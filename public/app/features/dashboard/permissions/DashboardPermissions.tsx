import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Tooltip from 'app/core/components/Tooltip/Tooltip';
import SlideDown from 'app/core/components/Animations/SlideDown';
import { StoreState, FolderInfo } from 'app/types';
import {
  dashboardAclTargets,
  dashboardPermissionLevels,
  DashboardAcl,
  PermissionLevel,
  NewDashboardAclItem,
} from 'app/types/acl';
import {
  getDashboardPermissions,
  addDashboardPermission,
  removeDashboardPermission,
  updateDashboardPermission,
} from '../state/actions';
import PermissionList from 'app/core/components/PermissionList/PermissionList';
import AddPermission from 'app/core/components/PermissionList/AddPermission';
import PermissionsInfo from 'app/core/components/PermissionList/PermissionsInfo';
import { store } from 'app/store/configureStore';

export interface Props {
  dashboardId: number;
  folder?: FolderInfo;
  permissions: DashboardAcl[];
  getDashboardPermissions: typeof getDashboardPermissions;
  updateDashboardPermission: typeof updateDashboardPermission;
  removeDashboardPermission: typeof removeDashboardPermission;
  addDashboardPermission: typeof addDashboardPermission;
}

export interface State {
  isAdding: boolean;
}

export class DashboardPermissions extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
    };
  }

  componentDidMount() {
    this.props.getDashboardPermissions(this.props.dashboardId);
  }

  onOpenAddPermissions = () => {
    this.setState({ isAdding: true });
  };

  onRemoveItem = (item: DashboardAcl) => {
    this.props.removeDashboardPermission(this.props.dashboardId, item);
  };

  onPermissionChanged = (item: DashboardAcl, level: PermissionLevel) => {
    this.props.updateDashboardPermission(this.props.dashboardId, item, level);
  };

  onAddPermission = (newItem: NewDashboardAclItem) => {
    return this.props.addDashboardPermission(this.props.dashboardId, newItem);
  };

  onCancelAddPermission = () => {
    this.setState({ isAdding: false });
  };

  render() {
    const { permissions, folder } = this.props;
    const { isAdding } = this.state;

    return (
      <div>
        <div className="dashboard-settings__header">
          <div className="page-action-bar">
            <h3 className="d-inline-block">Permissions</h3>
            <Tooltip className="page-sub-heading-icon" placement="auto" content={PermissionsInfo}>
              <i className="gicon gicon-question gicon--has-hover" />
            </Tooltip>
            <div className="page-action-bar__spacer" />
            <button className="btn btn-success pull-right" onClick={this.onOpenAddPermissions} disabled={isAdding}>
              <i className="fa fa-plus" /> Add Permission
            </button>
          </div>
        </div>
        <SlideDown in={isAdding}>
          <AddPermission
            dashboardAclTargets={dashboardAclTargets}
            dashboardPermissionLevels={dashboardPermissionLevels}
            onAddPermission={this.onAddPermission}
            onCancel={this.onCancelAddPermission}
          />
        </SlideDown>
        <PermissionList
          items={permissions}
          onRemoveItem={this.onRemoveItem}
          onPermissionChanged={this.onPermissionChanged}
          isFetching={false}
          folderInfo={folder}
        />
      </div>
    );
  }
}

function connectWithStore(WrappedComponent, ...args) {
  const ConnectedWrappedComponent = connect(...args)(WrappedComponent);
  return props => {
    return <ConnectedWrappedComponent {...props} store={store} />;
  };
}

const mapStateToProps = (state: StoreState) => ({
  permissions: state.dashboard.permissions,
});

const mapDispatchToProps = {
  getDashboardPermissions,
  addDashboardPermission,
  removeDashboardPermission,
  updateDashboardPermission,
};

export default connectWithStore(DashboardPermissions, mapStateToProps, mapDispatchToProps);
