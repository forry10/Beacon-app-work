import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/SurveyForm.module.css';
import Image from 'next/image';
import logo from '../public/Beacon_Logo-15.webp';

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
    email: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const questions = [
    { name: 'age', type: 'text', label: 'Age' },
    { name: 'gender', type: 'select', label: 'Gender', options: ['Male', 'Female', 'Other'] },
    { name: 'mentalHealth', type: 'select', label: 'Have you ever struggled with your mental health?', options: ['Yes', 'No'] },
    { name: 'talkToFriends', type: 'select', label: 'Did you talk to your friends about it?', options: ['Yes', 'No'] },
    { name: 'friendResponse', type: 'text', label: 'If your friend told you they were struggling, what would you think and how would you respond?' },
    { name: 'lightBeacon', type: 'select', label: 'Would you ever light a Beacon yourself?', options: ['Yes', 'No'] },
    { name: 'friendBeacon', type: 'select', label: 'If your friend lit a Beacon, would you send them support / interact with it?', options: ['Yes', 'No'] },
    { name: 'followInfluencers', type: 'select', label: 'Would you be interested in following influencers / celebrities on this and seeing their honest behind the scenes difficulties?', options: ['Yes', 'No'] },
    { name: 'tiredOfFake', type: 'select', label: 'Are you tired of how fake everybody’s life seems on social media?', options: ['Yes', 'No'] },
    { name: 'downloadApp', type: 'select', label: 'Would you download this app?', options: ['Yes', 'No'] },
    { name: 'colorScheme', type: 'text', label: 'App Design Preferences - Color Scheme:' },
    { name: 'appFeel', type: 'text', label: 'App Feel:' },
    { name: 'branding', type: 'text', label: 'Branding:' },
    { name: 'email', type: 'text', label: 'Email:' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Survey submitted successfully!');
      } else {
        alert('Failed to submit survey.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit survey.');
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <div key={question.name} className={`${styles.formGroup} form-group`}>
            <label>{question.label}</label>
            <input
              type="text"
              name={question.name}
              value={formData[question.name]}
              onChange={handleChange}
              className={`${styles.formControl} form-control`}
              required
            />
          </div>
        );
      case 'select':
        return (
          <div key={question.name} className={`${styles.formGroup} form-group`}>
            <label>{question.label}</label>
            <select
              name={question.name}
              value={formData[question.name]}
              onChange={(e) => {
                handleChange(e);
                handleNext();
              }}
              className={`${styles.formControl} form-control`}
              required
            >
              <option value="">Select</option>
              {question.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.surveyForm}>
        <Image src={logo} alt="Beacon Logo" className={styles.logo} />
        <h2 className={styles.surveyTitle}>Beacon Survey</h2>
        <form onSubmit={handleSubmit}>
          {renderQuestion(questions[currentStep])}
          {questions[currentStep].type === 'text' && currentStep !== questions.length - 1 && (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          )}
          {currentStep === questions.length - 1 && (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SurveyForm;
