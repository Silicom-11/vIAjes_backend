const express = require('express');
const auth = require('../middleware/auth');
const {
  createTrip,
  getTrips,
  getTrip,
  toggleFavorite,
  deleteTrip,
} = require('../controllers/tripController');

const router = express.Router();

router.use(auth);

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTrip);
router.patch('/:id/favorite', toggleFavorite);
router.delete('/:id', deleteTrip);

module.exports = router;
