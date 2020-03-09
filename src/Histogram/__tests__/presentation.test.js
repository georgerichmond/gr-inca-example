import React from 'react';
import { shallow } from 'enzyme';
import { HistogramPresentation } from '../presentation';

describe('HistogramPresentation', () => {
  describe('when given data', () => {
    test('it renders correctly', () => {
      const props = {
        data: [
          { x: '2018-09-30T00:00:00Z', y: 9903 },
          { x: '2018-09-30T01:00:00Z', y: 2506 }
        ],
        name: 'Unique visitors',
        metric: 'uniqueVisitors',
        activityPeriod: {
          from: '2018-11-04T00:00:00.000Z',
          to: '2018-11-05T00:00:00.000Z'
        }
      };
      const tree = shallow(<HistogramPresentation {...props} />);
      expect(tree).toMatchSnapshot();
    });
  });
});
