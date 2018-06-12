import moment from 'moment';

export default {
    toString: date => moment(date).format('DD-MM-YYYY'),
    toDate: string => moment(string, 'DD-MM-YYY'),
}