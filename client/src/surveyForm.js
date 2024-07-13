import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './SurveyForm.css';

const questions = [
  {
    id: 'age',
    type: 'input',
    label: 'Age',
    inputType: 'number'
  },
  {
    id: 'gender',
    type: 'select',
    label: 'Gender',
    options: ['Male', 'Female', 'Other']
  },
  {
    id: 'mentalHealth',
    type: 'yesNo',
    label: 'Have you ever struggled with your mental health?'
  },
  {
    id: 'talkToFriends',
    type: 'yesNo',
    label: 'Did you talk to your friends about it?'
  },
  {
    id: 'friendResponse',
    type: 'textarea',
    label: 'If your friend told you they were struggling, what would you think and how would you respond?'
  },
  {
    id: 'lightBeacon',
    type: 'yesNo',
    label: 'Would you ever light a Beacon yourself?'
  },
  {
    id: 'friendBeacon',
    type: 'yesNo',
    label: 'If your friend lit a Beacon, would you send them support / interact with it?'
  },
  {
    id: 'followInfluencers',
    type: 'yesNo',
    label: 'Would you be interested in following influencers / celebrities on this and seeing their honest behind the scenes difficulties?'
  },
  {
    id: 'tiredOfFake',
    type: 'yesNo',
    label: 'Are you tired of how fake everybody’s life seems on social media?'
  },
  {
    id: 'downloadApp',
    type: 'yesNo',
    label: 'Would you download this app?'
  },
  {
    id: 'colorScheme',
    type: 'textarea',
    label: 'App Design Preferences - Color Scheme'
  },
  {
    id: 'appFeel',
    type: 'textarea',
    label: 'App Feel'
  },
  {
    id: 'branding',
    type: 'textarea',
    label: 'Branding'
  },
  {
    id: 'email',
    type: 'input',
    label: 'Email',
    inputType: 'email'
  }
];

function SurveyForm() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    mentalHealth: '',
    talkToFriends: '',
    friendResponse: '',
    lightBeacon: '',
    friendBeacon: '',
    followInfluencers: '',
    tiredOfFake: '',
    downloadApp: '',
    colorScheme: '',
    appFeel: '',
    branding: '',
    email: ''
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleYesNo = (id, value) => {
    setFormData({
      ...formData,
      [id]: value
    });
    showNextQuestion();
  };

  const showNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const emailResult = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formData,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      );
      console.log('EmailJS result:', emailResult.text);

      const response = await fetch('/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.text();
      console.log('Success:', data);
      setSubmissionMessage('Survey submitted successfully');
      alert('Survey submitted successfully');
    } catch (error) {
      console.error('Error:', error);
      setSubmissionMessage('Failed to submit survey');
      alert('Failed to submit survey');
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case 'input':
        return (
          <div className="form-group">
            <label>{question.label}</label>
            <input type={question.inputType} name={question.id} value={formData[question.id]} onChange={handleChange} required />
            <button type="button" onClick={showNextQuestion}>Next</button>
          </div>
        );
      case 'select':
        return (
          <div className="form-group">
            <label>{question.label}</label>
            <select name={question.id} value={formData[question.id]} onChange={handleChange} required>
              <option value="">Select</option>
              {question.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <button type="button" onClick={showNextQuestion}>Next</button>
          </div>
        );
      case 'yesNo':
        return (
          <div className="form-group">
            <label>{question.label}</label>
            <div className="yes-no-buttons">
              <button type="button" onClick={() => handleYesNo(question.id, 'yes')}>Yes</button>
              <button type="button" onClick={() => handleYesNo(question.id, 'no')}>No</button>
            </div>
          </div>
        );
      case 'textarea':
        return (
          <div className="form-group">
            <label>{question.label}</label>
            <textarea name={question.id} value={formData[question.id]} onChange={handleChange} rows="3" required />
            <button type="button" onClick={showNextQuestion}>Next</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="survey-form">
        <h1>Beacon Survey</h1>
        {renderQuestion()}
      </form>
      {submissionMessage && <div className="submission-message">{submissionMessage}</div>}
    </div>
  );
}

export default SurveyForm;
