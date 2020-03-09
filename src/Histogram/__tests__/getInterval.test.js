import getInterval from '../getInterval';

describe('getInterval', () => {
  test('it returns 1h for a day', () => {
    const activityPeriod = {
      from: '2018-09-19T00:00:00Z',
      to: '2018-09-19T23:59:59Z'
    };
    expect(getInterval(activityPeriod)).toEqual('1h');
  });

  test('it returns 4h for longer than a day', () => {
    const activityPeriod = {
      from: '2018-09-19T00:00:00Z',
      to: '2018-09-26T23:59:59Z'
    };
    expect(getInterval(activityPeriod)).toEqual('8h');
  });
});
