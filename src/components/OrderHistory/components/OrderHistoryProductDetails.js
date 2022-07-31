/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import './styles.css';
import _ from 'lodash';
import Product from './Product';
import {
  REMOVE_FROM_CART, ADD_TO_CART,
} from '../../../constants/actionTypes';


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      loading: false,
      open: false,
      images: [],
      alreadyInCart: false,
      user: {},
    };
    this.cartItems = [];
  }

  componentWillMount() {
    if (this.props.cartItems) {
      this.cartItems = this.props.cartItems;
      this.setState({ render: !this.state.render });
    }
    if (this.props.publicPageUser) {
      this.setState({ user: this.props.publicPageUser });
    }
    if(this.props.orderId){
      this.setState({orderId:this.props.orderId})
    }
  }

  componentWillReceiveProps(np) {
    if (np.data && np.data !== this.state.product) {
      this.setState({ product: np.data });
    }
    if (np.publicPageUser) {
      this.setState({ user: np.publicPageUser });
    }
    if (np.cartItems) {
      this.cartItems = np.cartItems;
      this.setState({ render: !this.state.render });
    }
    if(np.orderId){
      this.setState({orderId:np.orderId})
    }
  }

  togelDialog() {
    this.setState({ open: !this.state.open });
  }

  renderCartContents(items) {
    let totalQuantity = 0;
    let totalPrice = 0;
    return (
      <div>
        <div className="cart-details-cart-item total">
          <h3>Product</h3>
          <h3>Quantity</h3>
          <h3>Price</h3>
        </div>
        {
            items.map((c, i) => {
              totalPrice += (c.meta_data.quantity * c.order.disc_price);
              totalQuantity += c.meta_data.quantity;
              let header = `${c.order.name}`;
              if (c.meta_data.size) {
                header = `${header}( ${c.meta_data.size} )`;
              }
              return (
                <div className="cart-details-cart-item" key={c.order.id}>
                  <h3>{header}</h3>
                  <h3>{c.meta_data.quantity}</h3>
                  <h3>{c.order.disc_price}</h3>
                </div>
              );
            })
        }
        <div className="cart-details-cart-item total">
          <h3>Total</h3>
          <h3>{totalQuantity}</h3>
          <h3>{totalPrice}</h3>
        </div>
      </div>

    );
  }

  render() {
    const {
      open, user, orderId
    } = this.state;

    return (
      <div className="">

        <button className="hidden-btn" onClick={this.togelDialog.bind(this)}>
            open cart item
        </button>

        <Dialog fullScreen open={open} onClose={this.togelDialog.bind(this)} TransitionComponent={Transition}>
          <div className="cart-details-top-bar">
            <h2>My Order</h2>
            <button type="button" onClick={this.togelDialog.bind(this)}>
                  Close
            </button>
          </div>
          <div className="cart-details-cart-content" style={{ justifyContent: 'space-evenly' }}>
            <b style={{overflowWrap:'break-word'}} >{`Order id: ${orderId}`}</b>

            <div className="cart-details-content-image">
              <ShoppingCartIcon />
              <h2>Order Content</h2>
            </div>
            {
                this.cartItems.length === 0
                  ? <p className="tc">No items in cart Purchase some Items</p>

                  : (
                    <div>
                      <div style={{ justifyContent: 'space-evenly', display: 'flex', flexWrap: 'wrap ' }}>

                        {
                          this.cartItems.map((p, i) => (
                            <Product data={p.order} key={i} cartItem />
                          ))
                        }
                      </div>
                      <div className="cart-details-cart-table">
                        {
                          this.renderCartContents(this.cartItems)
                        }
                      </div>
                      <DialogActions>
                        <button className="color-btn cart-purchase-btn" onClick={this.togelDialog.bind(this)}> Close</button>
                      </DialogActions>
                    </div>
                  )
            }


          </div>

        </Dialog>

      </div>

    );
  }
}


const mapStateToProps = (state) => ({


});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);
