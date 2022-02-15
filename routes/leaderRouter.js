const express = require('express');
const bodyParser = require('body-parser')

const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json('dev'));

leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch(err);
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Red Alert ! Not Allowed");
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.deleteOne({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
    }, (err) => next(err))
    .catch(err);
})

leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(leader)
    }, (err) => next(err))
    .catch(err);
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Cannot post leader')
})
.put(authenticate.verifyUser, (req, res, params) => {
    Leaders.findByIdAndUpdate(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, params) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err)=> next(err));
})
module.exports = leaderRouter;