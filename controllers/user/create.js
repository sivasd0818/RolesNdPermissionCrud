const Role = require('../../models/role')
const User = require('../../models/user')
const {isEmpty} = require('lodash')
const logger = require('../../utils/logger')
const {hashPassword} = require('../../utils/utils')

const TAG = 'controllers/user/create'

const createUser = async (req, res) => {

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
        // validate payload
        if(isEmpty(requestBody) || !requestBody.emailId || !requestBody.password || !requestBody.role){
            res.status(400).send({
                success: false,
                errorData: 'EmailId, password and role are not found.'
            })
            return
        }

        // check for user already present
        const isUserExists = await User.exists({emailId: requestBody.emailId})
        if(isUserExists){
            res.status(409).send({
                success: false,
                errorData: 'User with given emailId already exists.'
            })
            return
        }

        // check for role
        const roleDoc = await Role.findOne({_id: requestBody.role}).lean()
        if(isEmpty(roleDoc)){
            res.status(404).send({
                success: false,
                errorData: 'Role is invalid / not found.'
            })
            return
        }

        if(roleDoc.name === 'admin'){
            res.status(406).send({
                success: false,
                errorData: "Can't create more than one admin."
            })
            return
        }

        const hashedPassword = await hashPassword(requestBody.password)

        //user creation
        const newUserObj = new User({
            emailId: requestBody.emailId.toLowerCase().trim(),
            password: hashedPassword,
            role: roleDoc._id
        })

        if(requestBody.firstName){
            newUserObj.firstName = requestBody.firstName
        }

        if(requestBody.lastName){
            newUserObj.lastName = requestBody.lastName
        }

        if(!isEmpty(req.files.profile_pic)){
            const file = req.files.profile_pic[0]
            newUserObj.pic = {
                filename : file.filename,
                relative_url : `/profile/${file.filename}`,
                original_name : file.originalname,
                destination : file.destination,
                mime_type : file.mimetype,
                size : file.size
            }
        }

        const newUserDoc = await newUserObj.save()
        newUserDoc.password = null

        res.status(201).send({success: true, data: newUserDoc})

    } catch(error) {
        logger.error(`${TAG}: ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
    }

}

module.exports = createUser