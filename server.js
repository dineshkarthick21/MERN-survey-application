const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define survey schema and model
const surveySchema = new mongoose.Schema({
  question: String,
  answer: String
});

const Survey = mongoose.model('Survey', surveySchema);

// Middleware
app.use(express.json());
app.use(cors());

// Get all surveys
app.get('/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.send(surveys);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new survey
app.post('/surveys', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newSurvey = new Survey({ question, answer });
    await newSurvey.save();
    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete an existing survey
app.delete('/surveys/:id', async (req, res) => {
  try {
    const surveyId = req.params.id;
    await Survey.findByIdAndDelete(surveyId);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an existing survey
app.put('/surveys/:id', async (req, res) => {
  try {
    const surveyId = req.params.id;
    const { question, answer } = req.body;
    const updatedSurvey = await Survey.findByIdAndUpdate(surveyId, { question, answer }, { new: true });
    if (updatedSurvey) {
      res.status(200).json(updatedSurvey);
    } else {
      res.status(404).send('Survey not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Edit an existing survey
app.patch('/surveys/:id', async (req, res) => {
  try {
    const surveyId = req.params.id;
    const { question, answer } = req.body;
    const updatedSurvey = await Survey.findByIdAndUpdate(surveyId, { $set: req.body }, { new: true });
    if (updatedSurvey) {
      res.status(200).json(updatedSurvey);
    } else {
      res.status(404).send('Survey not found');
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
