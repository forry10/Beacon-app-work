const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-survey', (req, res) => {
    const formData = req.body;

    // Transform the data
    const transformedData = transformData(formData);

    // Store the data (For demonstration, we'll log it to the console. You can store it in a database)
    console.log('Transformed Data:', transformedData);

    // Send an email with the transformed data
    sendEmail(transformedData);

    res.send('Survey submitted successfully');
});

function transformData(data) {
    // Example transformation
    return {
        age: data.age,
        gender: data.gender.toUpperCase(),
        mentalHealth: data.mentalHealth === 'yes' ? 'Struggled' : 'Not Struggled',
        // Add other transformations as needed
    };
}

function sendEmail(data) {
    // Configure the email transport using nodemailer
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // Replace with your email provider
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password' // Replace with your email password
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