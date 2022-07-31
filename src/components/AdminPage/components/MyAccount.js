/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';

import 'tachyons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import './styles.css';
import { toast } from 'react-toastify';

import TextInput from '../../../common/Components/TextInput';
import Loader from '../../../common/Components/Loader';
import Logo from '../../../common/Components/Logo';
import Switch from '../../../common/Components/Switch';
import CollapseTransition from '../../../common/Components/CollapseTransition';
import { store } from '../../../store';
import {
  GET_USER_DETAILS, SET_USER, GET_SHOP_DETAILS, GET_PUBLIC_PAGE_SHOP_DETAILS,
} from '../../../constants/actionTypes';
import { WEB_TOKEN, ERROR_MSG } from '../../../constants/otherConstants';
import agent from '../../../agent';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'];

const countries = ['India'];

class MyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      myAccountDialogOpen: false,
      error: '',
      shopDetails: { country: countries[0], state: states[0] },
      user: {
        name: '', email: '', username: '', phone: '', is_validated: '',
      },
      shopDetailsChanged: false,
      userDetailsChanged: false,
    };
    this.countrySelectRef = React.createRef();
    this.stateSelectRef = React.createRef();
    this.togelMyAccountDialogOpen = this.togelMyAccountDialogOpen.bind(this);
    this.togelFreeDeliveryAfterInput = this.togelFreeDeliveryAfterInput.bind(this);
    this.showChangeHeaderDialog = this.showChangeHeaderDialog.bind(this);
  }

  componentDidMount() {
    const { user, shopDetails } = this.props;
    if (user && user.user) {
      const temp = user.user.user_type === 'normal';
      this.setState({ user: user.user, isNormalUser: temp });
    }

    if (shopDetails) {
      this.updateShopDetails(shopDetails);
    }
  }

  componentWillReceiveProps(np) {
    if (np.routingLocation) {
      if (np.routingLocation.query) {
        this.setState({ myAccountDialogOpen: np.routingLocation.query.myAccount });
      }
    }
    if (np.shopDetails) {
      this.updateShopDetails(np.shopDetails);
    }
  }


  onChangeUsername(text) {
    if ((text.includes(' ') || text.includes('%') || text.includes('@'))) {
      this.setState({ userDetailsChanged: true, user: { ...this.state.user, username: text.toLowerCase() }, error: 'username cannot contain @, space or %' });
    } else {
      this.setState({ userDetailsChanged: true, user: { ...this.state.user, username: text.toLowerCase() }, error: '' });
    }
  }

  onChangeName(text) {
    this.setState({ userDetailsChanged: true, user: { ...this.state.user, name: text }, error: '' });
  }

  onChangeEmail(text) {
    this.setState({ userDetailsChanged: true, user: { ...this.state.user, email: text }, error: '' });
  }

  updateShopDetails(shopDetails) {
    if (!shopDetails) return;
    if (!shopDetails.shop_address) {
      this.setState({ shopDetails });
      return;
    }
    let shop_address = '';
    let shop_no = '';
    const shop_address_util = shopDetails.shop_address.split(',');

    if (shop_address_util && shop_address_util.length > 0) {
      shop_no = shop_address_util[0];
      shop_address_util.map((s, i) => {
        if (i > 0) {
          shop_address += `,${s}`;
        }
      });
      shop_address = shop_address.substring(2);
    }
    if (this.countrySelectRef && this.countrySelectRef.current) {
      if (shopDetails.country) {
        Object.keys(this.countrySelectRef.current.children).forEach((c) => {
          const child = this.countrySelectRef.current.children[c];
          if (child.value === shopDetails.country) {
            child.selected = true;
          }
        });
      } else {
        this.setState({
          shopDetails: {
            ...shopDetails, country: countries[0], shop_no, shop_address,
          },
        });
      }
    } else {
      this.setState({
        shopDetails: {
          ...shopDetails, country: countries[0], shop_no, shop_address,
        },
      });
    }
    if (this.stateSelectRef && this.stateSelectRef.current) {
      if (shopDetails.state) {
        Object.keys(this.stateSelectRef.current.children).forEach((c) => {
          const child = this.stateSelectRef.current.children[c];
          if (child.value === shopDetails.state) {
            child.selected = true;
          }
        });
        this.setState({
          shopDetails: {
            ...shopDetails, state: states[0], shop_no, shop_address,
          },
        });
      }
    } else {
      this.setState({
        shopDetails: {
          ...shopDetails, state: states[0], shop_no, shop_address,
        },
      });
    }
  }


  togelMyAccountDialogOpen() {
    // this.setState({ myAccountDialogOpen: !this.state.myAccountDialogOpen });
    const { myAccountDialogOpen } = this.state;

    if (myAccountDialogOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&myAccount=true`
        : `${window.location.pathname}?myAccount=true`;
      store.dispatch(push(path));
    }
  }

  showChangeHeaderDialog() {
    const { routingLocation } = this.props;
    
    if (routingLocation.query) {
      const { tab } = routingLocation.query;
      if (tab) {
        const path = `${window.location.pathname}?tab=${tab}&changeHeader=true`;
        store.dispatch(push(path));
      } else {
        const path = `${window.location.pathname}?changeHeader=true`;
        store.dispatch(push(path));
      }
    }
  }


  saveDetails(e) {
    e.preventDefault();
    const { name, username, email } = this.state.user;
    const data = { username, name, email: email.toLowerCase() };
    if (!(username.includes(' ') || username.includes('%') || username.includes('@'))) {
      this.setState({ loading: true, error: '' });
      agent.AdminPage.updateUserDetails(data).then((res) => {
        // this.props.getUserDetails(data);
        agent.setToken(res.data.token);
        window.localStorage.setItem(WEB_TOKEN, res.data.token);
        this.props.setUser({ user: res.data.user });
        this.setState({ loading: false, error: '', userDetailsChanged: false });
        this.togelMyAccountDialogOpen();
      }).catch((err) => {
        console.log(err.response.data);
        if (err.response.status === 401) {
          this.setState({ loading: false, error: 'Username Already Present !!!' });
        } else {
          toast.error(ERROR_MSG);
          this.setState({ loading: false, error: 'Error Occurred in updating details !!!' });
        }
      });
    }
  }

  uploadShopDetails(e) {
    if (e) {
      e.preventDefault();
    }
    const { shopDetails } = this.state;
    const data = {
      ...shopDetails,
      shipping_area: `${shopDetails.shipping_area}`,
      shop_address: `${shopDetails.shop_no}, ${shopDetails.shop_address}`,
      pincode: shopDetails.pincode,
      country: shopDetails.country || countries[0],
      state: shopDetails.state || states[0],
      city: shopDetails.city,
      free_delivery_above_amount: shopDetails.free_delivery_above_amount ? Number(shopDetails.free_delivery_above_amount) : 0,
    };

    this.setState({ loading: true });
    agent.ProductsPage.setShopDetails(data).then((res) => {
      const { setShopDetails, shopDetails, setPublicPageShopDetails } = this.props;
      const data = { ...shopDetails, ...res.data };

      setShopDetails(data);
      setPublicPageShopDetails(data);
      this.setState({ loading: false, shopDetailsChanged: false });
    }).catch((err) => {
      console.log(err);
      this.setState({ loading: false });
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
    });
  }

  togelFreeDeliveryAfterInput() {
    const { shopDetails } = this.state;
    this.setState({ shopDetails: { ...shopDetails, has_free_delivery_above_amount: !shopDetails.has_free_delivery_above_amount }, shopDetailsChanged: true });
  }

  render() {
    const {
      shopDetails, user, error, loading, shopDetailsChanged, userDetailsChanged,
    } = this.state;
    const {
      name, email, username, phone, is_validated, links,
    } = user;

    const {
      pincode, free_delivery_above_amount, city, shipping_area, has_free_delivery_above_amount, shop_address, shop_no,
    } = shopDetails;
    return (
      <div className="w-100 h-100">
        <button type="button" className="side-drawer-link relative" onClick={() => this.togelMyAccountDialogOpen()}>
          <AccountCircleIcon />
            My Account
        </button>
        <Dialog
          open={this.state.myAccountDialogOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.togelMyAccountDialogOpen}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          style={{ width: '100%' }}
          fullScreen
          contentStyle={{ width: '100%', maxWidth: 'none' }}
        >
          <DialogTitle>
            My Account
          </DialogTitle>
          <DialogContent>
            <div className="bb pb3">
              <h3 className="underline"> Shop Details:</h3>
              <div className="flex justify-between mt1 mb1">
                <Logo />
                <button type="button" className="green-btn" onClick={this.showChangeHeaderDialog}>Edit</button>
              </div>
              <div>
                <form onSubmit={this.uploadShopDetails.bind(this)}>

                  <TextInput
                    label="Deliverable Areas"
                    value={shipping_area}
                    className="w-100"
                    type="text"
                    onTextChange={(text) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, shipping_area: text } })}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p>Enable free delivery: </p>
                    <Switch togelswitch={this.togelFreeDeliveryAfterInput} val={has_free_delivery_above_amount} />
                  </div>
                  <CollapseTransition visible={has_free_delivery_above_amount}>
                    <TextInput
                      label="Minimum cart value for free delivery (in Rs.)"
                      value={free_delivery_above_amount}
                      className="w-100"
                      type="number"
                      onTextChange={(text) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, free_delivery_above_amount: text } })}
                      required
                    />
                  </CollapseTransition>
                  <div className="flex">
                    <TextInput
                      label="Shop Number"
                      value={shop_no}
                      className="w-20-l"
                      type="number"
                      onTextChange={(text) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, shop_no: text } })}
                      required
                    />
                    <TextInput
                      label="Shop Address"
                      value={shop_address}
                      type="text"
                      className="w-100"
                      onTextChange={(text) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, shop_address: text } })}
                      required
                    />
                  </div>
                  <TextInput
                    label="City"
                    value={city}
                    type="text"
                    className="w-100"
                    onTextChange={(text) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, city: text } })}
                    required
                  />
                  <div className="payment-form-flex-input">
                    <select onChange={(e) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, country: e.target.value } })} ref={this.countrySelectRef}>
                      {
                          countries.map((s, i) => (
                            <option value={s} key={i}>{s}</option>
                          ))
                      }
                    </select>
                    <select onChange={(e) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, state: e.target.value } })} ref={this.stateSelectRef}>
                      {
                          states.map((s, i) => (
                            <option value={s} key={i}>{s}</option>
                          ))
                      }
                    </select>

                  </div>
                  <TextInput
                    label="PIN code"
                    value={pincode}
                    type="number"
                    className="w-100"
                    style={{ flexGrow: 1 }}
                    onTextChange={(text) => this.setState({ shopDetailsChanged: true, shopDetails: { ...shopDetails, pincode: text } })}
                    required
                  />
                  <CollapseTransition visible={shopDetailsChanged}>
                    <button className="green-btn w-100" type="submit">
                      Update Shop Details
                    </button>
                  </CollapseTransition>
                </form>
              </div>

            </div>
            <h3 className="underline"> Social media links: </h3>
            <div className="bb pb3 dyna-flex justify-between items-center">
              <div className="flex center items-center">
                {
                links && links.map((l) => (
                  <img src={l.icon} alt="" style={{ width: '40px', margin: '10px' }} key={l.id} />
                ))
              }
              </div>
              <button type="button" className="color-btn" onClick={() => store.dispatch(push('/admin'))}>Add Social media Links</button>
            </div>
            <div>
              <form onSubmit={this.saveDetails.bind(this)}>
                <div className="">
                  <TextInput style={{ flexGrow: 1 }} label="Username" value={username} onTextChange={this.onChangeUsername.bind(this)} />
                </div>
                <TextInput label="Name" value={name} onTextChange={this.onChangeName.bind(this)} />
                <TextInput label="email" value={email} disabled={is_validated} onTextChange={this.onChangeEmail.bind(this)} />
                <TextInput label="Phone" value={phone} disabled />
                <p className="err-txt">{error}</p>
                <CollapseTransition visible={userDetailsChanged}>
                  <button type="submit" className="green-btn w-100">Save User Details</button>
                </CollapseTransition>

              </form>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              type="button"
              className=" white"
              style={{
                background: 'red', border: 'none', borderRadius: '5px', padding: '10px', letterSpacing: '1px',
              }}
              onClick={this.togelMyAccountDialogOpen}
            >

            Close
            </button>

          </DialogActions>
          {
            loading ? <Loader /> : null
          }

        </Dialog>


      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  routingLocation: state.router.location,
  shopDetails: state.ProductsPageReducers.shopDetails,

});

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (user) => dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
  setUser: (user) => dispatch({ type: SET_USER, payload: user }),
  setShopDetails: (address) => dispatch({ type: GET_SHOP_DETAILS, payload: address }),
  setPublicPageShopDetails: (details) => dispatch({ type: GET_PUBLIC_PAGE_SHOP_DETAILS, payload: details }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAccount);
