/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';

import './ProductsPage.css';
import SideDrawer from '../AdminPage/components/SideDrawer';
// import { USER_DETAILS } from '../../constants/otherConstants';
import HomePage from '../HomePage/PublicHomePage';
import IsEmailVerified from '../IsEmailVerified/IsEmailVerified';

import CreateProduct from './components/CreateProduct';
import MarketPlace from './components/MarketPlace';
import InfiniteScrollProducts from './components/InfiniteScrollProducts';

import { store } from '../../store';
import {
  GET_PRODUCTS, GET_SHOP_DETAILS, GET_LINKS, GET_USER_DETAILS, GET_BG_STYLE, GET_HEADER_INFO, GET_NOTIFICATION,
} from '../../constants/actionTypes';
import { USER_DETAILS, ERROR_MSG } from '../../constants/otherConstants';

import agent from '../../agent';
import myShop from '../../assets/Images/myShop.png';
import marketPlace from '../../assets/Images/marketPlace.png';
import notification from '../../assets/Images/notification.png';

import Switch from '../../common/Components/Switch';
import BottomNavigation from '../../common/Components/BottomNavigation';
import DisabledDiv from '../../common/Components/DisabledDiv';
import CopyUrl from '../../common/Components/CopyUrl';
import Tabs from '../../common/Components/Tabs';
import Loader from '../../common/Components/Loader';
import NotificationsPage from './components/NotificationsPage';

let bottomNavigationData = [
  {
    label: 'Market Place',
    component: <MarketPlace />,
    icon: <div className="relative bottom-navigation-tab-icon">
      {' '}
      <img src={marketPlace} alt="Market place" />
          </div>,
  },
  {
    label: 'My Shop',
    component: <InfiniteScrollProducts />,
    icon: <div className="relative bottom-navigation-tab-icon">
      {' '}
      <img src={myShop} alt="My Shop" />
          </div>,
  },
  {
    label: 'Notifications',
    component: <NotificationsPage />,
    icon: <div className="relative bottom-navigation-tab-icon">
      {' '}
      <img src={notification} alt="Notification" />
          </div>,
  },
];
class ProductsPage extends Component {
  static togelMyAccountDialogOpen() {
    const path = window.location.search ? `${window.location.pathname}${window.location.search}&myAccount=true`
      : `${window.location.pathname}?myAccount=true`;
    store.dispatch(push(path));
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      mobileView: false,
      user: {},
      isNormalUser: true,
      is_category_view_enabled: false,
      screen: null,
    };
    this.products = [];
  }

  componentDidMount() {
    // console.log(this.props);
    window.addEventListener('resize', this.resize.bind(this));
    const username = window.localStorage.getItem(USER_DETAILS);
    const data = { username };
    this.resize();
    const {
      user, getShopDetails, shopDetails, getUserDetails, getBackgroundStyle, getHeaderInfo, getLinks,
    } = this.props;
    if (user && user.user) {
      const temp = user.user.user_type === 'normal';
      this.setState({ user: user.user, isNormalUser: temp });
    }
    if (shopDetails) {
      this.setState({ is_category_view_enabled: shopDetails.is_category_view_enabled });
    }
    getShopDetails(data);
    getUserDetails(data);
    getBackgroundStyle(data);
    getHeaderInfo(data);
    getLinks();
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { user, screen, is_category_view_enabled } = this.state;

    if (np.user && np.user.user && user !== np.user.user) {
      const temp = np.user.user.user_type === 'normal';
      this.setState({ user: np.user.user, loading: false, isNormalUser: temp });
    }

    if (np.shopDetails && np.shopDetails.is_category_view_enabled !== is_category_view_enabled) {
      this.setState({ is_category_view_enabled: np.shopDetails.is_category_view_enabled });
    }
    
    if (np.routingLocation.query && np.routingLocation.query.navigation && screen) {
      const { navigation } = np.routingLocation.query;
      bottomNavigationData.forEach((t) => {
        const heading = navigation.replace('%20', ' ');
        if (t.label === heading && heading !== screen.label) {
          this.setState({ screen: t.component });
        }
      });
    } else {
      this.setState({ screen: bottomNavigationData[0].component });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }

  togelDefaultCategoryView() {
    const { is_category_view_enabled } = this.state;

    const { shopDetails, setShopDetails } = this.props;
    const details = { ...shopDetails, is_category_view_enabled: !is_category_view_enabled };
    this.setState({ loading: true });
    agent.ProductsPage.setShopDetails(details).then((res) => {
      this.setState({ is_category_view_enabled: !is_category_view_enabled });
      this.setState({ loading: false });
      setShopDetails(details);
    }).catch((err) => {
      console.log('err in updaing previe preference', err, err.response);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
      this.setState({ loading: false });
    });
  }

  previewComponent() {
    const { is_category_view_enabled } = this.state;
    return (
      <div className="admin-home-page">
        {/* <div className="flex justify-between items-center bg-white bl br">
          <p className="  center mt0 mb0 b flex block flex-wrap " style={{ overflowY: 'auto' }}>
            <p className="  center mt0 mb0 b block  ">Categories View </p>
          </p>
          <Switch togelswitch={this.togelDefaultCategoryView.bind(this)} val={!is_category_view_enabled} />
          <p className="  center mt0 mb0 b block  ">All Products </p>
        </div> */}
        <HomePage parent="admin-page" />
      </div>
    );
  }


  editProductsComponent() {
    const {
      user, screen,
    } = this.state;
    bottomNavigationData = bottomNavigationData.map((d) => {
      if (d.label === 'Notifications') {
        return {
          ...d,
          icon: (
            <div className="relative bottom-navigation-tab-icon">
              <img src={notification} alt="Notification" />
              {
                user.unread_notifs > 0 && <p className="unread-notification-num">{`${user.unread_notifs}`}</p>
              }
            </div>
          ),
        };
      }
      return d;
    });
    return (
      <article className=" w-50 flex flex-column justify-between">
        <div>
          <IsEmailVerified />
          <div className="justify-center  self-center ">
            <CopyUrl />
            <div className="  bg-white bb flex flex-column tc pb2">
              {
                user.is_profile_complete ? null
                  : (
                    <>
                      <p className="mt0 mt0">Your profile is incomplete</p>
                      <button className=" f6 btn" type="button" onClick={ProductsPage.togelMyAccountDialogOpen}>
                        Complete your Profile
                      </button>
                    </>
                  )
              }
            </div>
            <div className=" center  flex x ">
              <button
                className="dyna-width tc center  mt2 color-btn relative"
                style={{ padding: '15px', borderRadius: '15px' }}
                type="button"
              >
                Add new Product
                <CreateProduct update={false} />
              </button>
            </div>

          </div>
          <div style={{ marginBottom: '56px' }}>
            {screen}
          </div>
        </div>
        <BottomNavigation tabsData={bottomNavigationData} />
      </article>

    );
  }

  render() {
    const {
      loading, mobileView, isNormalUser, user,
    } = this.state;
    const { location } = this.props;
    return (
      <>
        <SideDrawer user={user} location={location} />
        {
          mobileView
            ? (
              <div className="nav-margin admin-bg">
                <Tabs
                  tabsData={[
                    { tabHeading: 'Edit Products', components: this.editProductsComponent.bind(this) },
                    { tabHeading: 'Preview', components: this.previewComponent.bind(this) },
                  ]}
                />
              </div>
            )
            : (
              <div className="admin-bg nav-margin flex ">
                {
                  this.editProductsComponent()
                }
                {
                  this.previewComponent()
                }

              </div>
            )
        }

        {
          loading ? <Loader /> : null
        }
        {
          isNormalUser
            ? <DisabledDiv message="Purchase a Pro pack to unlock this feature" /> : null
        }
      </>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  shopDetails: state.ProductsPageReducers.shopDetails,
  routingLocation: state.router.location,

});

const mapDispatchToProps = (dispatch) => ({
  setProducts: (products) => dispatch({ type: GET_PRODUCTS, payload: products }),
  getShopDetails: (user) => dispatch({ type: GET_SHOP_DETAILS, payload: agent.ProductsPage.getShopDetails(user) }),
  setShopDetails: (address) => dispatch({ type: GET_SHOP_DETAILS, payload: address }),
  getHeaderInfo: (user) => dispatch({ type: GET_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
  getBackgroundStyle: (user) => dispatch({ type: GET_BG_STYLE, payload: agent.AdminPage.getBackground(user) }),
  getLinks: () => dispatch({ type: GET_LINKS, payload: agent.AdminPage.getLinks() }),
  getUserDetails: (user) => dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
  getNotifications: () => dispatch({ type: GET_NOTIFICATION, payload: agent.ProductsPage.getNotification() }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductsPage);
