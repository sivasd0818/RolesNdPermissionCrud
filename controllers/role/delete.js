const Role = require('../../models/role')
const User = require('../../models/user')
const {isEmpty} = require('lodash')
const logger = require('../../utils/logger')

const TAG = 'controllers/role/delete'

const deleteRole = async (req, res) => {

    try {

        const existingRoleDoc = await Role.findOne({_id: req.params.roleId}).lean()
        if(isEmpty(existingRoleDoc)){
            res.status(404).send({
                success: false,
                errorData: "Role not found"
            })
            return
        }

        if(existingRoleDoc.default){
            res.status(406).send({
                success: false,
                errorData: "Can't delete default role."
            })
            return
        }

        //check for any users tagged to this role
        const isUserExists = await User.exists({role: req.params.roleId})
        if(isUserExists){
            res.status(406).send({
                success: false,
                errorData: "Users found with this role. So can't delete this role."
            })
            return
        }

        //role deletion
        const result = await Role.deleteOne({_id: req.params.roleId})

        res.status(200).send({
            success: true,
            data: 'Deletion successful'
        })

    } catch(error) {
        logger.error(`${TAG}: ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
    }

}



module.exports = deleteRole