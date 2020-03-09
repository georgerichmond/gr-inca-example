import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import * as dateMock from 'jest-date-mock';
import resultBody from './result';
import { HistogramWithoutClientState as Histogram } from '../index';

import {
  query,
  edgesPath,
  edgeMetricTotalPath
} from '../../UniqueVisitorsHistogram';

jest.mock('../presentation', () => ({
  __esModule: true,
  HistogramPresentation: jest.fn(props => (
    <div id="HistogramPresentation">{JSON.stringify(props)}</div>
  )),
  HistogramLoading: jest.fn(props => (
    <div id="HistogramLoading">{JSON.stringify(props)}</div>
  ))
}));

describe('Histogram', () => {
  beforeAll(() => {
    dateMock.advanceTo(new Date('2018-09-19T22:00:00Z'));
  });

  afterAll(() => {
    dateMock.clear();
  });

  const activityPeriod = {
    from: '2018-09-19T00:00:00Z',
    to: '2018-09-19T23:00:00Z'
  };

  const articleId = 'asdfghjkl123456789';

  const interval = '1h';

  const name = 'Unique visitors';
  const metric = 'uniqueVisitors';

  it('renders just the label when the request is in flight', () => {
    const result = renderer.create(
      <MockedProvider mocks={[]} addTypename={false}>
        <Histogram
          activityPeriod={activityPeriod}
          articleId={articleId}
          edgesPath={edgesPath}
          edgeMetricTotalPath={edgeMetricTotalPath}
          query={query}
          name={name}
          metric={metric}
        />
      </MockedProvider>
    );

    expect(result).toMatchSnapshot();
  });

  it('renders ERROR when the request failed', async () => {
    const mocks = [
      {
        request: {
          query,
          variables: {
            interval,
            articleId,
            activityPeriod
          }
        },
        error: new Error('Not a Proper Request')
      }
    ];

    const result = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Histogram
          activityPeriod={activityPeriod}
          articleId={articleId}
          edgesPath={edgesPath}
          edgeMetricTotalPath={edgeMetricTotalPath}
          query={query}
          name={name}
          metric={metric}
        />
      </MockedProvider>
    );

    await wait(0);

    expect(result).toMatchSnapshot();
  });

  it('renders the histogram presentation when the request is successful', async () => {
    const mocks = [
      {
        request: {
          query,
          variables: {
            interval,
            articleId,
            activityPeriod
          }
        },
        result: resultBody
      }
    ];

    const result = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Histogram
          activityPeriod={activityPeriod}
          articleId={articleId}
          edgesPath={edgesPath}
          edgeMetricTotalPath={edgeMetricTotalPath}
          query={query}
          name={name}
          metric={metric}
        />
      </MockedProvider>
    );

    await wait(0);

    expect(result).toMatchSnapshot();
  });
});
