import express from 'express';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import logger from 'morgan';
import router from './router/router';
import { errorMiddleware } from './errors';
import * as Mongo from './model/mongo';

const app = express();
app.use(expressValidator())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use('/', router);
app.use(errorMiddleware);

app.listen(3000, () => console.log("Listengin to port 3000"));
