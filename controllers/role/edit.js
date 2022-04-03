const Role = require('../../models/role')
const {isEmpty} = require('lodash')
const logger = require('../../utils/logger')
const {validatePermissions, arraysEqual} = require('../../utils/utils')

const TAG = 'controllers/role/edit'

const editRole = async (req, res) => {

    try {
        // validate payload
        if(!req.body.name && !req.body.permissions){
            res.status(400).send({
                success: false,
                errorData: 'Name and permissions are not found or invalid.'
            })
            return
        }

        //fetch existing role doc
        const existingRoleDoc = await Role.findOne({_id: req.params.roleId}).lean()
        if(isEmpty(existingRoleDoc)){
            res.status(404).send({
                success: false,
                errorData: 'Role not found.'
            })
            return
        }

        if(existingRoleDoc.default){
            res.status(404).send({
                success: false,
                errorData: "Can't edit default Role."
            })
            return
        }

        const fieldsToSet = {}

        if(req.body.name){
            if(existingRoleDoc.name !== req.body.name.toLowerCase().trim()){
                const isAlreadyPresent = await Role.findOne({name : req.body.name.toLowerCase().trim()}).lean()
                if(isAlreadyPresent){
                    res.status(409).send({
                        success: false,
                        errorData: 'Role Already Present.'
                    })
                    return
                }

                fieldsToSet.name = req.body.name.toLowerCase().trim()
            }
        }

        if(!isEmpty(req.body.permissions)){
            if(!validatePermissions(req.body.permissions)){
                res.status(400).send({
                    success: false,
                    errorData: 'Invalid Permissions found.'
                })
                return
            }

            if(!arraysEqual(existingRoleDoc.permissions, req.body.permissions)){
                fieldsToSet.permissions = req.body.permissions
            }
        }

        if(!isEmpty(fieldsToSet)){
            const updatedRoleDoc = await Role.findByIdAndUpdate({_id: req.params.roleId}, {$set : fieldsToSet}, {new: true}).lean()
            res.status(201).send({
                success: true,
                data: updatedRoleDoc
            })
        } else {
            res.status(400).send({
                success: false, 
                errorData: 'No changes to update.'
            })
        }

    } catch(error) {
        logger.error(`${TAG}: ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
    }

}



module.exports = editRole