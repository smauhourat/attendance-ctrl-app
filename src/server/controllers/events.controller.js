const Event = require('../models/Event.model');
const Person = require('../models/Person.model');
const Attendance = require('../models/Attendance.model');

// Obtener todos los eventos
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('attendees');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener eventos abiertos
exports.getOpenEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'open' }).populate('attendees');
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener un evento específico
exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('attendees');
        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear un nuevo evento
exports.createEvent = async (req, res) => {
    const { name, description, date, attendees } = req.body;

    const event = new Event({
        name,
        description,
        date,
        attendees
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar un evento
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('attendees');

        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Obtener asistentes de un evento
exports.getEventAttendees = async (req, res) => {
    try {
        // Obtener el evento con los asistentes
        const event = await Event.findById(req.params.eventId)
            .populate('attendees');

        if (!event) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Obtener las asistencias registradas
        const attendances = await Attendance.find({
            event: req.params.eventId
        });

        // Combinar la información
        const attendeesWithAttendance = event.attendees.map(person => {
            const attendance = attendances.find(a =>
                a.person.toString() === person._id.toString()
            );
            return {
                ...person.toObject(),
                attended: !!attendance,
                attendanceTime: attendance?.timestamp
            };
        });

        res.json(attendeesWithAttendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};