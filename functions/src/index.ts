
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

interface EmailRequest {
  name: string;
  email: string;
  message: string;
}

export const sendEmail = onRequest(async (req, res) => {
  try {
    await new Promise((resolve, reject) => 
      corsHandler(req, res, (err) => {
        if (err) reject(err);
        resolve(true);
      })
    );

    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const { name, email, message } = req.body as EmailRequest;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.DESTINATION_EMAIL,
      subject: `New Contact Form Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', { name, email });
    res.status(200).send({ success: true });
  } catch (error) {
    logger.error('Error sending email:', error);
    res.status(500).send({ error: 'Failed to send email' });
  }
});