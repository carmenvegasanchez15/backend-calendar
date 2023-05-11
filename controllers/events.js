const { response } = require('express')
const CalendarEvents = require('../models/Calendar-events')

const createEvent = async (req, res = response) => {
  const events = new CalendarEvents(req.body)
  try {
    events.user = req.uid
    const eventSave = await events.save()
    res.status(201).json({
      ok: true,
      events: eventSave,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    })
  }
}

const viewEvent = async (req, res = response) => {
  const events = await CalendarEvents.find().populate('user', 'name')
  res.status(201).json({
    ok: true,
    events,
  })
}

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id
  const uid = req.uid
  try {
    const event = await CalendarEvents.findById(eventId) //Comprobamos si el id existe
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ese evento',
      })
    }
    if (event.user.toString() !== uid) {
      return res.status(404).json({
        ok: false,
        msg: 'No puedes actualizar un evento que no has creado',
      })
    }
    const nuevoEvento = {
      ...req.body,
      user: uid,
    }

    const eventoActualizado = await CalendarEvents.findByIdAndUpdate(
      eventId,
      nuevoEvento,
      { new: true }
    )

    res.status(201).json({
      ok: true,
      event: eventoActualizado,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    })
  }
}

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id
  const uid = req.uid
  try {
    const event = await CalendarEvents.findById(eventId) //Comprobamos si el id existe
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe ese evento',
      })
    }
    if (event.user.toString() !== uid) {
      return res.status(404).json({
        ok: false,
        msg: 'No puedes borrar un evento que no has creado',
      })
    }

    const eventoActualizado = await CalendarEvents.findByIdAndDelete(eventId)

    res.status(201).json({
      ok: true,
      msg: `El elemento con id ${eventId} se ha eliminado`,
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin',
    })
  }
}

module.exports = {
  createEvent,
  viewEvent,
  updateEvent,
  deleteEvent,
}
