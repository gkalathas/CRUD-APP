const express = require('express');
const router = express.Router();
const db = require('../models');

// Router for all requests at '/'
// e.g. localhost:3000/, localhost:3000/example, localhost:3000/create
module.exports = (app) => {
  app.use('/', router);
};

// localhost:3000/
// Callback function must be async, so that database call
// can be awaited
router.get('/', async (req, res, next) => {
  let todos, notes;
  try {
    if (req.session.todoFilter === 'all') {
      // SELECT * FROM Todos
      todos = await db.Todo.findAll();
    } else {
      // SELECT * FROM post WHERE done = 0;
      todos = await db.Todo.findAll({
        where: {
          done: false,
        },
      });
    }
    notes = await db.Note.findAll();
    console.log(notes)
  } catch (error) {
    next(error);
  }
  res.render('index', {
    title: 'Web Technologies',
    todos, notes
  });
});

// localhost:3000/create
router.get('/create', (req, res) => {
  res.render('create');
});


// localhost:3000/create
router.get('/createNote', (req, res) => {
  res.render('createNote');
});


// localhost:3000/test-query?firstParam=123&secondParam=456
// to test query params, url should have ...?key1=value1&key2=value2...
router.get('/test-query', (req, res) => {
  res.send(req.query);
});

// localhost:3000/test-params/123/456
// to test params, url should be /test-params/4 or /test-params/hello
router.get('/test-params/:test/:test2', (req, res) => {
  res.send(req.params);
});

// localhost:3000/test-params/123
router.get('/test-params/:test', (req, res) => {
  res.send(req.params);
});
