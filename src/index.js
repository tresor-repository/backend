import express from 'express';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import router from './router';

const app = express();
app.use(expressValidator())
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.listen(3000, () => console.log("Listengin to port 3000"));
