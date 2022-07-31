/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Slide from '@material-ui/core/Slide';
// import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';

import { store } from '../../../store';
import './styles.css';
import agent from '../../../agent';
import Loader from '../../../common/Components/Loader';
import DisabledDiv from '../../../common/Components/DisabledDiv';
import TextInput from '../../../common/Components/TextInput';
import TextArea from '../../../common/Components/TextArea';
import SelectImage from '../../../common/Components/SelectImage';
import Switch from '../../../common/Components/Switch';
import Image from '../../../common/Components/Image';
import CollapseTransition from '../../../common/Components/CollapseTransition';
import DropDownTextInput from '../../../common/Components/DropDownTextInput';
import {
  SET_PRODUCTS, GET_SHOP_DETAILS, SET_PUBLIC_PAGE_PRODUCTS, SET_RESELLING_PRODUCTS, GET_RESELLING_PRODUCTS, GET_FEATURED_PRODUCTS,
} from '../../../constants/actionTypes';
import {
  IS_COD_AVAILABLE, IS_ONLINE_PAYMENT_AVAILABLE, ESTIMATED_DELIVERY, DELIVERY_CHARGE, ERROR_MSG, BASE_URL, ADD_TO_MARKET_PLACE,
} from '../../../constants/otherConstants';

import copyCodeToClipboard from '../../../common/Components/copyText';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const availableSizes = [{ name: 'S' }, { name: 'M' }, { name: 'L' }, { name: 'XL' }, { name: 'XXL' }, { name: 'small' }, { name: 'medium' }, { name: 'large' }, { name: 'x-large' }, { name: 'xx-large' }, { name: 'XXXL' }, { name: 'xxx-large' }, { name: 'XS' }, { name: 'x-small' }, { name: '11 US' }, { name: '6 US' }, { name: '7 US' }, { name: '8 US' }, { name: '9 US' }, { name: '10 US' }, { name: '6 UK' }, { name: '7 UK' }, { name: '8 UK' }, { name: '9 UK' }, { name: '10 UK' }, { name: '11 UK' }, { name: '32"' }, { name: '34"' }, { name: '36"' }, { name: '38"' }, { name: '40"' }, { name: '42"' }];
class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      render: false,
      isCreateProductDialog: false,
      addImage: false,
      product: {
        images: [],
        cod_available: window.localStorage.getItem(IS_COD_AVAILABLE),
        estimated_delivery: window.localStorage.getItem(ESTIMATED_DELIVERY),
        online_available: window.localStorage.getItem(IS_ONLINE_PAYMENT_AVAILABLE),
        shipping_charges: window.localStorage.getItem(DELIVERY_CHARGE),
        opt_for_reselling: window.localStorage.getItem(ADD_TO_MARKET_PLACE),
      },
      isResellingProduct: false,
      addSizesVisibleForm: false,
      sizes: [],
      size: {},
      ourCommission: { cod: { percent: 0, extra: 0 }, online: { percent: 0, extra: 0 } },
      hideResult: true,
      isOwnProduct: false,
    };
    this.uploadingImagesIndex = [];
    this.uploadingImagesIndexError = [];
    this.uploadingImages = [];

    this.togelIsCreateProductDialog = this.togelIsCreateProductDialog.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.removeData = this.removeData.bind(this);
    this.removeResellingProduct = this.removeResellingProduct.bind(this);
    this.showLoader = this.showLoader.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.addSize = this.addSize.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      data, update, shopDetails, isResellingProduct, user, isOwnProduct,
    } = this.props;
    if (data) {
      const { meta_data } = data;
      if (meta_data && meta_data.sizes_available) {
        this.setState({ sizes: meta_data.sizes_available });
      }
      this.setState({
        product: { ...data, category: data.category ? data.category.name : null }, update, sizes: data.sizes || [], isOwnProduct,
      });
    }
    if (shopDetails) {
      this.setState({ ourCommission: shopDetails.commission, categories: shopDetails.categories });
    }
    if (user && user.user) {
      this.setState({ user });
    }
    if (isResellingProduct) {
      this.setState({ isResellingProduct });
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const {
      ourCommission, categories, update, isResellingProduct, isOwnProduct, isCreateProductDialog, product,
    } = this.state;

    if (np.data) {
      const { meta_data } = np.data;
      if (meta_data && meta_data.sizes_available) {
        this.setState({ sizes: meta_data.sizes_available });
      }
      this.setState({ product: { ...np.data, category: np.data.category ? np.data.category.name : null }, sizes: np.data.sizes || [] });
    }
    if (np.shopDetails && np.shopDetails.commission !== ourCommission) {
      this.setState({ ourCommission: np.shopDetails.commission });
    }
    if (np.shopDetails && np.shopDetails.categories !== categories) {
      this.setState({ categories: np.shopDetails.categories });
    }

    if (np.routingLocation) {
      if (np.data) {
        if (np.routingLocation.query) {
          const { createProduct } = np.routingLocation.query;
          if (isCreateProductDialog !== (createProduct === `${np.data.id}`)) {
            this.setState({ isCreateProductDialog: createProduct === `${np.data.id}` });
          }
        }
      } else if (np.routingLocation.query) {
        const { createProduct } = np.routingLocation.query;

        if ((createProduct === 'true' && !update) !== isCreateProductDialog) {
          this.setState({
            isCreateProductDialog: (createProduct === 'true' && !update),
            product: {
              images: [],
              cod_available: window.localStorage.getItem(IS_COD_AVAILABLE),
              estimated_delivery: window.localStorage.getItem(ESTIMATED_DELIVERY),
              online_available: window.localStorage.getItem(IS_ONLINE_PAYMENT_AVAILABLE),
              shipping_charges: window.localStorage.getItem(DELIVERY_CHARGE),
              opt_for_reselling: window.localStorage.getItem(ADD_TO_MARKET_PLACE),
            },
          });
        }
      }
    }
    if (np.isResellingProduct !== isResellingProduct) {
      this.setState({ isResellingProduct: np.isResellingProduct });
    }
    if (np.isOwnProduct !== isOwnProduct) {
      this.setState({ isOwnProduct: np.isOwnProduct });
    }
    if (np.user && np.user.user) {
      this.setState({ user: np.user.user });
    }
  }

  onSelectFile(file, isRetry) {
    const {
      shopDetails, user, getShopDetails,
    } = this.props;
    const { product, render } = this.state;

    let photoFile = [];
    let data = {};
    let uploadingIndex = 0;
    if (isRetry) {
      if (!file) return;
      data = { ...product };
      uploadingIndex = file.index;
      photoFile = [
        {
          key: 'product_id', file: product.id,
        },
        {
          key: 'photo', file: file.file.blob,
        },
      ];
    } else {
      data = { ...product, images: [...product.images, file.imageDataUrl] };
      uploadingIndex = data.images.length - 1;
      this.uploadingImages = [...this.uploadingImages, { file, index: uploadingIndex }];
      photoFile = [
        {
          key: 'product_id', file: product.id,
        },
        {
          key: 'photo', file: file.blob,
        },
      ];
    }
    this.uploadingImagesIndex = [...this.uploadingImagesIndex, uploadingIndex];
    this.setState({ product: data, loading: false });
    agent.ProductsPage.addProductImage(photoFile).then((res) => {
      this.setState({ product: res.data.product });
      this.uploadingImagesIndex = this.uploadingImagesIndex.filter((index) => index !== uploadingIndex);
      this.uploadingImages = this.uploadingImages.filter((image) => image.index !== uploadingIndex);
      this.setState({ loading: false });
      if (this.uploadingImagesIndex.length === 0 && this.uploadingImagesIndexError.length === 0) {
        if (shopDetails) {
          const productCategory = shopDetails.categories.filter((c) => c.id === res.data.product.category.id);
          if (productCategory[0] && !productCategory[0].image) {
            if (user && user.user) {
              const data = { username: user.user.username };
              getShopDetails(data);
            }
          }
          this.updateStoreProducts(res.data.product);
        }
      }
    }).catch((err) => {
      this.uploadingImagesIndex = this.uploadingImagesIndex.filter((index) => index !== uploadingIndex);
      this.uploadingImagesIndexError = [...this.uploadingImagesIndexError, uploadingIndex];
      this.setState({ render: !render });
      console.log(err);
      if (err.response) {
        toast.error(err.response.error);
      } else {
        toast.error(ERROR_MSG);
      }
    });
  }

  copy = () => {
    const { user, product } = this.state;
    const route = `${window.location.origin}${BASE_URL}/${user.username}/products/${product.slug}`;
    navigator.clipboard.writeText(route);
    if (copyCodeToClipboard(route)) {
      this.setState({ copySuccess: true });
      setTimeout(() => this.setState({ copySuccess: false }), 5000);
    }
  }

  togelIsCreateProductDialog() {
    const { product, update, isCreateProductDialog } = this.state;
    if (!update) {
      const online_available = window.localStorage.getItem(IS_ONLINE_PAYMENT_AVAILABLE);
      const cod_available = window.localStorage.getItem(IS_COD_AVAILABLE);
      const estimated_delivery = window.localStorage.getItem(ESTIMATED_DELIVERY);
      const shipping_charges = window.localStorage.getItem(DELIVERY_CHARGE);
      const opt_for_reselling = window.localStorage.getItem(ADD_TO_MARKET_PLACE);
      this.setState({
        product: {
          ...product,
          online_available: (/true/i).test(online_available),
          cod_available: (/true/i).test(cod_available),
          estimated_delivery,
          shipping_charges,
          opt_for_reselling,
        },
        addImage: false,
      });
      if (isCreateProductDialog) {
        store.dispatch(goBack());
      } else {
        const path = window.location.search ? `${window.location.pathname}${window.location.search}&createProduct=true`
          : `${window.location.pathname}?createProduct=true`;
        store.dispatch(push(path));
      }
    } else {
      if (isCreateProductDialog) {
        store.dispatch(goBack());
      } else {
        const path = window.location.search ? `${window.location.pathname}${window.location.search}&createProduct=${product.id}`
          : `${window.location.pathname}?createProduct=${product.id}`;
        store.dispatch(push(path));
      }
      this.setState({
        product,
        addImage: false,
      });
    }
  }

  togelAddSizes() {
    const { product } = this.state;
    this.setState({ product: { ...product, sizes_available: !product.sizes_available }, size: {}, textChanged: true });
  }

  togelFeatureProduct() {
    const { product } = this.state;
    this.setState({ product: { ...product, feature_product: !product.feature_product }, size: {}, textChanged: true });
  }

  togelResale() {
    const { product } = this.state;
    this.setState({ product: { ...product, opt_for_reselling: !product.opt_for_reselling, resell_margin: 0 }, textChanged: true });
  }

  isCodAvailableToggle() {
    this.setState({ product: { ...this.state.product, cod_available: !this.state.product.cod_available }, textChanged: true });
  }

  isOnlinePaymentAvailableToggle() {
    this.setState({ product: { ...this.state.product, online_available: !this.state.product.online_available }, textChanged: true });
  }

  addSize() {
    const { sizes, size, product } = this.state;
    this.setState({
      sizes: [...sizes, {
        ...size, stock: Number(size.stock), price: Number(size.price), disc_price: Number(size.disc_price), resell_margin: product.resell_margin,
      }],
      size: {
        size: '', price: size.price, disc_price: size.disc_price, stock: size.stock,
      },
      textChanged: true,
      hideResult: true,
    });
  }

  deleteSize(index) {
    const temp = this.state.sizes.filter((s, i) => i != index);
    this.setState({ sizes: temp, textChanged: true });
  }

  removeData(value) {
    if (value.id) {
      const data = { category_id: value.id };
      this.setState({ loading: true });
      const { shopDetails, setShopDetails } = this.props;
      agent.ProductsPage.deleteCategpry(data).then((res) => {
        const filteredCategories = shopDetails.categories.filter((c) => c.id !== value.id);
        const tempShopDetails = { ...shopDetails, categories: filteredCategories };
        setShopDetails(tempShopDetails);
        this.setState({ loading: false });
      }).catch((err) => {
        this.setState({ loading: false });
        console.log('Error in deleting category', err, err.response);
        if (err.response && err.response.data) {
          toast.error(err.response.data.error);
        } else {
          toast.error(ERROR_MSG);
        }
      });
    }
  }

  updateStoreProducts(product) {
    const {
      setProducts, products, publicPageProducts, setPublicPageProducts, setResellingProducts, resellingProducts, featuredProducts, setFeaturedProducts,
    } = this.props;
    let temp = [];
    if (products) {
      temp = products.map((p) => {
        if (p.id === product.id) {
          return product;
        }
        return p;
      });
    } else {
      temp = [product];
    }
    setProducts({ products: temp });
    if (publicPageProducts) {
      const tempPublicPageProducts = publicPageProducts.map((p) => {
        if (p.id === product.id) {
          return product;
        }
        return p;
      });
      setPublicPageProducts({ products: tempPublicPageProducts });
    }

    if (resellingProducts) {
      const tempResellingProducts = resellingProducts.map((p) => {
        if (p.id === product.id) {
          return product;
        }
        return p;
      });
      setResellingProducts({ products: tempResellingProducts });
    }

    if (product.feature_product) {
      if (featuredProducts && featuredProducts.products) {
        const tempFeaturedProducts = featuredProducts.products.filter((p) => p.id !== product.id);
        setFeaturedProducts({ ...featuredProducts, products: [product, ...tempFeaturedProducts] });
      } else {
        setFeaturedProducts({ ...featuredProducts, products: [product] });
      }
    } else if (featuredProducts && featuredProducts.products) {
      const tempFeaturedProducts = featuredProducts.products.filter((p) => p.id !== product.id);
      setFeaturedProducts({ ...featuredProducts, products: tempFeaturedProducts });
    }
  }

  showLoader() {
    this.setState({ loading: true });
  }

  removeResellingProduct() {
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
      toast.info('Product Removed from Resale');
      this.setState({ loading: false });
      if (resellingProducts) {
        const tempresellingProducts = resellingProducts.map((p) => {
          if (p.id === product.id) {
            return { ...p, added: false };
          }
          return p;
        });
        setResellingProducts({ products: tempresellingProducts });
      }

      let temp = products.filter((p) => p.id !== product.id);
      setProducts({ products: temp });

      temp = publicPageProducts.filter((p) => p.id !== product.id);
      setPublicPageProducts({ products: temp });
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

  retryImageUpload(imageIndex) {
    const imageFile = this.uploadingImages.find((image) => image.index === imageIndex);
    this.uploadingImagesIndexError = this.uploadingImagesIndexError.filter((index) => index !== imageIndex);
    this.onSelectFile(imageFile, true);
  }


  saveChanges(e) {
    if (e) {
      e.preventDefault();
    }

    if (e.target.id !== 'add-size-form') {
      const {
        product, update, sizes, textChanged,
      } = this.state;
      const {
        name, description, price, disc_price, estimated_delivery, id, cod_available, category, online_available, shipping_charges, opt_for_reselling, sizes_available, stock, feature_product,
      } = product;
      const {
        products, setProducts, shopDetails, user, getShopDetails, publicPageProducts, setPublicPageProducts, chosenCategory, publicPageChosenCategory, getResellingProducts, setFeaturedProducts, featuredProducts,
      } = this.props;
      if (sizes_available && (!sizes || sizes.length <= 0)) {
        this.setState({ error: 'At least one size is required!!!' });
        return;
      }
      let data = {
        name,
        category,
        description,
        estimated_delivery,
        meta_data: { },
        price: price ? Number(price) : 0,
        stock: stock ? Number(stock) : 0,
        disc_price: disc_price ? Number(disc_price) : 0,
        shipping_charges: shipping_charges ? Number(shipping_charges) : 0,
        online_available: Boolean(online_available),
        cod_available: Boolean(cod_available),
        opt_for_reselling: Boolean(opt_for_reselling),
        sizes_available: Boolean(sizes_available),
        feature_product: Boolean(feature_product),
        sizes,
      };

      if (!(online_available || cod_available)) {
        this.setState({ error: 'Enable the cod or online payment!!!' });
        return;
      }
      this.setState({ loading: true, error: '' });
      if (update) {
        data = { ...data, id };
        if (textChanged) {
          agent.ProductsPage.updateProduct(data).then((res) => {
            this.setState({
              addImage: true, loading: false, product: res.data.product, textChanged: false,
            });
            if (shopDetails && shopDetails.categories.filter((c) => c.id === res.data.product.category.id).length === 0) {
              if (user && user.user) {
                const userDetails = { username: user.user.username };
                getShopDetails(userDetails);
              }
            }

            this.updateStoreProducts(res.data.product);
          }).catch((err) => {
            this.setState({ loading: false });
            console.log('error in updating product ', err);
            if (err.response) {
              console.log('error in updating product ', err.response);
              toast.error(err.response.data.error);
            } else {
              toast.error(ERROR_MSG);
            }
          });
        } else {
          this.setState({ addImage: true, loading: false });
        }
      } else {
        agent.ProductsPage.createProduct(data).then((res) => {
          this.setState({ addImage: true, loading: false, product: res.data.product });

          if (!chosenCategory || chosenCategory === res.data.product.category.name) {
            if (products) {
              setProducts({ products: [res.data.product, ...products] });
            } else {
              setProducts({ products: [res.data.product] });
            }
          }
          if (!publicPageChosenCategory || publicPageChosenCategory === res.data.product.category.name) {
            if (publicPageProducts) {
              setPublicPageProducts({ products: [res.data.product, ...publicPageProducts] });
            } else {
              setPublicPageProducts({ products: [res.data.product] });
            }
          }
          if (shopDetails && shopDetails.categories.filter((c) => c.id === res.data.product.category.id).length === 0) {
            if (user && user.user) {
              const data = { username: user.user.username };
              getShopDetails(data);
            }
          }
          if (res.data.product.opt_for_reselling) {
            getResellingProducts(1);
          }

          if (res.data.product.feature_product) {
            if (featuredProducts && featuredProducts.products) {
              setFeaturedProducts({ ...featuredProducts, products: [res.data.product, ...featuredProducts.products] });
            } else {
              setFeaturedProducts({ ...featuredProducts, products: [res.data.product] });
            }
          }

          window.localStorage.setItem(IS_COD_AVAILABLE, res.data.product.cod_available);
          window.localStorage.setItem(ESTIMATED_DELIVERY, res.data.product.estimated_delivery);
          window.localStorage.setItem(IS_ONLINE_PAYMENT_AVAILABLE, online_available);
          window.localStorage.setItem(DELIVERY_CHARGE, shipping_charges);
          window.localStorage.setItem(ADD_TO_MARKET_PLACE, opt_for_reselling);
        }).catch((err) => {
          console.log(err, err.response);
          this.setState({ loading: false });
          if (err.response) {
            toast.error(err.response.data.error);
          } else {
            toast.error(ERROR_MSG);
          }
        });
      }
    }
  }

  deleteImage(img) {
    const data = {
      image: img,
      product_id: this.state.product.id,
    };
    this.setState({ loading: true, error: '' });
    agent.ProductsPage.deleteProductImage(data).then((res) => {
      this.setState({ loading: false });
      this.setState({ product: res.data.product });
      this.updateStoreProducts(res.data.product);
    }).catch((err) => {
      console.log(err);
      this.setState({ loading: false });

      if (err.response) {
        toast.error(err.response.error);
      } else {
        toast.error(ERROR_MSG);
      }
    });
  }

  deleteProduct() {
    const data = {
      product_id: this.state.product.id,
    };
    this.setState({ loading: true });
    const {
      products, publicPageProducts, setProducts, setPublicPageProducts, resellingProducts, setResellingProducts,
    } = this.props;
    agent.ProductsPage.deleteProduct(data).then((res) => {
      store.dispatch(goBack());
      const temp = products.filter((p) => p.id !== data.product_id);
      setProducts({ products: temp });
      const tempPublicPageProducts = publicPageProducts.filter((p) => p.id !== data.product_id);
      setPublicPageProducts({ products: tempPublicPageProducts });
      const tempResellingProducts = resellingProducts.filter((p) => (p.id !== data.product_id));
      setResellingProducts({ products: tempResellingProducts });
      this.setState({ loading: false });
    }).catch((err) => {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
      this.setState({ loading: false });
    });
  }

  render() {
    const {
      product, isCreateProductDialog, isNormalUser, update, addImage, sizes, size, error, ourCommission, textChanged, categories, loading, hideResult, isResellingProduct, addSizesVisibleForm, copySuccess, user, isOwnProduct,
    } = this.state;

    return (
      <div>
        <button
          className=" center  flex add-new-product "
          onClick={this.togelIsCreateProductDialog.bind(this)}
          type="button"
        >
              Add new Product
        </button>

        <Dialog
          open={isCreateProductDialog}
          TransitionComponent={Transition}
          maxWidth
          onClose={this.togelIsCreateProductDialog}
        >
          {
            (update && isOwnProduct)
              ? (
                <div>
                  <div className="   w-100  center pt2  flex tc justify-center bb">
                    <p className="  center mt0 mb0  block flex-wrap  " style={{ overflowY: 'auto' }}>
                        Your Product Link
                      <br />
                      <a
                        className="blue pointer grow"
                        target="_blank"
                        href={`${window.location.origin}${BASE_URL}/${user.username}/products/${product.slug}`}
                      >
                        {`${window.location.origin}${BASE_URL}/${user.username}/products/${product.slug}`}
                      </a>
                    </p>
                    <button className="pointer grow  bg-blue white bl b flex items-center ma2 pa2 br2 " style={{ border: 'none' }} type="button" onClick={() => this.copy()}>
                      {
                        copySuccess ? 'Copied' : 'Copy'
                      }
                    </button>
                  </div>
                </div>
              )
              : null
            }
          {
          addImage
            ? (
              <>
                <DialogTitle id="alert-dialog-slide-title">Add Product Image</DialogTitle>
                {
                  isResellingProduct
                    ? <p className="err-txt tc"> This is a reselling product. you cannot modify this product details. </p>
                    : null
                }
                <DialogContent style={{
                  flexWrap: 'wrap', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}
                >
                  <div className="dyna-flex flex-wrap ">
                    {
                      isResellingProduct
                        ? null
                        : (
                          <div className="product-img-add-img-btn">
                            <AddPhotoAlternateIcon />
                            <SelectImage onSelectFile={this.onSelectFile} showLoader={this.showLoader} />
                          </div>
                        )
                    }

                    {
                      product.images && product.images.map((img, i) => (
                        <div className="product-admin-img-div" key={i}>
                          {
                              this.uploadingImagesIndex.includes(i)
                                ? (
                                  <div className="uploding-loader">
                                    <h3 className="">Uploading...</h3>
                                    <CircularProgress style={{ width: '40px', height: '40px', color: 'white' }} />
                                  </div>
                                )
                                : (
                                  <>

                                    {
                                      this.uploadingImagesIndexError.includes(i)
                                        ? (
                                          <div className="uploding-loader">
                                            <h3 className="red f4 b">Error Occurred</h3>
                                            <button className="retry-button" type="button" onClick={() => this.retryImageUpload(i)}> Retry </button>
                                          </div>
                                        ) : (
                                          !isResellingProduct && (
                                          <button className="" onClick={() => this.deleteImage(img)} type="button">
                                            <DeleteForeverIcon />
                                          </button>
                                          )
                                        )
                                    }
                                  </>
                                )
                            }
                          <Image src={img} alt="" overlaySrc={product.preview_images[i]} />

                        </div>
                      ))
                    }
                  </div>
                </DialogContent>
                <DialogActions>
                  {
                    !isResellingProduct
                      && (
                      <button type="submit" className="color-btn ma1 relative w-50">
                      Add Image
                        <SelectImage onSelectFile={this.onSelectFile.bind(this)} />
                      </button>
                      )
                  }
                  <button onClick={this.togelIsCreateProductDialog} className="btn ba w-50" type="button">
                    Done
                  </button>
                </DialogActions>
              </>
            )
            : (
              <form onSubmit={this.saveChanges.bind(this)} className="create-product-form">
                <DialogTitle id="alert-dialog-slide-title">
                  {
                    isResellingProduct ? (
                      <>{isOwnProduct ? 'Your Product' : 'Reselling Product'}</>
                    )
                      : (
                        <>{ update ? 'Your Product' : 'Create Product'}</>
                      )
                  }
                </DialogTitle>
                {
                  isResellingProduct
                    && <p className="err-txt tc"> This product is for reselling. you cannot modify this product's details. </p>

                }
                <DialogContent style={{
                  flexWrap: 'wrap', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}
                >
                  <TextInput label="Product Name" value={product.name} type="text" className="w-100" onTextChange={(text) => this.setState({ textChanged: true, product: { ...product, name: text } })} required disabled={isResellingProduct} />
                  <DropDownTextInput
                    label="Add Product Category"
                    data={categories}
                    onChangeText={(text) => this.setState({ textChanged: true, product: { ...product, category: text } })}
                    setOption={(value) => this.setState({ textChanged: true, product: { ...product, category: value.name } })}
                    className="w-100"
                    canRemoveData={false}
                    value={product.category}
                    disabled={isResellingProduct}
                  />
                  <TextArea label="Description" value={product.description} type="text" className="w-100" onTextChange={(text) => this.setState({ textChanged: true, product: { ...product, description: text } })} required rows={4} disabled={isResellingProduct} />

                  <TextInput label="Expected Delivery Time" value={product.estimated_delivery} type="text" className="w-100" onTextChange={(text) => this.setState({ textChanged: true, product: { ...product, estimated_delivery: text } })} required disabled={isResellingProduct} />
                  <TextInput label="Shipping charge(in Rs.)" value={product.shipping_charges} type="number" className="w-100" onTextChange={(text) => this.setState({ textChanged: true, product: { ...product, shipping_charges: text } })} required disabled={isResellingProduct} />
                  {
                    product.shipping_charges > 0 && (
                      <small className="green" style={{ fontSize: '0.7rem' }}>
                          95% of customers don't prefer Delivery Fees
                      </small>
                    )

                  }
                  <div className="flex items-center justify-between w-100">
                    <label> Sizes Available on Product : </label>
                    <Switch togelswitch={this.togelAddSizes.bind(this)} val={product.sizes_available} disabled={isResellingProduct} />
                  </div>
                  {
                    product.sizes_available
                      ? (
                        <>
                          <table className="w-100 tc">
                            <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Discounted Price</th>
                              <th>Stock Quantity</th>
                              <th />
                            </tr>
                            {
                      sizes && sizes.map((s, i) => (
                        <tr>
                          <td>{s.size}</td>
                          <td>{s.price}</td>
                          <td>{s.disc_price}</td>
                          <td>{s.stock}</td>
                          {
                             !isResellingProduct
                               && <button type="button" className="bg-red white b" style={{ padding: '5px', borderRadius: '3px' }} onClick={() => this.deleteSize(i)}> X </button>

                           }
                        </tr>
                      ))
                       }
                          </table>

                        </>
                      )
                      : null
                  }
                  {
                    product.sizes_available ? (
                      <form onSubmit={this.addSize} id="add-size-form" className="w-100">
                        <CollapseTransition visible={addSizesVisibleForm}>
                          <DropDownTextInput
                            label="Size Label e.g.( Medium )"
                            data={availableSizes}
                            onChangeText={(text) => this.setState({ textChanged: true, size: { ...size, size: text }, hideResult: false })}
                            setOption={(value) => this.setState({ textChanged: true, size: { ...size, size: value.name } })}
                            className="w-100"
                            hideResult={hideResult}
                            value={size.size}
                            disabled={isResellingProduct}
                          />
                          <TextInput label="Size Price e.g.( 500 )" value={size.price} className="w-100" type="number" onTextChange={(text) => this.setState({ textChanged: true, size: { ...size, price: text } })} required disabled={isResellingProduct} />
                          <TextInput label="Size Discounted Price e.g.( 350 )" value={size.disc_price} className="w-100" type="number" onTextChange={(text) => this.setState({ textChanged: true, size: { ...size, disc_price: text } })} required disabled={isResellingProduct} />
                          <TextInput label="Size stock Quantity e.g.( 100 )" value={size.stock} className="w-100" type="number" onTextChange={(text) => this.setState({ textChanged: true, size: { ...size, stock: text } })} required disabled={isResellingProduct} />
                        </CollapseTransition>
                        <div className="flex justify-between flex-row-reverse">
                          {
                            addSizesVisibleForm && !isResellingProduct
                              ? <button type="submit" className="green-btn w-40 " disabled={isResellingProduct}>Add Size</button>
                              : null
                          }
                          {
                            !isResellingProduct
                              ? (
                                <button className="green-btn" type="button" onClick={() => this.setState({ addSizesVisibleForm: !addSizesVisibleForm })}>
                                  {!addSizesVisibleForm ? 'Add  Sizes' : 'Done' }
                                </button>
                              )
                              : null
                          }
                        </div>
                      </form>
                    )
                      : (
                        <>
                          <TextInput label="Price" value={product.price} type="number" className="w-100" onTextChange={(text) => this.setState({ textChanged: true, product: { ...product, price: text } })} required disabled={isResellingProduct} />
                          <TextInput label="Discounted Price" value={product.disc_price} className="w-100" type="number" onTextChange={(text) => this.setState({ textChanged: true, product: { ...product, disc_price: text } })} required disabled={isResellingProduct} />
                          <TextInput label="Stock Quantity" value={product.stock} type="number" className="w-100" onTextChange={(text) => this.setState({ textChanged: true, product: { ...product, stock: text } })} required disabled={isResellingProduct} />
                        </>
                      )
                  }
                  <div className="flex items-center justify-between w-100">
                    <label> Featured Product : </label>
                    <Switch togelswitch={this.togelFeatureProduct.bind(this)} val={product.feature_product} disabled={isResellingProduct} />
                  </div>
                  <div className="flex items-center justify-between w-100">
                    <label>Add to Market place : </label>
                    <Switch togelswitch={this.togelResale.bind(this)} val={product.opt_for_reselling} disabled={isResellingProduct} />
                  </div>
                  {
                    product.opt_for_reselling
                      && (
                        <small className="green" style={{ fontSize: '0.7rem' }}>
                          Keeping the  dicounted price low motivates reseller to sell your product
                        </small>
                      )

                  }
                  <div className="flex items-center justify-between w-100">
                    <label> Cash On Delivery Available: </label>
                    <Switch togelswitch={this.isCodAvailableToggle.bind(this)} val={product.cod_available} disabled={isResellingProduct} />
                  </div>
                  {
                    product.cod_available
                      && <small className="green" style={{ fontSize: '0.7rem' }}>{`You will be charged ${ourCommission.cod.percent}% + Rs. ${ourCommission.cod.extra} on each order`}</small>
                  }
                  <div className="flex items-center justify-between w-100">
                    <label> Online Payment Available: </label>
                    <Switch togelswitch={this.isOnlinePaymentAvailableToggle.bind(this)} val={product.online_available} disabled={isResellingProduct} />

                  </div>
                  {
                      product.online_available
                        && <small className="green" style={{ fontSize: '0.7rem' }}>{`You will be charged ${ourCommission.online.percent}% + Rs. ${ourCommission.online.extra} on each order`}</small>
                    }
                  <p className="err-txt">{error}</p>
                </DialogContent>
                <DialogActions>
                  <button type="submit" className="color-btn ma1 " style={{ flexGrow: 1 }}>
                    {
                      textChanged
                        ? 'Save Changes'
                        : (
                          <>
                            {
                              isResellingProduct ? 'See images' : 'Add Images'
                            }
                          </>
                        )
                    }
                  </button>
                  {
                    update && (
                      isResellingProduct
                        ? (
                          isOwnProduct
                            && (
                              <button type="button" onClick={() => this.removeResellingProduct()} className="green-btn ma1 " style={{ flexGrow: 1, padding: '10px' }}>
                              Remove product
                              </button>
                            )

                        ) : (
                          <button type="button" onClick={() => this.deleteProduct()} className="color-btn ma1 " style={{ flexGrow: 1 }}>
                          Delete Product
                          </button>
                        )
                    )
                  }
                  <button onClick={this.togelIsCreateProductDialog} className="btn ba " style={{ marginLeft: 0 }} type="button">
                    Cancel
                  </button>
                </DialogActions>
              </form>
            )
          }
          {
            loading
              && <Loader />
          }
          {
            isNormalUser
                && <DisabledDiv message="Purchase a pro pack to get this utility." />
          }
        </Dialog>
      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  products: state.ProductsPageReducers.products,
  shopDetails: state.ProductsPageReducers.shopDetails,
  publicPageProducts: state.HomePageReducers.publicPageProducts,
  chosenCategory: state.ProductsPageReducers.chosenCategory,
  publicPageChosenCategory: state.HomePageReducers.publicPageChosenCategory,
  routingLocation: state.router.location,
  resellingProducts: state.ProductsPageReducers.resellingProducts,
  featuredProducts: state.DesignHomePageReducers.featuredProducts,
});

const mapDispatchToProps = (dispatch) => ({
  setProducts: (products) => dispatch({ type: SET_PRODUCTS, payload: products }),
  setPublicPageProducts: (products) => dispatch({ type: SET_PUBLIC_PAGE_PRODUCTS, payload: products }),
  getShopDetails: (user) => dispatch({ type: GET_SHOP_DETAILS, payload: agent.ProductsPage.getShopDetails(user) }),
  setShopDetails: (shopDetails) => dispatch({ type: GET_SHOP_DETAILS, payload: shopDetails }),
  getResellingProducts: (pageNumber) => dispatch({ type: GET_RESELLING_PRODUCTS, pageNumber, payload: agent.ProductsPage.getResellingProducts(pageNumber) }),
  setResellingProducts: (products) => dispatch({ type: SET_RESELLING_PRODUCTS, payload: products }),
  setFeaturedProducts: (products) => dispatch({ type: GET_FEATURED_PRODUCTS, payload: products }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateProduct);
