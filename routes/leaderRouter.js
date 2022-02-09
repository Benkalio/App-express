const express = require('express');
const bodyParser = require('body-parser')

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json('dev'));

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain')
    next();
})
.get((req, res, next) => {
    res.end("Here are the revised standard leader coming right up..")
})
.post((req, res, next) => {
    res.end('Posting leaders with id: ' + req.body.name + 'details: ' + req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("Red Alert ! Not Allowed");
})
.delete((req, res, next) => {
    res.end("Showing no leaders")
})

leaderRouter.route('/:leaderId')
.all((req, res, next) =>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
})
.get((req, res, next) => {
    res.end('Sending leader with id: ' + req.body.params 
        + ' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Cannot post leader')
})
.put((req, res, params) => {
    res.write('Updating: ' + req.params.leaderId + '\n');
    res.end('Posting leader with id: ' 
        + req.body.name + 'with details: ' + req.body.description)
})
.delete((req, res, params) => {
    res.end('Deleting leader with id: ' + req.params.leaderId)
})
module.exports = leaderRouter;