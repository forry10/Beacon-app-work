const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/beaconSurvey', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const surveySchema = new mongoose.Schema({
    age: Number,
    gender: String,
    mentalHealth: String,
    talkToFriends: String,
    friendResponse: String,
    lightBeacon: String,
    friendBeacon: String,
    followInfluencers: String,
    tiredOfFake: String,
    downloadApp: String,
    colorScheme: String,
    appFeel: String,
    branding: String,
    email: String
});

const Survey = mongoose.model('Survey', surveySchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-survey', (req, res) => {
    const formData = req.body;

    // Transform the data
    const transformedData = transformData(formData);

    // Save to MongoDB
    const newSurvey = new Survey(transformedData);
    newSurvey.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to save survey data');
        } else {
            console.log('Survey data saved:', transformedData);
            sendEmail(transformedData);
            res.send('Survey submitted successfully');
        }
    });
});

function transformData(data) {
    return {
        age: data.age,
        gender: data.gender.toUpperCase(),
        mentalHealth: data.mentalHealth === 'yes' ? 'Struggled' : 'Not Struggled',
        talkToFriends: data.talkToFriends,
        friendResponse: data.friendResponse,
        lightBeacon: data.lightBeacon,
        friendBeacon: data.friendBeacon,
        followInfluencers: data.followInfluencers,
        tiredOfFake: data.tiredOfFake,
        downloadApp: data.downloadApp,
        colorScheme: data.colorScheme,
        appFeel: data.appFeel,
        branding: data.branding,
        email: data.email
    };
}

function sendEmail(data) {
    // Configure the email transport using nodemailer
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // Replace with your email provider
        auth: {
            user: 'jack.forry10@gmail.com', // Replace with your email
            pass: 'aiwx sodx aict twhm' // Replace with your app password
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: 'jack.forry10@gmail.com',
        subject: 'Survey Results',
        text: JSON.stringify(data, null, 2) // Convert data to a string for the email body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
