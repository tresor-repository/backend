import mailgun from 'mailgun.js';
import config from '../config.json';

const mg = mailgun.client({username: 'api', key: config.mailgunkey});
