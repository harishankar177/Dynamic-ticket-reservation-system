import express from 'express';
import { getTrains, addTrain, updateTrain, deleteTrain } from '../controllers/trainController.js';

const router = express.Router();

router.get('/', getTrains);
router.post('/', addTrain);
router.put('/:id', updateTrain);
router.delete('/:id', deleteTrain);

export default router;
