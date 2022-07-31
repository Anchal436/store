/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './SoldProducts.css';
import agent from '../../agent';
import {
  GET_NOT_DELIVERED_SOLD_PRODUCTS,
} from '../../constants/actionTypes';
import Loader from '../../common/Components/Loader';
import SoldOrder from './components/SoldOrder';
import Pagination from '../../common/Components/Pagination';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      notDeliveredSoldProducts: [],
      notDeliveredProductsPageCount: 1,

      currentPage: 1,
    };
  }

  componentDidMount() {
    const { user, notDeliveredSoldProducts, notDeliveredProductsPageCount } = this.props;
    if (user && user.user) {
      this.setState({ user: user.user });
    }
    if (notDeliveredSoldProducts && notDeliveredSoldProducts !== this.state.notDeliveredSoldProducts) {
      this.setState({ notDeliveredSoldProducts });
    }
    if (notDeliveredProductsPageCount) {
      this.setState({ notDeliveredProductsPageCount });
    }
  }

  componentWillReceiveProps(np) {
    const { user, notDeliveredSoldProducts } = this.state;
    if (np.user) {
      if (user !== np.user.user) {
        this.setState({ user: np.user.user, loading: false });
      }
    }
    if (np.notDeliveredSoldProducts && notDeliveredSoldProducts !== np.notDeliveredSoldProducts) {
      this.setState({ notDeliveredSoldProducts: np.notDeliveredSoldProducts });
    }
    if (np.notDeliveredProductsPageCount && np.notDeliveredProductsPageCount !== np.notDeliveredProductsPageCount) {
      this.setState({ notDeliveredProductsPageCount: np.notDeliveredProductsPageCount });
    }
  }

  renderSoldProducts() {
    if (
      this.state.notDeliveredSoldProducts.length === 0
    ) {
      return (
        <div>
          <h3 className="tc ">No Sold Products </h3>
        </div>

      );
    }
    return this.state.notDeliveredSoldProducts.map((p, i) => (
      <SoldOrder order={p} key={i} />
    ));
  }

  onPageChange(newPage) {
    const { getNotDeliveredSoldProducts } = this.props;
    getNotDeliveredSoldProducts(newPage);
    this.setState({ currentPage: newPage });
  }

  render() {
    const {
      loading, currentPage, notDeliveredProductsPageCount,
    } = this.state;
    return (
      <div>
        <div className="    ">
          <div>
            {
              this.renderSoldProducts()
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
            paddingBottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            background: 'rgba(255,255,255,0.9)',
          }}
        >
          <Pagination pageCount={notDeliveredProductsPageCount} onPageChange={this.onPageChange.bind(this)} currentPage={currentPage} />
        </div>
      </div>


    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  notDeliveredSoldProducts: state.SoldProductsReducers.notDeliveredSoldProducts,
  notDeliveredProductsPageCount: state.SoldProductsReducers.notDeliveredProductsPageCount,


});


const mapDispatchToProps = (dispatch) => ({
  getNotDeliveredSoldProducts: (pageNo) => dispatch({
    type: GET_NOT_DELIVERED_SOLD_PRODUCTS,
    payload: agent.SoldProducts.getNotDeliveredSoldProducts(pageNo),
  }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);
