/*
    Rutas de events / events
    host + /api/events
*/

const { Router } = require('express')
const {
  viewEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events')
const { check } = require('express-validator')
const { validateField } = require('../middlewares/validate-field')
const validateJwt = require('../middlewares/validate-jwt')
const { isDate } = require('../helpers/isDate')

const router = Router()
router.use(validateJwt) //Cualquier peticion deben de pasar por validar token

//Obtener eventos
router.get('/', viewEvent)
//Crear nuevo evento
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de fin es obligatoria').custom(isDate),
    validateField,
  ],

  createEvent
)
//Actualizar evento
router.put('/:id', updateEvent)
//Eliminar evento
router.delete('/:id', deleteEvent)

module.exports = router
