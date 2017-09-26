/* global notify */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, FormGroup, Radio } from 'react-bootstrap';
import { getAjaxErrorMsg } from '../../modules/utils';
import ModalTrigger from '../../components/ModalTrigger';

const $ = window.$ = require('jquery');

const propTypes = {
  css: PropTypes.string,
  dashboard: PropTypes.object.isRequired,
  triggerNode: PropTypes.node.isRequired,
};

class SaveModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashboard: props.dashboard,
      css: props.css,
      saveType: 'overwrite',
      newDashName: '',
    };
    this.modal = null;
    this.handleSaveTypeChange = this.handleSaveTypeChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.saveDashboard = this.saveDashboard.bind(this);
  }
  handleSaveTypeChange(event) {
    this.setState({
      saveType: event.target.value,
    });
  }
  handleNameChange(event) {
    this.setState({
      newDashName: event.target.value,
      saveType: 'newDashboard',
    });
  }
  saveDashboardRequest(data, url, saveType) {
    const dashboard = this.props.dashboard;
    const saveModal = this.modal;
    Object.assign(data, { css: this.props.css });
    $.ajax({
      type: 'POST',
      url,
      data: {
        data: JSON.stringify(data),
      },
      success(resp) {
        saveModal.close();
        dashboard.onSave();
        if (saveType === 'newDashboard') {
          window.location = '/superset/dashboard/' + resp.id + '/';
        } else {
          notify.success('此仪表板成功保存。');
        }
      },
      error(error) {
        saveModal.close();
        const errorMsg = getAjaxErrorMsg(error);
        notify.error('错误保存仪表板有: </ br>' + errorMsg);
      },
    });
  }
  saveDashboard(saveType, newDashboardTitle) {
    const dashboard = this.props.dashboard;
    const expandedSlices = {};
    $.each($('.slice_info'), function () {
      const widget = $(this).parents('.widget');
      const sliceDescription = widget.find('.slice_description');
      if (sliceDescription.is(':visible')) {
        expandedSlices[$(widget).attr('data-slice-id')] = true;
      }
    });
    const positions = dashboard.reactGridLayout.serialize();
    const data = {
      positions,
      css: this.state.css,
      expanded_slices: expandedSlices,
      dashboard_title: dashboard.dashboard_title,
      default_filters: dashboard.readFilters(),
    };
    let url = null;
    if (saveType === 'overwrite') {
      url = '/superset/save_dash/' + dashboard.id + '/';
      this.saveDashboardRequest(data, url, saveType);
    } else if (saveType === 'newDashboard') {
      if (!newDashboardTitle) {
        this.modal.close();
        showModal({
          title: '错误',
          body: '您必须为新的仪表板选择一个名称。',
        });
      } else {
        data.dashboard_title = newDashboardTitle;
        url = '/superset/copy_dash/' + dashboard.id + '/';
        this.saveDashboardRequest(data, url, saveType);
      }
    }
  }
  render() {
    return (
      <ModalTrigger
        ref={(modal) => { this.modal = modal; }}
        triggerNode={this.props.triggerNode}
        modalTitle="保存仪表板"
        modalBody={
          <FormGroup>
            <Radio
              value="overwrite"
              onChange={this.handleSaveTypeChange}
              checked={this.state.saveType === 'overwrite'}
            >
              覆盖的仪表板：[{this.props.dashboard.dashboard_title}]
            </Radio>
            <Radio
              value="newDashboard"
              onChange={this.handleSaveTypeChange}
              checked={this.state.saveType === 'newDashboard'}
            >
              保存于:
            </Radio>
            <FormControl
              type="text"
              placeholder="[dashboard name]"
              onFocus={this.handleNameChange}
              onChange={this.handleNameChange}
            />
          </FormGroup>
        }
        modalFooter={
          <div>
            <Button
              bsStyle="primary"
              onClick={() => { this.saveDashboard(this.state.saveType, this.state.newDashName); }}
            >
              保存
            </Button>
          </div>
        }
      />
    );
  }
}
SaveModal.propTypes = propTypes;

export default SaveModal;
