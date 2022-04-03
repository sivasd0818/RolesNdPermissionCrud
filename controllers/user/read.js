const User = require('../../models/user')
const logger = require('../../utils/logger')

const TAG = 'controllers/user/read'

const readUser = async (req, res) => {

    try {
        const userDocs = await User.find({}).select('-password').populate('role').lean()
        res.status(200).send({
            success: true,
            data: userDocs
        })
    } catch(error) {
        logger.error(`${TAG}: ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
    }

}

module.exports = readUser