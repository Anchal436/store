/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';
import 'tachyons';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './styles.css';

import { store } from '../../../store';
import agent from '../../../agent';
import {
  GET_NOT_DELIVERED_SOLD_PRODUCTS, GET_DELIVERED_SOLD_PRODUCTS,
} from '../../../constants/actionTypes';
import Loader from '../../../common/Components/Loader';
import CollapseTransition from '../../../common/Components/CollapseTransition';
import TextArea from '../../../common/Components/TextArea';
import WaterMark from '../../../common/Components/WaterMark';
import CreateShipment from './CreateShipment';


const available_status = ['Order Processed', 'Order Confirmed', 'Shipped', 'Delivered'];

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function formatDate(date) {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const current_datetime = new Date(date);
  const formatted_date = `${current_datetime.getDate()}-${months[current_datetime.getMonth()]}-${current_datetime.getFullYear()}`;

  return formatted_date;
}

class SoldOrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isRefundOrder: false,
      user: {},
      isSoldProductDetailsDialogOpen: false,
      error: '',
      nextStatusIndex: 1,
      isRefundPaymentDialogOpen: false,
      deliveryPossible: true,
      reason: '',
      isResellingCart: false,
    };
    this.togelIsRefundPaymentDialogOpen = this.togelIsRefundPaymentDialogOpen.bind(this);
    this.togelIsSoldProductDetailsDialogOpen = this.togelIsSoldProductDetailsDialogOpen.bind(this);
    this.refundPayment = this.refundPayment.bind(this);
  }

  componentWillMount() {
    // console.log(this.props);
    const { user, order } = this.props;
    if (user && user.user) {
      this.setState({ user: user.user });
    }
    if (order) {
      if (user && user.user) {
        if (order.reseller && order.reseller === user.user.seller_id) {
          this.setState({ isResellingCart: true });
        } else {
          this.setState({ isResellingCart: false });
        }
      }
      if (order.status.toLowerCase().includes('refund') || order.status.toLowerCase().includes('cancel')) {
        this.setState({ isRefundOrder: true });
      } else {
        let nextStatusIndex = 0;
        let deliveryPossible = false;
        available_status.map((s, i) => {
          if (s === order.status) {
            nextStatusIndex = i + 1;
            deliveryPossible = i < available_status.length - 2;
          }
        });
        this.setState({
          order, isRefundOrder: false, nextStatusIndex, deliveryPossible,
        });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    if (np.user) {
      if (this.state.user !== np.user.user) {
        const temp = np.user.user.user_type === 'normal';
        this.setState({ user: np.user.user, loading: false, isNormalUser: temp });
      }
    }
    if (np.order && np.user) {
      if (np.user && np.user.user) {
        if (np.order.reseller && np.order.reseller === np.user.user.seller_id) {
          this.setState({ isResellingCart: true });
        } else {
          this.setState({ isResellingCart: false });
        }
      }
      if (np.order.status.toLowerCase().includes('refund') || np.order.status.toLowerCase().includes('cancel')) {
        this.setState({ isRefundOrder: true });
      } else {
        let nextStatusIndex = 0;
        let deliveryPossible = false;
        available_status.map((s, i) => {
          if (s === np.order.status) {
            nextStatusIndex = i + 1;
            deliveryPossible = i < available_status.length - 2;
          }
        });
        this.setState({
          order: np.order, isRefundOrder: false, nextStatusIndex, deliveryPossible,
        });
      }
    }
    if (np.routingLocation && np.order) {
      if (np.routingLocation.query) {
        const { soldProduct, refundPayment } = np.routingLocation.query;

        this.setState({ isSoldProductDetailsDialogOpen: soldProduct === `${np.order.id}`, isRefundPaymentDialogOpen: refundPayment === `${np.order.id}` });
      }
    }
  }

  togelIsSoldProductDetailsDialogOpen() {
    const { isSoldProductDetailsDialogOpen, order } = this.state;
    const path = '';
    if (isSoldProductDetailsDialogOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&soldProduct=${order.id}`
        : `${window.location.pathname}?soldProduct=${order.id}`;
      store.dispatch(push(path));
    }
  }

  togelIsRefundPaymentDialogOpen() {
    const { isRefundPaymentDialogOpen, order } = this.state;
    let path = '';
    if (isRefundPaymentDialogOpen) {
      path = window.location.pathname;
      store.dispatch(goBack());
    } else {
      path = `${window.location.pathname}?refundPayment=${order.id}`;
      store.dispatch(push(path));
    }
  }

  refundPayment() {
    const { order, reason } = this.state;

    if (!reason || reason === '') {
      this.setState({ error: 'Reason of cancelling delivery is required!!!' });
      return;
    }
    // console.log('initiating refund', data);

    this.setState({ loading: true });
    const data = { order_id: order.order_id, reason };
    agent.SoldProducts.initiateRefund(data).then((res) => {
      // console.log(res);
      const {
        setNotDeliveredSoldProducts, notDeliveredSoldProducts, notDeliveredProductsPageCount,
      } = this.props;
      const updatedOrder = { ...order, status: 'Refund initiated' };
      this.setState({ order: updatedOrder, loading: false });
      this.togelIsRefundPaymentDialogOpen();
      const temp = notDeliveredSoldProducts.map((p) => {
        if (p.id === updatedOrder.id) {
          return updatedOrder;
        }
        return p;
      });
      setNotDeliveredSoldProducts({ orders: temp, num_count: notDeliveredProductsPageCount });
    }).catch((err) => {
      console.log(err, err.response);
      this.setState({ loading: false });
      if (err.response.data) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Error ocurred in initiating refund!!! ');
      }
    });
  }

  progressDelivery(status) {
    const { order } = this.state;
    const data = {
      item_id: order.id,
      status,
    };
    this.setState({ loading: true });
    agent.SoldProducts.updateOrderStatus(data).then((res) => {
      // console.log(res);
      const {
        deliveredSoldProducts, setDeliveredSoldProducts, setNotDeliveredSoldProducts, notDeliveredSoldProducts, deliveredProductsPageCount, notDeliveredProductsPageCount,
      } = this.props;
      if (res.data.item.status === available_status[available_status.length - 1]) {
        this.setState({ order: res.data.item });
        this.togelIsSoldProductDetailsDialogOpen();
        let temp = notDeliveredSoldProducts.filter((p) => (p.id !== res.data.item.id));
        setNotDeliveredSoldProducts({ orders: temp, num_count: notDeliveredProductsPageCount });

        temp = [...deliveredSoldProducts, res.data.item];
        temp.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA;
        });
        setDeliveredSoldProducts({ orders: temp, num_count: deliveredProductsPageCount });
      } else {
        this.setState({ order: res.data.item });
        const temp = notDeliveredSoldProducts.map((p) => {
          if (p.id === res.data.item.id) {
            return res.data.item;
          }
          return p;
        });
        setNotDeliveredSoldProducts({ orders: temp, num_count: notDeliveredProductsPageCount });
      }

      this.setState({ loading: false });
    }).catch((err) => {
      console.log(err, err.response);
      if (err.reponse) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Error orccured in updating status!!!');
      }
      this.setState({ loading: false });
    });
  }

  renderCartContents(items) {
    const {
      order,
    } = this.state;
    const {
      shipping_charges,
    } = order;
    let totalQuantity = 0;
    let totalPrice = Number(shipping_charges);

    return (

      <table className="cart-details-cart-item ">
        <tr className="total">
          <th className="order-header">Product</th>
          <th>Size</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>

        {
            items.map((c, i) => {
              totalQuantity += c.meta_data.quantity;
              const header = `${c.order.name}`;

              let size = {};
              if (c.meta_data.size && c.order && c.order.sizes) {
                [size] = c.order.sizes.filter((s) => s && s.id === c.meta_data.size);

                if (size) {
                  totalPrice += (c.meta_data.quantity * size.disc_price);
                } else {
                  size = { price: c.order.price, disc_price: c.order.disc_price };
                  totalPrice += (c.meta_data.quantity * c.order.disc_price);
                }
              } else {
                size = { price: c.order.price, disc_price: c.order.disc_price };
                totalPrice += (c.meta_data.quantity * c.order.disc_price);
              }
              return (
                <tr className="cart-details-cart-item" key={c.order.id}>
                  <td className="order-header">
                    <div className="flex items-center" onClick={() => { this.setState({ visibleIndex: this.state.visibleIndex === c.order.id ? -1 : c.order.id }); }}>
                      <h3>{header}</h3>
                      <ExpandMoreIcon />
                    </div>
                    <CollapseTransition visible={this.state.visibleIndex === c.order.id}>
                      <div className="details">
                        <small>{`price: ${size.price} Rs.`}</small>
                        <br />
                        <small>{`Discounted Price: ${size.disc_price} Rs.`}</small>
                        <br />
                        <small>{`Description: ${c.order.description} `}</small>
                      </div>
                    </CollapseTransition>
                  </td>
                  <td>{size.size}</td>
                  <td>{c.meta_data.quantity}</td>
                  <td>{size.disc_price}</td>
                </tr>
              );
            })
        }
        <tr className="cart-details-cart-item">
          <td className="order-header">Shipping Charges</td>
          <td />
          <td />
          <td>{shipping_charges}</td>

        </tr>
        <tr className="cart-details-cart-item total">
          <td className="order-header">Total</td>
          <td />
          <td>{totalQuantity}</td>
          <td>{totalPrice}</td>

        </tr>
      </table>

    );
  }

  render() {
    const {
      isResellingCart, loading, order, isSoldProductDetailsDialogOpen, nextStatusIndex, isRefundPaymentDialogOpen, error, isRefundOrder, deliveryPossible, reason,
    } = this.state;
    const {
      amount, cod, items, meta_data, paid, status, created_at, order_id, tracking_number, resell_margin,
      reseller,
    } = order;
    const { user_details } = meta_data;

    return (
      <div className="relative">
        <div className="sold-product-div relative pointer " onClick={this.togelIsSoldProductDetailsDialogOpen.bind(this)}>
          <div className="bb w-100 flex items-center justify-between">
            <p>
              <b>
                {`${formatDate(created_at)}`}
              </b>
            </p>
            <p className="green b">
              {`${status}`}
            </p>
          </div>

          <div className=" flex items-center   w-100 " style={{ justifyContent: 'space-between', padding: '0 10px' }}>
            <div className=" buyer-details">
              <b>Buyer Details :  </b>
              <p>
                {`${user_details.name}`}
              </p>
              <p>
                {`${user_details.number}`}
              </p>
            </div>
            {
              isResellingCart ? (
                <div className="cart-details tc">
                  <p className="b">Your Commision</p>
                  <b>{`${resell_margin} Rs.`}</b>
                  {
                reseller
                  ? (
                    <small className="red">{` Cart Value : Rs.${amount} `}</small>
                  )
                  : null
              }
                </div>
              ) : (
                <div className="cart-details tc">
                  <p className="b"> Cart Value</p>
                  <b>{`${amount} Rs.`}</b>
                  {
                reseller
                  ? (
                    <small className="red">{` Rs.${resell_margin} Reseller commision`}</small>
                  )
                  : null
              }
                </div>
              )
            }

          </div>
          {
            isResellingCart
              ? <WaterMark message="Reselling Cart" fontSize="20px" />
              : null
          }

        </div>
        <Dialog
          open={isSoldProductDetailsDialogOpen}
          TransitionComponent={Transition}
          fullScreen
          onClose={this.togelIsSoldProductDetailsDialogOpen.bind(this)}
        >

          {
            isResellingCart
              ? <WaterMark message="Reselling Cart" fontSize="100px" />
              : null
          }
          <div className="dialog-details-top-bar">
            <h2>Order Details</h2>
            <button type="button" onClick={this.togelIsSoldProductDetailsDialogOpen.bind(this)}>GO BACK</button>

          </div>
          <DialogContent>
            <div className="dyna-flex bb justify-around">
              <p className=" flex-wrap mt0 mb0" style={{ overflowWrap: 'break-word' }}>
                <b>Order ID :</b>
                {` ${order_id}`}
              </p>
              <p className=" mt0 mb0">
                <b>Order Date :</b>
                {`${formatDate(created_at)}`}
              </p>
            </div>
            {
              tracking_number
                ? (
                  <div className="dyna-flex bb justify-center tc">
                    <b>Track Your order :  </b>
                    <a className=" mt0 mb0" href={`https://shiprocket.co/tracking/${tracking_number}`} target="_blank" style={{ overflowWrap: 'break-word' }}>
                      {`https://shiprocket.co/tracking/${tracking_number}`}
                    </a>
                  </div>
                )
                : null
            }
            <div className="flex  justify-around items-center">
              <h4 className=" ">Order Summary</h4>

            </div>
            <div className="sold-product-details-order-summary">
              {this.renderCartContents(items)}
            </div>
            <div className="dyna-flex bb bt mt2 justify-around pt2 pb2 ">
              <h4 className="mt0 mb0">{`Payment Mode : ${cod ? 'cash on delivery' : 'online'}` }</h4>

              <h4 className="mt0 mb0">{`Product Status : ${status}` }</h4>
            </div>
            {
              reseller
                ? (
                  <div className="dyna-flex bb mt2 justify-around pt2 pb2 ">
                    <h4 className="mt0 mb0 red">
                      {isResellingCart
                        ? `This Product is sold by your website you will get Rs.${resell_margin} on this cart after completion of delivery.`
                        : `This Product is sold by One of a Reseller with comission of Rs.${resell_margin} on this cart.`}
                    </h4>
                  </div>
                )
                : null
            }

            <div className="dyna-flex bb justify-around">
              <div className="buyer-details">
                <b>Buyer Details:</b>
                <p>
                  {`Customer Name : ${user_details.name}`}
                </p>
                <p>
                  {`Customer phone number: ${user_details.number}`}
                </p>
                <p>
                  {`Customer email : ${user_details.email}`}
                </p>
              </div>
              <div className="buyer-details">
                <b>Delivery Address: </b>
                <p>
                  {`Customer Address : ${user_details.apartment},${user_details.address}, ${user_details.pincode} `}
                </p>
                <p>
                  {`Customer City : ${user_details.city}`}
                </p>
                <p>
                  {`Customer State : ${user_details.state}`}
                </p>
                <p>
                  {`Customer Country : ${user_details.country}`}
                </p>
              </div>

              <p className="err-txt">{`${error}`}</p>
            </div>
          </DialogContent>
          <DialogActions>
            {
              isResellingCart
                ? <button type="button" className="w-100 color-btn ">{`Your commision Rs.${resell_margin}`}</button>
                : (
                  <>
                    {
                      isRefundOrder ? (
                        <button type="button" className="w-100 color-btn bg-red"> Delivery is cacelled </button>
                      )
                        : (
                          <>
                            {
                              nextStatusIndex <= available_status.length - 1
                                ? (
                                  <div className="flex  justify-around w-100 ">
                                    <button type="button" className="w-70 ml1 mr1  color-btn" onClick={() => this.progressDelivery(available_status[nextStatusIndex])}>
                                      {`Mark as ${available_status[nextStatusIndex]}`}
                                    </button>
                                    {
                                      !isRefundOrder && nextStatusIndex < available_status.length - 2 && !tracking_number
                                        ? (
                                          <button className="green-btn " type="button" onClick={this.togelIsRefundPaymentDialogOpen}>
                                            Cancel Delivery
                                          </button>
                                        )
                                        : null
                                    }
                                  </div>
                                )
                                : <button type="button" className="w-100 color-btn">Product Delivered </button>
                            }
                          </>
                        )
                      }
                  </>
                )
            }


          </DialogActions>
          {
            loading
              ? <Loader />
              : null
        }
          {
          deliveryPossible && !tracking_number && !isResellingCart
            ? <CreateShipment order={order} user_details={user_details} />
            : null
        }

        </Dialog>
        <Dialog
          name="Refund Payment Dialog"
          open={isRefundPaymentDialogOpen}
          onClose={this.isRefundPaymentDialogOpen}
        >
          <DialogTitle>
            Refund Payment
          </DialogTitle>
          <DialogContent>
            <div className="tc">
              <b>
              Are you sure you want to Cancel Delivery?
              </b>
              <br />
              <b className="green"> You cannot revert back after Cancelling Delivery.</b>

              <TextArea
                label="Reason to cancelling order"
                value={reason}
                type="text"
                className="w-100"
                onTextChange={(text) => this.setState({ reason: text })}
                rows={4}
              />
              {error && <p className="err-txt">{error}</p>}
            </div>
          </DialogContent>
          <DialogActions>
            <button className="color-btn" type="button" onClick={this.refundPayment}>
              Cancel Delivery
            </button>
            <button className="btn" type="button" onClick={this.togelIsRefundPaymentDialogOpen}>
              Cancel
            </button>
          </DialogActions>

          {
            loading
              ? <Loader />
              : null
        }
        </Dialog>
      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  notDeliveredSoldProducts: state.SoldProductsReducers.notDeliveredSoldProducts,
  deliveredSoldProducts: state.SoldProductsReducers.deliveredSoldProducts,
  deliveredProductsPageCount: state.SoldProductsReducers.deliveredProductsPageCount,
  notDeliveredProductsPageCount: state.SoldProductsReducers.notDeliveredProductsPageCount,
  routingLocation: state.router.location,

});

const mapDispatchToProps = (dispatch) => ({
  setNotDeliveredSoldProducts: (notDeliveredSoldProducts) => dispatch({ type: GET_NOT_DELIVERED_SOLD_PRODUCTS, payload: notDeliveredSoldProducts }),
  setDeliveredSoldProducts: (deliveredSoldProducts) => dispatch({ type: GET_DELIVERED_SOLD_PRODUCTS, payload: deliveredSoldProducts }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SoldOrderDetails);
