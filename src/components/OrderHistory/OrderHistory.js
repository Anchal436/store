import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';

import './OrderHistory.css';
import SideDrawer from '../AdminPage/components/SideDrawer';
import agent from '../../agent';
import {
  GET_ORDER_HISTORY, GET_NOT_DELIVERED_SOLD_PRODUCTS, GET_DELIVERED_SOLD_PRODUCTS,
} from '../../constants/actionTypes';
import Tabs from '../../common/Components/Tabs';
import { store } from '../../store';
import Order from './components/Order';
import ProductOrder from './components/ProductOrder';
import Loader from '../../common/Components/Loader';
import SoldProducts from '../SoldProducts/SoldProducts';
import DeliveredSoldProducts from '../SoldProducts/DeliveredSoldProducts';

class OrderHistory extends Component {
  static renderSoldProducts() {
    return <SoldProducts />;
  }

  static renderDeliveredSoldProducts() {
    return <DeliveredSoldProducts />;
  }
  
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      planOrders: [],
      productOrders: [],
    };
    this.orderHistory = [];
    // this.renderDeliveredSoldProducts = this.renderDeliveredSoldProducts.bind(this);
    this.renderProductsOrders = this.renderPlansOrders.bind(this);
    // this.renderPlansOrders = this.renderPlansOrders.bind(this);
    // this.renderSoldProducts = this.renderSoldProducts.bind(this);
  }

  componentDidMount() {
    // console.log(this.props);
    const {
      getNotDeliveredSoldProducts, getDeliveredSoldProducts, orderHistory, getOrders,
    } = this.props;
    
    if (orderHistory && orderHistory.orders) {
      this.formatOrderData(orderHistory.orders);
      this.orderHistory = orderHistory.orders;
    }
    getNotDeliveredSoldProducts(1);
    getDeliveredSoldProducts(1);
    getOrders();
  }

  componentWillReceiveProps(np) {
    if (np.orderHistory && np.orderHistory.orders && np.orderHistory.orders !== this.orderHistory) {
      this.formatOrderData(np.orderHistory.orders);
      this.orderHistory = np.orderHistory.orders;
    }
  }

  formatOrderData(orders) {
    const planOrders = orders.filter((o) => o.items[0].order_type === 'subscription');
    const productOrders = orders.filter((o) => o.items[0].order_type === 'product');
    this.setState({ planOrders, productOrders });
  }

  renderPlansOrders() {
    const { planOrders } = this.state;
    return planOrders.map((o, i) => (
      <Order data={o} key={o.id} />
    ));
  }

  renderProductsOrders() {
    const { productOrders } = this.state;
    return productOrders.map((o, i) => (
      <ProductOrder data={o} key={o.id} />
    ));
  }

  render() {
    const { loading, user } = this.state;
    return (
      <div>
        <SideDrawer user={user} />
        <div className="nav-margin admin-bg">
          <button
            className=" tc center w-100 mt2 mb2 color-btn b "
            style={{ borderRadius: '15px' }}
            type="button"
            onClick={() => store.dispatch(push('/admin/products/'))}
          >
            Go to products page
          </button>

          <div className="" style={{ paddingBottom: '50px' }}>
            <Tabs
              tabsData={[
                { tabHeading: 'Sold Products', components: () => OrderHistory.renderSoldProducts() },
                { tabHeading: 'Delivered Products', components:() => OrderHistory.renderDeliveredSoldProducts() },
                { tabHeading: 'Product Purchases', components: () => this.renderProductsOrders() },
              ]}
            />
          </div>
        </div>
        {
          loading ? <Loader /> : null
        }
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  orderHistory: state.OrderHistoryReducers.orderHistory,
  soldProducts: state.SoldProductsReducers.soldProducts,
});

const mapDispatchToProps = (dispatch) => ({
  getOrders: () => dispatch({ type: GET_ORDER_HISTORY, payload: agent.OrderHistory.getOrders() }),
  getNotDeliveredSoldProducts: (pageNo) => dispatch({ type: GET_NOT_DELIVERED_SOLD_PRODUCTS, payload: agent.SoldProducts.getNotDeliveredSoldProducts(pageNo) }),
  getDeliveredSoldProducts: (pageNo) => dispatch({ type: GET_DELIVERED_SOLD_PRODUCTS, payload: agent.SoldProducts.getDeliveredSoldProducts(pageNo) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderHistory);
