const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getModel = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

const EXPERIENCE_LABELS = {
  aventura: 'Aventura y adrenalina',
  tranquilo: 'Tranquilo y relajado',
  cultural: 'Cultural e histórico',
  fiesta: 'Fiesta y vida nocturna',
  romantico: 'Romántico en pareja',
  familiar: 'Familiar para todas las edades',
};

const ACCOMMODATION_LABELS = {
  economico: 'Económico (hostal, 1-2 estrellas)',
  estandar: 'Estándar (3 estrellas)',
  comodo: 'Cómodo (4 estrellas)',
  lujo: 'Lujo (5 estrellas o más)',
  no_importa: 'Sin preferencia',
};

const TRANSPORT_LABELS = {
  publico: 'Transporte público',
  coche_propio: 'Coche propio',
  privado: 'Traslados privados',
  caminando: 'Caminando / Bicicleta',
  no_importa: 'Sin preferencia',
};

const COMPANION_LABELS = {
  solo: 'Viajando solo',
  pareja: 'En pareja',
  familia: 'Con familia',
  amigos: 'Con amigos',
  grupo: 'Grupo organizado',
};

const generateTrip = async (preferences) => {
  const model = getModel();

  const destinationInstruction = preferences.destination === 'sorprendeme'
    ? 'Sugiere el mejor destino posible basándote en las preferencias del viajero. Sé creativo y sorprendente.'
    : `El destino elegido es: ${preferences.destination}. Planifica el viaje a este destino.`;

  const prompt = `Eres un experto planificador de viajes. Genera un plan de viaje completo y detallado basado en estas preferencias:

- Presupuesto: S/ ${preferences.budget} (soles peruanos)
- Tipo de experiencia: ${EXPERIENCE_LABELS[preferences.experienceType]}
- Alojamiento: ${ACCOMMODATION_LABELS[preferences.accommodation]}
- Transporte: ${TRANSPORT_LABELS[preferences.transport]}
- Duración: ${preferences.duration} días
- Compañía: ${COMPANION_LABELS[preferences.companions]}
- ${destinationInstruction}

Responde ÚNICAMENTE con un JSON válido (sin markdown, sin backticks, sin texto adicional) con esta estructura exacta:
{
  "destinationName": "nombre del destino",
  "country": "país",
  "description": "descripción atractiva del destino en 2-3 oraciones",
  "imageQuery": "query en inglés para buscar imágenes del destino (ej: 'Machu Picchu Peru landscape')",
  "itinerary": [
    {
      "day": 1,
      "title": "título del día",
      "activities": [
        {
          "time": "08:00",
          "activity": "nombre de la actividad",
          "description": "descripción breve",
          "estimatedCost": "S/ XX"
        }
      ]
    }
  ],
  "tips": ["consejo 1", "consejo 2", "consejo 3"],
  "estimatedTotalCost": "S/ XXXX",
  "bestTimeToVisit": "mejor época para visitar",
  "highlights": ["punto destacado 1", "punto destacado 2", "punto destacado 3"]
}

Asegúrate de:
- Incluir actividades realistas y específicas del destino
- Que los costos sean coherentes con el presupuesto en soles peruanos
- Generar un itinerario para TODOS los ${preferences.duration} días
- Incluir al menos 3-4 actividades por día
- Dar consejos prácticos y útiles`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleanJson);
};

module.exports = { generateTrip };
