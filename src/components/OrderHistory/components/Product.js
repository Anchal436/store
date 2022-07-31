/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './styles.css';
import _ from 'lodash';
import {
  ADD_TO_CART, REMOVE_FROM_CART,
} from '../../../constants/actionTypes';
import ProductDetails from './ProductDetails';
import Image from '../../../common/Components/Image';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: { },
      alreadyInCart: false,
    };
    this.cartItems = [];
  }

  componentWillMount() {
    if (this.props.data) {
      this.setState({ product: this.props.data });
    }
  }

  componentWillReceiveProps(np) {

  }

  render() {
    const {
      name, disc_price, price, images, preview_images,
    } = this.state.product;
    const {
      alreadyInCart,
    } = this.state;
    return (
      <div className="public-product relative">

        <div className="product-header-img relative" style={{ overflow: 'hidden' }}>
          {
            images.length > 0
              ? <Image src={images[0]} alt="" overlaySrc={preview_images[0]} /> : null
          }
          <ProductDetails data={this.state.product} alreadyInCart={alreadyInCart} parent={this.props.parent} />
        </div>
        <div className="product-pricing">
          <h3 className="ma0 relative">
            <ProductDetails data={this.state.product} alreadyInCart={alreadyInCart} parent={this.props.parent} />
            {name}
          </h3>
          {
            disc_price === price
              ? (
                <b>
                    Rs.
                  {price}
                </b>
              )
              : (
                <div>
                  <div className="home-page-product-sale">
                    {`${Math.floor(((price - disc_price) / price) * 100)}%off`}
                  </div>
                  <b>
                    Rs.
                    {disc_price}
                  </b>
                  <strike>{` Rs. ${price}`}</strike>

                </div>
              )
          }

        </div>


      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  cartItems: state.HomePageReducers.cartItems,


});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (product) => dispatch({ type: ADD_TO_CART, payload: product }),
  removeFromCart: (product) => dispatch({ type: REMOVE_FROM_CART, payload: product }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);
