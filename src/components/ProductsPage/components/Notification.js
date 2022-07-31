/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { store } from '../../../store';
import './styles.css';
import agent from '../../../agent';
import Loader from '../../../common/Components/Loader';
import {
  SET_NOTIFICATION, SET_USER,
} from '../../../constants/actionTypes';


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      render: false,
      isNotificationDialog: false,
      notification: {},
    };

    this.togelNotificationDetailsDialog = this.togelNotificationDetailsDialog.bind(this);
  }

  componentDidMount() {
    const {
      notification, user,
    } = this.props;
    if (notification) {
      this.setState({ notification });
    }
    if (user && user.user) {
      this.setState({ user: user.user });
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const {
      notification, user,
    } = this.state;
    if (np.notification && np.notification !== notification) {
      this.setState({ notification: np.notification });
    }
    if (np.user && np.user.user && np.user.user !== user) {
      this.setState({ user: np.user.user });
    }
    if (np.routingLocation) {
      if (np.notification) {
        if (np.routingLocation.query) {
          const { notificationDetails } = np.routingLocation.query;
          this.setState({ isNotificationDialog: notificationDetails === `${np.notification.id}` });
        }
      }
    }
  }

  togelNotificationDetailsDialog() {
    const { notification, isNotificationDialog, user } = this.state;
    if (isNotificationDialog) {
      store.dispatch(goBack());
    } else {
      if (!notification.read_at) {
        const data = {
          notif_id: Number(notification.id),
        };

        agent.ProductsPage.readNotification(data).then(() => {
          const {
            notifications, setNotifications, setUser,
          } = this.props;
  
          if (notification) {
            const tempNotification = notifications.map((n) => {
              if (n.id === notification.id) {
                return { ...n, read_at: new Date() };
              }
              return n;
            });
            setNotifications({ notifications: tempNotification });
            if (user) {
              const updatedUserData = { ...user, unread_notifs: user.unread_notifs - 1 };
              setUser({ user: updatedUserData });
            }
          }
        }).catch((err) => {
          console.log(err, err.response);
        });
      }
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&notificationDetails=${notification.id}`
        : `${window.location.pathname}?notificationDetails=${notification.id}`;
      store.dispatch(push(path));
    }
  }

  render() {
    const {
      notification, isNotificationDialog, loading,
    } = this.state;

    return (
      <div className="notification-div">
        <button
          onClick={this.togelNotificationDetailsDialog.bind(this)}
          type="button"
        >
          {`${notification.header}`}
          {
            !notification.read_at
              ? <div className="unread" />
              : null
          }
        </button>
        <Dialog
          open={isNotificationDialog}
          TransitionComponent={Transition}
          keepMounted
          maxWidth
          onClose={this.togelNotificationDetailsDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{notification.header}</DialogTitle>
          <DialogContent style={{
            flexWrap: 'wrap', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}
          >
            {
              notification.description
            }
          </DialogContent>
          <DialogActions>
            <button onClick={this.togelNotificationDetailsDialog} className="btn ba w-100" type="button">
              Close
            </button>
          </DialogActions>
          {
            loading
              ? <Loader />
              : null
          }
        </Dialog>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  notifications: state.ProductsPageReducers.notifications,
  routingLocation: state.router.location,

});

const mapDispatchToProps = (dispatch) => ({
  setNotifications: (notification) => dispatch({ type: SET_NOTIFICATION, payload: notification }),
  setUser: (user) => dispatch({ type: SET_USER, payload: user }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
// getShopDetails: (user) => dispatch({ type:  payload: agent.ProductsPage.getShopDetails(user) }),,)(Notification);
