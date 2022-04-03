const {isEmpty} = require('lodash')
const User = require('../../models/user')
const logger = require('../../utils/logger')
const {passwordCheck} = require('../../utils/utils')
const jwt = require('jsonwebtoken')
const {APP_SECRET} = require('../../config')()

const TAG = 'controller/user/signIn'

const signIn = async (req, res) => {

    try {
        if(isEmpty(req.body) || !req.body.emailId || !req.body.password){
            res.status(400).send({
                success: false,
                errorData: `Email and password required.` 
            })
            return
        }

        const userDoc = await User.findOne({emailId: req.body.emailId?.toLowerCase()?.trim()}).populate('role').lean()
        if(isEmpty(userDoc)){
            res.status(404).send({
                success: false,
                errorData: `Email/password is incorrect`
            })
            return
        }

        const isPasswordValid = await passwordCheck(req.body.password, userDoc.password)

        if(!isPasswordValid){
            res.status(404).send({
                success: false,
                errorData: `Email/password is incorrect`
            })
            return
        }

        const newUserDocCopy = {...userDoc}
        delete newUserDocCopy.password

        const token = jwt.sign({id: userDoc._id}, APP_SECRET, {expiresIn: '30d'})
        res.status(200).send({
            success: true, 
            data: {
                accessToken: token,
                user: newUserDocCopy
            }
        })
    } catch (error) {
        logger.error(`${TAG} ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
        return
    }
}

module.exports = signIn