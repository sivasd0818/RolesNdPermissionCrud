const express = require('express')
const { connect } = require('mongoose')
const cors = require('cors')
const {DB, PORT} = require('./config')()
const logger = require('./utils/logger')
const {createDefaultAdmin} = require('./utils/utils')
const authenticateToken = require('./middlewares/auth')
const authenticationRoute = require('./routers/authentication')
const roleRoute = require('./routers/role')
const userRoute = require('./routers/user')

const app = express();

// middleware
app.use(cors())

app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// static file paths
app.use('/profile', express.static('public/profile-pic', {fallthrough: false}))

//ping
app.get('/api/ping', function(req, res){
    res.status(200).send({up: true})
})

app.use('/api/auth', authenticationRoute)

app.use(authenticateToken)

app.use('/api/role', roleRoute)
app.use('/api/user', userRoute)

// start app function
const startApp = async () => {
    try {
        await connect(DB)
        logger.info(`Successfully connected with the Database :: ${DB}`)
        createDefaultAdmin((res) => {
            if(res.success){
                logger.info(`${res.tag}: ${res.data}`)
            } else {
                logger.error(`${res.tag}: ${res.error_data}`)
            }
        })
        app.listen(PORT, () =>
            logger.info(`Server started on PORT ${PORT}`)
        );
    } catch (err) {
        logger.error(`Unable to connect with the Database :: ${err}`)
    }
}

startApp()