const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!userExists(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(400).send("Bad request. Must include username and pwd in body");  
});

const userExists = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    let response = await axios.get("./booksdb.js");
    let booksAsync = response.data;
  return res.send(JSON.stringify(booksAsync, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn && books[isbn]) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  }

  return res.status(404).send("Could not find book with ISBN: " + isbn);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    if (author) {
      let booksArray = Object.values(books);
      let foundBooks = booksArray.filter(book => book.author === author);

      return res.send(JSON.stringify(foundBooks, null, 4));
    }
  
    return res.status(404).send("Could not find book with author: " + author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if (title) {
      let booksArray = Object.values(books);
      let foundBooks = booksArray.filter(book => book.title.includes(title));

      return res.send(JSON.stringify(foundBooks, null, 4));
    }
  
    return res.status(404).send("Could not find book with title: " + title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn && books[isbn]) {
      return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    }
  
    return res.status(404).send("Could not find book with ISBN: " + isbn);
});

module.exports.general = public_users;
