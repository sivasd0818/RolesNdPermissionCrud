const route = require('express').Router()

const signIn = require('../controllers/authentication/signIn')
route.post('/sign-in', signIn)

module.exports = route