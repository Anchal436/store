/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './SoldProducts.css';

import {
  GET_DELIVERED_SOLD_PRODUCTS,
} from '../../constants/actionTypes';
import Loader from '../../common/Components/Loader';
import Pagination from '../../common/Components/Pagination';
import SoldOrder from './components/SoldOrder';
import agent from '../../agent';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      deliveredSoldProducts: [],
      deliveredProductsPageCount: 1,

      currentPage: 1,
    };
  }

  componentDidMount() {
    const { user, deliveredSoldProducts, deliveredProductsPageCount } = this.props;
    if (user && user.user) {
      this.setState({ user: user.user });
    }
    if (deliveredSoldProducts && deliveredSoldProducts !== this.state.deliveredSoldProducts) {
      this.setState({ deliveredSoldProducts });
    }
    this.setState({ deliveredProductsPageCount });
  }

  componentWillReceiveProps(np) {
    const { user, deliveredSoldProducts, deliveredProductsPageCount } = this.state;
    if (np.user) {
      if (user !== np.user.user) {
        this.setState({ user: np.user.user, loading: false });
      }
    }
    if (np.deliveredSoldProducts && deliveredSoldProducts !== np.deliveredSoldProducts) {
      this.setState({ deliveredSoldProducts: np.deliveredSoldProducts });
    }
    if (np.deliveredProductsPageCount && np.deliveredProductsPageCount !== deliveredProductsPageCount) {
      this.setState({ deliveredProductsPageCount });
    }
  }

  rendeDeliveredSoldProducts() {
    if (
      this.state.deliveredSoldProducts.length === 0
    ) {
      return (
        <div>
          <h3 className="tc ">No Delivered Products are present</h3>
        </div>

      );
    }
    return this.state.deliveredSoldProducts.map((p, i) => (
      <SoldOrder order={p} key={i} />
    ));
  }

  onPageChange(newPage) {
    const { currentPage } = this.state;
    const { getDeliveredSoldProducts } = this.props;
    getDeliveredSoldProducts(newPage);
    this.setState({ currentPage: newPage });
  }

  render() {
    const {
      loading, deliveredProductsPageCount, currentPage,
    } = this.state;
    return (
      <div>
        <div>
          <div>
            {
              this.rendeDeliveredSoldProducts()
            }
          </div>
        </div>
        {
          loading ? <Loader /> : null
        }
        <div
          className="flex justify-center items-center"
          style={{
            position: 'fixed',
            bottom: '0',
            paddingBottom:'10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width:'100%',
            background:'rgba(255,255,255,0.9)'
          }}
        >
          <Pagination pageCount={deliveredProductsPageCount} onPageChange={this.onPageChange.bind(this)} currentPage={currentPage} />
        </div>
      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  deliveredSoldProducts: state.SoldProductsReducers.deliveredSoldProducts,
  deliveredProductsPageCount: state.SoldProductsReducers.deliveredProductsPageCount,
});

const mapDispatchToProps = (dispatch) => ({
  getDeliveredSoldProducts: (pageNo) => dispatch({ type: GET_DELIVERED_SOLD_PRODUCTS, payload: agent.SoldProducts.getDeliveredSoldProducts(pageNo) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);
