const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json('dev'));

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200,
    res.setHeader('Content-Type', 'text/plain')
    next();
})
.get((req, res, next) => {
    res.end('Lights ! Cameras ! Action !')
}) 
.post((req, res, next) => {
    res.end('Your post will be added: ' + req.body.name + 'with the following details: ' + req.body.description );
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('Put operations not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all the promo now!')
})

promoRouter.route('/:promoId')
.all((req, res, next) =>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
})
.get((req, res, next) => {
    res.end('Sending promotion with id: ' + req.params.promoId 
        + ' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Cannot post promo')
})
.put((req, res, params) => {
    res.write('Updating: ' + req.params.promoId + '\n');
    res.end('Posting promotion with id: ' 
        + req.body.name + 'with details: ' + req.body.description)
})
.delete((req, res, params) => {
    res.end('Deleting promo with id: ' + req.params.promoId)
})

module.exports = promoRouter;