const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');

// Sample database of surveys
let surveys = [];
app.use(express.json());
app.use(cors());

// Get all surveys
app.get('/surveys', (req, res) => {
  res.send(surveys);
});

// Create a new survey
app.post('/surveys', (req, res) => {
  const { question, answer } = req.body;
  const newSurvey = { id: Date.now().toString(), question, answer };
  surveys.push(newSurvey);
  res.status(201).json(newSurvey);
});

// Delete an existing survey
app.delete('/surveys/:id', (req, res) => {
  const surveyId = req.params.id;
  surveys = surveys.filter(survey => survey.id !== surveyId);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// server.js

// Update an existing survey
app.put('/surveys/:id', (req, res) => {
  const surveyId = req.params.id;
  const { question, answer } = req.body;
  const surveyIndex = surveys.findIndex(survey => survey.id === surveyId);
  if (surveyIndex !== -1) {
    surveys[surveyIndex] = { ...surveys[surveyIndex], question, answer };
    res.status(200).json(surveys[surveyIndex]);
  } else {
    res.status(404).send('Survey not found');
  }
});

// Edit an existing survey
app.patch('/surveys/:id', (req, res) => {
  const surveyId = req.params.id;
  const { question, answer } = req.body;
  const surveyIndex = surveys.findIndex(survey => survey.id === surveyId);
  if (surveyIndex !== -1) {
    if (question) {
      surveys[surveyIndex].question = question;
    }
    if (answer) {
      surveys[surveyIndex].answer = answer;
    }
    res.status(200).json(surveys[surveyIndex]);
  } else {
    res.status(404).send('Survey not found');
  }
});

