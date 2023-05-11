const express = require('express')
const dbConnection = require('./database/config')
const dotenv = require('dotenv').config() //variables de entorno
const cors = require('cors')

//Crear servidor de express
const app = express()

//BD
dbConnection()

//CORS
app.use(cors())

//Mostrar directorio publico
app.use(express.static('public'))

//Lectura y parseo del body
app.use(express.json()) //-> las peticiones que vengan en formato json las voy a procesar y obtener su contenido

//Rutas
//auth -> crear, login, renovar token
app.use('/api/auth', require('./routes/auth'))
//crud eventos
app.use('/api/events', require('./routes/events'))

//Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Server corriendo en el puerto ${process.env.PORT}`)
})
