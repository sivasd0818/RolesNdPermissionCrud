const Role = require('../../models/role')
const User = require('../../models/user')
const {isEmpty} = require('lodash')
const logger = require('../../utils/logger')
const {removeLocalAsset} = require('../../utils/utils')

const TAG = 'controllers/user/edit'

const editUser = async (req, res) => {

    //request body parsing
    let requestBody = {}
    try {
        requestBody = JSON.parse(req.body.data)
    } catch (error) {
        logger.error(`${TAG}: ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
    }

    try {

        //fetch existing user doc
        const existingUserDoc = await User.findOne({_id: req.params.userId}).populate('role').lean()
        if(isEmpty(existingUserDoc)){
            res.status(404).send({
                success: false,
                errorData: 'User not found.'
            })
            return
        }

        // check for other user
        if(existingUserDoc.role.name === 'admin'){
            if(req.user.id !== existingUserDoc._id.toString()){
                res.status(406).send({
                    success: false,
                    errorData: "Admin user details can't be edited by any other type of role of user"
                })
                return
            }
        }

        const fieldsToSet = {}
        const fieldsToUnSet = []

        if('firstName' in requestBody){
            if(requestBody.firstName && existingUserDoc.firstName !== requestBody.firstName.trim()){
                fieldsToSet.firstName = requestBody.firstName
            } else {
                if(requestBody.firstName === '' && existingUserDoc.firstName){
                    fieldsToUnSet.push('firstName')
                }
            }
        }

        if('lastName' in requestBody){
            if(requestBody.lastName && existingUserDoc.lastName !== requestBody.lastName.trim()){
                fieldsToSet.lastName = requestBody.lastName
            } else {
                if(requestBody.lastName === '' && existingUserDoc.lastName){
                    fieldsToUnSet.push('lastName')
                }
            }
        }

        if(requestBody.role && existingUserDoc.role.name !== 'admin'){
            if(requestBody.role !== existingUserDoc.role._id.toString()){
                const newRoleDoc = await Role.findOne({_id: requestBody.role}).lean()
                if(isEmpty(newRoleDoc)){
                    res.status(404).send({
                        success: false,
                        errorData: "Role not found."
                    })
                    return
                }

                if(newRoleDoc.name === 'admin' || newRoleDoc.default){
                    res.status(406).send({
                        success: false,
                        errorData: "Can't have more than one admin."
                    })
                    return
                }

                fieldsToSet.role = requestBody.role
            }
        }

        if(requestBody.emailId){
            if(requestBody.emailId !== existingUserDoc.emailId){
                const isAlreadyPresent = await User.exists({emailId: requestBody.emailId.toLowerCase().trim()})
                if(isAlreadyPresent){
                    res.status(409).send({
                        success: false,
                        errorData: "EmailId already present."
                    })
                    return
                }

                fieldsToSet.emailId = requestBody.emailId.toLowerCase().trim()
            }
        }

        if(!isEmpty(req.files.profile_pic)){
            if(!isEmpty(existingUserDoc.pic)){
                await removeLocalAsset(`${existingUserDoc.pic.destination}/${existingUserDoc.pic.filename}`)
            }
            const file = req.files.profile_pic[0]
            fieldsToSet.pic = {
                filename : file.filename,
                relative_url : `/profile/${file.filename}`,
                original_name : file.originalname,
                destination : file.destination,
                mime_type : file.mimetype,
                size : file.size
            }
        } else if(requestBody.pic === '' && !isEmpty(existingUserDoc.pic)){
            fieldsToUnSet.push('pic')
            await removeLocalAsset(`${existingUserDoc.pic.destination}/${existingUserDoc.pic.filename}`)
        }

        const updatingObj = []
        if(!isEmpty(fieldsToSet)){
            updatingObj.push({$set : fieldsToSet})
        }
        if(!isEmpty(fieldsToUnSet)){
            updatingObj.push({$unset : fieldsToUnSet})
        }

        if(!isEmpty(updatingObj)){
            const updatedUserDoc = await User.findByIdAndUpdate({_id: req.params.userId}, updatingObj, {new: true}).select('-password').lean()
            res.status(201).send({
                success: true,
                data: updatedUserDoc
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

module.exports = editUser