import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TableLoader from './TableLoader';

const propTypes = {
  user: PropTypes.object.isRequired,
};

export default class Favorites extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashboardsLoading: true,
      slicesLoading: true,
      dashboards: [],
      slices: [],
    };
  }
  renderSliceTable() {
    const mutator = data => data.map(slice => ({
      slice: <a href={slice.url}>{slice.title}</a>,
      creator: <a href={slice.creator_url}>{slice.creator}</a>,
      favorited: moment.utc(slice.dttm).fromNow(),
      _favorited: slice.dttm,
    }));
    return (
      <TableLoader
        dataEndpoint={`/superset/fave_slices/${this.props.user.userId}/`}
        className="table table-condensed"
        columns={['slice', 'creator', 'favorited']}
        mutator={mutator}
        noDataText="还没有喜欢的图表, 去点击星星!"
        sortable
      />
    );
  }
  renderDashboardTable() {
    const mutator = data => data.map(dash => ({
      dashboard: <a href={dash.url}>{dash.title}</a>,
      creator: <a href={dash.creator_url}>{dash.creator}</a>,
      favorited: moment.utc(dash.dttm).fromNow(),
    }));
    return (
      <TableLoader
        className="table table-condensed"
        mutator={mutator}
        dataEndpoint={`/superset/fave_dashboards/${this.props.user.userId}/`}
        noDataText="还没有喜欢的仪表盘, 去点击星星!"
        columns={['dashboard', 'creator', 'favorited']}
        sortable
      />
    );
  }
  render() {
    return (
      <div>
        <h3>仪表盘</h3>
        {this.renderDashboardTable()}
        <hr />
        <h3>图表</h3>
        {this.renderSliceTable()}
      </div>
    );
  }
}
Favorites.propTypes = propTypes;
