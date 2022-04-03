const { model, Schema } = require('mongoose')
const { isEmail } = require('validator')

const logger = require('../utils/logger')

const UserSchema = new Schema({
    pic : {
        type : Object,
    },
    firstName : {
        type : String,
        minLength : [1, 'first_name is too short'],
        maxLength : [40, 'first_name is too long'],
        validate : [isNameValid, 'Please enter valid first name']
    },
    lastName : {
        type : String,
        validate : [isNameValid, 'Please enter valid last name'],
        minLength : [1, 'last_name is too short'],
        maxLength : [40, 'last_name is too long']
    },
    emailId : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        validate : [isEmail, 'Invalid email Id']
    },
    password : {
        type : String,
        required: true
    },
    role : {
        type : Schema.Types.ObjectId,
        ref : 'roles',
        required: true
    },
    default: {
        type : Boolean,
        default: false
    }
}, { timestamps: true })

function isNameValid(name) {
    return /^[A-Za-z ]*$/.test(name)
}

module.exports = model('users', UserSchema)