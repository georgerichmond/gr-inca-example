import React from 'react';
import { shallow } from 'enzyme';
import { Menu } from 'antd';
import ActivityPeriodPanel, { INCA_GROUP } from '../';
import apolloClient from '../../../apollo/client';
import { getActivityPeriodGraphQLDataFromOption } from '../../../helpers/activityPeriod';
import ReactGA from 'react-ga';

jest.mock('../../../helpers/activityPeriod', () => ({
  times: [{ value: 1, label: 'Today' }, { value: 2, label: 'Yesterday' }],
  getActivityPeriodGraphQLDataFromOption: jest.fn()
}));

describe('Activity Period Panel', () => {
  beforeAll(() => {
    getActivityPeriodGraphQLDataFromOption.mockImplementation(option => ({
      activityPeriod: {
        from: '2018-09-01T00:00:00Z',
        to: '2018-09-01T23:59:59Z'
      },
      option
    }));
  });

  it('renders correctly', () => {
    const result = shallow(
      <ActivityPeriodPanel
        activityPeriodOption="today"
        metaData={{ role: INCA_GROUP, features: [] }}
      />
    );

    expect(result).toMatchSnapshot();
  });

  it('calls the onActivityPeriodChange callback when an option is selected', () => {
    const wrapper = shallow(
      <ActivityPeriodPanel
        activityPeriodOption="today"
        metaData={{ role: INCA_GROUP, features: [] }}
      />
    );
    const activityPeriodChange = jest.spyOn(
      wrapper.instance(),
      'onActivityPeriodChange'
    );
    const onClickHandler = wrapper
      .find(Menu.Item)
      .first()
      .prop('onClick');

    onClickHandler({ key: 'today' });

    expect(activityPeriodChange).toHaveBeenCalledWith('today');
  });

  describe('Activity Period change', () => {
    beforeAll(() => {
      jest.spyOn(apolloClient, 'writeData');
      jest.spyOn(ReactGA, 'event').mockImplementation(() => {});
      getActivityPeriodGraphQLDataFromOption.mockImplementation(option => ({
        activityPeriod: {
          from: '2018-09-01T00:00:00Z',
          to: '2018-09-01T23:59:59Z'
        },
        option
      }));
      const wrapper = shallow(
        <ActivityPeriodPanel
          activityPeriodOption="today"
          metaData={{ role: INCA_GROUP, features: [] }}
        />
      );

      const onClickHandler = wrapper
        .find(Menu.Item)
        .first()
        .prop('onClick');

      onClickHandler({ key: 'today' });
    });

    it('writes the selected activity period and option to the Apollo client', () => {
      expect(apolloClient.writeData).toHaveBeenCalledWith({
        data: {
          activityPeriod: {
            from: '2018-09-01T00:00:00Z',
            to: '2018-09-01T23:59:59Z'
          },
          option: 'today'
        }
      });
    });

    it('tracks the event in google analytics', () => {
      expect(ReactGA.event).toHaveBeenCalledWith({
        action: 'Change option',
        category: 'Activity period',
        label: 'today'
      });
    });
  });
});
