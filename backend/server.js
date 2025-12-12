require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- GMAIL SETUP ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'deepchandkhowal123@gmail.com', // Aapka Email
    pass: 'fvcd qnal ritv wlnm'           // YAHAN APNA 16-DIGIT APP PASSWORD DALEIN
  }
});

const otpStore = new Map();

// SEND OTP VIA EMAIL
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  const mailOptions = {
    from: 'SecureVault App',
    to: email,
    subject: 'Your Secure Login OTP',
    text: `Your One-Time Password is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    otpStore.set(email, otp);
    console.log(`OTP sent to ${email}`);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Email sending failed. Check App Password." });
  }
});

// VERIFY OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body;
  if (otpStore.get(email) === code) {
    otpStore.delete(email);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

