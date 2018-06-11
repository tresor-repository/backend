import mongoose, { mongo } from 'mongoose';
import Promise from 'bluebird';

Promise.promisifyAll(mongoose);

mongoose.connect('mongodb://localhost/tresor');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB connected");
});