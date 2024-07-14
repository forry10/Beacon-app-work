import React, { useState } from 'react';
import { Button, Container, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import emailjs from 'emailjs-com';
import './SurveyForm.css';

const SurveyForm = () => {
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

  const [currentStep, setCurrentStep] = useState(0);

  const questions = [
    { label: 'Age', name: 'age', type: 'text' },
    { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { label: 'Have you ever struggled with your mental health?', name: 'mentalHealth', type: 'select', options: ['Yes', 'No'] },
    { label: 'Did you talk to your friends about it?', name: 'talkToFriends', type: 'select', options: ['Yes', 'No'] },
    { label: 'If your friend told you they were struggling, what would you think and how would you respond?', name: 'friendResponse', type: 'text' },
    { label: 'Would you ever light a Beacon yourself?', name: 'lightBeacon', type: 'select', options: ['Yes', 'No'] },
    { label: 'If your friend lit a Beacon, would you send them support / interact with it?', name: 'friendBeacon', type: 'select', options: ['Yes', 'No'] },
    { label: 'Would you be interested in following influencers / celebrities on this and seeing their honest behind the scenes difficulties?', name: 'followInfluencers', type: 'select', options: ['Yes', 'No'] },
    { label: 'Are you tired of how fake everybody’s life seems on social media?', name: 'tiredOfFake', type: 'select', options: ['Yes', 'No'] },
    { label: 'Would you download this app?', name: 'downloadApp', type: 'select', options: ['Yes', 'No'] },
    { label: 'Color Scheme', name: 'colorScheme', type: 'text' },
    { label: 'App Feel', name: 'appFeel', type: 'text' },
    { label: 'Branding', name: 'branding', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('http://localhost:3000/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(result => {
      console.log('Survey data sent successfully', result);
      alert('Survey submitted successfully');
    })
    .catch(error => {
      console.error('Error submitting survey:', error);
    });

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  return (
    <Container className="survey-form">
      <form onSubmit={handleSubmit}>
        <Typography variant="h6">{questions[currentStep].label}</Typography>
        {questions[currentStep].type === 'select' ? (
          <FormControl fullWidth>
            <InputLabel>{questions[currentStep].label}</InputLabel>
            <Select
              name={questions[currentStep].name}
              value={formData[questions[currentStep].name]}
              onChange={handleChange}
              required
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              {questions[currentStep].options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            type={questions[currentStep].type}
            name={questions[currentStep].name}
            value={formData[questions[currentStep].name]}
            onChange={handleChange}
            required
          />
        )}
        {currentStep < questions.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
        ) : (
          <Button variant="contained" color="primary" type="submit">Submit</Button>
        )}
      </form>
    </Container>
  );
}

export default SurveyForm;
