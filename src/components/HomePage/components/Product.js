/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
// import { toast } from 'react-toastify';
import { push } from 'react-router-redux';
import './styles.css';
import _ from 'lodash';
import {
  ADD_TO_CART, REMOVE_FROM_CART, SELECT_PRODUCT,
} from '../../../constants/actionTypes';

import { store } from '../../../store';
// import CollapseTransition from '../../../common/Components/CollapseTransition';
import Image from '../../../common/Components/Image';

// import { DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';
import getBgStyle from '../../../common/Components/getBgStyle';


class PublicProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: { category:"" },
      quantity: 1,
      alreadyInCart: false,
      cartItem: false,
      isSizesAvailable: false,
      selectedSize: null,
      sizes: [],
      secondaryColor:"",
      fontColor:"",
      user: {},
      stockAvailable: true,
    };
    this.cartItems = [];
    this.selectRef = React.createRef();
    this.showCart = this.showCart.bind(this);
    this.showProductDetails = this.showProductDetails.bind(this);
  }

  componentDidMount() {
    const {
      data, cartItems, publicPageBgStyle, publicPageUser,
    } = this.props;
    if (publicPageBgStyle) {
      const { secondaryColor, fontColor } = getBgStyle(publicPageBgStyle);
      this.setState({ secondaryColor, fontColor });
    }

    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
    if (data) {
      this.setState({ product: data });
      if (data.sizes_available) {
        this.setState({ sizes: data.sizes, isSizesAvailable: data.sizes_available });
        this.setMinMaxPrice(data.sizes);
      } else {
        this.setState({ stockAvailable: data.stock > 0, isSizesAvailable: false });
      }
    }
    
    if (cartItems) {
      this.cartItems = cartItems;
      const temp = cartItems.filter((c) => c.item.id === data.id);
      this.setState({alreadyInCart: temp.length > 0 });
    }
    
  }

  UNSAFE_componentWillReceiveProps(np) {
    
    const { product, user, publicPageBgStyle } = this.state;

    if (np.publicPageBgStyle && np.publicPageBgStyle !== publicPageBgStyle) {
      const { secondaryColor, fontColor } = getBgStyle(np.publicPageBgStyle);
      this.setState({ secondaryColor, fontColor, publicPageBgStyle });
    }
    if (np.publicPageUser && np.publicPageUser !== user) {
      this.setState({ user: np.publicPageUser });
    }

    if (np.data && np.data !== product) {
      const { data } = np;
      this.setState({ product: { ...data } });
      if (np.data.sizes_available) {
        this.setState({ isSizesAvailable: true });
        this.setMinMaxPrice(np.data.sizes);
      } else {
        this.setState({ isSizesAvailable: false });
      }
    }
    
    if (np.cartItems && np.cartItems !== this.cartItems) {
      this.cartItems = np.cartItems;
      const temp = np.cartItems.filter((c) => c.item.id === np.data.id);
      this.setState({alreadyInCart: temp.length > 0 });
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

  showCart() {
    const { routingLocation } = this.props;
    let path = `${window.location.pathname}?`;
    const { query } = routingLocation;
    query.cartDetails = true;
    Object.keys(query).forEach((q) => {
      path += `${q}=${query[q]}&`;
    });
    path.substring(0, path.length - 2);
    store.dispatch(push(path));
  }

 
  showProductDetails() {
    const { product, user } = this.state;
    const path = `/${user.username}/products/${product.slug}`;
    store.dispatch(push(path));
  }

  render() {
    const {
    alreadyInCart, product,  minPrice, maxPrice, isSizesAvailable, selectedSize, secondaryColor, fontColor,
    } = this.state;
    const {
      name, disc_price, price, images, preview_images, category,
    } = product;
    const { style } = this.props;
    if (images && images.length === 0) {
      return null;
    }
    return (
      <button className="public-product" style={style} type="button" onClick={this.showProductDetails}>
        <div className="product-header-img " style={{ overflow: 'hidden' }}>
          {
            images && images.length > 0
              ? <Image src={images[0]} alt="" overlaySrc={preview_images[0]} /> : null
          }
        </div>
        <div className="product-pricing">
          <h3 className="ma0 ">
            {name}
          </h3>
          <p className="ma0 ">
            {category.name}
          </p>
          {
            !isSizesAvailable ? (
              disc_price === price
                ? (
                  <b>{`Rs.${price}`}</b>
                )
                : (
                  <div className="disc-price-div">
                    <b>{`Rs.${disc_price}`}</b>
                    <strike>{` Rs. ${price}`}</strike>
                    <p>{`( ${Math.floor(((price - disc_price) / price) * 100)}%off )`}</p>
                  </div>
                )
            ) : (
              minPrice !== maxPrice
                ? (
                  <b>{`Rs.${minPrice} ~ Rs.${maxPrice}`}</b>
                )
                : (
                  <b>{`Rs.${maxPrice}`}</b>
                )
            )
          }
        </div>
        {
            alreadyInCart
              && (
                <button type="button" onClick={this.showCart} className="go-to-cart" style={{ backgroundColor: secondaryColor, color:  fontColor }}>
                  Item already in cart.
                  Go To Cart
                </button>

              )

          }
      </button>
    );
  }
}


const mapStateToProps = (state) => ({
  // user: state.AuthReducer.user,
  cartItems: state.HomePageReducers.cartItems,
  routingLocation: state.router.location,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,
  publicPageUser: state.HomePageReducers.publicPageUser,
  homeBgStyle: state.AdminPageReducers.homeBgStyle,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (product) => dispatch({ type: ADD_TO_CART, payload: product }),
  removeFromCart: (product) => dispatch({ type: REMOVE_FROM_CART, payload: product }),
  selectProduct: (product) => dispatch({ type: SELECT_PRODUCT, payload: product }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicProduct);
