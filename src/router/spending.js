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
        .customSanitizer(value => moment(value, 'DD-MM-YYYY'))
    ],
    post: (req, res, next) => {
        new Spending(_.assign({},
            req.body, {
                userId: req.userId
            }
        )).save(function (err, spending) {
            if (err) return next(err);
            res.status(201).send(sendSpending(spending));
        })
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
    }
}

function sendSpending(data) {
    return {
        id: data._id,
        amount: data.amount,
        tags: data.tags,
        date: moment(data.date).format('DD-MM-YYYY'),
        info: data.info,
        category: data.category
    }
}