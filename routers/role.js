const route = require('express').Router()

const onlyAdminMiddleware = require('../middlewares/onlyAdmin')
const createRole = require('../controllers/role/create')
const readRole = require('../controllers/role/read')
const editRole = require('../controllers/role/edit')
const deleteRole = require('../controllers/role/delete')

route.get('/read', onlyAdminMiddleware, readRole)
route.post('/create', onlyAdminMiddleware, createRole)
route.put('/:roleId/edit', onlyAdminMiddleware, editRole)
route.delete('/:roleId/delete', onlyAdminMiddleware, deleteRole)

module.exports = route