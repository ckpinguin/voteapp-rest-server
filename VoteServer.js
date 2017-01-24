var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
import {dd} from './toolbox';

function start(port, voteDatabase) {
    var app = express();

    // configure app to use bodyParser()
    // this will let us get the data from a P           OST
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    // Allow CORS
    app.use(cors());
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();
    // GET
    router.get('/', function(req, res) {
        const msg = JSON.stringify({
            message: 'Hooraaaay! welcome to our api!'
        }, null, 4);
        res.setHeader('Content-Type', 'application/json');
        res.send(msg);
    });
    // POST
    router.post('/', function(req, res) {
        console.log('Got a POST request for the homepage');
        res.send('Hello POST');
    });
    // DELETE
    router.delete('/del_user', function(req, res) {
        console.log('Got a DELETE request for /del_user');
        res.send('Hello DELETE');
    });
    // This responds a GET request for the /list_user page.
    router.get('/list_user', function(req, res) {
        console.log('Got a GET request for /list_user');
        res.send('Page Listing');
    });
    // This responds a GET request for abcd, abxcd, ab123cd, and so on
    router.get('/ab*cd', function(req, res) {
        console.log('Got a GET request for /ab*cd');
        res.send('Page Pattern Match');
    });
    router.put('/test', function(req, res) {
        console.log('Got a PUT request for /test');
        res.send('PUT request');
    });

    router.get('/votes', function(req, res) {
        console.log('Got a GET request for /votes');
        console.info('from: ' + req.ip + ', for ' + req.hostname);
        voteDatabase.getAllVotes((err, votes) => { // Error-First callback
            res.setHeader('Accept', 'application/json');
            res.type('application/json');
            res.send(votes);
        });
    });

    router.get('/votes/:voteId', function(req, res) {
        console.log('Got a GET request for /votes/' + voteId);
        console.info('from: ' + req.ip + ', for ' + req.hostname);
        const voteId = req.params.voteId;
        voteDatabase.getVoteById(voteId, (err, vote) => {
            if (vote) {
                res.type('application/json');
                res.send(vote);
            } else {
                res.status(404).send(`Invalid Vote id '${voteId}'`);
            }
        });
    });

    router.get('/votes/:voteId/choices/:choiceId', function(req, res) {
        const voteId = parseInt(req.params.voteId);
        const choiceId = parseInt(req.params.choiceId);
        console.log('Got a GET request for /votes/' + voteId + '/choices/'
                    + choiceId);
        console.info('from: ' + req.ip + ', for ' + req.hostname);
        voteDatabase.getVoteById(voteId, (err, vote) => {
            if (!vote) {
                res.status(404).send(`Invalid Vote id '${voteId}'`);
            } else {
                const choice = vote.choices.find((c) => c.id === choiceId);
                if (!choice) {
                    // invalid choice
                    res.status(404).send(`Invalid Choice id '${choiceId}'`);
                } else {
                    res.send(choice);
                }
            }
        });
    });

    router.put('/votes/:voteId/choices/:choiceId/vote', function(req, res) {
        const voteId = parseInt(req.params.voteId);
        const choiceId = parseInt(req.params.choiceId);
        console.log(`Got a PUT request for '/votes/${voteId}/choices/${choiceId}/vote`);
        console.info('from: ' + req.ip + ', for ' + req.hostname);
        dd(choiceId, 'choiceId', `VoteServer.router.put(/votes/${voteId}/choices/${choiceId}/vote)`);
        voteDatabase.getVoteById(voteId, (err, vote) => {
            if (!vote) {
                res.status(404).send(`Invalid Vote id '${voteId}'`);
            } else {
                const choice = vote.choices.find((c) => c.id === choiceId);
                if (!choice) {
                    // invalid choice
                    res.status(404).send(`Invalid Choice id '${choiceId}'`);
                } else {
                    // increment count
                    choice.count = choice.count + 1;
                    // save vote
                    voteDatabase.store(vote, (err, vote) => {
                        dd(choice.id, 'choice.id', 'VoteServer: choice.id to be stored');
                        dd(choice.count, 'choice.count', 'VoteServer: choice.count to be stored');
                        //dd(vote.choice, 'vote.choice', 'vote.choice to be stored');
                        res.send(vote);
                    });
                }
            }
        });
    });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    var server = app.listen(port, function(error) {
        if (error) {
            console.error(error);
        } else {
            //var host = server.address().address;
            var host = server.address().address;
            var port = server.address().port;
            console.info('==> 🌎  Express is Listening on ' + host + ':' + port + '. Visit http://' + host + ':' + port + '/ in your browser.');
        }
    });
}

export default {
    start
};
