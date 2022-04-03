const Role = require('../../models/role')
const {isEmpty} = require('lodash')
const logger = require('../../utils/logger')
const {validatePermissions} = require('../../utils/utils')

const TAG = 'controllers/role/create'

const createRole = async (req, res) => {

    try {
        // validate payload
        if(isEmpty(req.body) || !req.body.name || !req.body.permissions || !validatePermissions(req.body.permissions)){
            res.status(400).send({
                success: false,
                errorData: 'Name and permissions are not found or invalid.'
            })
            return
        }

        //check for already present
        const isAlreadyPresent = await Role.findOne({name: req.body.name.toLowerCase().trim()}).lean()
        if(isAlreadyPresent){
            res.status(409).send({
                success: false,
                errorData: 'Already present'
            })
            return
        }

        //role creation
        const newRoleObj = new Role({
            name: req.body.name.toLowerCase().trim(),
            permissions: req.body.permissions
        })

        const roleDoc = await newRoleObj.save()

        res.status(201).send({success: true, data: roleDoc})

    } catch(error) {
        logger.error(`${TAG}: ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
    }

}

module.exports = createRole