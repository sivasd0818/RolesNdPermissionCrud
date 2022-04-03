const route = require('express').Router()

const createUser = require('../controllers/user/create')
const readUser = require('../controllers/user/read')
const editUser = require('../controllers/user/edit')
const deleteUser = require('../controllers/user/delete')

const multerErrorHandler = require('../middlewares/multerErrorHandler')
const verifyAccess = require('../middlewares/verifyAccess')

const {EXTENSION_TYPES, PERMISSIONS} = require('../utils/constants')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({   
    destination: function(req, file, callback) {
        let destinationPath = './public'
        if (file.fieldname === 'profile_pic') {
            destinationPath += '/profile-pic'
        }
        callback(null, destinationPath)
    },
    filename: function (req, file, callback) {
        let filename = ''
        if (file.fieldname === 'profile_pic') {
            filename = 'profile'
        }
        callback(null, filename + '-' + Date.now() + path.extname(file.originalname));
    }
})

function checkFileType(file, callback){
    let ext = path.extname(file.originalname);
    if (file.fieldname === 'profile_pic') {
        if (![...EXTENSION_TYPES.image].includes(ext.toLowerCase())) {
            return callback(new Error('Only images are allowed'))
        }
        if (file.size > 1024 * 1024 * 2) {
            return callback(new Error('File size exceeds 2 MB'))
        }
    }
    callback(null, true)
}

let upload = multer(
    {
        storage : storage,
        fileFilter : function(_req, file, cb){
            checkFileType(file, cb);
        }
    }
)

route.get('/read', verifyAccess(PERMISSIONS.read), readUser)
route.post('/create', verifyAccess(PERMISSIONS.create)  , multerErrorHandler(upload.fields([
    {
        name: "profile_pic",
        maxCount : 1
    }
])), createUser)

route.put('/:userId/edit', verifyAccess(PERMISSIONS.update), multerErrorHandler(upload.fields([
    {
        name: "profile_pic",
        maxCount : 1
    }
])), editUser)

route.delete('/:userId/delete', verifyAccess(PERMISSIONS.delete), deleteUser)

module.exports = route