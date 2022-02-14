const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
const Promotions = require('../models/promotions');
promoRouter.use(bodyParser.json('dev'));


promoRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err)); 
}) 
.post((req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promo created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('Put operations not supported on /promotions');
})
.delete((req, res, next) => {
    Promotions.deleteOne({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err))
})

promoRouter.route('/:promoId')
.get((req, res, next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Cannot post promo ' + req.params.promoId)
})
.put((req, res, params) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {new: true})
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete((req, res, params) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err))
})

module.exports = promoRouter;