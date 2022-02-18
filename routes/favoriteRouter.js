const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate')
const cors = require('./cors');
const Dishes = require('../models/dishes');
const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json('dev'));

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch(err);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    (req, res, next) => {
        Favorites.findOne({ user: req.user._id})
        .then((favorites) => {
            if (favorites) {
                for (let i = 0; i < req.body.length; i++) {
                    if (favorites.dishes.indexOf(req.body[i]._id) === -1) {
                        favorites.dishes.push(req.body[i]._id);
                    }
                }
                Favorites.save()
                .then((favorite) => {
                    console.log('Favorite added!', favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, 
                (err) => next(err));
            } else {
                Favorites.create({
                    user: req.user._id,
                    dishes: req.body
                })
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            }  
        }) 
    })
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findByIdAndUpdate(req.params._id, {
        $set: req.body
    }, {new: true})
    .then((favorites) => {
        if (!_id) return null
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(favorite);
        }
    },(err) => next(err))
    .catch(err)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findByIdAndRemove(req.params._id)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch(err);
});

module.exports = favoriteRouter;
