import _ from 'lodash';
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
        .customSanitizer(value => toDate(value))
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
    getPerDays: {
        validation: [
            check('dateStart')
            .customSanitizer(value => toDate(value)),
            check('dateEnd')
            .customSanitizer(value => toDate(value))
            .custom((value, {
                req
            }) => {
                if (value && req.query.dateStart && value.isBefore(req.query.dateStart)) {
                    throw new Error('dateEnd before dateStart');
                }
                return true;
            })
        ],
        handle: (req, res, next) => {
            const dateEnd = req.query.dateEnd ? req.query.dateEnd : req.query.dateStart ? req.query.dateStart.clone().add(5, 'days') : moment();
            const dateStart = req.query.dateStart ? req.query.dateStart : req.query.dateEnd.clone().subtract(5, 'days');
            Spending.find({
                    userId: req.userId,
                    date: {
                        '$gte': dateStart,
                        '$lte': dateEnd
                    }
                })
                .then(spendings =>
                    _.chain(spendings)
                    .groupBy('date')
                    .toPairs()
                    .map(value => _.assign({}, {
                        date: toFormattedDateString(value[0]),
                        count: value[1].length,
                        amount: _.reduce(value[1], (sum, item) => sum += item.amount, 0)
                    }))
                )
                .then(result => res.status(200).send(result))
                .catch(e => next(e));

        }
    }
}

function sendSpending(data) {
    return {
        id: data._id,
        amount: data.amount,
        tags: data.tags,
        date: toFormattedDateString(data.date),
        info: data.info,
        category: data.category
    }
}

function toFormattedDateString(date) {
    return moment(date).format('DD-MM-YYYY');

}

function toDate(string) {
    return moment(string, 'DD-MM-YYY')
}