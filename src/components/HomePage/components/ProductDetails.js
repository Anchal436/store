/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Carousel } from 'react-responsive-carousel';
import Slide from '@material-ui/core/Slide';

import { store } from '../../../store';
import './styles.css';
import Image from '../../../common/Components/Image';
import ZoomImage from '../../../common/Components/ZoomImage';
import getBgStyle from '../../../common/Components/getBgStyle';
import Loader from '../../../common/Components/Loader';
import PublicNavBar from './PublicNavBar';
import PublicFooter from './PublicFooter';
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SELECT_PRODUCT,
  GET_PUBLIC_PAGE_HEADER_INFO,
  GET_PUBLIC_PAGE_BG_STYLE,
  GET_PUBLIC_PAGE_SHOP_DETAILS,
  GET_PUBLIC_PAGE_USER,
} from '../../../constants/actionTypes';
import { ERROR_MSG } from '../../../constants/otherConstants';
import agent from '../../../agent';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyInCart: false,
      product: { images: [] },
      quantity: 1,
      sizes: [],
      isSizesAvailable: false,
      selectedSize: null,
      user: {},
      stockAvailable: true,
      recommendedProducts: [],
    };
    this.selectRef = React.createRef();

    this.cartItems = [];

    this.showProductDetails = this.showProductDetails.bind(this);
    this.togelIsZoomImageDialog = this.togelIsZoomImageDialog.bind(this);
    this.showCart = this.showCart.bind(this);
  }

  componentDidMount() {
    const {
      publicPageProducts, cartItems, publicPageBgStyle, publicPageUser, match, publicPageShopDetails,
    } = this.props;
    const { productSlug } = match.params;
    if (publicPageShopDetails) {
      this.shopDetails = publicPageShopDetails;
    }
    if (cartItems) {
      this.cartItems = cartItems;
      this.checkCartPresence(productSlug);
    }
    if (publicPageProducts) {
      this.getProductDetails(productSlug, publicPageProducts);
    } else {
      this.getProductDetails(productSlug);
    }

    if (publicPageBgStyle) {
      const { secondaryColor, fontColor, bgStyle } = getBgStyle(publicPageBgStyle);
      this.setState({ secondaryColor, fontColor, bgStyle });
    }
    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { user, render } = this.state;
    const { productSlug } = np.match.params;
    if (np.routingLocation) {
      if (np.routingLocation.query) {
        const { imageZoom } = np.routingLocation.query;
        if (imageZoom) {
          this.setState({ isZoomImageDialogOpen: imageZoom });
        } else {
          this.setState({ isZoomImageDialogOpen: false });
        }
      }
    }
    if (np.publicPageProducts) {
      this.getProductDetails(productSlug, np.publicPageProducts);
    } else {
      this.getProductDetails(productSlug);
    }
    if (np.publicPageUser && np.publicPageUser !== user) {
      this.setState({ user: np.publicPageUser });
      this.setState({ loading: false });
    }
    // console.log(np)
    if (np.cartItems) {
      this.cartItems = np.cartItems;
      this.checkCartPresence(productSlug);
    }
    if (np.publicPageBgStyle) {
      const { secondaryColor, fontColor, bgStyle } = getBgStyle(np.publicPageBgStyle);
      this.setState({ secondaryColor, fontColor, bgStyle });
      this.setState({ loading: false });
    }

    if (np.publicPageShopDetails && np.publicPageShopDetails !== this.shopDetails) {
      this.shopDetails = np.publicPageShopDetails;
      this.setState({ render: !render });
    }
  }

  getProductDetails(productSlug, publicPageProducts) {
    const { match } = this.props;
    const { userName } = match.params;
    const products = publicPageProducts ? publicPageProducts.filter((p) => `${p.slug}` === productSlug) : [];
    if (products.length > 0) {
      this.setState({ product: products[0] });
      const recommendedProductsData = { seller: userName, query: products[0].category.name };
      agent.PublicPage.searchProduct(recommendedProductsData, 1).then((res) => {
        this.setState({ recommendedProducts: res.data.products });
      });
      if (products[0].sizes_available) {
        this.setState({ isSizesAvailable: products[0].sizes_available, sizes: products[0].sizes });
        this.setMinMaxPrice(products[0].sizes);
      } else {
        this.setState({ stockAvailable: products[0].stock > 0, isSizesAvailable: false });
      }
    } else {
      const {
        getPublicPageHeaderInfo,
        getPublicPageUserDetails,
        getPublicPageShopDetails,
        getPublicPageBackGroundStyles,
      } = this.props;
      const data = { username: userName };
      agent.AdminPage.addViewToProfile(data);
      this.setState({ loading: true });
      getPublicPageHeaderInfo(data);
      getPublicPageUserDetails(data);
      getPublicPageShopDetails(data);
      getPublicPageBackGroundStyles(data);
      agent.PublicPage.getProductDetails(productSlug).then((res) => {
        this.setState({ product: res.data.product });

        const recommendedProductsData = { seller: userName, query: res.data.category.name };
        agent.PublicPage.searchProduct(recommendedProductsData, 1).then((res) => {
          this.setState({ recommendedProducts: res.data.products });
        });

        if (res.data.product.sizes_available) {
          this.setState({
            isSizesAvailable: res.data.product.sizes_available,
            sizes: res.data.product.sizes,
          });
          this.setMinMaxPrice(res.data.product.sizes);
        } else {
          this.setState({ stockAvailable: res.data.product.stock > 0, isSizesAvailable: false });
        }
      }).catch((err) => {
        console.log(err, err.response);
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error(ERROR_MSG);
        }
        store.dispatch(push(`/${userName}/`));
      });
    }
  }

  setMinMaxPrice(sizes) {
    if (!sizes || sizes.length <= 0) {
      this.setState({ minPrice: 0, maxPrice: 0 });
      return;
    }
    if (!sizes[0].price) return;
    let minPrice = sizes[0].disc_price;
    let maxPrice = sizes[0].disc_price;
    let stockAvailable = false;
    sizes.forEach((p) => {
      minPrice = Math.min(p.disc_price, minPrice);
      maxPrice = Math.max(p.disc_price, maxPrice);
      stockAvailable = stockAvailable || p.stock > 0;
    });
    this.setState({ minPrice, maxPrice, stockAvailable });
  }

  checkCartPresence(productSlug) {
    const temp = this.cartItems.filter((c) => `${c.item.slug}` === productSlug);

    if (temp.length > 0) {
      this.setState({ alreadyInCart: true });
    } else {
      this.setState({ alreadyInCart: false, quantity: 1, selectedSize: null });
    }
  }

  togelIsZoomImageDialog() {
    const { isZoomImageDialogOpen } = this.state;

    if (isZoomImageDialogOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&imageZoom=true`
        : `${window.location.pathname}?imageZoom=true`;
      store.dispatch(push(path));
    }
  }

  showCart() {
    const { routingLocation } = this.props;
    let path = `${window.location.pathname}?`;
    const { query } = routingLocation;

    if (routingLocation.query.tab) {
      path += `cartDetails=true&tab=${query.tab}`;
    } else {
      path += 'cartDetails=true';
    }

    store.dispatch(push(path));
  }

  addToCart() {
    const {
      isSizesAvailable, selectedSize, product, quantity, user,
    } = this.state;
    const { addToCart } = this.props;
    if (isSizesAvailable && !selectedSize) {
      this.setState({ showSizes: true });
    } else {
      const data = {
        item: product,
        quantity,
        selectedSize,
        seller: user,
      };
      addToCart(data);
      window.navigator.vibrate(100);
      const sizeSelect = this.selectRef.current;
      if (sizeSelect) sizeSelect.children[0].selected = true;
      this.setState({ showSizes: false, quantity: 1, selectedSize: null });
    }
  }


  modifyQuantity(change) {
    const { quantity, product, isSizesAvailable, selectedSize } = this.state;
    if (isSizesAvailable && !selectedSize) {
      this.setState({ showSizes: true });
      return;
    }
    const stock = selectedSize ? Math.min(selectedSize.stock, 10) : Math.min(product.stock);
    if (quantity + change > 0 && quantity + change < stock) {
      this.setState({ quantity: quantity + change, showSizes: false });
    }
  }

  selectSize(e) {
    const { sizes } = this.state;
    this.setState({ selectedSize: sizes[e.target.value] });
  }

  showProductDetails(product) {
    const { user } = this.state;
    const path = `/${user.username}/products/${product.slug}`;
    store.dispatch(push(path));
  }

  renderZoomImageDialog() {
    const { isZoomImageDialogOpen, product } = this.state;

    return (
      <Dialog
        open={isZoomImageDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        fullScreen
        name="zoomImageDialog"
        onClose={this.togelIsZoomImageDialog.bind(this)}
      >
        <div className="tc b f5">
          <p>
          Double click or pinch to zoom.
          </p>
        </div>

        <DialogContent>
          <div>
            {
               product && product.images && product.images.length > 0
                 ? (
                   <Carousel className="product-details-carousel" style={{ background: 'white' }}>
                     { product.images.map((img, i) => (
                       <ZoomImage key={i}>
                         <img src={img} alt="" style={{ width: 'auto', maxHeight: window.innerHeight - 200, margin: 'auto' }} overlaySrc={product.preview_images[0]} key={i} />
                       </ZoomImage>
                     ))}
                   </Carousel>
                 )
                 : null
            }

          </div>
        </DialogContent>

        <DialogActions>
          <button type="button" className="color-btn w-50" onClick={this.togelIsZoomImageDialog}> close</button>
        </DialogActions>
      </Dialog>
    );
  }


  render() {
    const {
      alreadyInCart, sizes, showSizes, secondaryColor, fontColor, minPrice, maxPrice, isSizesAvailable, selectedSize, product, stockAvailable, quantity,
      preview_image, loading, user, recommendedProducts,
    } = this.state;
    const {
      name, images, price, disc_price, description, estimated_delivery, preview_images, cod_available, stock, shipping_charges,
    } = product;
    const bgStyle = { position: 'fixed', width: window.innerWidth > window.innerHeight ? window.innerWidth : '100%', height: window.innerHeight > window.innerWidth ? window.innerHeight : 'auto' };

    return (
      <>
        <Helmet>
          <title>{`Myweblink.store: ${user.username}`}</title>
          <meta name="description" content="Get your ecommerce business website with no setup cost , sell online books, shoes ,accessories, apparels." />
          <meta name="keywords " content="online store, ecommerce website , sell your product, get free website, online market place, increase your sales, for wholesellers and retailers , expand your business, sell books online , sell clothes online, sell shoes online, sell accessories online, easy to handle website, delivery facility , maintain tranparency, mobile friendly website." />

          <link rel="canonical" href={`https://myweblink.store/${user.username}/`} />
          <meta name="play store app" content="https://play.google.com/store/apps/details?id=com.myweblink.myweblink" />
        </Helmet>
        <div className="gradientbg home-page-bg mh-100 flex flex-column justify-between" style={this.state.bgStyle ? { ...this.state.bgStyle, color: secondaryColor } : null}>
          <div style={bgStyle}>
            {
              this.state.bgStyle ? <Image src={this.state.bgStyle.backgroundImage} style={bgStyle} overlaySrc={preview_image} /> : null
            }
          </div>
          <div className="">

            <PublicNavBar />
            <nav className="product-details-nav" >
              <button type="button" onClick={() => store.dispatch(push(`/${user.username}`))}>Home ></button>
              <button type="button">{name}</button>
            </nav>
            <div className="product-details">
              <div className="product-details-top-div">
                {
                  images && images.length > 0
                    ? (
                      <Carousel className="product-details-carousel" background="#000" dynamicHeight onClickItem={this.togelIsZoomImageDialog} showThumbs={false}>
                        { images.map((img, i) => (
                          <Image src={img} alt="" overlaySrc={preview_images[0]} key={i} />
                        ))}
                      </Carousel>
                    )
                    : null
                  
                }
                <div className="product-details-top-right-div">
                  <h3>{name}</h3>
                  <div className="product-pricing">
                    {
                      !isSizesAvailable
                        ? (
                          disc_price === price
                            ? (
                              <b>{`Rs. ${price}`}</b>
                            )
                            : (
                              <div>
                                <b>{`Rs. ${disc_price}`}</b>
                                <strike>{` Rs. ${price}`}</strike>
                                <span className="product-details-product-sale">
                                  {`${Math.floor(((price - disc_price) / price) * 100)} %off`}
                                </span>
                              </div>
                            )
                        ) : (
                          selectedSize ? (
                            selectedSize.disc_price === selectedSize.price
                              ? (
                                <b>{`Rs. ${selectedSize.price}`}</b>
                              )
                              : (
                                <div>
                                  <b>{`Rs. ${selectedSize.disc_price}`}</b>
                                  <strike>{` Rs. ${selectedSize.price}`}</strike>
                                  <span className="product-details-product-sale">
                                    {`${Math.floor(((selectedSize.price - selectedSize.disc_price) / selectedSize.price) * 100)} %off`}
                                  </span>
                                </div>
                              )
                          )
                            : (
                              minPrice !== maxPrice
                                ? (
                                  <b>{`Rs. ${minPrice} ~ Rs.${maxPrice}`}</b>
                                )
                                : (
                                  <b>{`Rs. ${minPrice}`}</b>
                                )
                            )
                        )
                    }
                  </div>
                  <div className="product-add-to-cart-div">
                    <div>
                      <div className="flex flex-column mt1 mb1">
                        {
                          sizes && sizes.length > 0
                          && (
                          <select onChange={this.selectSize.bind(this)} ref={this.selectRef}>
                            <option value={null}>Select Size</option>
                            {
                            sizes.map((s, i) => (
                              <option value={i} key={i}>{s.size}</option>
                            ))
                            }
                          </select>
                          )
                        }
                        {
                          showSizes ? <p className="err-txt"> *Select a size </p> : null
                        }
                      </div>
                      <div className="flex">
                        <button type="button" className="w-20 b ba" onClick={() => this.modifyQuantity(-1)}> - </button>
                        <input type="number" value={quantity} style={{ fontSize: '1rem' }} className="w-60 b bt bb" disabled />
                        <button type="button" className="w-20 ba b" onClick={() => this.modifyQuantity(1)}>  + </button>
                      </div>
                      <button
                        type="button"
                        className="product-add-to-cart"
                        onClick={this.addToCart.bind(this)}
                        style={{ background: secondaryColor, color: fontColor }}
                        disabled={selectedSize ? selectedSize.stock <= 0 : !stockAvailable}
                      >
                        {
                          selectedSize
                            ? (selectedSize.stock > 0
                              ? 'Add To Cart'
                              : 'Out of Stock'
                            )
                            : stockAvailable
                              ? 'Add To Cart'
                              : 'Out of Stock'
                        }
                      </button>
                    </div>
                    {
                      alreadyInCart
                        ? (

                          <div className="b go-to-cart relative">
                            Item already in cart.
                            <a onClick={this.showCart} style={{ color: secondaryColor, fontWeight: 'bold' }}>Go To Cart</a>
                          </div>
                        )
                        : null
                    }
                  </div>
                  <p className="b">
                    {`Estimated Delivery: ${estimated_delivery}`}
                  </p>
                  {
                    cod_available
                      ? (
                        <p className=" green b">Cash on delivery available</p>
                      )
                      : null
                  }
                  <small className=" mt1 mb1">{`${shipping_charges} Rs. shipping charges`}</small>
                  {
                    user && this.shopDetails && `${user.id}` === `${product.user}` && this.shopDetails.has_free_delivery_above_amount && this.shopDetails.free_delivery_above_amount > 0 ? (
                      <p className=" green b">{`Free delivery on order above Rs.${this.shopDetails.free_delivery_above_amount}`}</p>
                    ) : null
                  }
                  <div style={{ overflowWrap: 'anywhere', borderTop: `1px solid ${secondaryColor}` }}>
                    <h5> Description : </h5>
                    <p>{description}</p>
                  </div>
                </div>
              </div>
            </div>

            {
            recommendedProducts && recommendedProducts.length > 0
              && (
                <div className="we-also-recommend-div">
                  <h3>We Also Recommend</h3>
                  <div className="content">
                    {
                      recommendedProducts.map((p) => {
                        if ((p.images && p.images.length === 0) || (p.id === product.id)) {
                          return null;
                        }
                        return (
                          <div className="public-product">
                            <div className="product-header-img " style={{ overflow: 'hidden' }} onClick={() => this.showProductDetails(p)}>
                              {
                                p.images && p.images.length > 0
                                  ? <Image src={p.images[0]} alt="" overlaySrc={p.preview_images[0]} /> : null
                              }
                            </div>
                            <div className="product-pricing">
                              <h3 className="ma0 " onClick={() => this.showProductDetails(p)}>
                                {p.name}
                              </h3>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              )
          }
            {
            this.renderZoomImageDialog()
          }
          </div>
          <PublicFooter parent={!this.props.parent ? 'public-home-page' : this.props.parent} />

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
  cartItems: state.HomePageReducers.cartItems,
  routingLocation: state.router.location,
  homeBgStyle: state.AdminPageReducers.homeBgStyle,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,
  publicPageProducts: state.HomePageReducers.publicPageProducts,
  // selectedProduct: state.HomePageReducers.selectedProduct,
  publicPageUser: state.HomePageReducers.publicPageUser,
  publicPageShopDetails: state.HomePageReducers.publicPageShopDetails,

});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (product) => dispatch({ type: ADD_TO_CART, payload: product }),
  removeFromCart: (product) => dispatch({ type: REMOVE_FROM_CART, payload: product }),
  selectProduct: (product) => dispatch({ type: SELECT_PRODUCT, payload: product }),

  getPublicPageHeaderInfo: (user) => dispatch({ type: GET_PUBLIC_PAGE_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
  getPublicPageUserDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_USER, payload: agent.Auth.getUserDetails(user) }),
  getPublicPageShopDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_SHOP_DETAILS, payload: agent.ProductsPage.getShopDetails(user) }),
  getPublicPageBackGroundStyles: (user) => dispatch({ type: GET_PUBLIC_PAGE_BG_STYLE, payload: agent.AdminPage.getBackground(user) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetails);
