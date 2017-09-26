/* eslint camelcase: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Modal, Alert, Button, Radio } from 'react-bootstrap';
import Select from 'react-select';
import { getExploreUrl } from '../exploreUtils';

const propTypes = {
  can_overwrite: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  form_data: PropTypes.object,
  user_id: PropTypes.string.isRequired,
  dashboards: PropTypes.array.isRequired,
  alert: PropTypes.string,
  slice: PropTypes.object,
  datasource: PropTypes.object,
};

class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saveToDashboardId: null,
      newDashboardName: '',
      newSliceName: '',
      dashboards: [],
      alert: null,
      action: props.can_overwrite ? 'overwrite' : 'saveas',
      addToDash: 'noSave',
    };
  }
  componentDidMount() {
    this.props.actions.fetchDashboards(this.props.user_id);
  }
  onChange(name, event) {
    switch (name) {
      case 'newSliceName':
        this.setState({ newSliceName: event.target.value });
        break;
      case 'saveToDashboardId':
        this.setState({ saveToDashboardId: event.value });
        this.changeDash('existing');
        break;
      case 'newDashboardName':
        this.setState({ newDashboardName: event.target.value });
        break;
      default:
        break;
    }
  }
  changeAction(action) {
    this.setState({ action });
  }
  changeDash(dash) {
    this.setState({ addToDash: dash });
  }
  saveOrOverwrite(gotodash) {
    this.setState({ alert: null });
    this.props.actions.removeSaveModalAlert();
    const sliceParams = {};

    let sliceName = null;
    sliceParams.action = this.state.action;
    if (this.props.slice && this.props.slice.slice_id) {
      sliceParams.slice_id = this.props.slice.slice_id;
    }
    if (sliceParams.action === 'saveas') {
      sliceName = this.state.newSliceName;
      if (sliceName === '') {
        this.setState({ alert: '请输入一个切片名称' });
        return;
      }
      sliceParams.slice_name = sliceName;
    } else {
      sliceParams.slice_name = this.props.slice.slice_name;
    }

    const addToDash = this.state.addToDash;
    sliceParams.add_to_dash = addToDash;
    let dashboard = null;
    switch (addToDash) {
      case ('existing'):
        dashboard = this.state.saveToDashboardId;
        if (!dashboard) {
          this.setState({ alert: '请选择一个仪表板' });
          return;
        }
        sliceParams.save_to_dashboard_id = dashboard;
        break;
      case ('new'):
        dashboard = this.state.newDashboardName;
        if (dashboard === '') {
          this.setState({ alert: '请输入仪表板名称' });
          return;
        }
        sliceParams.new_dashboard_name = dashboard;
        break;
      default:
        dashboard = null;
    }
    sliceParams.goto_dash = gotodash;

    const saveUrl = getExploreUrl(this.props.form_data, 'base', false, null, sliceParams);
    this.props.actions.saveSlice(saveUrl)
      .then((data) => {
        // Go to new slice url or dashboard url
        window.location = data;
      });
    this.props.onHide();
  }
  removeAlert() {
    if (this.props.alert) {
      this.props.actions.removeSaveModalAlert();
    }
    this.setState({ alert: null });
  }
  render() {
    return (
      <Modal
        show
        onHide={this.props.onHide}
        bsStyle="large"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            保存一个图表
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(this.state.alert || this.props.alert) &&
            <Alert>
              {this.state.alert ? this.state.alert : this.props.alert}
              <i
                className="fa fa-close pull-right"
                onClick={this.removeAlert.bind(this)}
                style={{ cursor: 'pointer' }}
              />
            </Alert>
          }
          {this.props.slice &&
            <Radio
              id="overwrite-radio"
              disabled={!this.props.can_overwrite}
              checked={this.state.action === 'overwrite'}
              onChange={this.changeAction.bind(this, 'overwrite')}
            >
              {`覆盖图表 ${this.props.slice.slice_name}`}
            </Radio>
          }

          <Radio
            id="saveas-radio"
            inline
            checked={this.state.action === 'saveas'}
            onChange={this.changeAction.bind(this, 'saveas')}
          > 保存到 &nbsp;
          </Radio>
          <input
            name="new_slice_name"
            placeholder="[slice name]"
            onChange={this.onChange.bind(this, 'newSliceName')}
            onFocus={this.changeAction.bind(this, 'saveas')}
          />


          <br />
          <hr />

          <Radio
            checked={this.state.addToDash === 'noSave'}
            onChange={this.changeDash.bind(this, 'noSave')}
          >
          不要添加到仪表板上
          </Radio>

          <Radio
            inline
            checked={this.state.addToDash === 'existing'}
            onChange={this.changeDash.bind(this, 'existing')}
          >
          向现有仪表板添加切片
          </Radio>
          <Select
            options={this.props.dashboards}
            onChange={this.onChange.bind(this, 'saveToDashboardId')}
            autoSize={false}
            value={this.state.saveToDashboardId}
            placeholder="Select Dashboard"
          />

          <Radio
            inline
            checked={this.state.addToDash === 'new'}
            onChange={this.changeDash.bind(this, 'new')}
          >
          添加一个新的仪表盘 &nbsp;
          </Radio>
          <input
            onChange={this.onChange.bind(this, 'newDashboardName')}
            onFocus={this.changeDash.bind(this, 'new')}
            placeholder="[dashboard name]"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            id="btn_modal_save"
            className="btn pull-left"
            onClick={this.saveOrOverwrite.bind(this, false)}
          >
            保存
          </Button>
          <Button
            type="button"
            id="btn_modal_save_goto_dash"
            className="btn btn-primary pull-left gotodash"
            disabled={this.state.addToDash === 'noSave'}
            onClick={this.saveOrOverwrite.bind(this, true)}
          >
            保存并进入仪表盘
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SaveModal.propTypes = propTypes;

function mapStateToProps({ explore, saveModal }) {
  return {
    datasource: explore.datasource,
    slice: explore.slice,
    can_overwrite: explore.can_overwrite,
    user_id: explore.user_id,
    dashboards: saveModal.dashboards,
    alert: saveModal.saveModalAlert,
  };
}

export { SaveModal };
export default connect(mapStateToProps, () => ({}))(SaveModal);
