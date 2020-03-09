//@flow
import React from 'react';
import { HistogramPresentation, HistogramLoading } from './presentation';

import { Query } from 'react-apollo';
import mapHistogramData from './mapHistogramData';
import { GET_ACTIVITY_PERIOD_QUERY } from '../App';
import getInterval from './getInterval';
import type { ActivityPeriod } from '../../types';
import type { Path } from './mapHistogramData';
import { Alert } from 'antd';

type HistogramProps = {
  name: string,
  metric: string,
  edgesPath: Path,
  edgeMetricTotalPath: Path,
  query: Object
};

type HistogramWithoutClientStateProps = {
  articleId: string,
  activityPeriod: ActivityPeriod,
  ...$Exact<HistogramProps>
};

export const HistogramWithoutClientState = ({
  name,
  metric,
  edgesPath,
  edgeMetricTotalPath,
  query,
  articleId,
  activityPeriod
}: HistogramWithoutClientStateProps) => (
  <Query
    query={query}
    variables={{
      articleId,
      activityPeriod,
      interval: getInterval(activityPeriod)
    }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (loading) {
        return <HistogramLoading />;
      }

      if (error) {
        return <Alert message="No chart data" type="warning" showIcon />;
      }

      return (
        <HistogramPresentation
          data={mapHistogramData({
            edgesPath,
            edgeMetricTotalPath,
            data
          })}
          name={name}
          metric={metric}
          activityPeriod={activityPeriod}
        />
      );
    }}
  </Query>
);

const Histogram = ({
  name,
  metric,
  query,
  edgesPath,
  edgeMetricTotalPath
}: HistogramProps) => (
  <Query query={GET_ACTIVITY_PERIOD_QUERY}>
    {({ data }) => (
      <HistogramWithoutClientState
        articleId={data.articleId}
        activityPeriod={data.activityPeriod}
        name={name}
        metric={metric}
        query={query}
        edgesPath={edgesPath}
        edgeMetricTotalPath={edgeMetricTotalPath}
      />
    )}
  </Query>
);

export default Histogram;
