/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { push, goBack } from 'react-router-redux';

import './styles.css';
import _ from 'lodash';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { store } from '../../../store';
import CartProduct from './CartProduct';
import {
  REMOVE_FROM_CART, ADD_TO_CART,
} from '../../../constants/actionTypes';
import getBgStyle from '../../../common/Components/getBgStyle';


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class CartDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      open: false,
      user: {},
      secondaryColor: '',
      fontColor: '',

    };
    this.cartItems = [];
    this.shopDetails = {};
    this.togelDialog = this.togelDialog.bind(this);
  }

  componentDidMount() {
    const {
      publicPageUser, publicPageBgStyle, publicPageShopDetails, cartItems,
    } = this.props;
    const { render } = this.state;

    if (publicPageShopDetails) {
      this.shopDetails = publicPageShopDetails;
      this.calculateTotal();
      this.setState({ render: !render });
    }
    if (cartItems) {
      this.cartItems = cartItems;
      this.calculateTotal();
      this.setState({ render: !render });
    }
    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
    const { secondaryColor, fontColor } = getBgStyle(publicPageBgStyle);
    this.setState({ secondaryColor, fontColor });
  }

  UNSAFE_componentWillReceiveProps(np) {
    const {
      product, render, user,
    } = this.state;
    if (np.data && np.data !== product) {
      this.setState({ product: np.data });
    }
    if (np.publicPageShopDetails && np.publicPageShopDetails !== this.shopDetails) {
      this.shopDetails = np.publicPageShopDetails;
      this.calculateTotal();
      this.setState({ render: !render });
    }
    if (np.publicPageUser && np.publicPageUser !== user) {
      this.setState({ user: np.publicPageUser });
    }
    if (np.cartItems && np.cartItems !== this.cartItems) {
      this.cartItems = np.cartItems;
      this.calculateTotal();
    }
    if (np.routingLocation) {
      if (np.routingLocation.location.query) {
        this.setState({ open: np.routingLocation.location.query.cartDetails });
        this.calculateTotal();
      }
    }
    const { secondaryColor, fontColor } = getBgStyle(np.publicPageBgStyle);
    this.setState({ secondaryColor, fontColor });
  }

  modifyQuantity(product, change) {
    const changeQuntity = product.quantity + change;
    const { addToCart } = this.props;
    if (changeQuntity > 0) {
      const temp = { ...product, quantity: change };
      addToCart(temp);
    }
  }

  togelDialog() {
    const { open } = this.state;
    let path = '';
    if (open) {
      store.dispatch(goBack());
    } else {
      path = `${window.location.pathname}?cartDetails=true`;
      store.dispatch(push(path));
    }
  }

  calculateTotal() {
    let totalPrice = 0;
    const sellersDeliveryCharges = {};
    const sellersCartTotal = {};
    const { user } = this.state;
    const { shopDetails } = this;
    const { id } = user;
    this.cartItems.map((c) => {
      if (c.item) {
        const itemPrice = c.selectedSize ? c.selectedSize.disc_price : c.item.disc_price;
        totalPrice += (c.quantity * itemPrice);

        if (sellersCartTotal[c.item.user]) {
          sellersCartTotal[c.item.user] += (c.quantity * itemPrice);
        } else {
          sellersCartTotal[c.item.user] = (c.quantity * itemPrice);
        }

        if (sellersDeliveryCharges[c.item.user]) {
          sellersDeliveryCharges[c.item.user] = Math.max(sellersDeliveryCharges[c.item.user], c.item.shipping_charges);
        } else {
          sellersDeliveryCharges[c.item.user] = c.item.shipping_charges;
        }
      }
    });
    let deliveryCharges = 0;

    Object.keys(sellersDeliveryCharges).forEach((k) => {
      if (!(`${k}` === `${id}` && shopDetails.has_free_delivery_above_amount && sellersCartTotal[k] >= shopDetails.free_delivery_above_amount)) {
        deliveryCharges += sellersDeliveryCharges[k];
      }
    });

    totalPrice += deliveryCharges;
    this.setState({ totalPrice, deliveryCharges });
  }

  renderCartContents() {
    const {
      secondaryColor, fontColor,
    } = this.state;
    let totalQuantity = 0;
    const { totalPrice, deliveryCharges } = this.state;
    return (
      <div className="cart-details-cart-content">
        <div className="cart-details-cart-items">
          {
            this.cartItems.map((c, i) => {
              totalQuantity += c.quantity;


              return (
                <CartProduct data={c.item} cartItem={c} key={c.item.id} selectedSize={c.selectedSize} quantity={c.quantity} />
              );
            })
          }
          <div className="bt w-100 tr">
            <h3>{`Shipping Charges: Rs. ${deliveryCharges}`}</h3>
          </div>
          <div className="bt w-100 tr">
            <h2>
              {`Total (${totalQuantity} Items): `}
              <span>{`Rs. ${totalPrice}`}</span>
            </h2>
          </div>
        </div>

        <div className="checkout-div">
          <div className="flex items-center justify-between flex-wrap">
            <h3>{`Total (${totalQuantity} Items) : `}</h3>
            <h2>{`${totalPrice} Rs.`}</h2>
          </div>
          <button
            className="color-btn w-100"
            onClick={() => (store.dispatch(push('/user-payment/')))}
            type="button"
            style={{ background: secondaryColor, color: fontColor }}
          >
            Proceed to Buy
          </button>
        </div>
      </div>

    );
  }

  render() {
    const {
      open, secondaryColor, fontColor,
    } = this.state;

    return (
      <div className="">
        <button className="hidden-btn" type="button" onClick={this.togelDialog}>
            open cart item
        </button>

        <Dialog fullScreen open={open} onClose={this.togelDialog} TransitionComponent={Transition}>
          <div className="cart-details-top-bar" style={{ backgroundColor: secondaryColor, color: fontColor }}>
            <h2>My Cart</h2>
            <button type="button" onClick={this.togelDialog} style={{ color: fontColor }}>
                  Close
            </button>
          </div>
          <div className="cart-details-content-image">
            <ShoppingCartIcon />
            <h2>Cart Content</h2>
          </div>
          <div>
            {
              this.cartItems && this.cartItems.length === 0
                ? <p className="tc">No items in cart Purchase some Items</p>
                : (
                  this.renderCartContents()
                )
            }
          </div>
        </Dialog>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  cartItems: state.HomePageReducers.cartItems,
  publicPageUser: state.HomePageReducers.publicPageUser,
  selectedProduct: state.HomePageReducers.selectedProduct,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,
  publicPageShopDetails: state.HomePageReducers.publicPageShopDetails,
  routingLocation: state.router,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (product) => dispatch({ type: ADD_TO_CART, payload: product }),
  removeFromCart: (product) => dispatch({ type: REMOVE_FROM_CART, payload: product }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartDetails);
