const jwt = require('jsonwebtoken')
const { APP_SECRET } = require('../config')()
const logger = require('../utils/logger')

const TAG = 'middleware/auth'

function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        logger.error(`${TAG}: Token is null or undefined`)
        res.status(401).send({
            success : false,
            errorData : "Unauthorized user"
        })
        return
    }

    jwt.verify(token, APP_SECRET, (err, payload) => {
        if(err) {
            logger.error(`${TAG}: ${err.message}`)
            res.status(401).send({
                success : false,
                errorData : "Unauthorized user"
            })
            return
        }
        req.user = payload
        next()
    })
}

module.exports = authenticateToken