const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const next = require('next');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '../client' });
const handle = nextApp.getRequestHandler();

const app = express();
const PORT = process.env.PORT || 3001;

nextApp.prepare().then(() => {
  app.use(cors());
  app.use(bodyParser.json());

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  const Survey = require('./models/survey');

  app.post('/api/survey', async (req, res) => {
    const surveyData = new Survey(req.body);
    try {
      await surveyData.save();
      res.status(200).send('Survey data saved successfully');
      sendEmail(req.body);
    } catch (error) {
      res.status(500).send('Error saving survey data');
    }
  });

  const sendEmail = (data) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAILJS_USER,
        pass: process.env.EMAILJS_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAILJS_USER,
      to: process.env.EMAILJS_USER,
      subject: 'New Survey Submission',
      text: JSON.stringify(data, null, 2),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ', info.response);
      }
    });
  };

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
