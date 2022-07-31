/* eslint-disable camelcase */
import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { connect } from 'react-redux';

import './styles.css';
import Slide from '@material-ui/core/Slide';
import agent from '../../../agent';
import { GET_ORDER_HISTORY } from '../../../constants/actionTypes';
import Loader from '../../../common/Components/Loader';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

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
    if(this.props.data){
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
      amount, id, items, meta_data, order_id,
    } = this.orderData;

    const order = items[0];
    const { loading } = this.state;
    return (
      <div className="order relative" onClick={this.togelIsOrderDetailsOpen.bind(this)}>


        <div className=" order-header ">
          <h3>{order.order.sub_type}</h3>
          <div className="price">
            <h1>
              {amount}
              <span>{meta_data.order.currency}</span>
            </h1>
          </div>

        </div>
        <div className="order-sub-header flex justify-between">

          <h4>
Ordered on:
            {order.order.start_date}
          </h4>

          {
              order.order.is_active ? (
                <div className="active-order">
                    Currenlty Active Plan
                </div>
              ) : null
          }
        </div>
        <Dialog
          open={this.state.isOrderDetailsOpen}
          TransitionComponent={Transition}
          keepMounted
          maxWidth
          onClose={this.togelIsOrderDetailsOpen.bind(this)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >

          <DialogTitle id="alert-dialog-slide-title">Order Details</DialogTitle>
          <DialogContent style={{ flexWrap: 'wrap', position: 'relative' }}>
            <div className="order-details">
              <div className=" order-header " onClick={this.togelIsOrderDetailsOpen.bind(this)}>
                <h1>{order.order.sub_type}</h1>
                <div className="price">
                  <h1>
                    {amount}
                    <span>{meta_data.order.currency}</span>
                  </h1>
                </div>

              </div>
              <div className="order-content">
              <b style={{overflowWrap:'break-word'}} >{`Order id: ${order_id}`}</b>

                <h4>
                  Payment mode:
                  {meta_data.method}
                </h4>
                <h4>
                  Plan Started on:
                  {order.order.start_date}
                </h4>
                {
                    order.order.is_active ? (
                      <h4>
                    Plan Ending on:
                        {order.order.end_date}
                      </h4>
                    ) : (
                      <h4>
                    Plan Ended on:
                        {order.order.end_date}
                      </h4>
                    )
                }

                {
                    order.order.is_unsubscribed ? null : (
                      <h4>
                        Order Type:
                        {order.order_type}


                      </h4>
                    )
                }

                {
                    order.order.is_unsubscribed ? null : (
                      <div className="flex justify-between items-center">
                        <h5>*This is a recurring payment order plan will get auto renewed at the end of pack. To unsubscribe from this click on unsubscribe.</h5>
                        <button className=" center color-btn b h-100 " type="button" onClick={() => this.unsubscribe(order)}>Unsubscribe </button>
                      </div>
                    )
                }

              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button type="button" className="color-btn w-100" onClick={() => this.togelIsOrderDetailsOpen()}> Close </button>
          </DialogActions>


        </Dialog>
        {
            loading ? <Loader /> : null
        }
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
