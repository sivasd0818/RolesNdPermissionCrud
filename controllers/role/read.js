const Role = require('../../models/role')
const logger = require('../../utils/logger')

const TAG = 'controllers/role/read'

const readRole = async (req, res) => {

    try {
        const roleDocs = await Role.find({}).lean()
        res.status(200).send({
            success: true,
            data: roleDocs
        })
    } catch(error) {
        logger.error(`${TAG}: ${error.message}`)
        res.status(500).send({
            success: false,
            errorData: error.message || 'Something went wrong!'
        })
    }

}

module.exports = readRole