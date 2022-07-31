/* eslint-disable camelcase */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import { toast } from 'react-toastify';
import './styles.css';
import _ from 'lodash';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Header from './PublicNavBar';
import { store } from '../../../store';
import agent from '../../../agent';
import Loader from '../../../common/Components/Loader';
import TextInput from '../../../common/Components/TextInput';
import getBgStyle from '../../../common/Components/getBgStyle';
import { ERROR_MSG } from '../../../constants/otherConstants';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'];
const countries = ['India'];

class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      loading: false,
      open: false,
      user: {},
      buyerInfo: { country: countries[0], state: states[0] },
      totalPrice: 0,
      isConfirmOrderModelOpen: false,
      isCodEligible: true,
      codItems: [],
      onlineItems: [],
      deliveryCharges: 0,
      secondaryColor: '',
      fontColor: '',

    };
    this.cartItems = [];
    this.shopDetails = {};

    this.cod = false;
    this.countrySelectRef = React.createRef();
    this.stateSelectRef = React.createRef();

    this.togelConfirmOrderModal = this.togelConfirmOrderModal.bind(this);
    this.showCart = this.showCart.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      cartItems, publicPageBgStyle, publicPageUser, publicPageShopDetails,
    } = this.props;
    let buyer = window.localStorage.getItem('publicPageBuyer');
    const { render } = this.state;

    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
    try {
      buyer = JSON.parse(buyer);
      this.updateUserInfo(buyer);
    } catch {}
    if (cartItems) {
      this.cartItems = cartItems;
      this.checkCashOndelivery();
      this.calculateTotal();
      this.setState({ render: !this.state.render });
    }
    if (publicPageShopDetails) {
      this.shopDetails = publicPageShopDetails;
      this.calculateTotal();
      this.setState({ render: !render });
    }

    const { secondaryColor, fontColor } = getBgStyle(publicPageBgStyle);
    this.setState({ secondaryColor, fontColor });
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { render, user } = this.state;
    if (np.publicPageUser) {
      this.setState({ user: np.publicPageUser });
    }
    if (np.cartItems && np.cartItems !== this.cartItems) {
      this.cartItems = np.cartItems;
      this.calculateTotal();
      this.checkCashOndelivery();
      this.setState({ render: !render });
    }
    if (np.publicPageShopDetails && np.publicPageShopDetails !== this.shopDetails) {
      this.shopDetails = np.publicPageShopDetails;
      this.calculateTotal();
      this.setState({ render: !render });
    }

    if (np.routingLocation) {
      if (np.routingLocation.query) {
        const { confirmOrder } = np.routingLocation.query;
        this.paymentMode = confirmOrder;
        if (confirmOrder === 'online') {
          const codItems = this.cartItems.filter((c) => ((c.item.online_available === false && c.item.cod_available)));
          const onlineItems = this.cartItems.filter((c) => ((c.item.online_available)));
          this.calculateTotal();
          this.setState({ codItems, onlineItems, isConfirmOrderModelOpen: true });
        } else if (confirmOrder === 'cod') {
          const onlineItems = this.cartItems.filter((c) => ((c.item.online_available && c.item.cod_available === false)));
          const codItems = this.cartItems.filter((c) => ((c.item.cod_available)));
          this.onlineItems = onlineItems;

          this.setState({ onlineItems, codItems, isConfirmOrderModelOpen: true });
        } else {
          this.setState({ isConfirmOrderModelOpen: false });
        }
      }
    }
    const { secondaryColor, fontColor } = getBgStyle(np.publicPageBgStyle);
    this.setState({ secondaryColor, fontColor });
  }

  updateUserInfo(buyerInfo) {
    if (!buyerInfo) return;

    if (this.countrySelectRef && this.countrySelectRef.current) {
      if (buyerInfo.country) {
        Object.keys(this.countrySelectRef.current.children).forEach((c) => {
          const child = this.countrySelectRef.current.children[c];
          if (child.value === buyerInfo.country) {
            child.selected = true;
          }
        });
      } else {
        buyerInfo = { ...buyerInfo, country: countries[0] };
      }
    } else {
      buyerInfo = { ...buyerInfo, country: countries[0] };
    }
    if (this.stateSelectRef && this.stateSelectRef.current) {
      if (buyerInfo.state) {
        Object.keys(this.stateSelectRef.current.children).forEach((c) => {
          const child = this.stateSelectRef.current.children[c];
          if (child.value === buyerInfo.state) {
            child.selected = true;
          }
        });
      } else {
        buyerInfo = { ...buyerInfo, state: states[0] };
      }
    } else {
      buyerInfo = { ...buyerInfo, state: states[0] };
    }

    this.setState({ buyerInfo });
  }

  checkCashOndelivery(cartItems) {
    let res = false;
    this.cartItems.forEach((c) => {
      res = res || c.item.cod_available;
    });
    this.setState({ isCodEligible: res });
  }

  togelConfirmOrderModal(paymentMode) {
    const { isConfirmOrderModelOpen } = this.state;
    if (isConfirmOrderModelOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&confirmOrder=${paymentMode}`
        : `${window.location.pathname}?confirmOrder=${paymentMode}`;
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

  purchaseCart(e) {
    if (e) {
      e.preventDefault();
    }
    const {
      onlineItems, codItems, buyerInfo, user,
    } = this.state;
    window.localStorage.setItem('publicPageBuyer', JSON.stringify(buyerInfo));

    this.setState({ loading: true });
    const tempOnlineItems = onlineItems.map((p) => {
      if (p.selectedSize) {
        return ({
          type: 'product',
          id: p.item.id,
          meta_data: {
            size: (p.selectedSize.id || p.selectedSize),
            quantity: p.quantity,
          },
        });
      }
      return ({
        type: 'product',
        id: p.item.id,
        meta_data: {

          quantity: p.quantity,
        },
      });
    });
    const tempCodItems = codItems.map((p) => {
      if (p.selectedSize) {
        return ({
          type: 'product',
          id: p.item.id,
          meta_data: {
            size: (p.selectedSize.id || p.selectedSize),
            quantity: p.quantity,
          },
        });
      }
      return ({
        type: 'product',
        id: p.item.id,
        meta_data: {
          quantity: p.quantity,
        },
      });
    });
    const data = {
      user_details: buyerInfo,
      online_items: tempOnlineItems,
      cod_items: tempCodItems,
      seller: user.username,
    };
    console.log(data);
    agent.Purchase.makeOrder(data).then(async (res) => {
      // console.log(res.data);
      if (res.data.form) {
        const payment = res.data.form;
        const form = document.createElement('form');
        form.action = payment.url;
        form.method = 'POST';
        for (const field in payment.fields) {
          const input = document.createElement('input');
          input.setAttribute('hidden', true);
          input.setAttribute('name', field);
          input.setAttribute('value', payment.fields[field]);
          form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
      } else if (res.data.message === 'Order received') {
        store.dispatch(push('/user-payment/success'));
      } else {
        store.dispatch(push('/user-payment/success'));
      }
      this.setState({ loading: false });
    }).catch((err) => {
      console.log(err, err.response);
      toast.error(ERROR_MSG);
      this.setState({ loading: false });
    });
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

  confirmOrder() {
    this.cod = true;
    const button = document.createElement('button');
    button.setAttribute('form', 'payment-info-form');
    button.setAttribute('type', 'submit');
    button.setAttribute('hidden', true);

    document.body.appendChild(button);
    button.click();
  }

  render() {
    const {
      open, user, buyerInfo, totalPrice, isConfirmOrderModelOpen, deliveryCharges, onlineItems, codItems, isCodEligible, fontColor, secondaryColor,
    } = this.state;
    let codTotal = 0;
    let onlineTotal = this.paymentMode === 'cod' ? deliveryCharges : 0;
    let totalQuantity = 0;

    return (
      <div className="">
        <Header />
        <nav className="product-details-nav">
          <button type="button" onClick={() => store.dispatch(push(`/${user.username}`))}>Home ></button>
          <button type="button">Payment page</button>
        </nav>
        {/* <div className="cart-details-top-bar" style={{ backgroundColor: secondaryColor, color: fontColor }}>
          <h2>Payment Info</h2>
          <button type="button" onClick={() => store.dispatch(push(`/${user.username}`))} style={{ backgroundColor: secondaryColor, color: fontColor }}>
                Go to Home

          </button>
        </div> */}
        <div className="" style={{ justifyContent: 'space-evenly' }}>
          <div className="payment-form-header">
            <h2>Enter Your Details</h2>
            {/* <button className="relative cart-btn" type="button" onClick={() => this.showCart()} style={{ backgroundColor: secondaryColor, color: fontColor }}>
              <ShoppingCartIcon />
              <p> Your cart </p>
            </button> */}
          </div>
          <form id="payment-info-form" onSubmit={this.purchaseCart.bind(this)}>
            <h3>Contact Information</h3>

            <TextInput label="Email" value={buyerInfo.email} type="email" className="w-100" onTextChange={(text) => this.setState({ buyerInfo: { ...buyerInfo, email: text } })} required />
            <TextInput label="Phone number" value={buyerInfo.number} type="number" className="w-100" onTextChange={(text) => this.setState({ buyerInfo: { ...buyerInfo, number: text } })} required />

            <h3>Delivery Address</h3>
            <TextInput label="Customer Name" value={buyerInfo.name} type="text" className="w-100" onTextChange={(text) => this.setState({ buyerInfo: { ...buyerInfo, name: text } })} required />
            <TextInput label="Address" value={buyerInfo.address} type="text" className="w-100" onTextChange={(text) => this.setState({ buyerInfo: { ...buyerInfo, address: text } })} required />
            <TextInput label="Apartment,flat no, etc.." value={buyerInfo.apartment} type="text" className="w-100" onTextChange={(text) => this.setState({ buyerInfo: { ...buyerInfo, apartment: text } })} required />
            <TextInput label="City" value={buyerInfo.city} type="text" className="w-100" onTextChange={(text) => this.setState({ buyerInfo: { ...buyerInfo, city: text } })} required />

            <div className="payment-form-flex-input">
              <select onChange={(e) => this.setState({ buyerInfo: { ...buyerInfo, country: e.target.value } })} ref={this.countrySelectRef}>
                {
                  countries.map((s, i) => (
                    <option value={s} key={i}>{s}</option>
                  ))
                }
              </select>
              <select onChange={(e) => this.setState({ buyerInfo: { ...buyerInfo, state: e.target.value } })} ref={this.stateSelectRef}>
                {
                    states.map((s, i) => (
                      <option value={s} key={i}>{s}</option>
                    ))
                }
              </select>

            </div>
            <TextInput label="PIN code" value={buyerInfo.pincode} type="number" className="w-100" style={{ flexGrow: 1 }} onTextChange={(text) => this.setState({ buyerInfo: { ...buyerInfo, pincode: text } })} required />
            <div className="flex">
              <button type="button" className={isCodEligible ? 'color-btn w-100 pa3 mt2 mr2' : 'color-btn w-100 pa3 mt2 mr2 disabled-btn'} onClick={() => this.togelConfirmOrderModal('cod')} style={{ position: 'relative', backgroundColor: secondaryColor, color: fontColor }}>
               Cash on delivery
              </button>
              <button type="button" className="color-btn w-100 pa3 mt2 ml2" onClick={() => this.togelConfirmOrderModal('online')} style={{ position: 'relative', backgroundColor: secondaryColor, color: fontColor }}>
                Pay  Online
              </button>
            </div>

          </form>
        </div>
        {
              this.state.loading
                ? <Loader />
                : null
          }
        <Dialog
          open={isConfirmOrderModelOpen}
          TransitionComponent={Transition}
          onClose={this.togelConfirmOrderModal.bind(this)}
        >
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogContent>
            {
              this.paymentMode === 'online'
                ? (
                  <div>
                    {
                    codItems.length !== 0
                      ? (
                        <div>

                          <div className="ba ">
                            {
                              codItems.map((item, i) => {
                                totalQuantity += item.quantity;
                                codTotal += (item.quantity) * (item.item.disc_price);
                                onlineTotal = totalPrice - codTotal;
                                return (
                                  <div className="flex items-center justify-around w-100" key={i}>
                                    {
                                      item.selectedSize
                                        ? <b>{`${item.item.name}(${item.selectedSize})`}</b>
                                        : <b>{`${item.item.name}`}</b>
                                    }
                                    <b>{`${item.quantity}`}</b>
                                    <b>{`${(item.quantity) * (item.item.disc_price)}`}</b>
                                  </div>
                                );
                              })
                            }
                            <div className="flex items-center justify-around w-100 mt2 bt ">
                              <b>Total</b>
                              <b>{`${totalQuantity}`}</b>
                              <b>{`${codTotal}`}</b>
                            </div>
                          </div>
                          <p className=" tc">
                            This items are not eligible for online payment You have to pay
                            {' '}
                            <b className="red">{`Rs. ${codTotal} on delivery.`}</b>
                          </p>
                        </div>
                      )
                      : (
                        <div>
                          <p className="tc"> On confirming, you will be redirected to payment Gateway. </p>
                        </div>
                      )
                  }

                  </div>
                )
                : (
                  <div>
                    {
                    onlineItems.length !== 0
                      ? (
                        <div>
                          <div className="ba ">
                            {
                              onlineItems.map((item, i) => {
                                totalQuantity += item.quantity;
                                onlineTotal += (item.quantity) * (item.item.disc_price);
                                codTotal = totalPrice - onlineTotal;
                                return (
                                  <div className="flex items-center justify-around w-100" key={i}>
                                    {
                                      item.selectedSize
                                        ? <b>{`${item.item.name}(${item.selectedSize})`}</b>
                                        : <b>{`${item.item.name}`}</b>
                                    }
                                    <b>{`${item.quantity}`}</b>
                                    <b>{`${(item.quantity) * (item.item.disc_price)}`}</b>
                                  </div>
                                );
                              })
                            }
                            <div className="flex items-center justify-around w-100 mt2 bt ">
                              <b>Total</b>
                              <b>{`${totalQuantity}`}</b>
                              <b>{`${onlineTotal}`}</b>
                            </div>
                          </div>
                          <p className=" tc">
                            This items are not eligible for Cash on Delivery. You have to pay
                            <b className="red">{`Rs. ${onlineTotal} online.`}</b>
                          </p>
                        </div>
                      )
                      : (
                        <div>
                          <p className="tc">{`On confirming, you have to pay Rs. ${totalPrice} on delivery.`}</p>
                        </div>
                      )
                  }
                  </div>
                )
            }
          </DialogContent>
          <DialogActions>

            <div>
              <button
                className="b color-btn"
                onClick={() => this.confirmOrder(true)}
                style={{ position: 'relative', backgroundColor: secondaryColor, color: fontColor }}
                type="button"
              >
                {
                    onlineItems.length !== 0
                      ? (
                        <p className="mt0 mb0">{`Pay Rs. ${onlineTotal === 0 ? totalPrice : onlineTotal} online`}</p>
                      )
                      : (
                        <p className="mt0 mb0">Confirm Order</p>
                      )

                  }
              </button>
            </div>
            <button className="b btn" type="button" onClick={() => this.togelConfirmOrderModal(this.paymentMode)}>
              Cancel
            </button>
          </DialogActions>
        </Dialog>

      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  routingLocation: state.router.location,
  cartItems: state.HomePageReducers.cartItems,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,
  publicPageUser: state.HomePageReducers.publicPageUser,
  publicPageShopDetails: state.HomePageReducers.publicPageShopDetails,

});

const mapDispatchToProps = (dispatch) => ({
//   addToCart: (product) => dispatch({ type: ADD_TO_CART, payload: product }),
//   removeFromCart: (product) => dispatch({ type: REMOVE_FROM_CART, payload: product }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Payment);
