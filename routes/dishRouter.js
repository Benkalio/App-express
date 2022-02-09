const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json('dev'));

dishRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Sending you the recent dishes...');
})
.post((req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all the dishes!');
});

dishRouter.route('/:dishId')
.all((req, res, next) =>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
})
.get((req, res, next) => {
    res.end('Sending dish with id: ' + req.body.params 
        + ' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Cannot post dish ' + req.params.dishId)
})
.put((req, res, params) => {
    res.write('Updating: ' + req.params.dishId + '\n');
    res.end('Posting dish with id: ' 
        + req.body.name + 'with details: ' + req.body.description)
})
.delete((req, res, params) => {
    res.end('Deleting dishes with id: ' + req.params.dishId)
})

module.exports = dishRouter;