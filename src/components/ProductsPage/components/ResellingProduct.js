/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { Carousel } from 'react-responsive-carousel';
import { toast } from 'react-toastify';
import { push } from 'react-router-redux';
import ShowMoreText from 'react-show-more-text';

import { store } from '../../../store';
import './MarketPlace.css';
// import ZoomImage from '../../../common/Components/ZoomImage';
import Image from '../../../common/Components/Image';
import Loader from '../../../common/Components/Loader';
import CollapseTransition from '../../../common/Components/CollapseTransition';
import TextInput from '../../../common/Components/TextInput';
import {
  GET_RESELLING_PRODUCTS, SET_PRODUCTS, SET_PUBLIC_PAGE_PRODUCTS, SET_RESELLING_PRODUCTS,
} from '../../../constants/actionTypes';
import { APP_NAME, ERROR_MSG } from '../../../constants/otherConstants';
import agent from '../../../agent';
import defaultLogo from '../../../assets/Images/instalink_logo.png';
import CreateProduct from './CreateProduct';

class ResellingProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: { product: {}, seller: {} },
      loading: false,
      user: {},
      minDiscPrice: 0,
      maxDiscPrice: 0,
      isSizesAvailable: false,
      isOwnProduct: false,
      maxMargin: 0,
      showResellMarginInput: false,
      resellMarginInputValue: 0,
    };
    this.chooseProduct = this.chooseProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }

  componentDidMount() {
    const { product, user } = this.props;
    if (product) {
      if (user && user.user) {
        if (product.user === user.user.id) {
          this.setState({ product, isOwnProduct: true, maxMargin: product.price - product.disc_price });
        } else {
          this.setState({ product, isOwnProduct: false, maxMargin: product.price - product.disc_price });
        }
      }
      if (product.sizes_available) {
        this.setState({ isSizesAvailable: product.sizes_available });
        this.setMinMaxDiscPrice(product.sizes);
      }
    }
    if (user && user.user) {
      this.setState({ user: user.user });
    }
  }

  componentWillReceiveProps(np) {
    const { product, user } = this.props;
    if (np.user && np.user.user !== user) {
      this.setState({ user: np.user.user });
    }

    if (np.product && np.product !== product) {
      if (np.user && np.user.user) {
        if (np.product.user === np.user.user.id) {
          this.setState({ product: np.product, isOwnProduct: true, maxMargin: np.product.price - np.product.disc_price });
        } else {
          this.setState({ product: np.product, isOwnProduct: false, maxMargin: np.product.price - np.product.disc_price });
        }
        if (np.product && np.product.sizes_available) {
          this.setState({ isSizesAvailable: np.product.sizes_available });
          this.setMinMaxDiscPrice(np.product.sizes);
        }
      }
    }
  }

  setMinMaxDiscPrice(sizes) {
    if (!sizes || sizes.length <= 0) {
      this.setState({ minDiscPrice: 0, maxDiscPrice: 0 });
      return;
    }
    if (!sizes[0].price) return;
    let minDiscPrice = sizes[0].disc_price;
    let minPrice = sizes[0].price;
    let maxDiscPrice = sizes[0].disc_price;
    let stockAvailable = false;
    sizes.forEach((p) => {
      minDiscPrice = Math.min(p.disc_price, minDiscPrice);
      minPrice = Math.min(p.price, minPrice);
      maxDiscPrice = Math.max(p.disc_price, maxDiscPrice);
      stockAvailable = stockAvailable || p.stock > 0;
    });
    this.setState({
      minDiscPrice, maxDiscPrice, stockAvailable, maxMargin: minPrice - minDiscPrice,
    });
  }

  chooseProduct() {
    const { product, resellMarginInputValue, maxMargin } = this.state;
    const { id } = product;
    if (resellMarginInputValue > maxMargin) {
      this.setState({ error: `Your margin should be between 0 and ${maxMargin}` });
      return;
    }
    const data = {
      product_id: id,
      resell_margin: resellMarginInputValue ? Number(resellMarginInputValue) : 0,
    };
    const {
      products, setProducts, publicPageProducts, setPublicPageProducts, chosenCategory, publicPageChosenCategory, setResellingProducts, resellingProducts,
    } = this.props;
    this.setState({ loading: true });

    agent.ProductsPage.addResaleProductToShop(data).then((res) => {
      toast.info('Product Added to Resell');
      this.setState({
        loading: false, resellMarginInputValue: 0, showResellMarginInput: false, error: '',
      });
      const tempresellingProducts = resellingProducts.map((p) => {
        if (p.id === product.id) {
          return { ...p, added: true, resell_margin: Number(resellMarginInputValue) };
        }
        return p;
      });
      setResellingProducts({ products: tempresellingProducts });
      if (products) {
        if (!chosenCategory || chosenCategory === product.category.name) {
          let tempProduct = {};
          if (product.sizes_available) {
            const tempSizes = product.sizes.map((s) => ({
              ...s, disc_price: s.disc_price + Number(resellMarginInputValue),
            }));
            tempProduct = { ...product, sizes: tempSizes };
          } else {
            tempProduct = { ...product, disc_price: product.disc_price + Number(resellMarginInputValue) };
          }
          setProducts({ products: [tempProduct, ...products] });
        }
      }
      if (publicPageProducts) {
        if (!publicPageChosenCategory || publicPageChosenCategory === product.category.name) {
          let tempProduct = {};
          if (product.sizes_available) {
            const tempSizes = product.sizes.map((s) => ({
              ...s, disc_price: s.disc_price + Number(resellMarginInputValue),
            }));
            tempProduct = { ...product, sizes: tempSizes };
          } else {
            tempProduct = { ...product, disc_price: product.disc_price + Number(resellMarginInputValue) };
          }
          setPublicPageProducts({ products: [tempProduct, ...publicPageProducts] });
        }
      }
    }).catch((err) => {
      this.setState({ loading: false, error: '' });
      console.log(err, err.response);
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
    });
  }

  removeProduct() {
    const { product } = this.state;
    const { id } = product;
    const data = {
      product_id: id,
    };
    const {
      products, setProducts, publicPageProducts, setPublicPageProducts, resellingProducts, setResellingProducts,
    } = this.props;
    this.setState({ loading: true });
    agent.ProductsPage.removeResaleProductToShop(data).then(() => {
      toast.info('Product Removed from Resell');
      this.setState({ loading: false });
      if (resellingProducts) {
        const tempresellingProducts = resellingProducts.map((p) => {
          if (p.id === product.id) {
            return { ...p, added: false, resell_margin: 0 };
          }
          return p;
        });
        setResellingProducts({ products: tempresellingProducts });
      }
      if (products) {
        const temp = products.filter((p) => p.id !== product.id);
        setProducts({ products: temp });
      }
      if (publicPageProducts) {
        const temp = publicPageProducts.filter((p) => p.id !== product.id);
        setPublicPageProducts({ products: temp });
      }
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err, err.response);
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
    });
  }

  showProductDetails() {
    const { product } = this.state;
    const path = window.location.search ? `${window.location.pathname}${window.location.search}&createProduct=${product.id}`
      : `${window.location.pathname}?createProduct=${product.id}`;
    store.dispatch(push(path));
  }

  render() {
    const {
      loading, isOwnProduct, minDiscPrice, maxDiscPrice, isSizesAvailable, maxMargin, showResellMarginInput, resellMarginInputValue, error, product,
    } = this.state;

    const {
      description, disc_price, images, name, preview_images, shipping_charges, seller, added, resell_margin,
    } = product;

    if (!isOwnProduct && images && images.length === 0) {
      return null;
    }
    return (
      <div className="reselling-product-div relative">
        {
          images && images.length === 0
            && (
              <div style={{
                background: 'rgba(0,0,0,0.6)', width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none', textAlign: 'center', display: 'grid', placeItems: 'center', zIndex: '5',
              }}
              >
                <h3 className="b white"> This product will not be visible in marketplace to other resellers, because it is not having any images. </h3>
                <button className="color-btn" type="button">Add Images</button>
              </div>
            )
        }

        <div className="relative">

          <div className="product-header">
            {
              seller ? (
                <div className="seller-div">
                  <div className="seller-logo">
                    <img src={seller.header_icon || defaultLogo} alt="" />
                  </div>
                  <div className="seller-name">
                    {seller.header_text || APP_NAME}
                  </div>
                </div>
              )
                : null
            }

            {
              resell_margin && resell_margin > 0 ? (
                <div className="margin your-margin">
                  {`Your Margin: ${resell_margin} Rs`}
                </div>
              ) : (
                <div className="margin">
                  {`Maximum Margin: ${maxMargin} Rs`}
                </div>
              )
            }

          </div>
          <div className="product-img-carousel">

            <Carousel className="" style={{ background: 'white' }} showArrows showIndicators={false} showThumbs={false}>
              { images && images.map((img, i) => (
                <button type="button" onClick={() => this.showProductDetails()}>
                  <Image src={img} alt="" overlaySrc={preview_images[i]} key={i} />
                </button>
              ))}

            </Carousel>

          </div>
          <div className="product-footer relative">
            <div className="content">
              <b>{name}</b>
              {
                !isSizesAvailable ? (
                  <p>{`Rs.${disc_price} + Rs. ${shipping_charges} (Delivery charges)`}</p>
                ) : (
                  minDiscPrice !== maxDiscPrice
                    ? (
                      <p>
                        {`Rs. ${minDiscPrice} ~ Rs.${maxDiscPrice} + Rs. ${shipping_charges} (Delivery charges)`}
                      </p>
                    )
                    : (
                      <p>{`Rs.${maxDiscPrice} + Rs. ${shipping_charges} (Delivery charges)`}</p>
                    )
                )
              }
              <ShowMoreText
                lines={2}
                more="See more"
                less="See less"
                anchorClass="show-more"
                expanded={false}
                width={250}
              >
                {description}
              </ShowMoreText>
            </div>
            <CreateProduct data={product} update isResellingProduct={!isOwnProduct} isOwnProduct={added || isOwnProduct} chooseForReselling={this.chooseProduct} />
          </div>

        </div>

        <div className="buttons">
          {
            isOwnProduct
              ? (
                <button type="button" className="relative own-product b">
                  This is your product
                </button>
              )
              : (
                <>
                  {
                    added
                      ? (
                        <button type="button" className="relative remove b" onClick={this.removeProduct}>
                          Remove product
                        </button>
                      )
                      : (
                        resellMarginInputValue > 0 ? (
                          <button type="button" className="relative b" onClick={this.chooseProduct}>
                            Resell Product
                          </button>
                        )
                          : (
                            <button type="button" className="relative b" onClick={() => this.setState({ showResellMarginInput: !showResellMarginInput, error: '' })}>
                              Resell this product
                            </button>
                          )

                      )
                  }
                </>
              )
          }
        </div>
        <CollapseTransition visible={showResellMarginInput}>
          <div>
            <TextInput label="Add Your Margin on top of the Product Price(in Rs.)" value={resellMarginInputValue} type="number" className="w-100 tc" onTextChange={(text) => this.setState({ resellMarginInputValue: text, error: '' })} required />
            { error && <p className="err-txt">{error}</p> }
          </div>
        </CollapseTransition>
        {
            loading
              ? <Loader />
              : null
        }

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  products: state.ProductsPageReducers.products,
  productsPageNum: state.ProductsPageReducers.productsPageNum,
  publicPageProducts: state.HomePageReducers.publicPageProducts,
  chosenCategory: state.ProductsPageReducers.chosenCategory,
  publicPageChosenCategory: state.HomePageReducers.publicPageChosenCategory,
  resellingProducts: state.ProductsPageReducers.resellingProducts,
});

const mapDispatchToProps = (dispatch) => ({
  getResellingProducts: (pageNumber) => dispatch({ type: GET_RESELLING_PRODUCTS, pageNumber, payload: agent.ProductsPage.getResellingProducts(pageNumber) }),
  setResellingProducts: (products) => dispatch({ type: SET_RESELLING_PRODUCTS, payload: products }),
  setProducts: (products) => dispatch({ type: SET_PRODUCTS, payload: products }),
  setPublicPageProducts: (products) => dispatch({ type: SET_PUBLIC_PAGE_PRODUCTS, payload: products }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResellingProduct);
