'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();

/*========== GET ALL ITEMS =============== */
router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('tags')
    .orderBy('tags.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


/*========== GET ITEMS by ID =============== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  knex('tags')
    .select()
    .where('tags.id', id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => next(err));
});


/*========== PUT/UPDATE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const updateObj = {};
  updateObj.name = req.body.name;
  //make sure updated object has a title.  if not throw an error
  if (!updateObj.name) {
    const err = new Error('Missing`name` in request body');
    err.status = 400;
    return next(err);
  }
  //select 
  knex('tags')
    .where('tags.id', id)
    .update(updateObj)
    .returning(['id', 'name'])
    .then(([reply]) => {
      res.status(201).json(reply);
    })
    .catch (err => next(err));
});

/*========== POST/CREATE ITEM ========== */
router.post('/', (req, res, next) => {
  const { name } = req.body; //same as /const name = req.body.name
  
  //makes sure user input is valid
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      //results will be an array with one item. next line sets up a constant to only return the first item in the returned array
      const result = results[0];
      res.location(`{req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});


/*=============== DELETE ITEM ==============*/
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('tags')
    .where('tags.id', id)
    .del()
    .then(() => {
      res.sendStatus(204)
    })  
    .catch(err => next(err)); 
});


module.exports = router;
