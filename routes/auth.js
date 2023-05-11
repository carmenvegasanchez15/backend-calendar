/*
    Rutas de usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express')
const { createUser, loginUser, renewToken } = require('../controllers/auth')
const { check } = require('express-validator')
const { validateField } = require('../middlewares/validate-field')
const validateJwt = require('../middlewares/validate-jwt')

const router = Router()

//Endpoints

router.post(
  '/new',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password debe tener mas de 6 ').isLength({ min: 6 }),
    validateField,
  ],
  createUser
)

router.post(
  '/',
  [
    check('email', 'Email is required').isEmail().isLength({ min: 6 }),
    check('password', 'Password debe tener mas de 6 ').isLength({ min: 6 }),
    validateField,
  ],
  loginUser
)

router.get('/renew', validateJwt, renewToken)

module.exports = router
