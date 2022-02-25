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

        if(favorites) {
            user_favorites = favorites.filter(favor => favor.user._id.toString() === 
                req.user.id.toString())[0];
                if(!user_favorites) {
                    let err = new Error('No available favorites!');
                    err.status = 404;
                    return next(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
        } 
        else {
            let err = new Error("There\'s no favorite");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch(err);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
    (req, res, next) => {
        Favorites.findOne({})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            let user;
            if (favorites) {
                user = favorites.filter(favor => favor.user._id.toString() === 
                req.user.id.toString())[0];
                for (let i = 0; i < req.body.length; i++) {
                    if (favorites.dishes.indexOf(req.body[i]._id) === -1) {
                        favorites.dishes.push(req.body[i]._id);
                    }
                }
                Favorites.save()
                .then((favorites) => {
                    console.log('Favorite added!', favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, 
                (err) => next(err));
            } else {
                Favorites.create({
                    user: req.user._id,
                    dishes: req.body
                })
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                })
            }  
        }); 
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
            res.json(favorites);
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

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        if(favorites) {
            const favor = favorites.filter(favor => favor.user._id.toString() === req.user.id.toString ())[0]
            const dish = favor.dishes.filter(dish => dish.id == req.params.id)[0];

            if(dish) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }
            else {
                let err = new Error("No favorites available " + req.params.dishId);
                err.status = 404;
                return next(err);
            }
        }
        else {
            let err = new Error("No favorites available");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                var user;
                if(favorites)
                    user = favorites.filter(favor => favor.user._id.toString() === req.user.id.toString())[0];
                if(!user) 
                    user = new Favorites({user: req.user.id});
                if(!user.dishes.find((d_id) => {
                    if(d_id._id)
                        return d_id._id.toString() === req.params.dishId.toString();
                }))
                    user.dishes.push(req.params.dishId);
                
                user.save()
                    .then((userFavors) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(userFavors);
                        console.log("Favorites Created");
                    }, (err) => next(err))
                    .catch((err) => next(err));

            })
            .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation is not supported on /favorites/:dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            var user;
            if(favorites)
                user = favorites.filter(favor => favor.user._id.toString() === req.user.id.toString())[0];
            if(user){
                user.dishes = user.dishes.filter((dishId) => dishId._id.toString() !== req.params.dishId);
                user.save()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));
                
            } else {
                var err = new Error('You do not have any favorites');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = favoriteRouter;
