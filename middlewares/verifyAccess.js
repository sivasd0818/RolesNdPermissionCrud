const User = require('../models/user')
const logger = require('../utils/logger')
const {isEmpty} = require('lodash')

const TAG = 'middleware/verifyAccess'

function verifyAccess(action){
    return async function(req, res, next){

        try {
            const userDoc = await User.findOne({_id: req.user.id})
                                    .select('role')
                                    .populate('role')
                                    .lean()
            
            if(isEmpty(userDoc)){
                res.status(404).send({
                    success: false,
                    errorData: 'User not found.'
                })
                return
            }

            const hasAction = userDoc.role.permissions.includes(action)
            if(!hasAction){
                res.status(403).send({
                    success: false,
                    errorData: "You don't have access to perform action using his api"
                })
                return
            }

            next()
            
        } catch (error) {
            logger.error(`${TAG}: ${error.message}`)
            res.status(500).send({
                success: false,
                errorData: error.message || 'Something went wrong!'
            })
            return
        }
    }
}

module.exports = verifyAccess