/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlareIcon from '@material-ui/icons/Flare';
import 'tachyons';
import './styles.css';
import {

} from '../../../constants/actionTypes';
import CreateProduct from './CreateProduct';
import Image from '../../../common/Components/Image';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: { },
      user: {},
      stockAvailable: true,
    };
  }

  componentWillMount() {
    const { data, user } = this.props;
    if (data) {
      if (user.user) {
        if (data.user === user.user.id) this.setState({ product: data, isResellingProduct: false });
        else this.setState({ product: data, isResellingProduct: true });
      }
      if (data.sizes_available) {
        this.setState({ product: data, isSizesAvailable: data.sizes_available });
        this.setMinMaxPrice(data.sizes);
      } else {
        this.setState({ stockAvailable: data.stock > 0, isSizesAvailable: false });
      }

      // this.setState({ product: data });
    }
    if (user && user.user) {
      this.setState({ user: user.user });
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { user, product } = this.state;
    if (np.data && np.data !== product) {
      if (np.user.user) {
        if (np.data.user === np.user.user.id) {
          this.setState({ product: np.data, isResellingProduct: false });
        } else {
          this.setState({ product: np.data, isResellingProduct: true });
        }
        if (np.data.sizes_available) {
          this.setState({ product: np.data, isSizesAvailable: np.data.sizes_available });
          this.setMinMaxPrice(np.data.sizes);
        } else {
          this.setState({ stockAvailable: np.data.stock > 0, isSizesAvailable: false });
        }
      }
    }
    if (np.user && np.user.user && np.user.user !== user) {
      this.setState({ user: np.user.user });
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

  render() {
    const {
      isResellingProduct, product, minPrice, maxPrice, isSizesAvailable, stockAvailable,
    } = this.state;
    const {
      name, disc_price, price, images, preview_images, resell_margin, feature_product,
    } = product;

    return (
      <div className="admin-product relative" style={this.props.style}>
        {
          isResellingProduct
            ? (
              <div className="resell-div">
                {`Your margin ${resell_margin} Rs.`}
              </div>
            )
            : null
        }
        <div className="product-header-img" style={{ overflow: 'hidden', position: 'relative' }}>
          {
           images && images.length > 0
             && <Image src={images[0]} alt="" overlaySrc={preview_images[0]} />
          }
        </div>
        <div className="product-pricing">
          <h3>
            {name}
          </h3>
          {
           !isSizesAvailable ? (
             disc_price === price
               ? (
                 <b>{`Rs. ${price}`}</b>
               )
               : (
                 <div>
                   <b>{`Rs. ${disc_price}`}</b>
                   <strike>{` Rs. ${price}`}</strike>
                 </div>
               )
           ) : (
             minPrice !== maxPrice
               ? (
                 <b className="green">
                   {`Rs. ${minPrice} ~ Rs. ${maxPrice}`}
                 </b>
               )
               : (
                 <b className="green">{`Rs.${maxPrice}`}</b>
               )
           )
          }
          {

          }
        </div>

        <CreateProduct data={product} update isResellingProduct={isResellingProduct} isOwnProduct />
        {
            !stockAvailable
              ? (
                <div style={{
                  background: 'rgba(0,0,0,0.4)', width: '100%', height: '100%', color: 'white', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none',
                }}
                >
                  <h3>Out Of Stock</h3>
                </div>
              )
              : null
        }
        {
          images && images.length === 0
            && (
              <div style={{
                background: 'rgba(0,0,0,0.4)', width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none', padding: '5px',
              }}
              >
                <p className="b white"> This product will not be visible in your website and marketplace, because it is not having any images. </p>
                <button className="color-btn" type="button">Add Images</button>
              </div>
            )
        }
        {
          feature_product && (
            <div className="feature-icon">
          <FlareIcon />
        </div>
          )
        }
        
      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Product);
