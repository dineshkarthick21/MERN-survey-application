
import React, { useState, useEffect   } from 'react';
import axios from 'axios';
import "./home.css"

export default function Survey() {
  const [surveys, setSurveys] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('http://localhost:3000/surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateSurvey = async () => {
    try {
      if (editId) {
        await axios.patch(`http://localhost:3000/surveys/${editId}`, { question, answer });
        setEditId(null);
      } else {
        await axios.post('http://localhost:3000/surveys', { question, answer });
      }
      fetchSurveys();
      setQuestion('');
      setAnswer('');
      alert('Survey saved successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to save survey');
    }
  };

  const handleEditSurvey = (survey) => {
    setEditId(survey.id);
    setQuestion(survey.question);
    setAnswer(survey.answer);
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      await axios.delete(`http://localhost:3000/surveys/${surveyId}`);
      fetchSurveys();
      alert('Survey deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete survey');
    }
  };

  return (
    <>
      <div className='container'>
        <h3>Survey Application</h3>
        <form>
          <div>
            <label>Question</label>
            <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} /><br />
          </div>
          <div>
            <label>Answer</label>
            <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} /><br />
            <button type="button" onClick={handleCreateSurvey}>{editId ? 'Save' : 'Create'} Survey</button>
          </div>
        </form>
      </div>
      <div>
        {surveys.map(survey => (
          <div className='con2' key={survey.id}>
            <p>Question: {survey.question}</p>
            <p>Answer: {survey.answer}</p>
            <button onClick={() => handleEditSurvey(survey)}>Edit</button>
            <button onClick={() => handleDeleteSurvey(survey.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}
