const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  if (review) {
    const isbn = req.params.isbn;
    if (isbn && books[isbn]) {
        const token = req.session.authorization.accessToken;
        const decoded = jwt.verify(token, 'access');
        const username = decoded.data.username;

        books[isbn].reviews[username] = review;
        return res.status(204).send("Updated");
   }
  }
  return res.status(400).send("Bad request. Must include review as query");  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (isbn && books[isbn]) {
        const token = req.session.authorization.accessToken;
        const decoded = jwt.verify(token, 'access');
        const username = decoded.data.username;

        delete books[isbn].reviews[username];
        return res.status(204).send("Updated");
    }
    return res.status(400).send("Bad request. Must include review as query");  
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
