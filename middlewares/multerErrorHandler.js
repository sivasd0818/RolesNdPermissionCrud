const multer = require('multer')
const logger = require('../utils/logger')

const TAG = 'middleware/multerErrorHandler'

function multerErrorHandler(multerUploadFunction) {
    return (req, res, next) =>
        multerUploadFunction(req, res, err => {
            // handle Multer error
            if (err instanceof multer.MulterError) {
                logger.error(`${TAG}: ${err.message}`)
                res.status(400).send({
                    success: false,
                    errorData: `${err.message}`,
                });
                return

            // handle other errors
            } else if(err){
                logger.error(`${TAG}: ${err.message}`)
                res.status(500).send({
                    success: false,
                    errorData: `${err.message || "Something went wrong!"}`
                });
                return
            }
            next();
        });
}

module.exports = multerErrorHandler