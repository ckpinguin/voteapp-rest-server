import Sequelize from 'sequelize';
import {dd} from '../toolbox';

var sequelize = new Sequelize('voteapp', 'voteapp', 'voteapp', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

var Vote = sequelize.define('vote', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT
    }
});

var Choice = sequelize.define('choice', {
    choiceTitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    count: {
        type: Sequelize.INTEGER,
        length: 6
    }
});

Choice.belongsTo(Vote);
Vote.hasMany(Choice);

const PostgresVoteDatabase = {
    // TODO: This looks awful and does not work right, please learn more about Promises
    initialize() {
        Vote.sync({force: true}).then(function() {
            return Choice.sync({force: true});
        }).then(function() {
            return Promise.all([
                Vote.create({title: 'Test1', description: 'Desc1'}),
                Choice.create({choiceTitle: 'Choice 1', count: 12, voteId: 1}),
                Choice.create({choiceTitle: 'Choice 2', count: 4, voteId: 1}),
                Vote.create({title: 'Wurst?', description: 'Your favorite Bratwurst'}),
                Choice.create({choiceTitle: 'Olma (ohne Senf)', count:0, voteId: 2}),
                Choice.create({choiceTitle: 'Olma (mit Senf)', count: 1, voteId: 2})
            ]);
        }).catch(function(err) {
            return err;
        });
    },

    getAllVotes(callback) {
        return Vote.findAll({include: [Choice]}).then((votes, err) => callback(err, votes));
    },

    getVoteById(id, callback) {
        return Vote.findById(id, {include: [Choice]}).then((vote, err) => callback(err, vote));
    },

    /*
    store(vote, callback) {
        return Vote.findById(vote.id)
        .then(function(vote) {
            dd(vote.getChoices[0], 'resVote.choices', 'PostgresVoteDatabase.store()');
            // TODO: Make this dynamic and don't break API of VoteServer.js!
            //let count = resVote.choices[0].count;
            vote.getChoices[0].update({count: 120})
            //return .update(
                .then(function(res) {
                    callback(null, res);
                }).catch((err) => callback(err, null));
        });
    },    */

    store(vote, callback) {
        return this.storeVote(vote)
        /*
Vote.findById(vote.id).then(function(vote) {
            return vote.getChoices();
        }).then(function(choices) {
            return Promise.all(choices.map(function(choice) {
                dd(vote.choices[choice.id].count, `Storing vote.choices[${choice.id}].count`);
                choice.update({count: vote.choices[choice.id].count} );
            }));*/


            /*
  for (let choice of choices) {
                choice.update({count: choice.count+1 });
            }  */
            //return choices[0].update({count: 120});
        .then(function() {
            callback(null, vote); // callback with vote, not choice ;-)
        }).catch(function(err) {
            callback(err);
        });
    },

    // I have to break the API here for relational db's sake :(
    // Maybe I can use them only locally
    getChoiceById(id) {
        return Choice.findById(id);
    },

    storeVote(vote) {
        dd(vote.id, 'vote.id', 'PostgresVoteDatabase.storeVote()');
        return Vote.findById(vote.id).then(function(vote) {
            vote.update(vote);
        })
        .then(function(vote) {
            return Promise.all(vote.choices.map(function(choice) {
                this.storeChoice(vote.choices[choice.id]);
            }));
        });
        /*
.then(function(vote) {
            callback(vote);
        })
        .catch(function(err) {
            callback(err);
        });*/


    },

    storeChoice(choice) {
        dd(choice.count, 'choice.count', 'PostgresVoteDatabase.storeChoice()');
        return choice.update({ count: choice.count });
        //Choice.create(choice).then((result, err) => callback(err, result)).catch((err) => callback(err, null));
    }
};

export default {
    create(callback) {
        // callback is defined error-first (nodejs standard)
        return callback(PostgresVoteDatabase.initialize(), PostgresVoteDatabase);
    }
};
