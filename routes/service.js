const express = require('express');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const accountSid = process.env.VIDEO_ID;
const authToken = process.env.VIDEO_AUTH;

const router = express.Router();
const saltRounds = 10;

router.post('/token', (req, res) => {
    const { identity } = req.body;
    if (!identity) {
      return res.status(400).json({ error: 'Identity is required' });
    }
  
    // Verify JWT token
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      // Create Twilio token
      const twilioToken = new twilio.jwt.AccessToken(accountSid, authToken);
      twilioToken.identity = identity;
      const videoGrant = new twilio.jwt.AccessToken.VideoGrant();
      twilioToken.addGrant(videoGrant);
  
      res.json({ token: twilioToken.toJwt() });
    });
  });
  module.exports = router;