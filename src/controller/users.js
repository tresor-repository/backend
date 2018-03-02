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
                .custom(value => {
                    const isRegexMatch = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/.test(value);
                    console.log(isRegexMatch);
                    if (!isRegexMatch) {
                        throw new Error("password harus mengandung satu huruf besar, satu huruf kecil dan paling pendek 8 karakter");
                    }
                    return true;
                })
        ],
        handle: (req, res, next) => {
            res.send(req.body.email);
        }
    },
}