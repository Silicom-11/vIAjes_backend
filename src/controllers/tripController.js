const Trip = require('../models/Trip');
const { generateTrip } = require('../services/geminiService');

exports.createTrip = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ message: 'Las preferencias son obligatorias' });
    }

    const result = await generateTrip(preferences);

    const trip = await Trip.create({
      user: req.user._id,
      preferences,
      result,
    });

    res.status(201).json({ trip });
  } catch (error) {
    console.error('Trip generation error:', error);
    res.status(500).json({ message: 'Error al generar el viaje. Intenta de nuevo.' });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({ trips });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los viajes' });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    res.json({ trip });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el viaje' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    trip.isFavorite = !trip.isFavorite;
    await trip.save();

    res.json({ trip });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar favorito' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    res.json({ message: 'Viaje eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el viaje' });
  }
};
