import React, { Component } from 'react';
import { connect } from 'react-redux';

import './styles.css';

import agent from '../../../agent';
import { GET_ORDER_HISTORY } from '../../../constants/actionTypes';
import Loader from '../../../common/Components/Loader';
import OrderHistoryProductDetails from './OrderHistoryProductDetails';


const formatDate = (date) => {
  const d = new Date('2010-08-05');
  const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
  const [{ value: mo },, { value: da },, { value: ye }] = dtf.formatToParts(d);
  return `${da}-${mo}-${ye}`;
};
class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      loading: false,
      isOrderDetailsOpen: false,
    };
  }

  componentWillMount() {
    if (this.props.data) {
      this.orderData = this.props.data;
    }
  }

  componentWillReceiveProps(np) {
    if (np.data) {
      this.orderData = np.data;
    }
  }


  togelIsOrderDetailsOpen() {
    const { isOrderDetailsOpen } = this.state;
    this.setState({ isOrderDetailsOpen: !isOrderDetailsOpen });
  }

  unsubscribe(item) {
    const data = {
      sub_id: item.order.sub_id,
    };
    this.setState({ loading: true });
    agent.OrderHistory.orderUnsubscribe(data).then((res) => {
      this.props.getOrders();
      this.setState({ loading: false });
    }).catch((err) => {
      this.setState({ loading: false });
    });
  }

  render() {
    const {
      amount,  items, created_at, order_id
    } = this.orderData;

    const order = items[0];
    const {
       images
    } = order.order;
    const { loading } = this.state;
    return (
      <div className="order relative" onClick={this.togelIsOrderDetailsOpen.bind(this)}>


        <div className=" order-header ">
          <div className="product-order-sub-header ">
            {
            images.length > 0
              ? <img src={images[0]} alt="" /> : null
          }
            <div className="details">
              <p>{` ${formatDate(created_at)}`}</p>
              <p>{`Cart Contents: ${items.length} items`}</p>
            </div>

          </div>
          <div className="price">
            <h1>
              {amount}
              <span>INR</span>
            </h1>
          </div>

        </div>


        {
            loading ? <Loader /> : null
        }
        <OrderHistoryProductDetails cartItems={items} orderId={order_id} />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  orderHistory: state.OrderHistoryReducers.orderHistory,

});

const mapDispatchToProps = (dispatch) => ({
  getOrders: () => dispatch({ type: GET_ORDER_HISTORY, payload: agent.OrderHistory.getOrders() }),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);
