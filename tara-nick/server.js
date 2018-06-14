'use strict';

const fs = require('fs');
const express = require('express');
const pg = require('pg');
const PORT = process.env.PORT || 3000;
const app = express();

// DONE: Install and require the NPM package pg and assign it to a variable called pg.

// Windows and Linux users: You should have retained the user/password from the pre-work for this course.
// Your OS may require that your conString (connection string, containing protocol and port, etc.) is composed of additional information including user and password.
const conString = 'postgres://postgres:1234@localhost:5432/kilovolt';
// For example...
// const conString = 'postgres://postgres:1234@localhost:5432/kilovolt'

// Mac:
// const conString = 'postgres://localhost:5432/kilovolt';

// DONE: Pass the conString into the Client constructor so that the new database interface instance has the information it needs
const client = new pg.Client(conString);

// REVIEW: Use the client object to connect to our DB.
client.connect();


// REVIEW: Install the middleware plugins so that our app can parse the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));


// REVIEW: Routes for requesting HTML resources
app.get('/new-article', (request, response) => {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js, if any, is interacting with this particular piece of `server.js`? What part of CRUD, if any, is being enacted/managed by this particular piece of code?
  // This route corresponds to 1 > 2 > 6 > 5 > 1. This route is for HTML resources, which is static, and doesn't need to hit the database. At this point, we are simply reading the HTML.
  response.sendFile('new.html', { root: './public' });
});


// REVIEW: Routes for making API calls to use CRUD Operations on our database
app.get('/articles', (request, response) => {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE
  client.query('')
    .then(function(result) {
      response.send(result.rows);
    })
    .catch(function(err) {
      console.error(err)
    })
});

app.post('/articles', (request, response) => {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE
  let SQL = `
    INSERT INTO articles(title, author, "authorUrl", category, "publishedOn", body)
    VALUES ($1, $2, $3, $4, $5, $6);
  `;

  let values = [
    request.body.title,
    request.body.author,
    request.body.authorUrl,
    request.body.category,
    request.body.publishedOn,
    request.body.body
  ]

  client.query(SQL, values)
    .then(function() {
      response.send('insert complete')
    })
    .catch(function(err) {
      console.error(err);
    });
});

app.put('/articles/:id', (request, response) => {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE

  let SQL = '';
  let values = [];

  client.query(SQL, values)
    .then(() => {
      response.send('update complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/articles/:id', (request, response) => {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE

  let SQL = `DELETE FROM articles WHERE article_id=$1;`;
  let values = [request.params.id];

  client.query(SQL, values)
    .then(() => {
      response.send('Delete complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/articles', (request, response) => {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE

  let SQL = '';
  client.query(SQL)
    .then(() => {
      response.send('Delete complete')
    })
    .catch(err => {
      console.error(err);
    });
});

// COMMENT: What is this function invocation doing?
// PUT YOUR RESPONSE HERE
loadDB();

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});


//////// ** DATABASE LOADER ** ////////
////////////////////////////////////////
function loadArticles() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE

  let SQL = 'SELECT COUNT(*) FROM articles';
  client.query(SQL)
    .then(result => {
      // REVIEW: result.rows is an array of objects that PostgreSQL returns as a response to a query.
      // If there is nothing on the table, then result.rows[0] will be undefined, which will make count undefined. parseInt(undefined) returns NaN. !NaN evaluates to true.
      // Therefore, if there is nothing on the table, line 158 will evaluate to true and enter into the code block.
      if (!parseInt(result.rows[0].count)) {
        fs.readFile('./public/data/hackerIpsum.json', 'utf8', (err, fd) => {
          JSON.parse(fd).forEach(ele => {
            let SQL = `
              INSERT INTO articles(title, author, "authorUrl", category, "publishedOn", body)
              VALUES ($1, $2, $3, $4, $5, $6);
            `;
            let values = [ele.title, ele.author, ele.authorUrl, ele.category, ele.publishedOn, ele.body];
            client.query(SQL, values);
          })
        })
      }
    })
}

function loadDB() {
  // COMMENT: What number(s) of the full-stack-diagram.png image correspond to this route? Be sure to take into account how the request was initiated, how it was handled, and how the response was delivered. Which method of article.js is interacting with this particular piece of `server.js`? What part of CRUD is being enacted/managed by this particular piece of code?
  // PUT YOUR RESPONSE HERE
  client.query(`
    CREATE TABLE IF NOT EXISTS articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      "authorUrl" VARCHAR (255),
      category VARCHAR(20),
      "publishedOn" DATE,
      body TEXT NOT NULL);`)
    .then(() => {
      loadArticles();
    })
    .catch(err => {
      console.error(err);
    });
}