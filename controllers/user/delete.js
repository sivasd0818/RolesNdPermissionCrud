const User = require('../../models/user')
const {isEmpty} = require('lodash')
const logger = require('../../utils/logger')
const {removeLocalAsset} = require('../../utils/utils')

const TAG = 'controllers/user/delete'

const deleteUser = async (req, res) => {

    try {

        const existingUserDoc = await User.findOne({_id: req.params.userId}).lean()
        if(isEmpty(existingUserDoc)){
            res.status(404).send({
                success: false,
                errorData: "User not found"
            })
            return
        }

        if(existingUserDoc.default){
            res.status(406).send({
                success: false,
                errorData: "Can't delete default user."
            })
            return
        }

        //role deletion
        const result = await User.deleteOne({_id: req.params.userId})

        if(!isEmpty(existingUserDoc.pic)){
            await removeLocalAsset(`${existingUserDoc.pic.destination}/${existingUserDoc.pic.filename}`)
        }

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



module.exports = deleteUser