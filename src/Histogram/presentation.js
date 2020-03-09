// @flow
import React from 'react';
import { Axis, Chart, Geom, Tooltip } from 'bizcharts';
import dl from 'datalib';
import moment from 'moment-timezone';
import type { ActivityPeriod } from '../../types';
import getInterval from './getInterval';
import { Spin } from 'antd';
import { map, prop } from 'ramda';

const tooltipColour = 'white';
const tooltipBackgroundColour = '#283c4f';

const commonChartProps = {
  forceFit: true,
  height: 100
};

const getMax = data => {
  if (Math.max(...map(prop('y'), data)) < 10) return 10;
};

const getChartProps = ({ data, name, activityPeriod }) => ({
  ...commonChartProps,
  padding: 'auto',
  scale: {
    x: {
      type: 'time',
      formatter: milliseconds => {
        const format = getInterval(activityPeriod) === '1h' ? 'HH' : 'DD';
        return moment(new Date(milliseconds).toISOString()).format(format);
      },
      tickCount: 6,
      min: activityPeriod.from,
      max: activityPeriod.to
    },
    y: {
      alias: name,
      tickCount: 3,
      formatter: dl.format.auto.number('s'),
      min: 0,
      max: getMax(data)
    }
  }
});

const getXAxisProps = ({ activityPeriod }) => ({
  label: {
    autoRotate: false
  },
  tickLine: { length: 2 }
});

type Props = {
  name: string,
  data: [{ x: string, y: number }],
  metric: string,
  activityPeriod: ActivityPeriod
};

export const HistogramLoading = () => (
  <Spin>
    <Chart {...commonChartProps} />
  </Spin>
);

export const HistogramPresentation = ({
  name,
  metric,
  data,
  activityPeriod
}: Props) => (
  <div data-test={`${metric}-histogram`}>
    <Chart data={data} {...getChartProps({ name, data, activityPeriod })}>
      <Axis name="x" {...getXAxisProps({ activityPeriod })} />
      <Axis name="y" />
      <Tooltip
        crosshairs={{ type: 'line' }}
        g2-tooltip={{
          marginTop: '-75px',
          marginLeft: '-25px',
          color: tooltipColour,
          backgroundColor: tooltipBackgroundColour,
          border: 'none',
          boxShadow: 'none'
        }}
      />
      <Geom
        size={4}
        type="interval"
        position="x*y"
        tooltip={[
          'x*y',
          (dateStr, value) => ({
            name,
            title: moment(dateStr).format('ddd Do MMM HH:mm'),
            value: value.toLocaleString()
          })
        ]}
      />
    </Chart>
  </div>
);
