const express = require('express');
const router = express.Router();
const db = require('../models');
const path = require('path');
const config = require('../../config/config');
const logger = require('pino')();

// Router for all requests at '/api'
// e.g. localhost:3000/api, localhost:3000/api/example, localhost:3000/api/todos
module.exports = (app) => {
  app.use('/api', router);
};

// localhost:3000/api/todos
// Callback function must be async, so that database call
// can be awaited
router.post('/todos', async (req, res, next) => {
  // Javascript object destructuring. The commented code
  // does the same as the one below.
  // const title = req.body.title;
  // const text = req.body.text;
  // const dueDate = req.body.dueDate;
  const { title, text, dueDate } = req.body;
  try {
    // Create a new todo
    await db.Todo.create({
      title,
      text,
      dueDate,
    });
    // Redirect the response (aka the browser) to the '/'
    // after submitting the form.
    res.redirect('/');
  } catch (error) {
    // If there was any error during the Todo INSERT, we
    // can catch it here and pass it to the error handler.
    next(error);
  }
});



// localhost:3000/api/notes
// Callback function must be async, so that database call
// can be awaited
router.post('/notes', async (req, res, next) => {
  // Javascript object destructuring. The commented code
  // does the same as the one below.
  // const title = req.body.title;
  // const text = req.body.text;
  // const dueDate = req.body.dueDate;
  const {text} = req.body;
  try {
    // Create a new todo
    await db.Note.create({
      text
    });
    // Redirect the response (aka the browser) to the '/'
    // after submitting the form.
    res.redirect('/');
  } catch (error) {
    // If there was any error during the Todo INSERT, we
    // can catch it here and pass it to the error handler.
    next(error);
  }
});





// localhost:3000/api/todos/2/complete
router.get('/todos/:id/complete', async (req, res, next) => {
  // Javascript object destructuring. The commented code
  // does the same as the one below.
  // const id = req.params.id;
  const { id } = req.params;
  try {
    // Change every todo with this id to done: true
    await db.Todo.update(
      { done: true },
      {
        where: {
          id,
        },
      }
    );
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});



// localhost:3000/api/todos/2/important
router.get('/todos/:id/important', async (req, res, next) => {
  // Javascript object destructuring. The commented code
  // does the same as the one below.
  // const id = req.params.id;
  const { id } = req.params;
  try {
    // Change every important with this id to important: true
    await db.Todo.update(
      { important: true },
      {
        where: {
          id,
        },
      }
    );
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});


// localhost:3000/api/todo-filter/all
router.get('/todo-filter/:chosenFilter', (req, res) => {
  req.session.todoFilter = req.params.chosenFilter;
  req.session.save(() => {
    res.redirect('/');
  });
});


// localhost:3000/api/note-filter/all
router.get('/notes-filter/:chosenFilter', (req, res) => {
  req.session.notesFilter = req.params.chosenFilter;
  req.session.save(() => {
    res.redirect('/');
  });
});




// localhost:3000/api/test-upload
router.post('/test-upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const sampleFile = req.files.sampleFile;
  const uploadPath = path.join(
    config.root,
    '/uploaded_files/',
    sampleFile.name
  );

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

// localhost:3000/api/get-cookie
router.get('/get-cookie', function (req, res, next) {
  logger.info('I GAVE A COOKIE');
  req.session.gotCookie = true;
  res.redirect('/');
});
