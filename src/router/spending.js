import {
    check
} from 'express-validator/check';
import Spending from '../model/Spending';
import {
    NotFoundError,
    UnauthorizedError
} from '../errors';

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
    },
    get: (req, res, next) => {
        Spending.findById(req.params.spendingId).then(spending => {
            if (!spending) return next(new NotFoundError());
            if (spending.userId !== req.userId) return next(new UnauthorizedError());
            res.status(200).send(sendSpending(spending));
        })
    },
    remove: (req, res, next) => {
        Spending.findById(req.params.spendingId).then(spending => {
            if (!spending) return next(new NotFoundError());
            if (spending.userId !== req.userId) return next(new UnauthorizedError());
            spending.remove().then(() => res.status(204).send());
        })
    }
}

function sendSpending(data) {
    return {
        id: data._id,
        amount: data.amount,
        tags: data.tags,
        date: data.date,
        info: data.info,
        category: data.category
    }
}