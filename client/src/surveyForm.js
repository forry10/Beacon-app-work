import React, { useState } from 'react';
import styles from './SurveyForm.module.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
    { name: 'age', label: 'Age', type: 'text' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { name: 'mentalHealth', label: 'Have you ever struggled with your mental health?', type: 'select', options: ['Yes', 'No'] },
    { name: 'talkToFriends', label: 'Did you talk to your friends about it?', type: 'select', options: ['Yes', 'No'] },
    { name: 'friendResponse', label: 'If your friend told you they were struggling, what would you think and how would you respond?', type: 'text' },
    { name: 'lightBeacon', label: 'Would you ever light a Beacon yourself?', type: 'select', options: ['Yes', 'No'] },
    { name: 'friendBeacon', label: 'If your friend lit a Beacon, would you send them support / interact with it?', type: 'select', options: ['Yes', 'No'] },
    { name: 'followInfluencers', label: 'Would you be interested in following influencers / celebrities on this and seeing their honest behind the scenes difficulties?', type: 'select', options: ['Yes', 'No'] },
    { name: 'tiredOfFake', label: 'Are you tired of how fake everybody’s life seems on social media?', type: 'select', options: ['Yes', 'No'] },
    { name: 'downloadApp', label: 'Would you download this app?', type: 'select', options: ['Yes', 'No'] },
    { name: 'colorScheme', label: 'App Design Preferences - Color Scheme:', type: 'text' },
    { name: 'appFeel', label: 'App Feel:', type: 'text' },
    { name: 'branding', label: 'Branding:', type: 'text' },
    { name: 'email', label: 'Email:', type: 'text' }
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

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Survey submitted successfully!');
      } else {
        alert('Failed to submit survey');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey');
    }
  };

  return (
    <div className={styles.surveyContainer}>
      <div className={styles.surveyHeader}>
        <img src="/Beacon_Logo-15.webp" alt="Beacon Logo" className={styles.logo} />
        <h2>Beacon Survey</h2>
        <p>
          “A new social platform where users can 'Light a beacon' when they're struggling with their mental health.
          While a beacon is lit, the user can jot down their thoughts and feelings, and other users can view the beacon and add their support.
          After 24 hours, beacons go out and are saved down as an entry in the user's journal.
          Users can follow each other and support each other in various ways.
          Essentially, it’s a social network for sharing the stuff you don’t want to share on Instagram. The real, raw, unfiltered reality of life. It’s the equivalent of opening up your mental health journal and letting everybody read it. A chance to be vulnerable and ask for support and also it should have a link to "beaconapp.ai" so people can go learn more.”
        </p>
      </div>
      <form className={styles.surveyForm} onSubmit={handleSubmit}>
        <TransitionGroup>
          {questions.map((question, index) => (
            <CSSTransition key={question.name} timeout={500} classNames="fade">
              <div style={{ display: currentStep === index ? 'block' : 'none' }}>
                <label htmlFor={question.name}>{question.label}</label>
                {question.type === 'text' ? (
                  <input
                    type="text"
                    id={question.name}
                    name={question.name}
                    value={formData[question.name]}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <select
                    id={question.name}
                    name={question.name}
                    value={formData[question.name]}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    {question.options.map((option) => (
                      <option key={option} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
        {questions[currentStep].type === 'text' && (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        )}
        {currentStep === questions.length - 1 && (
          <button type="submit">
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default SurveyForm;
