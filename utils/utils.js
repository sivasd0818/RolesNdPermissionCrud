const User = require('../models/user')
const Role = require('../models/role')
const {isEmpty} = require('lodash')
const {ADMIN_EMAIL, ADMIN_PASSWORD} = require('../config')()
const { PERMISSIONS } = require('./constants')
const logger = require('./logger')
const bcrypt = require('bcryptjs')

const TAG = "utils"

const hashPassword = async(password) => {
    // try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    // } catch(error) {
    //     logger.error(`${TAG} ${error.message}`)
    // }
}

function passwordCheck(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
}

const createDefaultAdmin = async (cb) => {
    try {
        const isAdminExists = await User.exists({emailId: ADMIN_EMAIL, default: true})
        if(!isAdminExists){
            let fetchedRoleDoc = await Role.findOne({name: 'admin', default: true}).lean()
            if(isEmpty(fetchedRoleDoc)){
                const newRoleDoc = new Role({
                    name: 'admin',
                    default: true,
                    permissions : [PERMISSIONS.create, PERMISSIONS.read, PERMISSIONS.update, PERMISSIONS.delete]
                })
                fetchedRoleDoc = await newRoleDoc.save()
            }

            const hashedPassword = await hashPassword(ADMIN_PASSWORD)

            const user = new User({
                emailId : ADMIN_EMAIL,
                password : hashedPassword,
                default: true,
                role: fetchedRoleDoc._id
            })
            await user.save()

            cb({
                tag: TAG, 
                success : true,
                data: 'Created default admin successfully'
            })
        } else {
            cb({
                tag: TAG, 
                success : true,
                data: 'Default admin account already exists'
            })
        }
    } catch (error) {
        cb({
            tag: TAG,
            success: false,
            error_data: error.message || 'Something went wrong!'
        })
    }
}

function validatePermissions(arr){
    if(!Array.isArray(arr) || isEmpty(arr)) return false

    let valid = true
    for(const item of arr){
        if(!Object.values(PERMISSIONS).includes(item)){
            valid=false
            break
        }
    }
    return valid
}

function arraysEqual(arr1, arr2) {
    return (arr1.length === arr2.length) && arr1.every((element) => Boolean(arr2.includes(element)))
}

module.exports = {
    createDefaultAdmin,
    hashPassword,
    passwordCheck,
    validatePermissions,
    arraysEqual
}