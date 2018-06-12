import _ from 'lodash';
import moment from 'moment';
import {
    ValidationError
} from '../errors';
const toString = date => moment(date).format('DD-MM-YYYY');
const toDate = string => moment(string, 'DD-MM-YYYY');
export default {
    toString: toString,
    toDate: toDate,
    validateStartEnd: function (req, res, next) {
        const raw = {
            dateStart: req.query.dateStart ?
                toDate(req.query.dateStart) : null,
            dateEnd: req.query.dateEnd ?
                toDate(req.query.dateEnd) : null
        }
        if (raw.dateStart && raw.dateEnd) {
            if (raw.dateEnd.isBefore(raw.dateStart)) {
                next(new ValidationError([{
                    param: 'dateEnd',
                    msg: 'dateEnd is before dateStart'
                }]))
            }
        }
        const dateEnd = raw.dateEnd ?
            raw.dateEnd :
            raw.dateStart ?
            raw.dateStart.clone().add(7, 'days') :
            moment()

        const dateStart = raw.dateStart ?
            raw.dateStart :
            dateEnd.clone().subtract(7, 'days')

        _.assign(req, {
            dateStart: dateStart,
            dateEnd: dateEnd
        })
        next();
    }
}