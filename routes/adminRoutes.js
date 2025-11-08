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

router.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  // Check if email already exists in the database
  const checkEmailSql = "SELECT COUNT(*) AS count FROM admin WHERE email = ?";
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

      let User = {
        email,
        password: hashedPassword,
      };

      const sql = "INSERT INTO admin SET ?";
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

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const sql = "SELECT * FROM admin WHERE email = ?";
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
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
      });
    });
  });
  router.get("/dashboard", authenticateToken, (req, res) => {
    res.json({ message: `, ${req.user.email}!` });
  });
  router.post("/logout", (req, res) => {
    res.json({ message: "Logout successful" });
  });

  //  router.get('/data', (req, res) => {
  //   const sql = 'SELECT id, email, username, first_name, last_name FROM customer_data';
  //   const contactQuery = 'SELECT id, email, username, first_name, last_name FROM contact_form';

  //   db.query(sql, (err, customerResults) => {
  //       if (err) return res.status(500).json({ error: 'Failed to fetch customer data' });

  //       db.query(contactQuery, (err, contactResults) => {
  //           if (err) return res.status(500).json({ error: 'Failed to fetch contact form data' });

  //           res.json({
  //               customers: customerResults,
  //               contacts: contactResults
  //           });
  //       });
  //   });
  // })

  router.get("/data", authenticateToken, (req, res) => {
    const sql =
      "SELECT id, email, username, first_name, last_name FROM customer_data";
    const contactQuery =
      "SELECT id, email, first_name, last_name, message FROM contact_form";
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching data from customer_data:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      db.query(contactQuery, (err, results2) => {
        if (err) {
          console.error("Error fetching data from contact_form:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json({
          user: results,
          user_form: results2,
        });
      });
      // console.log('Results:', results); // Log data fetched from the database

      // res.json(results);
    });
  });
});

module.exports = router;
