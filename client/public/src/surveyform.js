import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      formData,
      process.env.REACT_APP_EMAILJS_USER
    )
    .then(response => {
      alert('Survey submitted successfully');
    })
    .catch(error => {
      alert('Failed to submit survey');
    });

    axios.post('http://localhost:3000/submit-survey', formData)
      .then(response => {
        alert('Survey submitted successfully');
      })
      .catch(error => {
        alert('Failed to submit survey');
      });
  };

  return (
    <div className="container">
      <h2>Beacon Survey</h2>
      <form onSubmit={handleSubmit}>
        {/* Render your form fields here */}
        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Add more form fields similarly */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SurveyForm;