import { check } from 'express-validator/check';

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
            res.send(req.body.email);
        }
    },
}