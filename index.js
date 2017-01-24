require('babel-register'); // babel-transpile all required or imported stuff

const VoteServer = require('./VoteServer.js').default;
const useMongoDb = process.env.USE_MONGODB;
const usePGDb = process.env.USE_PGDB;

var Database = require('./db/InMemoryVoteDatabase').default;
if (useMongoDb) {
    Database = require('./db/MongoDbVoteDatabase').default;
} else if (usePGDb) {
    Database = require('./db/PostgresVoteDatabase').default;
}

Database.create((err, database) => { // Error-First callback
    if (err) {
        console.error('Error using database: ' + err);
        return; // Server stops here...
    }
    console.log('Starting VoteApp...');
    VoteServer.start(3000, database);
});
