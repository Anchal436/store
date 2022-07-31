/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Carousel } from 'react-responsive-carousel';
import Slide from '@material-ui/core/Slide';
import { toast } from 'react-toastify';
import './styles.css';
import Image from '../../../common/Components/Image';

import {
  ADD_TO_CART, REMOVE_FROM_CART,
} from '../../../constants/actionTypes';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      loading: false,
      mobileView: false,
      isCreateProductDialog: false,
      alreadyInCart: false,
      user: {},
      product: { images: [] },
      images: [],
      quantity: 1,
      sizes:[],
      isSizesAvailable:false,
      selectedSize:"",
    };
    this.cartItems = [];
    this.togelIsCreateProductDialog = this.togelIsCreateProductDialog.bind(this);
  }

  componentWillMount() {
    if (this.props.data) {
      this.setState({ product: this.props.data });
      const { data } = this.props;
      if (data.meta_data && data.meta_data.sizes_available) {
        this.setState({ sizes: data.meta_data.sizes_available, isSizesAvailable: data.meta_data.sizes_available.length > 0 });
      }
    }
    if (this.props.cartItems ) {
      this.cartItems = this.props.cartItems;
      const temp = this.props.cartItems.filter((c) => c.item.id === this.props.data.id);
      if (temp.length > 0) {
        this.setState({ alreadyInCart: true, quantity: temp[0].quantity, selectedSize: temp[0].selectSize });
      } else {

        this.setState({ alreadyInCart: false, quantity: 1, selectedSize: ""});
      }
    }
  }

  componentWillReceiveProps(np) {
    if (np.data) {
      this.setState({ product: np.data });
      const data = np
      if (data.meta_data && data.meta_data.sizes_available) {
        this.setState({ sizes: data.meta_data.sizes_available, isSizesAvailable: data.meta_data.sizes_available.length > 0 });
      }
    }

    if (np.cartItems ) {
      this.cartItems = np.cartItems;
      const temp = np.cartItems.filter((c) => c.item.id === np.data.id);
      if (temp.length > 0) {
        this.setState({ alreadyInCart: true, quantity: temp[0].quantity, selectedSize: temp[0].selectSize });
      } else {
        this.setState({ alreadyInCart: false, quantity: 1, selectedSize: ""});
      }
    }
  }

  togelIsCreateProductDialog() {
    this.setState({ isCreateProductDialog: !this.state.isCreateProductDialog });
  }


  addToCart() {
    console.log(this.state)
    if (this.state.isSizesAvailable && this.state.selectedSize === '') {
      this.setState({ showSizes: true });
    } else {
      const data = {
        item: this.state.product,
        quantity: this.state.quantity,
        selectedSize: this.state.selectedSize
      };
      this.props.addToCart(data);
      this.setState({showSizes:false})
    }
  }

  removeProduct() {
    this.props.removeFromCart(this.state.product);
  }

  modifyQuantity(change) {
    if (this.state.quantity + change > 0) this.setState({ quantity: this.state.quantity + change });
  }
  selectSize(e) {
    console.log(e.target.value);
    this.setState({ selectedSize: e.target.value });
  }


  render() {
    const {
      name, images, price, disc_price, description, id, estimated_delivery, preview_images, cod_available
    } = this.state.product; 
    const { alreadyInCart, isCreateProductDialog, quantity,showSizes } = this.state;
    return (
      <div>

        <button
          className=" center  flex add-new-product "

          onClick={this.togelIsCreateProductDialog.bind(this)}
        >
              see Product details
        </button>

        <Dialog
          open={isCreateProductDialog}
          TransitionComponent={Transition}
          keepMounted

          fullScreen
          onClose={this.togelIsCreateProductDialog}


        >
          <div className="cart-details-top-bar">
            <h2>{name}</h2>
            <button type="button" onClick={this.togelIsCreateProductDialog.bind(this)}>
                  Close
            </button>
          </div>

          <DialogContent>
            <div className="product-details">
              <div className="product-details-top-div">
                <Carousel className="product-details-carousel" background="#000">
                  { images.map((img, i) =>  <Image src={img} alt="" overlaySrc={preview_images[0]} key={i} />)}
                </Carousel>
                <div className="cart-details-top-right-div">
                  <h1>{name}</h1>
                  <div className="product-pricing">

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

                      <b>
                        Rs.
                        {disc_price}
                      </b>
                      <strike>{` Rs. ${price}`}</strike>
                      <span className="product-details-product-sale">
                        {Math.floor(((price - disc_price) / price) * 100)}
%off
                      </span>
                    </div>
                  )
            }
                  </div>

                  <h4>
                    {`Esimated Delivery:${estimated_delivery} Days`}
                  </h4>
                  {
                    cod_available?
                    <p className='err-txt b' > {`Cash on delivery available`} </p>:
                    null
                  }
                  
                  <div className="product-add-to-cart-div">



                  </div>
                </div>
              </div>
              <div>
                <h4> Description : </h4>
                <p>{description}</p>
              </div>
            </div>
          </DialogContent>


        </Dialog>
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
