import express from 'express';
import { validationResult } from 'express-validator/check';
import { ValidationError} from '../errors';
import session from '../model/session';

export default {
    validator: (array) => {
        return [array, (req, res, next) => {
            const errors = validationResult(req);
            if (!(errors.isEmpty())) {
                next(new ValidationError(errors.array()));
            }
            next();
        }];
    },
    session: (req, res, next) => {
            const authorization = req.get('Authorization');
            const result = session.verify(authorization);
            console.log(result);
            res.status(200).send({"result":"ok"}); 
    }
}
