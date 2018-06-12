import _ from 'lodash';
import Spending from '../model/Spending';

export default {
    get: {
        validation: [],
        handle: (req, res, next) => {
            Spending.find({
                    userId: req.userId
                })
                .then(spendings =>
                    _.chain(spendings)
                    .flatMap(spending =>
                        spending.tags.map(tag =>
                            _.assign({}, {
                                tag: tag,
                                amount: spending.amount
                            })
                        )
                    )
                    .groupBy('tag')
                    .toPairs()
                    .map(value => _.assign({}, {
                        tag: value[0],
                        count: value[1].length,
                        amount: _.reduce(value[1], (sum, item) => sum += item.amount, 0)
                    })))
                .then(spendings => res.status(200).send(spendings))
                .catch(e => next(e))
        }
    }
}