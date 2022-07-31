/* eslint-disable camelcase */
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './styles.css';
import loader from '../../../assets/Images/loader.gif';
import { GET_NOTIFICATION, SET_USER } from '../../../constants/actionTypes';
import agent from '../../../agent';
import Notification from './Notification';

class NotificationsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      loadingMore: false,
      notificationPageNum: 1,
      currentPage: 0,
      prevY: 0,
    };
    this.scrollingRef = createRef();
    this.renderNotifications = this.renderNotifications.bind(this);
  }

  componentDidMount() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 1.0,
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options,
    );
    this.observer.observe(this.scrollingRef);
    const { notifications, notificationPageNum } = this.props;
    const { currentPage } = this.state;
    if (notifications) {
      this.setState({ notifications });
    }
    if (notificationPageNum) {
      this.setState({ notificationPageNum });
    }
    this.loadMore();
    this.setState({ currentPage: currentPage + 1 });
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { notifications, notificationPageNum } = this.props;
    if (np.notifications && np.notifications !== notifications) {
      this.setState({ notifications: np.notifications, loadingMore: false });
    }
    if (np.notificationPageNum && np.notificationPageNum !== notificationPageNum) {
      this.setState({ notificationPageNum: np.notificationPageNum });
    }
  }

  handleObserver(entities, observer) {
    const { y } = entities[0].boundingClientRect;
    if (this.state.prevY > y) {
      this.loadMore();
    }
    this.setState({ prevY: y });
  }

  loadMore() {
    const { loadingMore, currentPage, notificationPageNum } = this.state;
    const { getNotifications } = this.props;
    if (loadingMore) return;
    if (currentPage + 1 <= notificationPageNum) {
      this.setState({ loadingMore: true });
      getNotifications(currentPage + 1);
      this.setState({ currentPage: currentPage + 1 });
    }
  }

  renderNotifications() {
    const { notifications } = this.state;
    return notifications.map((notification) => <Notification notification={notification} key={notification.id} />);
  }

  render() {
    const { loadingMore } = this.state;
    return (
      <div className="market-place-div">
        <h2 className="tc">My Notifications</h2>
        <div className="market-place-content-div" ref={(scrollingRef) => (this.scrollingRef = scrollingRef)}>
          {
            this.renderNotifications()
          }
        </div>
        <div
          ref={(scrollingRef) => (this.scrollingRef = scrollingRef)}
        >
          {
            loadingMore
              ? (
                <img
                  src={loader}
                  style={{
                    width: '50px', height: '50px', color: 'white', display: 'block', margin: 'auto',
                  }}
                  alt="Loading..."
                />
              )
              : null
        }
        </div>

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  notifications: state.ProductsPageReducers.notifications,
  notificationPageNum: state.ProductsPageReducers.notificationPageNum,
});

const mapDispatchToProps = (dispatch) => ({
  getNotifications: (pageNumber) => dispatch({ type: GET_NOTIFICATION, pageNumber, payload: agent.ProductsPage.getNotification(pageNumber) }),
  setUser: (user) => dispatch({ type: SET_USER, payload: user }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationsPage);
