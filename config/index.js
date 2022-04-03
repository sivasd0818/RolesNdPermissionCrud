require('dotenv').config()

const config = () => {
    switch(process.env.NODE_ENV && process.env.NODE_ENV.trim()){
        case 'development':
            return {
                PORT : process.env.PORT,
                DB : process.env.DB,
                APP_SECRET : process.env.APP_SECRET,
                ADMIN_EMAIL : process.env.ADMIN_EMAIL_ID,
                ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
            }

        default :
            // production
            return {
                PORT : process.env.PORT,
                DB : process.env.DB,
                APP_SECRET : process.env.APP_SECRET,
                ADMIN_EMAIL : process.env.ADMIN_EMAIL_ID,
                ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
            }
    }
}

module.exports = config
