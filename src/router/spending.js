import _ from 'lodash';
import DateHelper from '../helper/date';
import {
    check
} from 'express-validator/check';
import Spending from '../model/Spending';
import moment from 'moment';
import {
    NotFoundError,
    UnauthorizedError
} from '../errors';

export default {
    validation: [
        check('amount')
        .isNumeric().withMessage('tidak berupa angka')
        .trim(),
        check('date')
        .trim()
        .customSanitizer(value => DateHelper.toDate(value))
    ],
    post: {
        validation: [
            check('amount')
            .exists().withMessage('tidak ada'),
            check('date')
            .exists().withMessage('tidak ada'),
            check('category')
            .exists().withMessage('tidak ada')
        ],
        handle: (req, res, next) => {
            new Spending(_.assign({},
                req.body, {
                    userId: req.userId
                }
            )).save(function (err, spending) {
                if (err) return next(err);
                res.status(201).send(sendSpending(spending));
            })
        }
    },
    get: (req, res, next) => {
        Spending.findByIdAndUser(req.params.spendingId, req.userId)
            .then(spending => res.status(200).send(sendSpending(spending)))
            .catch(e => next(e));
    },
    remove: (req, res, next) => {
        Spending.findByIdAndUser(req.params.spendingId, req.userId)
            .then(spending => spending
                .remove()
                .then(() => res.status(204).send()))
            .catch(e => next(e));
    },
    update: (req, res, next) => {
        Spending.findByIdAndUser(req.params.spendingId, req.userId)
            .then(spending =>
                spending.update(req.body).execAsync()
                .then(() =>
                    Spending.findById(req.params.spendingId)
                    .then(spending => res.status(200).send(sendSpending(spending)))
                )
            )
            .catch(e => next(e));
    },
    getList: (req, res, next) => {
        Spending.find({
                userId: req.userId
            })
            .then(spendings => res.status(200).send({
                count: spendings.length,
                data: _.map(spendings, spending => sendSpending(spending))
            }))
            .catch(e => next(e));
    },
    getPerDays: (req, res, next) => {
        console.log(req.dateStart);
        console.log(req.dateEnd);
        Spending.find({
                userId: req.userId,
                date: {
                    '$gte': req.dateStart,
                    '$lte': req.dateEnd
                }
            })
            .then(spendings =>
                _.chain(spendings)
                .groupBy('date')
                .toPairs()
                .map(value => _.assign({}, {
                    date: DateHelper.toString(value[0]),
                    count: value[1].length,
                    amount: _.reduce(value[1], (sum, item) => sum += item.amount, 0)
                }))
            )
            .then(result => res.status(200).send(result))
            .catch(e => next(e));

    }
}

function sendSpending(data) {
    return {
        id: data._id,
        amount: data.amount,
        tags: data.tags,
        date: DateHelper.toString(data.date),
        info: data.info,
        category: data.category
    }
}