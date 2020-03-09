// @flow
import React from 'react';
import { Menu, DatePicker } from 'antd';
import { getOr } from 'lodash/fp';
import moment from 'moment';
import { times } from '../../helpers/activityPeriod';
import apolloClient from '../../apollo/client';
import {
  getActivityPeriodGraphQLDataFromOption,
  disabledDate
} from '../../helpers/activityPeriod';
import './style.scss';
import ReactGA from 'react-ga';

export const INCA_GROUP = 'inca-group';

type AppMetaData = {
  role: string,
  features: Array<string>
};
type Props = {
  activityPeriodOption: string,
  metaData: AppMetaData
};
type State = {
  defaultActivityPeriod: Array<string>
};

type OnActivityPeriodChange = (string | Array<moment>) => void;

type setPickerValue = Object => void;

class ActivityPeriodPanel extends React.Component<Props, State> {
  state = {
    defaultActivityPeriod: [moment().startOf('day'), moment().endOf('day')]
  };

  onActivityPeriodChange: OnActivityPeriodChange = option => {
    const label = Array.isArray(option) ? 'custom' : option;
    ReactGA.event({
      category: 'Activity period',
      action: 'Change option',
      label
    });
    const data = getActivityPeriodGraphQLDataFromOption(option);
    this.setPickerValue({ data, option });
    apolloClient.writeData({
      data
    });
  };

  setPickerValue: setPickerValue = ({ data, option }) => {
    const { from, to } = data.activityPeriod;
    if (Array.isArray(option))
      this.setState({
        defaultActivityPeriod: [
          moment(from).startOf('day'),
          moment(to).endOf('day')
        ]
      });
    else
      this.setState({
        defaultActivityPeriod: [
          moment(from).startOf('day'),
          moment(to)
            .subtract(1, 'day')
            .endOf('day')
        ]
      });
  };
  render() {
    const { activityPeriodOption, metaData } = this.props;

    console.log(metaData)



    const isINCAGroupMember = getOr('', 'role', metaData).includes(INCA_GROUP);

    return (
      <div className="inca-period-picker-panel" data-test="period-panel">
        <Menu mode="horizontal" selectedKeys={[activityPeriodOption]}>
          {times.map(({ value, label }) => (
            <Menu.Item
              key={value}
              data-test={value}
              onClick={({ key }) => this.onActivityPeriodChange(key)}
              className={!isINCAGroupMember ? 'feature-toggle-off' : ''}
            >
              {label}
            </Menu.Item>
          ))}
          {isINCAGroupMember && (
            <Menu.Item
              key="custom"
              data-test="custom"
              className="custom-date-picker-list"
            >
              <DatePicker.RangePicker
                className="custom-date-picker"
                dropdownClassName="custom-date-picker-drop"
                id="period-selector"
                format="ddd D MMM"
                value={this.state.defaultActivityPeriod}
                onChange={this.onActivityPeriodChange}
                disabledDate={disabledDate}
                allowClear={false}
              />
            </Menu.Item>
          )}
        </Menu>
      </div>
    );
  }
}
export default ActivityPeriodPanel;
