// @flow

import * as R from 'ramda';

export type Path = string[];

type Props = {
  edgesPath: Path,
  edgeMetricTotalPath: Path,
  data: Object
};

const mapHistogramData = ({ edgesPath, edgeMetricTotalPath, data }: Props) =>
  R.pathOr([], edgesPath, data).map(edge => ({
    x: edge.node.id,
    y: R.pathOr(null, edgeMetricTotalPath, edge)
  }));

export default mapHistogramData;
