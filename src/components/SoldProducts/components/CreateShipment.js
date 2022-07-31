/* eslint-disable react/sort-comp */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push, goBack, go } from 'react-router-redux';
import 'tachyons';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from 'react-toastify';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './styles.css';

import { store } from '../../../store';
import agent from '../../../agent';
import {
  GET_NOT_DELIVERED_SOLD_PRODUCTS, GET_DELIVERED_SOLD_PRODUCTS,
} from '../../../constants/actionTypes';
import {
  ERROR_MSG, PICKUP_POSTCODE,
} from '../../../constants/otherConstants';
import Loader from '../../../common/Components/Loader';
import TextInput from '../../../common/Components/TextInput';
import Stepper from '../../../common/Components/Stepper';
import CollapseTransition from '../../../common/Components/CollapseTransition';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


class CreateShipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      order: {},
      weight: '',
      pickup_postcode: '',
      isCraeteShipmentDialogOpen: false,
      error: '',
      showCouriers: false,
      isSuccessShipmentDialogOpen: false,
      availableCouriers: [],
      recommendedCouries: {},
      shipmentDetails: {},
      activeStepIndex: null,
      shopDetails: {},
    };
    this.stepperData = [
      {
        label: 'Select Pick-up Address',
        element: () => this.pickUpAddressForm(),
      },
      {
        label: 'Enter Product Details',
        element: () => this.courierOptionForm(),
      },
      {
        label: 'Select Courier Service',
        element: () => this.courierOptions(),
      },
    ];
    this.togelIsCreateShipmentDialogOpen = this.togelIsCreateShipmentDialogOpen.bind(this);
    this.togelsuccessShipmentDialogOpen = this.togelsuccessShipmentDialogOpen.bind(this);
    this.getCourieroptions = this.getCourieroptions.bind(this);
    this.createShipment = this.createShipment.bind(this);

    this.courierOptionForm = this.courierOptionForm.bind(this);
    this.courierOptions = this.courierOptions.bind(this);
  }


  componentWillMount() {
    // console.log(this.props);
    const {
      user, order, user_details, shopDetails, routingLocation,
    } = this.props;
    if (user && user.user) {
      this.setState({ user: user.user });
    }
    if (user_details) {
      this.setState({ user_details });
    }
    if (shopDetails) {
      this.setState({ shopDetails });
    }
    if (order && routingLocation) {
      if (routingLocation.query) {
        const { createShipment, shipmentStepperIndex } = routingLocation.query;

        if (createShipment === `${order.id}`) {
          this.setState({
            isCraeteShipmentDialogOpen: createShipment === `${order.id}`,
            // isSuccessShipmentDialogOpen: createShipmentResult === `${np.order.id}`,
            activeStepIndex: shipmentStepperIndex || 0,
          });
        } else {
          this.setState({
            isCraeteShipmentDialogOpen: false,
            // isSuccessShipmentDialogOpen: false,
            activeStepIndex: null,
          });
        }
      }
      this.setState({ order });
    }
  }

  componentWillReceiveProps(np) {
    const { user_details, order, shopDetails } = this.state;
    if (np.order && np.order !== order) {
      this.setState({ order: np.order });
    }
    if (np.routingLocation && np.order) {
      if (np.routingLocation.query) {
        const { createShipment, createShipmentResult, shipmentStepperIndex } = np.routingLocation.query;

        if (createShipment === `${np.order.id}`) {
          this.setState({
            isCraeteShipmentDialogOpen: createShipment === `${np.order.id}`,
            // isSuccessShipmentDialogOpen: createShipmentResult === `${np.order.id}`,
            activeStepIndex: shipmentStepperIndex || 0,
          });
        } else {
          this.setState({
            isCraeteShipmentDialogOpen: false,
            // isSuccessShipmentDialogOpen: false,
            activeStepIndex: null,
          });
        }
      }
    }
    if (np.shopDetails && np.shopDetails !== shopDetails) {
      this.setState({ shopDetails: np.shopDetails });
    }
    if (np.user_details && np.user_details !== user_details) {
      this.setState({ user_details: np.user_details });
    }
  }

  getCourieroptions(e) {
    e.preventDefault();
    const {
      user, order, weight, pickup_postcode, activeStepIndex,
    } = this.state;
    const data = { weight: Number(weight), order_id: order.order_id };
    // console.log(data);
    this.setState({ loading: true });
    agent.SoldProducts.getShippingOptions(data).then((res) => {
      if (res.data.couriers) {
        this.setState({
          availableCouriers: res.data.couriers, recommendedCouries: res.data.recommended_courier_id, loading: false,
        });
      } else {
        this.setState({ loading: false, availableCouriers: [] });
      }
      this.updateStepper(1);
    }).catch((err) => {
      console.log(err, err.response);
      this.setState({ loading: false });
      toast.error(ERROR_MSG);
    });
  }

  courierService(details) {
    const {
      cod_charges, courier_name, delivery_performance, estimated_delivery_days, etd, min_weight, mode, pickup_performance, pod_available, rate, rating, realtime_tracking, rto_charges, rto_performance, tracking_performance,
    } = details;
    // const { recommendedCouries } = this.state;

    return (
      <div className="create-shipment-courier-div">
        <h5>{courier_name}</h5>
        <div className="dyna-flex bb  justify-between items-center">
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Delivery Performance: </small>
            <p className="b">{`${delivery_performance}/ 5`}</p>
          </div>
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Tracking Performance: </small>
            <p className="b">{`${tracking_performance}/ 5`}</p>
          </div>
        </div>
        <div className="dyna-flex bb  justify-between items-center">
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Return To Origin Performance: </small>
            <p className="b">{`${rto_performance}/ 5`}</p>
          </div>
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Pickup Performance: </small>
            <p className="b">{`${pickup_performance}/ 5`}</p>
          </div>
        </div>
        <div className="dyna-flex bb  justify-between items-center">
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">COD Charges: </small>
            <p className="b">{`${cod_charges} Rs.`}</p>
          </div>
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Return To Origin Charges: </small>
            <p className="b">{`${rto_charges} Rs.`}</p>
          </div>
        </div>
        <div className="dyna-flex bb  justify-between items-center">
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Overall Rating: </small>
            <p className="b">{`${rating}/ 5`}</p>
          </div>
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Tracking: </small>
            <p className="b">{`${realtime_tracking}`}</p>
          </div>
        </div>
        <div className="dyna-flex bb  justify-between items-center">
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Delivery by : </small>
            <p className="b">{`${etd}`}</p>
          </div>
          <div className="w-50-ns w-100 flex items-center justify-between ml1 mr1">
            <small className="b">Minimum Weight: </small>
            <p className="b">{`${min_weight} Kg.`}</p>
          </div>
        </div>
        <div className="rate">
          <h4>{`Price: ${rate} Rs.`}</h4>
        </div>
        <button type="button" onClick={() => this.createShipment(details)}> Create Shipment </button>

      </div>
    );
  }

  updateStepper(step) {
    const { routingLocation } = this.props;
    const { query, pathname } = routingLocation;
    let search = '';
    let found = false;
    Object.keys(query).forEach((k) => {
      if (k === 'shipmentStepperIndex') {
        search = `${search}&${k}=${Number(query[k]) + 1}`;
        found = true;
      } else {
        search = `${search}&${k}=${query[k]}`;
      }
    });
    if (!found) {
      search = search ? `${search}&shipmentStepperIndex=1` : 'shipmentStepperIndex=1';
    }

    if (step < 0) {
      store.dispatch(go(step));
    } else {
      const path = search ? `${pathname}?${search}` : `${pathname}`;
      store.dispatch(push(path));
    }
  }

  togelIsCreateShipmentDialogOpen() {
    const { isCraeteShipmentDialogOpen, order } = this.state;

    if (isCraeteShipmentDialogOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&createShipment=${order.id}`
        : `${window.location.pathname}?createShipment=${order.id}`;
      store.dispatch(push(path));
    }
  }

  courierOptionForm =() => {
    const {
      weight, length, breadth, height,
    } = this.state;
    return (
      <form onSubmit={this.getCourieroptions} className="get-courier-option-form">
        <TextInput
          label="Weight Of product (in Kg.)"
          value={weight}
          type="number"
          className="w-100"
          onTextChange={(text) => this.setState({ weight: text })}
          required
          step="0.01"
        />
        <TextInput
          label="Length Of product (in cms)"
          value={length}
          type="number"
          className="w-100"
          onTextChange={(text) => this.setState({ length: text })}
          required
          step="0.01"
        />
        <TextInput
          label="Width Of product (in cms)"
          value={breadth}
          type="number"
          className="w-100"
          onTextChange={(text) => this.setState({ breadth: text })}
          required
          step="0.01"
        />
        <TextInput
          label="Height Of product (in cms)"
          value={height}
          type="number"
          className="w-100"
          onTextChange={(text) => this.setState({ height: text })}
          required
          step="0.01"
        />
        <div className="flex pa2 justify-between">
          <button type="button" className="color-btn w-40" onClick={() => this.updateStepper(-1)}>Go Back</button>
          <button type="submit" className="green-btn w-40">Get Courier Option</button>
        </div>
      </form>

    );
  }

  changeShopAddress =() => {
    const path = `${window.location.pathname}?myAccount=true`;
    store.dispatch(push(path));
  }

  pickUpAddressForm =() => {
    const { shopDetails, activeStepIndex } = this.state;
    return (
      <div className="tc ba br2">
        <h3>Order pick up address</h3>
        <p>Order will be pick from your shop.</p>

        {
            shopDetails.shop_address
              ? (

                <h4>
                  {`${shopDetails.shop_address}, ${shopDetails.city}, ${shopDetails.state}, ${shopDetails.country} - ${shopDetails.pincode} `}
                </h4>

              )
              : null
        }
        <div className="flex pa2 justify-between">
          <button type="button" className="color-btn w-40" onClick={this.changeShopAddress}> Change Shop Address </button>
          <button
            type="button"
            className="green-btn w-40"
            // disabled={!shopDetails.address}
            onClick={() => this.updateStepper(1)}
          >
            Continue ->
          </button>
        </div>
      </div>
    );
  }

  courierOptions = () => {
    const {
      availableCouriers,
    } = this.state;
    return (
      <div>
        <h4>Select Courier Service :</h4>
        <div className="dyna-flex flex-wrap">
          {
              availableCouriers.length > 0 ? (
                availableCouriers.map((c, i) => this.courierService(c))
              )
                : <h3>No Couriere are available</h3>
          }
        </div>
      </div>
    );
  }

  createShipment(details) {
    const {
      order, user_details, weight, pickup_postcode, length, breadth, height,
    } = this.state;
    // console.log(details);
    const data = {
      courier_id: details.courier_company_id,
      order_id: order.order_id,
      length: Number(length),
      breadth: Number(breadth),
      height: Number(height),
      weight: Number(weight),
      // pickup_location: pickup_postcode,
      // vendor_details: { ...user_details, pickup_location: pickup_postcode },
    };
    console.log(data);
    this.setState({ loading: true });
    agent.SoldProducts.createShipment(data).then((res) => {
      // console.log(res);
      // const path = window.location.search ? `${window.location.pathname}${window.location.search}&createShipmentResult=${order.id}`
      //   : `${window.location.pathname}?createShipmentResult=${order.id}`;
      // store.dispatch(push(path));

      this.setState({ loading: false, shipmentDetails: res.data.shipment });
      this.updateStepper(1);
    }).catch((err) => {
      console.log(err, err.response);
      if (err.response && err.response.data) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
      this.setState({ loading: false, isSuccessShipmentDialogOpen: false });
    });
  }

  togelsuccessShipmentDialogOpen() {
    store.dispatch(go(-2));
  }


  render() {
    const {
      loading, isCraeteShipmentDialogOpen, activeStepIndex, showCouriers, isSuccessShipmentDialogOpen, shipmentDetails,
    } = this.state;

    return (
      <>
        <div className="create-shipment-offer ">
          <button type="button" onClick={this.togelIsCreateShipmentDialogOpen.bind(this)}>
            ship at 29 Rs./Kg
          </button>
        </div>
        <Dialog
          open={isCraeteShipmentDialogOpen}
          TransitionComponent={Transition}

          fullScreen
          onClose={this.togelIsCreateShipmentDialogOpen.bind(this)}


        >
          <div className="dialog-details-top-bar">
            <h2>Create Shipment</h2>
            <button type="button" onClick={this.togelIsCreateShipmentDialogOpen.bind(this)}>GO BACK</button>
          </div>
          <DialogContent>
            <div className="create-shipment-content">
              <h4>
                Deliver with us at charges as low as Rs. 29/Kg.
              </h4>
              {
                activeStepIndex != null
                  ? (
                    <>
                      {
                      Number(activeStepIndex) === this.stepperData.length ? (
                        <div className="">

                          <h3> Your shipment is created.</h3>
                          <h4>{shipmentDetails.courier_name}</h4>
                          <b>Shipment id:</b>
                          <p>

                            {shipmentDetails.shipment_id}
                          </p>
                          <b>Scheduled Pick-up Date:</b>
                          <p>{`${shipmentDetails.pickup_scheduled_date}`}</p>
                          <b>Pick-up Date: </b>
                          <p>{`${shipmentDetails.pickup_scheduled_date}`}</p>
                          <b>{`Applied Weight: ${shipmentDetails.applied_weight} Kg.`}</b>
                          <button type="button" className="green-btn w-100" onClick={this.togelsuccessShipmentDialogOpen.bind(this)}>
                          Close
                          </button>
                        </div>
                      )
                        : <Stepper data={this.stepperData} activeStepIndex={activeStepIndex} />
                    }
                    </>
                  )
                  : null
              }

            </div>
          </DialogContent>
          <DialogActions />
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
  notDeliveredSoldProducts: state.SoldProductsReducers.notDeliveredSoldProducts,
  deliveredSoldProducts: state.SoldProductsReducers.deliveredSoldProducts,
  deliveredProductsPageCount: state.SoldProductsReducers.deliveredProductsPageCount,
  notDeliveredProductsPageCount: state.SoldProductsReducers.notDeliveredProductsPageCount,
  routingLocation: state.router.location,
  shopDetails: state.ProductsPageReducers.shopDetails,

});

const mapDispatchToProps = (dispatch) => ({
  setNotDeliveredSoldProducts: (notDeliveredSoldProducts) => dispatch({ type: GET_NOT_DELIVERED_SOLD_PRODUCTS, payload: notDeliveredSoldProducts }),
  setDeliveredSoldProducts: (deliveredSoldProducts) => dispatch({ type: GET_DELIVERED_SOLD_PRODUCTS, payload: deliveredSoldProducts }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateShipment);
