import moment from 'moment-timezone';

const durationInHours = (from, to) => moment(to).diff(moment(from), 'hours');

const getInterval = ({ from, to }) =>
  durationInHours(from, to) > 24 ? '8h' : '1h';

export default getInterval;
