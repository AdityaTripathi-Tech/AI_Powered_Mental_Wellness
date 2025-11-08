const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const db = require("../config/db");
const authenticateToken = require("../middleware/authenticateToken");
const bodyParser = require("body-parser");

const router = express.Router();
const saltRounds = 10;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

async function getUniqueUsername(email) {
  let userName = email.split("@")[0];
  let uniqueUsername = userName;

  const checkUsernameExists = () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) AS count FROM customer_data WHERE username = ?",
        [uniqueUsername],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count);
        }
      );
    });
  };
  isUsernameNotUnique = false;
  let count = await checkUsernameExists();
  if (count > 0) {
    isUsernameNotUnique = true;
  } else {
    isUsernameNotUnique ? (uniqueUsername += nanoid().substring(0, 5)) : "";
  }
  return uniqueUsername;
}

router.post("/signup", (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      });
  }

  // Check if email already exists in the database
  const checkEmailSql =
    "SELECT COUNT(*) AS count FROM customer_data WHERE email = ?";
  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error("Failed to check email:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password before inserting into the database
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error("Failed to hash password:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      let username = await getUniqueUsername(email);
      let User = {
        first_name,
        last_name,
        email,
        username,
        password: hashedPassword,
      };

      const sql = "INSERT INTO customer_data SET ?";
      db.query(sql, User, (err, result) => {
        if (err) {
          console.error("Failed to insert user:", err);
          return res.status(500).json({ error: "Failed to insert user" });
        }
        res.json({
          message: "User inserted successfully",
          id: result.insertId,
        });
      });
    });
  });
});
//signin user routes

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const sql = "SELECT * FROM customer_data WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Failed to select user:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0]; // Correctly define user

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Failed to compare passwords:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token using the user object
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        message: 'Login successful',
        token
      });
    });
  });
});
router.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: `${req.user.email}` });
});
router.post('/logout', (req, res) => {
  // This endpoint is primarily for demonstration.
  // If using a blacklist, add the token to the blacklist here.
  res.json({ message: 'Logout successful' });
});
router.post('/contact', (req, res) => {
  const {first_name, last_name, email, message} = req.body;

  if (!first_name ||!last_name ||!email ||!message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  // create an object to hold the data
  const contactData ={
    first_name,
    last_name,
    email,
    message,
  }
  // Send email to support team using your preferred method
  const sql = 'INSERT INTO contact_form SET ?';
  db.query(sql, contactData, (err, result) => {
    if (err) {
      console.error("Failed to insert contact form data:", err);
      return res.status(500).json({ error: "Failed to insert contact form data" });
    }
    res.json({
      message: "Contact form data inserted successfully",
      id: result.insertId,
    });
  });

  
})

module.exports = router;
