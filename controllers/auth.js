const { response } = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const generarJwt = require('../helpers/jwt')

const createUser = async (req, res = response) => {
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email }) // comprueba si hay alguien con ese correo
    if (user) {
      res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe',
      })
    }
    user = new User(req.body)
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync() //crea numeros random que son los que se van a ver en la BD
    user.password = bcrypt.hashSync(password, salt) //encriptar contraseña
    await user.save()
    //Generar JWT
    const token = await generarJwt(user.id, user.name)
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      msg: 'register',
      token,
      // user: req.body, //->extraer info
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
  //   if (name.length < 5) {
  //     return res.status(400).json({
  //       ok: false,
  //       msg: 'El nombre debe de ser de 5 letras',
  //     })
  //   }
}

const loginUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }) // comprueba si hay alguien con ese correo
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe con ese email',
      })
    }

    //Confirmar contraseñas
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña incorrecta',
      })
    }

    //Generar nuestro JWT
    const token = await generarJwt(user.id, user.name)

    res.json({
      of: true,
      uid: user.id,
      name: user.name,
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    })
  }
}

const renewToken = async (req, res = response) => {
  const { uid, name } = req

  const token = await generarJwt(uid, name)
  res.json({
    ok: true,
    token,
    msg: 'renew',
  })
}

module.exports = {
  createUser,
  loginUser,
  renewToken,
}
