import Train from '../models/Train.js';

// Get all trains
export const getTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add new train
export const addTrain = async (req, res) => {
  try {
    const train = new Train(req.body);
    await train.save();
    res.status(201).json(train);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add train', error: err.message });
  }
};

// Update train
export const updateTrain = async (req, res) => {
  try {
    const updated = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update train', error: err.message });
  }
};

// Delete train
export const deleteTrain = async (req, res) => {
  try {
    await Train.findByIdAndDelete(req.params.id);
    res.json({ message: 'Train deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete train', error: err.message });
  }
};
