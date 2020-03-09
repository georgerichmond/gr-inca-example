// @flow
import { Chart, Coord, Geom, Legend } from 'bizcharts';
import { DataView } from '@antv/data-set';
import React from 'react';
import * as R from 'ramda';

type Props = {
  data: [
    {
      name: string,
      value: number
    }
  ]
};

const formatPercent = val => Math.round(val * 100) + '%';
const chartProps = { padding: 'auto' };

const sortByNameCaseInsensitive = R.sortBy(
  R.compose(
    R.toLower,
    R.prop('name')
  )
);

export const HorizontalBar = ({ data }: Props) => {
  const dv = new DataView();
  dv.source(sortByNameCaseInsensitive(data)).transform({
    type: 'percent',
    field: 'value',
    dimension: 'name',
    as: 'percent'
  });
  const cols = {
    percent: {
      formatter: formatPercent
    }
  };
  const itemFormatter = name =>
    `${name.replace(
      /\w+/g,
      word => word.charAt(0).toUpperCase() + word.substr(1)
    )} (${formatPercent(
      R.pathOr({}, ['percent'], dv.rows.find(point => point.name === name))
    )})`;

  return (
    <Chart height={50} {...chartProps} forceFit data={dv} scale={cols}>
      <Legend
        offsetY={-10}
        textStyle={{ fill: 'rgba(255, 255, 255, 0.65)' }}
        itemFormatter={itemFormatter}
      />
      <Coord transpose />
      <Geom
        type="intervalStack"
        position="1*percent"
        color={['name']}
        size={10}
      />
    </Chart>
  );
};

export default HorizontalBar;
