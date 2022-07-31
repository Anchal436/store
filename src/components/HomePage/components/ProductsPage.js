/* eslint-disable camelcase */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
// import CloseIcon from '@material-ui/icons/Close';
import { push } from 'react-router-redux';
import './PublicProductsPage.css';
import agent from '../../../agent';

import Loader from '../../../common/Components/Loader';
import { store } from '../../../store';
import {
  GET_USER_DETAILS, GET_PUBLIC_PAGE_HEADER_INFO, GET_PUBLIC_PAGE_USER, CLEAR_CART, GET_PUBLIC_PAGE_SHOP_DETAILS, GET_PUBLIC_PAGE_BG_STYLE,
} from '../../../constants/actionTypes';
import Logo from '../../../common/Components/Logo';
import { DEFAULT_BG_STYLE, DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';
import PublicFooter from './PublicFooter';
import Image from '../../../common/Components/Image';
import ProductDetails from './ProductDetails';
import PublicNavBar from './PublicNavBar';
import lightOrDark from '../../../common/Components/checkBgColor';
import CartDetails from './CartDetails';
import RenderInfiniteScrollProduct from './RenderInfiniteScrollProduct';

class PublicProductsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bgStyle: null,
      textColor: DEFAULT_TEXT_COLOR,
      user: {},
    };
    this.links = [];
    this.cartItems = [];
  }

  componentWillMount() {
    const {
      getPublicPageHeaderInfo, getPublicPageUserDetails, match, getPublicPageShopDetails, getPublicPageBackGroundStyles,
    } = this.props;

    const { userName } = match.params;
    const data = { username: userName };

    this.setState({ loading: true });
    getPublicPageHeaderInfo(data);
    getPublicPageUserDetails(data);
    getPublicPageShopDetails(data);
    getPublicPageBackGroundStyles(data);
  }

  componentWillReceiveProps(np) {
    const { clearCart, parent, setPublicPageUserDetails } = this.props;
    if (np.publicPageUser) {
      this.setState({ user: np.publicPageUser, loading: false });
    }
    if (np.publicPageBgStyle) {
      let data = JSON.parse(DEFAULT_BG_STYLE);
      let textColor = DEFAULT_TEXT_COLOR;
      if (np.publicPageBgStyle.background_color) {
        try {
          data = JSON.parse(np.publicPageBgStyle.background_color);
        } catch {
          data = JSON.parse(DEFAULT_BG_STYLE);
        }
      }

      if (np.publicPageBgStyle.link_style) {
        textColor = np.publicPageBgStyle.link_style;
      }

      if (np.publicPageBgStyle.background_image) {
        data = { ...data, backgroundImage: `${np.publicPageBgStyle.background_image}` };
      }
      this.setState({ bgStyle: data, textColor });
    }
  }

  render() {
    const {
      preview_image, user, textColor, loading,
    } = this.state;
    const { username } = user;
    const bgStyle = { position: 'fixed', width: window.innerWidth > window.innerHeight ? window.innerWidth : '100%', height: window.innerHeight > window.innerWidth ? window.innerHeight : 'auto' };

    return (
      <div className="gradientbg home-page-bg mh-100 flex flex-column justify-between" style={this.state.bgStyle ? { ...this.state.bgStyle } : null}>
        <div style={bgStyle}>
          {
            this.state.bgStyle ? <Image src={this.state.bgStyle.backgroundImage} style={bgStyle} overlaySrc={preview_image} /> : null
          }
        </div>
        <div className="  ">
          <PublicNavBar />
          <div className="dyna-width mt2">
            <RenderInfiniteScrollProduct parent={!this.props.parent ? 'public-home-page' : this.props.parent} username={username} textColor={textColor} />
          </div>
        </div>
        <PublicFooter />
        {
          loading
            ? <Loader />
            : null
        }

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  links: state.AdminPageReducers.links,
  homeBgStyle: state.AdminPageReducers.homeBgStyle,
  products: state.ProductsPageReducers.products,
  cartItems: state.HomePageReducers.cartItems,
  shopDetails: state.ProductsPageReducers.shopDetails,
  publicPageUser: state.HomePageReducers.publicPageUser,
  publicPageProducts: state.HomePageReducers.publicPageProducts,
  publicPageShopDetails: state.HomePageReducers.publicPageShopDetails,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,
  // shippingAddress: state.ProductsPageReducers.shippingAddress,
});

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (user) => store.dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
  getPublicPageHeaderInfo: (user) => dispatch({ type: GET_PUBLIC_PAGE_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
  // getPublicPageProducts: (user) => dispatch({ type: GET_PUBLIC_PAGE_PRODUCTS, payload: agent.ProductsPage.getProducts(user) }),
  getPublicPageUserDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_USER, payload: agent.Auth.getUserDetails(user) }),
  setPublicPageUserDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_USER, payload: user }),
  getPublicPageShopDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_SHOP_DETAILS, payload: agent.ProductsPage.getShopDetails(user) }),
  clearCart: () => store.dispatch({ type: CLEAR_CART }),
  getPublicPageBackGroundStyles: (user) => dispatch({ type: GET_PUBLIC_PAGE_BG_STYLE, payload: agent.AdminPage.getBackground(user) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicProductsPage);
