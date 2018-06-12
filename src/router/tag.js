import _ from 'lodash';
import Spending from '../model/Spending';

export default {
    get: {
        validation: [],
        handle: (req, res, next) => {
            const query = RegExp(req.query.q, 'i');
            var sort;
            switch (req.query.sort) {
                case 'count':
                    sort = {
                        by: 'count',
                        method: 'desc'
                    }
                    break;
                case 'name':
                default:
                    sort = {
                        by: 'tag',
                        method: 'asc'
                    };

            }
            Spending.find({
                    userId: req.userId,
                    tags: query,
                    date: {
                        '$gte': req.dateStart,
                        '$lte': req.dateEnd
                    }
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
                    .filter(value => query.test(value.tag))
                    .groupBy('tag')
                    .toPairs()
                    .map(value => _.assign({}, {
                        tag: value[0],
                        count: value[1].length,
                        amount: _.reduce(value[1], (sum, item) => sum += item.amount, 0)
                    }))
                    .orderBy(value => value[sort.by], [sort.method])
                )
                .then(spendings => res.status(200).send(spendings))
                .catch(e => next(e))
        }
    }
}