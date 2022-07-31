/* eslint-disable camelcase */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { Helmet } from 'react-helmet';
import LogRocket from 'logrocket';

// import { Carousel } from 'react-responsive-carousel';
import './HomePage.css';
import agent from '../../agent';
import Loader from '../../common/Components/Loader';
import { store } from '../../store';
import {
  GET_USER_DETAILS, GET_PUBLIC_PAGE_HEADER_INFO, GET_PUBLIC_PAGE_USER, CLEAR_CART, GET_PUBLIC_PAGE_SHOP_DETAILS, GET_PUBLIC_PAGE_BG_STYLE,
} from '../../constants/actionTypes';
import { DEFAULT_TEXT_COLOR } from '../../constants/otherConstants';
import Header from './components/Header';
import LinksPage from './components/LinkPage';
// import lightOrDark from '../../common/Components/checkBgColor';
import getBgStyle from '../../common/Components/getBgStyle';

import Image from '../../common/Components/Image';
import RenderInfiniteScrollProduct from './components/RenderInfiniteScrollProduct';
import PublicFooter from './components/PublicFooter';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: { profile_pic: null, link: [], username: '' },
      bgStyle: null,
      categories: [],
      secondaryColor: DEFAULT_TEXT_COLOR,
      preview_image: '',
    };
  }

  componentWillMount() {
    const {
      parent, links, user, homeBgStyle, shopDetails, setPublicPageBackGroundStyles, setPublicPageUserDetails, setPublicPageShopDetails,
    } = this.props;
    if (parent && parent === 'admin-page') {
      if (user && user.user) {
        this.setState({ user: user.user });
        setPublicPageUserDetails({ user: user.user });

        LogRocket.identify(user.user.id, {
          name: user.user.name,
          email: user.user.email,
          // Add your own custom user variables here, ie:
          userType: 'seller',
          dateAndTime: new Date(),

        });
      }
      if (homeBgStyle) setPublicPageBackGroundStyles(homeBgStyle);
      if (shopDetails) {
        setPublicPageShopDetails(shopDetails);
      }
    } else {
      // other api callls
      // LogRocket.init('asjnjo/myweblink');
      const {
        getPublicPageHeaderInfo, getPublicPageUserDetails, match, getPublicPageShopDetails, getPublicPageBackGroundStyles,
      } = this.props;
      const { userName } = match.params;
      const data = { username: userName };
      agent.AdminPage.addViewToProfile(data);
      this.setState({ loading: true });
      getPublicPageHeaderInfo(data);
      getPublicPageUserDetails(data);
      getPublicPageShopDetails(data);
      getPublicPageBackGroundStyles(data);
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const {
      user, categories, publicPageBgStyle, shopDetails,
    } = this.state;
    const {
      setPublicPageBackGroundStyles, parent, setPublicPageUserDetails, setPublicPageShopDetails,
    } = this.props;
    if (parent === 'admin-page') {
      if (np.user && np.user.user && np.user.user !== user) {
        this.setState({ user: np.user.user });
        setPublicPageUserDetails({ user: np.user.user });
        LogRocket.identify(np.user.user.id, {
          name: np.user.user.name,
          email: np.user.user.email,
          // Add your own custom user variables here, ie:
          userType: 'seller',
          dateAndTime: new Date(),

        });
      }
      if (np.homeBgStyle && np.homeBgStyle !== publicPageBgStyle) {
        const { secondaryColor, bgStyle } = getBgStyle(np.homeBgStyle);
        this.setState({ secondaryColor, bgStyle });
        setPublicPageBackGroundStyles(np.homeBgStyle);
        this.setState({ publicPageBgStyle: np.homeBgStyle });
      }
      if (np.shopDetails && np.shopDetails !== shopDetails) {
        setPublicPageShopDetails(np.shopDetails);
        this.setState({ shopDetails: np.shopDetails });
      }
      this.setState({ loading: false });
    } else {
      if (np.publicPageUser && np.publicPageUser !== user) {
        LogRocket.identify(np.publicPageUser.id, {
          name: np.publicPageUser.name,
          email: np.publicPageUser.email,
          // Add your own custom user variables here, ie:
          userType: 'seller',
          dateAndTime: new Date(),

        });
        this.setState({ user: np.publicPageUser, loading: false });
      }
      if (np.publicPageShopDetails && np.publicPageShopDetails !== shopDetails) {
        this.setState({ shopDetails: np.publicPageShopDetails });
        if (np.publicPageShopDetails.categories !== categories) {
          this.setState({ categories: np.publicPageShopDetails.categories });
        }
      }
      if (np.publicPageBgStyle && np.publicPageBgStyle !== publicPageBgStyle) {
        const { secondaryColor, bgStyle } = getBgStyle(np.publicPageBgStyle);

        this.setState({ secondaryColor, bgStyle, publicPageBgStyle: np.publicPageBgStyle });
      }
    }
  }

  render() {
    const {
      secondaryColor, user, loading, bgStyle,
    } = this.state;
    const { username } = user;
    const { parent } = this.props;

    return (
      <>
        <Helmet>
          <title>{username}</title>
          <meta name="description" content="Get your ecommerce business website with no setup cost, add multiple links, sell online books, shoes ,accessories, apparels." />
          <meta name="keywords " content="online store, ecommerce website , sell your product, get free website, online market place, increase your sales, for wholesellers and retailers , expand your business, sell books online , sell clothes online, sell shoes online, sell accessories online, easy to handle website, delivery facility , maintain tranparency, mobile friendly website." />

          <link rel="canonical" href={`https://myweblink.store/${username}/`} />
          <meta name="play store app" content="https://play.google.com/store/apps/details?id=com.myweblink.myweblink" />
        </Helmet>
        <div
          className="gradientbg home-page-bg mh-100 flex flex-column justify-between"
          style={bgStyle ? { ...bgStyle, flex: 1 } : null}
        >
          <LinksPage parent={!parent ? 'public-home-page' : parent} />
          <Header parent={!parent ? 'public-home-page' : parent} />
          <div className={parent ? 'dyna-width-90 mt2' : 'dyna-width mt2'}>
            <RenderInfiniteScrollProduct parent={!parent ? 'public-home-page' : parent} username={username} secondaryColor={secondaryColor} />
          </div>
          <PublicFooter parent={!parent ? 'public-home-page' : parent} />

          {
            loading
              ? <Loader />
              : null
          }

        </div>
      </>
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
  setPublicPageBackGroundStyles: (style) => dispatch({ type: GET_PUBLIC_PAGE_BG_STYLE, payload: style }),
  getPublicPageShopDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_SHOP_DETAILS, payload: agent.ProductsPage.getShopDetails(user) }),
  setPublicPageShopDetails: (details) => dispatch({ type: GET_PUBLIC_PAGE_SHOP_DETAILS, payload: details }),
  clearCart: () => store.dispatch({ type: CLEAR_CART }),
  getPublicPageBackGroundStyles: (user) => dispatch({ type: GET_PUBLIC_PAGE_BG_STYLE, payload: agent.AdminPage.getBackground(user) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
