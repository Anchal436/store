/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'tachyons';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

import './DesignHomePage.css';
import SideDrawer from '../AdminPage/components/SideDrawer';

import HomePage from '../HomePage/PublicHomePage';
import IsEmailVerified from '../IsEmailVerified/IsEmailVerified';

import { store } from '../../store';
import {
  GET_PRODUCTS, GET_SHOP_DETAILS, GET_LINKS, GET_USER_DETAILS, GET_BG_STYLE, GET_HEADER_INFO, GET_NOTIFICATION, GET_HOME_PAGE_INFO,
} from '../../constants/actionTypes';
import { USER_DETAILS, ERROR_MSG } from '../../constants/otherConstants';

import agent from '../../agent';
import Switch from '../../common/Components/Switch';
import DisabledDiv from '../../common/Components/DisabledDiv';
import CollapseTransition from '../../common/Components/CollapseTransition';
import CopyUrl from '../../common/Components/CopyUrl';
import Tabs from '../../common/Components/Tabs';
import Loader from '../../common/Components/Loader';
import SelectImage from '../../common/Components/SelectImage';


class DesignHomePage extends Component {
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

      showAddInfo: false,

      homePageInfo: { cover_photos: [], info: [] },
      tempInfo: {
        heading: {
          text: '',
          style: {},
        },
        description: {
          text: '',
          style: {},
        },
      },
    };
    this.selectProfilePic = this.selectProfilePic.bind(this);
    this.showLoader = this.showLoader.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  componentDidMount() {
    // console.log(this.props);
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    const username = window.localStorage.getItem(USER_DETAILS);
    const { user } = this.props;
    if (user && user.user) {
      this.setState({ user: user.user });
    }

    const data = { username };
    const {
      getHomePageData, getUserDetails, getBackgroundStyle, getHeaderInfo, getLinks,
    } = this.props;
    getUserDetails(data);
    getBackgroundStyle(data);
    getHeaderInfo(data);
    getHomePageData({ seller: username });
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { user, homePageInfo } = this.state;
    if (np.user) {
      if (user !== np.user.user) {
        this.setState({ user: np.user.user, loading: false });
      }
    }
    if (np.homePageInfo && np.homePageInfo !== homePageInfo) {
      // console.log(np.homePageInfo);
      this.setState({ homePageInfo: np.homePageInfo });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this));
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
    // const { is_category_view_enabled } = this.state;
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

  uploadInfo(info) {
    const { homePageInfo } = this.state;
    const { setHomePageData } = this.props;

    this.setState({ loading: true });
    agent.DesignHomePage.setHomePageInfo(info).then((res) => {
      const homePageData = { ...homePageInfo, info: res.data.shop_info };
      setHomePageData(homePageData);

      this.setState({
        loading: false, showAddInfo: false,
      });
    }).catch((err) => {
      console.log(err.response);
      this.setState({
        loading: false,
      });
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
    });
  }

  addInfo() {
    const { tempInfo, homePageInfo } = this.state;
    if (!homePageInfo.info) return;

    const info = { shop_info: [...homePageInfo.info, tempInfo] };
    this.uploadInfo(info);
  }

  selectProfilePic({ blob }) {
    const { user } = this.state;
    const { getHomePageData } = this.props;
    this.setState({ loading: true });
    const data = [{ key: 'photo', file: blob }];

    // this.setState({ coverImages: [...coverImages, imageDataUrl], loading: false });
    agent.DesignHomePage.addCoverPhoto(data).then((res) => {
      const seller = { seller: user.username };
      getHomePageData(seller);
      this.setState({ loading: false });
    }).catch((err) => {
      this.setState({ loading: false });
      // console.log('err in uploading image', err);
      if (err.response) {
        console.log(err.response);
        toast.error(err.response.data.error);
      } else {
        toast.error('Error ocurred in uploading profile picture!!!');
      }
    });
  }

  deleteImage(img) {
    const { user } = this.state;
    const { getHomePageData } = this.props;
    this.setState({ loading: true });
    const data = { photo: img };
    agent.DesignHomePage.deleteCoverPhoto(data).then((res) => {
      console.log(res);
      const seller = { seller: user.username };
      getHomePageData(seller);
      this.setState({ loading: false });
    }).catch((err) => {
      console.log(err.response);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
    });
  }

  deleteInfo(index) {
    const { homePageInfo } = this.state;

    if (!homePageInfo || !homePageInfo.info) return;

    const tempInfo = homePageInfo.info.filter((_, i) => i !== index);
    const info = { shop_info: tempInfo };

    this.uploadInfo(info);
  }

  showLoader() {
    this.setState({ loading: !this.state.loading });
  }


  editProductsComponent() {
    const {
      user, showAddInfo, tempInfo, homePageInfo,
    } = this.state;

    return (
      <article className=" w-50 flex flex-column justify-between">
        <div className="design-homepage">
          <IsEmailVerified />
          <div className="justify-center  self-center ">
            <CopyUrl />
            <div className="  bg-white bb flex flex-column tc pb2">
              {
                user.is_profile_complete ? null
                  : (
                    <>
                      <p className="mt0 mt0">Your profile is incomplete</p>
                      <button className=" f6 btn" type="button" onClick={DesignHomePage.togelMyAccountDialogOpen}>
                        Complete your Profile
                      </button>
                    </>
                  )
              }
            </div>
            <div className="cover-photo-wrapper">
              <h2>Your home Page</h2>
              <p>Customize your Homepage to suit your customer.</p>
              <div className="cover-photo-div">
                {
                  homePageInfo.cover_photos.length > 0 ? (
                    <Carousel autoPlay swipeable={false} infiniteLoop showIndicators showArrows showStatus showThumbs={false} interval={3000}>
                      {this.renderImages()}
                    </Carousel>
                  ) : (
                    <p>Add some cover photos to your homepage and enhance your user experience</p>
                  )
                }

              </div>
              <button type="button" className="add-cover-photo color-btn">
                  Add Cover Image
                <SelectImage onSelectFile={this.selectProfilePic} aspect={16 /9} isCroppingRequired showLoader={this.showLoader} />
              </button>
            </div>
            <div className="add-info-wrapper">
              {
                homePageInfo.info.length > 0
                  ? homePageInfo.info.map((info, i) => (
                    <>
                      <div className="heading">
                        <div className="line" />
                        <h3 style={info.heading.style}>{info.heading.text}</h3>
                        <button type="button" onClick={() => this.deleteInfo(i)}><DeleteOutlineIcon /></button>
                        <div className="line" />
                      </div>
                      <div className="info-div">

                        <div className="discreption">
                          <p style={info.description.style}>
                            {info.description.text}
                          </p>
                        </div>
                      </div>
                    </>
                  )) : (
                    <p>Explain your shop and write something about product</p>
                  )
                }
              <CollapseTransition visible={showAddInfo}>
                <div className="add-temp-info">
                  <div className="heading">
                    <div className="line" />
                    <input
                      type="text"
                      value={tempInfo.heading.text}
                      onChange={(e) => (
                        this.setState({ tempInfo: { ...tempInfo, heading: { ...tempInfo.heading, text: e.target.value } } })
                      )}
                    />
                    <div className="line" />
                  </div>
                  <div className="info-div">

                    <div className="discreption">
                      <textarea

                        value={tempInfo.description.text}
                        onChange={(e) => (
                          this.setState({ tempInfo: { ...tempInfo, description: { ...tempInfo.description, text: e.target.value } } })
                        )}
                        rows={5}

                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button type="button" className="error-btn center mt2 mb2" onClick={() => this.setState({ showAddInfo: false })}>Cancel</button>
                    <button type="button" className="green-btn center mt2 mb2" onClick={() => this.addInfo()}>Done</button>
                  </div>


                </div>
              </CollapseTransition>
              {
                !showAddInfo && (
                  <button type="button" className="color-btn center" onClick={() => this.setState({ showAddInfo: !showAddInfo })}>Add Info</button>
                )
              }
            </div>
          </div>
        </div>
      </article>

    );
  }

  renderImages() {
    const { homePageInfo } = this.state;
    return homePageInfo.cover_photos.map((img) => (
      <div key={img} className="cover-img">
        <button type="button" onClick={() => this.deleteImage(img)} ><DeleteOutlineIcon /></button>
        <img src={img} alt="Cover" />
      </div>
    ));
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
                    { tabHeading: 'Design Homepage', components: this.editProductsComponent.bind(this) },
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
        {/* {
          isNormalUser
            ? <DisabledDiv message="Purchase a Pro pack to unlock this feature" /> : null
        } */}
      </>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  shopDetails: state.ProductsPageReducers.shopDetails,
  routingLocation: state.router.location,
  homePageInfo: state.DesignHomePageReducers.homePageInfo,

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
  getHomePageData: (seller) => dispatch({ type: GET_HOME_PAGE_INFO, payload: agent.DesignHomePage.getHomePageData(seller) }),
  setHomePageData: (homePageData) => dispatch({ type: GET_HOME_PAGE_INFO, payload: homePageData }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DesignHomePage);
