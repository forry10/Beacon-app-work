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

app.post('/submit-survey', async (req, res) => {
    const formData = req.body;

    // Transform the data
    const transformedData = transformData(formData);

    try {
        // Save to MongoDB
        const newSurvey = new Survey(transformedData);
        await newSurvey.save();
        console.log('Survey data saved:', transformedData);

        // Send email
        await sendEmail(transformedData);

        res.send('Survey submitted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to save survey data');
    }
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

async function sendEmail(data) {
    // Configure the email transport using nodemailer
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'jack.forry10@gmail.com', // Replace with your Gmail address
            pass: 'aiwx sodx aict twhm' // Replace with your App Password
        }
    });

    let mailOptions = {
        from: 'jack.forry10@gmail.com',
        to: 'jack.forry10@gmail.com',
        subject: 'Survey Results',
        text: JSON.stringify(data, null, 2) // Convert data to a string for the email body
    };

    return transporter.sendMail(mailOptions);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
