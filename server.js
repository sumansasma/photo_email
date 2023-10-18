const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Serve the public directory as a static folder
app.use(express.static('public'));

// Handle form submissions
app.post('/send_email', upload.single('image'), (req, res) => {
    const { name, email, description } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'YourEmailService', // e.g., 'Gmail'
        auth: {
            user: 'your-email@example.com', // Replace with your email
            pass: 'your-password', // Replace with your email password
        },
    });

    // Compose the email
    const mailOptions = {
        from: 'your-email@example.com',
        to: 'recipient@example.com', // Replace with the recipient's email
        subject: 'Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nDescription: ${description}`,
        attachments: [
            {
                filename: req.file.originalname,
                path: req.file.path,
            },
        ],
    };
    // Inside the email sending function in server.js
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error:', error);
        res.json({ success: false, error: error.message });
    } else {
        console.log('Email sent:', info.response);
        res.json({ success: true });
    }
});
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error:', error);
            res.json({ success: false, error: error.message }); // Return an error message
        } else {
            console.log('Email sent:', info.response);
            res.json({ success: true });
        }

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
