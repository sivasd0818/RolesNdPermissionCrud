const { model, Schema } = require('mongoose')
const { PERMISSIONS } = require('../utils/constants')
const logger = require('../utils/logger')

const RoleSchema = new Schema({
    name: {
        type : String,
        minLength : [1, 'name is too short'],
        maxLength : [40, 'name is too long'],
        unique: true
    },
    permissions : [{
        type: String,
        enum: [ PERMISSIONS.create, PERMISSIONS.read, PERMISSIONS.update, PERMISSIONS.delete],
        default: [PERMISSIONS.read]
    }],
    default : {
        type : Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = model('roles', RoleSchema)