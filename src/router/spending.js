import {
    check
} from 'express-validator/check';
import Spending from '../model/Spending';

export default {
    post: {
        validation: [
            check('amount')
            .exists().withMessage('tidak ada')
            .isNumeric().withMessage('tidak berupa angka')
            .trim()
        ],
        handle: (req, res, next) => {
            const spending = new Spending({
                amount: req.body.amount,
                userId: req.userId,
                tags: req.body.tags,
                info: req.body.info,
                category: req.body.category,
                date: req.body.date
            })
            spending.save(err => {
                if (err) return next(err);
                res.status(201).send();
            })
        }
    }
}