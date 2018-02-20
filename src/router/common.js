import express from 'express';
import { validationResult } from 'express-validator/check';

export default {
    validator: (array) => {
        return [array, (req, res, next) => {
            const errors = validationResult(req);
            if (!(errors.isEmpty())) {
                console.log(errors.array());
                res.status(422).json({
                    errors: errors.array().map(it => {
                        return {
                            field: it.param,
                            message: it.msg
                        }
                    })
                });
            }
            next();
        }];
    }
}