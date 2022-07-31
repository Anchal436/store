/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';

import { push } from 'react-router-redux';

import './styles.css';
import _ from 'lodash';
import {
  ADD_TO_CART, REMOVE_FROM_CART, SELECT_PRODUCT,
} from '../../../constants/actionTypes';

import { store } from '../../../store';
// import CollapseTransition from '../../../common/Components/CollapseTransition';
import Image from '../../../common/Components/Image';
import checkBgColor from '../../../common/Components/checkBgColor';
import { DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';


class CartProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textColor: DEFAULT_TEXT_COLOR,
      user: {},
      cartItem: { item: {stock:100}, quantity: 1, selectedSize: {stock:100} },

    };
    this.quntitySelectRef = React.createRef(null);
    this.showProductDetails = this.showProductDetails.bind(this);
  }

  componentDidMount() {
    const {
      homeBgStyle, publicPageBgStyle, parent, publicPageUser, cartItem,
    } = this.props;
    if (parent && parent === 'admin-page') {
      if (homeBgStyle) {
        let textColor = DEFAULT_TEXT_COLOR;
        if (homeBgStyle.link_style) {
          textColor = homeBgStyle.link_style;
        }
        this.setState({ textColor });
      }
    } else if (publicPageBgStyle) {
      let textColor = DEFAULT_TEXT_COLOR;
      if (publicPageBgStyle.link_style) {
        textColor = publicPageBgStyle.link_style;
      }
      this.setState({ textColor });
    }
    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }

    if (cartItem) {
      this.setState({ cartItem });
      
      if (this.quntitySelectRef) {
        Object.keys(this.quntitySelectRef.current.children).forEach((c) => {
          const child = this.quntitySelectRef.current.children[c];
          
          if (child.value === `${cartItem.quantity}`) {
            child.selected = true;
          }
        });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { parent } = this.props;
    const {
      product, user, selectedSize, quantity, cartItem,
    } = this.state;
    if (parent === 'admin-page') {
      if (np.homeBgStyle) {
        let textColor = DEFAULT_TEXT_COLOR;
        if (np.homeBgStyle.link_style) {
          textColor = np.homeBgStyle.link_style;
        }
        this.setState({ textColor });
      }
    } else if (np.publicPageBgStyle) {
      let textColor = DEFAULT_TEXT_COLOR;
      if (np.publicPageBgStyle.link_style) {
        textColor = np.publicPageBgStyle.link_style;
      }
      this.setState({ textColor });
    }
    if (np.publicPageUser && np.publicPageUser !== user) {
      this.setState({ user: np.publicPageUser });
    }
    if (np.cartItem && np.cartItem !== cartItem) {
      this.setState({ cartItem: np.cartItem });
      if (this.quntitySelectRef) {
        Object.keys(this.quntitySelectRef.current.children).forEach((c) => {
          const child = this.quntitySelectRef.current.children[c];
          
          if (child.value === `${np.cartItem.quantity}`) {
            child.selected = true;
          }
        });
      }
    }
  }

  removeProduct() {
    const { cartItem } = this.state;
    const { removeFromCart } = this.props;

    removeFromCart(cartItem);
  }

  showProductDetails() {
    const { cartItem, user } = this.state;
    if (cartItem && cartItem.item) {
      const path = `/${user.username}/products/${cartItem.item.slug}`;
      store.dispatch(push(path));
    }
  }

  modifyQuantity(newQuantity) {
    const { cartItem } = this.state;
    const change = Number(newQuantity) - Number(cartItem.quantity);
    const { addToCart } = this.props;

    const temp = { ...cartItem, quantity: Number(change) };
    addToCart(temp);
  }

  render() {
    const { cartItem, textColor } = this.state;
    const { selectedSize, item, quantity } = cartItem;
    const {
      name, disc_price, images, preview_images, cod_available,
    } = item;
    const stock = selectedSize ? selectedSize.stock : item.stock;
    if (images && images.length === 0) {
      return null;
    }
    return (
      <div className="cart-product relative">
        <div className="product-header " style={{ overflow: 'hidden' }}>
          <button type="button" className="image" onClick={this.showProductDetails}>
            {
            images && images.length > 0
              ? <Image src={images[0]} alt="" overlaySrc={preview_images[0]} /> : null
          }
          </button>
          <div className="content">
            <div className="heading">
              <button type="button" onClick={this.showProductDetails}>
                <h3>
                  {name}
                </h3>
                {
                    selectedSize
                        && (
                        <p>{`Size: ${selectedSize.size}`}</p>
                        )
                }
              </button>
              <p className="green">In stock </p>
              {
                cod_available
                  && <p className="green">Eligible for cash on delivery </p>

              }
            </div>
            <div className="remove-from-cart-div">
              <div className="flex quantity-div">
                <select ref={this.quntitySelectRef} onChange={(e) => this.modifyQuantity(e.target.value)}>
                  {
                      Array.from(Array(((stock > 20) ? 20 : stock)), (_, i) => i + 1).map((q) => (
                        <option value={q} key={q}>{q}</option>
                      ))
                  }
                </select>
              </div>
              |
              <button type="button" className="remove" onClick={this.removeProduct.bind(this)}>Remove</button>
            </div>

          </div>
        </div>
        <div className="product-pricing">
          {
            selectedSize ? (
              <p>{`Rs.${selectedSize.disc_price}`}</p>
            ) : (
              <p>{`Rs.${disc_price}`}</p>
            )
          }
        </div>
      </div>
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
)(CartProduct);
