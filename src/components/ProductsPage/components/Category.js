/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';

import { store } from '../../../store';
import './styles.css';
import agent from '../../../agent';
import TextInput from '../../../common/Components/TextInput';
import SelectImage from '../../../common/Components/SelectImage';
import Loader from '../../../common/Components/Loader';
import Image from '../../../common/Components/Image';
import {
  GET_SHOP_DETAILS,
} from '../../../constants/actionTypes';
import {
  ERROR_MSG,
} from '../../../constants/otherConstants';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textChanged: false,
      isEditCategoryDialogOpen: false,
      category: {
        images: [],
      },
      user: {},
    };
    this.togelIsEditCategoryDialog = this.togelIsEditCategoryDialog.bind(this);
    this.showLoader = this.showLoader.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentWillMount() {
    const {
      category, user, routingLocation,
    } = this.props;
    const { isEditCategoryDialogOpen } = this.state;
    if (user && user.user) {
      this.setState({ user });
    }
    if (category) {
      this.setState({ category });
    }
    if (routingLocation) {
      if (category) {
        if (routingLocation.query) {
          const { editCategory } = routingLocation.query;
          if (editCategory === `${category.id}`) {
            if (!isEditCategoryDialogOpen) {
              this.setState({ isEditCategoryDialogOpen: true });
            }
          } else if (isEditCategoryDialogOpen) {
            this.setState({ isEditCategoryDialogOpen: false });
          }
        }
      }
    }
  }

  componentWillReceiveProps(np) {
    const {
      category, user,
    } = this.state;
    if (np.category && np.category !== category) {
      this.setState({ category: np.category });
    }
    if (np.user && np.user.user && np.user.user !== user) {
      this.setState({ user: np.user.user });
    }
    if (np.routingLocation) {
      if (np.category) {
        if (np.routingLocation.query) {
          const { editCategory } = np.routingLocation.query;
          this.setState({ isEditCategoryDialogOpen: editCategory === `${np.category.id}` || (editCategory === 'true') });
        }
      }
    }
  }


  onSelectFile(file) {
    const { category } = this.state;
    this.setState({ blob: file.blob, category: { ...category, image: file.imageDataUrl }, textChanged: true });
  }


  saveChanges() {
    const {
      getShopDetails,
    } = this.props;
    const {
      category, blob, user, textChanged,
    } = this.state;
    if (!textChanged) {
      return;
    }
    let photoFile = [];
    if (blob) {
      photoFile = [
        {
          key: 'category_id', file: category.id,
        },
        {
          key: 'photo', file: blob,
        },
        {
          key: 'name', file: category.name,
        },
      ];
    } else {
      photoFile = [
        {
          key: 'category_id', file: category.id,
        },
        {
          key: 'name', file: category.name,
        },
      ];
    }
    this.setState({ uploading: true, errorOccurred: false });
    agent.ProductsPage.updateCategory(photoFile).then((res) => {
      this.setState({ category: res.data.category });
      this.setState({ uploading: false, errorOccurred: false });
      this.togelIsEditCategoryDialog();
      if (user) {
        const data = { username: user.username };
        getShopDetails(data);
      }
    }).catch((err) => {
      this.setState({ uploading: false, errorOccurred: true });
      console.log(err);
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
      products, publicPageProducts, setProducts, setPublicPageProducts,
    } = this.props;
    agent.ProductsPage.deleteProduct(data).then((res) => {
      store.dispatch(goBack());
      const temp = products.filter((p) => p.id !== data.product_id);
      setProducts({ products: temp });
      const tempPublicPageProducts = publicPageProducts.filter((p) => p.id !== data.product_id);
      setPublicPageProducts({ products: tempPublicPageProducts });
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

  togelIsEditCategoryDialog() {
    const { category, isEditCategoryDialogOpen } = this.state;
    if (isEditCategoryDialogOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&editCategory=${category.id}`
        : `${window.location.pathname}?editCategory=${category.id}`;
      store.dispatch(push(path));
    }
  }

  showLoader() {
    this.setState({ loading: true, errorOccurred: false });
  }


  render() {
    const {
      category, isEditCategoryDialogOpen, uploading, errorOccurred, textChanged, loading,
    } = this.state;
    const { chooseCategory } = this.props;

    return (
      <>
        <div className="admin-category">
          <div className="content relative" onClick={() => chooseCategory(category.name)}>
            <div className="relative" style={{ overflow: 'hidden' }}>
              <Image src={category.image} alt="" overlaySrc={category.image} />
            </div>
            <div className="category-text">
              <h3 className="ma0 relative">
                {category.name}
              </h3>
            </div>
          </div>
          <button
            className="edit-btn"
            onClick={this.togelIsEditCategoryDialog.bind(this)}
            type="button"
          >
            Edit
          </button>
        </div>

        <Dialog
          open={isEditCategoryDialogOpen}
          TransitionComponent={Transition}
          keepMounted
          maxWidth
          onClose={this.togelIsEditCategoryDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextInput
              label="Category Name"
              value={category.name}
              className="w-100"
              type="text"
              onTextChange={(text) => this.setState({ category: { ...category, name: text }, textChanged: true })}
              required
            />
            <div className="change-category-img relative">
              {
                uploading
                  ? (
                    <div className="uploding-loader">
                      <h3 className="">Uploading...</h3>
                      <CircularProgress style={{ width: '40px', height: '40px', color: 'white' }} />
                    </div>
                  )
                  : (
                    <>
                      {
                        errorOccurred
                          ? (
                            <div className="uploding-loader">
                              <h3 className="red f4 b">Error Occurred</h3>
                              <button className="retry-button" onClick={() => this.saveChanges()} type="button"> Retry </button>
                            </div>
                          ) : null
                      }
                    </>
                  )
              }
              <Image src={category.image} alt="" overlaySrc={category.image} />
              <button type="button" className="relative">
                Change Image
                <SelectImage onSelectFile={this.onSelectFile} />
              </button>
            </div>
          </DialogContent>
          <DialogActions>
            {
                textChanged
                  ? (
                    <button type="button" color="primary" className="color-btn ma1 " style={{ flexGrow: 1 }} onClick={this.saveChanges}>
                      Save Changes
                    </button>
                  )
                  : null
            }
            <button onClick={this.togelIsEditCategoryDialog} className="btn ba w-50" type="button">
                Cancel
            </button>
          </DialogActions>
          {
              loading
                ? <Loader />
                : null
          }
        </Dialog>
      </>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  routingLocation: state.router.location,
  shopDetails: state.ProductsPageReducers.shopDetails,


  // categories: state.ProductsPageReducers.categories,
});

const mapDispatchToProps = (dispatch) => ({
  getShopDetails: (user) => dispatch({ type: GET_SHOP_DETAILS, payload: agent.ProductsPage.getShopDetails(user) }),


});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateProduct);
