const { response } = require('express')
const { validationResult } = require('express-validator')

const validateField = (req, res = response, next) => {
  //Manejo de errores con express-validator
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    })
  }
  //next -> funcion que hay que llamar si esta todo correctamente
  next()
}

module.exports = {
  validateField,
}
