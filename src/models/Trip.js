const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  preferences: {
    budget: { type: Number, required: true },
    currency: { type: String, default: 'PEN' },
    experienceType: {
      type: String,
      enum: ['aventura', 'tranquilo', 'cultural', 'fiesta', 'romantico', 'familiar'],
      required: true,
    },
    accommodation: {
      type: String,
      enum: ['economico', 'estandar', 'comodo', 'lujo', 'no_importa'],
      required: true,
    },
    transport: {
      type: String,
      enum: ['publico', 'coche_propio', 'privado', 'caminando', 'no_importa'],
      required: true,
    },
    duration: { type: Number, required: true, min: 1, max: 30 },
    companions: {
      type: String,
      enum: ['solo', 'pareja', 'familia', 'amigos', 'grupo'],
      required: true,
    },
    destination: { type: String, default: 'sorprendeme' },
  },
  result: {
    destinationName: String,
    country: String,
    description: String,
    imageQuery: String,
    itinerary: [{
      day: Number,
      title: String,
      activities: [{
        time: String,
        activity: String,
        description: String,
        estimatedCost: String,
      }],
    }],
    tips: [String],
    estimatedTotalCost: String,
    bestTimeToVisit: String,
    highlights: [String],
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['generated', 'saved', 'completed'],
    default: 'generated',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Trip', tripSchema);
