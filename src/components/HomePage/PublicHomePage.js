/* eslint-disable camelcase */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { Helmet } from 'react-helmet';
import { Carousel } from 'react-responsive-carousel';
import LogRocket from 'logrocket';
import { push } from 'react-router-redux';

import './PublicHomePage.css';
import agent from '../../agent';
import Loader from '../../common/Components/Loader';
import { store } from '../../store';
import {
  GET_USER_DETAILS, GET_PUBLIC_PAGE_HEADER_INFO, GET_PUBLIC_PAGE_USER, CLEAR_CART, GET_PUBLIC_PAGE_SHOP_DETAILS, GET_PUBLIC_PAGE_BG_STYLE, GET_FEATURED_PRODUCTS, GET_HOME_PAGE_INFO, GET_PUBLIC_PAGE_PRODUCTS,
} from '../../constants/actionTypes';
import { DEFAULT_TEXT_COLOR } from '../../constants/otherConstants';
import PublicNavBar from './components/PublicNavBar';
// import LinksPage from './components/LinkPage';
// import lightOrDark from '../../common/Components/checkBgColor';
import getBgStyle from '../../common/Components/getBgStyle';


import PublicFooter from './components/PublicFooter';
import Product from './components/Product';


class PublicHomePage extends Component {
  static renderImages() {

  }

  constructor(props) {
    super(props);
    this.state = {

      user: { profile_pic: null, link: [], username: '' },
      bgStyle: null,
      categories: [],
      secondaryColor: DEFAULT_TEXT_COLOR,
      featuredProducts: [],
      products: [],
      homePageInfo: {
        cover_photos: [],
        info: [],
      },
    };
  }

  UNSAFE_componentWillMount() {
    const {
      parent,
      getFeaturedProducts,
      user,
      homeBgStyle,
      shopDetails,
      setPublicPageBackGroundStyles,
      setPublicPageUserDetails,
      setPublicPageShopDetails,
      getPublicPageHeaderInfo,
      getPublicPageUserDetails,
      match,
      getPublicPageShopDetails,
      getPublicPageBackGroundStyles,
      getHomePageData,
      getPublicPageProducts,
    } = this.props;

    let data = {};
    if (parent && parent === 'admin-page') {
      if (user && user.user) {
        this.setState({ user: user.user });
        data = { username: user.user.username };
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
      const { userName } = match.params;
      data = { username: userName };
      // LogRocket.init('asjnjo/myweblink');
      agent.AdminPage.addViewToProfile(data);
      getPublicPageHeaderInfo(data);
      getPublicPageUserDetails(data);
      getPublicPageShopDetails(data);
      getPublicPageBackGroundStyles(data);
    }
    getHomePageData({ seller: data.username });
    getFeaturedProducts({ seller: data.username });
    getPublicPageProducts(data, 1);
  }

  UNSAFE_componentWillReceiveProps(np) {
    const {
      user, categories, publicPageBgStyle, shopDetails, homePageInfo, featuredProducts, products,
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

    if (np.homePageInfo && np.homePageInfo !== homePageInfo) {
      // console.log(np.homePageInfo);
      this.setState({ homePageInfo: np.homePageInfo });
    }
    if (np.featuredProducts && np.featuredProducts !== featuredProducts) {
      this.setState({ featuredProducts: np.featuredProducts.products });
    }
    if (np.publicPageProducts && np.publicPageProducts !== products) {
      this.setState({ products: np.publicPageProducts });
    }
  }

  render() {
    const {
      secondaryColor, user, featuredProducts, bgStyle, homePageInfo, products,
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
          className="gradientbg home-page-bg mh-100 flex flex-column justify-between public-page"
          style={bgStyle ? { ...bgStyle, flex: 1 } : null}
        >
          {/* <LinksPage parent={!parent ? 'public-home-page' : parent} /> */}
          <PublicNavBar parent={!parent ? 'public-home-page' : parent} />
          <div className="cover-photo-div">
            {
              homePageInfo.cover_photos && (
                <Carousel autoPlay swipeable={false} infiniteLoop showIndicators showArrows showStatus showThumbs={false} interval={3000}>
                  { homePageInfo.cover_photos.map((img) => (
                    <img src={img} className="cover-img" alt="cover" key={img} />
                  ))}
                </Carousel>
              )
            }

          </div>
          {
            homePageInfo.info.map((info, i) => (
              <>
                <div className="heading">
                  <div className="line" style={{ ...info.heading.style, backgroundColor: secondaryColor }} />
                  <h3 style={{ ...info.heading.style, color: secondaryColor }}>{info.heading.text}</h3>
                  <div className="line" style={{ ...info.heading.style, backgroundColor: secondaryColor }} />
                </div>
                <div className="info-div">

                  <div className="discreption">
                    <p style={{ ...info.heading.style, color: secondaryColor }}>
                      {info.description.text}
                    </p>
                  </div>
                </div>
              </>
            ))
          }
          {
              featuredProducts.length > 0 && (
                <>
                  <div className="heading">
                    <div className="line" style={{ backgroundColor: secondaryColor }} />
                    <h3 style={{ color: secondaryColor }}>Featured Products</h3>
                    <div className="line" style={{ backgroundColor: secondaryColor }} />
                  </div>
                  <div className="featured-products">
                    <div className="products">
                      {
                      featuredProducts.map((p) => <Product data={p} key={p.id} />)
                    }

                    </div>
                    <button type="button" className="see-all" style={{ color: secondaryColor, borderColor: secondaryColor }} onClick={() => store.dispatch(push(`/${username}/products/`))}> See all products </button>
                  </div>
                  {/* <div className="featured-products">
                    {
                            featuredProducts.map((p) => (
                              <Product data={p} key={p.id} />
                            ))
                    }
                    <button type="button" className="see-all" onClick={() => store.dispatch(push(`/${username}/products/`))}> See all products </button>
                  </div> */}
                </>
              )

          }
          {
            products.length > 0
              && (
                <>
                  <div className="heading">
                    <div className="line" style={{ backgroundColor: secondaryColor }} />
                    <h3 style={{ color: secondaryColor }}>Our products</h3>
                    <div className="line" style={{ backgroundColor: secondaryColor }} />
                  </div>

                  <div className="products-div">
                    <div className="products">
                      {
                      products.map((p, i) => <Product data={p} key={p.id} />)
                    }
                    </div>
                    <button type="button" className="see-all" style={{ color: secondaryColor, borderColor: secondaryColor }} onClick={() => store.dispatch(push(`/${username}/products/`))}> See all products </button>
                  </div>
                </>
              )
          }

          <PublicFooter parent={!parent ? 'public-home-page' : parent} />

          {/* {
            loading
              ? <Loader />
              : null
          } */}

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
  homePageInfo: state.DesignHomePageReducers.homePageInfo,
  // shippingAddress: state.ProductsPageReducers.shippingAddress,
  featuredProducts: state.DesignHomePageReducers.featuredProducts,

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
  getHomePageData: (seller) => dispatch({ type: GET_HOME_PAGE_INFO, payload: agent.DesignHomePage.getHomePageData(seller) }),
  getPublicPageBackGroundStyles: (user) => dispatch({ type: GET_PUBLIC_PAGE_BG_STYLE, payload: agent.AdminPage.getBackground(user) }),
  getFeaturedProducts: (user) => dispatch({ type: GET_FEATURED_PRODUCTS, payload: agent.DesignHomePage.getFeaturedProducts(user) }),
  getPublicPageProducts: (user, pageNumber) => dispatch({ type: GET_PUBLIC_PAGE_PRODUCTS, pageNumber, payload: agent.ProductsPage.getProducts(user, pageNumber) }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicHomePage);
