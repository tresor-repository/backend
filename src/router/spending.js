import {
    check
} from 'express-validator/check';

export default {
    post: {
        validation: [
            check('amount')
            .exists().withMessage('tidak ada')
            .isNumeric().withMessage('tidak berupa angka')
            .trim()
        ],
        handle: (req, res, next) => {
            console.log(req.body.tags[0])
            
            res.status(201).send();
        }
    }
}