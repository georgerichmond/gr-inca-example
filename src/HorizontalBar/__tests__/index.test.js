import React from 'react';
import { shallow } from 'enzyme';
import HorizontalBar from '../index';

describe('HorizontalBar', () => {
  describe('when given data', () => {
    test('it renders correctly', () => {
      const props = {
        data: [
          {
            name: 'RA',
            value: 10
          },
          {
            name: 'subscriber',
            value: 50
          },
          {
            name: 'anonymous',
            value: 40
          }
        ],
        name: 'Unique visitors',
        metric: 'uniqueVisitors',
        interval: '1h'
      };
      const tree = shallow(<HorizontalBar {...props} />);
      expect(tree).toMatchSnapshot();
    });
  });
});
