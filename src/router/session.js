import {
    check
} from 'express-validator/check';
import Session from '../model/Session';
import {
    UnauthorizedError
} from '../errors';
import {
    createVerify
} from 'crypto';

export default {
    create: {
        validation: [
            check('email')
            .exists().withMessage('email tidak ada')
            .isEmail().withMessage('email tidak berbentuk email')
            .trim()
            .normalizeEmail(),
            check('password')
            .exists().withMessage('password tidak ada')
        ],
        handle: (req, res, next) => {
            Session.create(req.body).then(token =>
                res.status(200).send({
                    "session": token
                })
            ).catch(err => {
                console.log(err);
                next(new ValidationError(
                    [{
                        param: "username",
                        msg: "username / password salah"
                    }]
                ))
            })
        }
    },
    middleware: (req, res, next) => {
        Session.verify(req.get('x-access-token'))
            .then(user => {
                req.userId = user.userId;
                next()
            })
            .catch(err => {
                console.log(err);
                next(new UnauthorizedError())
            });
    }
}