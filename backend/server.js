require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
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

    const transformedData = transformData(formData);

    try {
        const newSurvey = new Survey(transformedData);
        await newSurvey.save();
        console.log('Survey data saved:', transformedData);

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
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAILJS_USER,
            pass: process.env.EMAILJS_PASS
        }
    });

    let mailOptions = {
        from: data.email,
        to: 'jack.forry10@gmail.com',
        subject: 'Survey Results',
        text: JSON.stringify(data, null, 2)
    };

    return transporter.sendMail(mailOptions);
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});