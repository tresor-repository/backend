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
    }
}
