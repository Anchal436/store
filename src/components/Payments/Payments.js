/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';

import './Payments.css';
import { toast } from 'react-toastify';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SideDrawer from '../AdminPage/components/SideDrawer';
import { store } from '../../store';
import agent from '../../agent';
import {
  GET_PENDING_PAYMENT, GET_REDEEM_HISTORY, GET_BANK_DETAILS, GET_SHIPPING_ADDRESS
} from '../../constants/actionTypes';

import TextInput from '../../common/Components/TextInput';
import Loader from '../../common/Components/Loader';
import CollapseTransition from '../../common/Components/CollapseTransition';
import { USER_DETAILS } from '../../constants/otherConstants';


const wallets = [
  { name: 'Paytm Wallet', img: 'https://img.icons8.com/color/48/000000/paytm.png', key: 'paytm' },
  { name: 'Mobikwik', img: 'http://static.dnaindia.com/sites/default/files/2015/08/10/364016-mobikwik-twitter.png', key: 'mobiKwik' },
  { name: 'Amazon Wallet', img: 'https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Amazon_alt.png', key: 'amazonPayWallet' },
];
const upi = [
  { name: 'PhonePe', img: 'https://www.searchpng.com/wp-content/uploads/2018/11/phone-pe_white-200x200.png', key: 'phonepe' },
  { name: 'Paytm', img: 'https://img.icons8.com/color/48/000000/paytm.png', key: 'paytm' },
  { name: 'Amazon Pay', img: 'https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/Amazon_alt.png', key: 'amazonPayUpi' },
  { name: 'Google Pay', img: 'https://www.searchpng.com/wp-content/uploads/2019/02/Google-Pay-Logo-Icon-PNG-1024x1024.png', key: 'googlePay' },
];
class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      loading: false,
      mobileView: false,
      user: {},
      isNormalUser: true,
      accountDetails: {},
      paymentRedeemHistory: [],
      pendingPayment: 0,
      redeemAmount: 0,
      error: '',
      showBankDetails: false,
      isAccountDetailsPresent: false,
    };
  }

  componentWillMount() {
    // console.log(this.props);
    const { getPendingPayment, getRedeemHistory, getBankDetails,  user } = this.props
    const username = window.localStorage.getItem(USER_DETAILS);
    const data = { username };

    if (user && user.user) {
      const temp = user.user.user_type === 'normal';
      this.setState({ user: user.user, isNormalUser: temp });
    }
    getPendingPayment();
    getRedeemHistory();
    getBankDetails(data);
    
  }

  componentWillReceiveProps(np) {
    if (np.user) {
      if (this.state.user !== np.user.user) {
        const temp = np.user.user.user_type === 'normal';
        this.setState({ user: np.user.user, loading: false, isNormalUser: temp });
      }
    }

    if (np.pendingPayment) {
      this.setState({ pendingPayment: np.pendingPayment });
    }
    if (np.paymentRedeemHistory) {
      this.setState({ paymentRedeemHistory: np.paymentRedeemHistory });
    }
    if (np.bankDetails) {
      this.setState({ accountDetails: np.bankDetails });
      const {
        account_holder_name, account_number, ifsc_code,
      } = np.bankDetails;
      if (account_holder_name, account_number, ifsc_code) {
        this.setState({ isAccountDetailsPresent: true, updated: false });
      } else {
        this.setState({ isAccountDetailsPresent: false, updated: false });
      }
    }
    
  }

  redeem() {
    const {
      redeemAmount, paymentRedeemHistory, pendingPayment, accountDetails, isAccountDetailsPresent,
    } = this.state;
    if (paymentRedeemHistory.filter((p) => p.paid === false).length > 0) {
      this.setState({ redeemError: 'Your one payment redeem is in process, you can request for new payment redeem after the previous one completes' });
      setTimeout(() => this.setState({ redeemError: '' }), 5000);
    } else if (redeemAmount > 0 && redeemAmount <= pendingPayment) {
      if (isAccountDetailsPresent) {
        this.setState({ loading: true, error: '' });
        agent.Payments.redeemAmount({ amount: Number(redeemAmount) }).then((res) => {
          console.log(res);
          toast.info('Redeem request is sent!!!');
          this.setState({ loading: false });
          this.props.getRedeemHistory();
        }).catch((err) => {
          console.log(err, err.response);
          this.setState({ loading: false });
          if (err.response) {
            toast.error(err.response.data.error);
          } else toast.error('Error in sending request!!!');
        });
      } else {
        this.setState({ redeemError: 'Please fill the bank details first' });
        setTimeout(() => this.setState({ redeemError: '' }), 5000);
      }
    } else {
      this.setState({ redeemError: `Redeem amount must be between 1 and ${pendingPayment}` });
      setTimeout(() => this.setState({ redeemError: '' }), 5000);
    }
  }

  addUserAccountDetails(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.state.error === '') {
      this.setState({ loading: true });
      const { account_holder_name, account_number, ifsc_code } = this.state.accountDetails;
      const data = { account_holder_name, account_number, ifsc_code };
      agent.Payments.setBankingDetails(data).then((res) => {
        this.setState({ loading: false, accountDetails: res.data.seller });
        this.props.setBankDetails(res.data);
      }).catch((err) => {
        this.setState({ loading: false });
        console.log('err  in setting bank details', err, err.response);
        if (err.response) {
          toast.error(err.response.data.error);
        }
      });
    }
  }

  formatDate(date) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const current_datetime = new Date(date);
    const formatted_date = `${current_datetime.getDate()}-${months[current_datetime.getMonth()]}-${current_datetime.getFullYear()}`;

    return formatted_date;
  }

  render() {
    const {
      loading, pendingPayment, showBankDetails, accountDetails, isAccountDetailsPresent, error, redeemAmount, paymentRedeemHistory, redeemError, updated,
    } = this.state;
    const {
      account_holder_name, account_number, amount, id, ifsc_code,
    } = accountDetails;
    return (
      <div>
        <SideDrawer user={this.state.user} />

        <div className="admin-bg nav-margin dyna-flex justify-center ">

          <div className="payments-left-div">
            <div className="payment-link" onClick={() => this.setState({ showBankDetails: !showBankDetails })} >
              <div className="flex items-center">
                <AccountBalanceIcon />
                <h3>My Bank</h3>
              </div>
              <div>
                <button className="" type="button" >
                  <ExpandMoreIcon />
                </button>
              </div>

            </div>
            <CollapseTransition visible={showBankDetails}>

              <div>
                <form onSubmit={this.addUserAccountDetails.bind(this)}>
                  <h2>Account Details</h2>
                  <TextInput label="Account-holder Name" value={account_holder_name} type="name" className="w-100" onTextChange={(text) => this.setState({ accountDetails: { ...accountDetails, account_holder_name: text }, updated: true })} required />
                  <TextInput label="Account No." value={account_number} type="password" className="w-100" onTextChange={(text) => this.setState({ accountDetails: { ...accountDetails, account_number: text, confirmAccountNo: '' }, error: '', updated: true })} required />
                  {
                    updated
                      ? <TextInput label="Confirm Account No." value={accountDetails.confirmAccountNo} type="password" className="w-100" onTextChange={(text) => this.setState({ accountDetails: { ...accountDetails, confirmAccountNo: text }, error: text !== account_number ? '*Account No. not matching' : '', updated: true })} required />
                      : null
                  }

                  <p className="err-txt">{error}</p>

                  <TextInput label="IFSC code" value={ifsc_code} type="text" className="w-100" onTextChange={(text) => this.setState({ accountDetails: { ...accountDetails, ifsc_code: text }, updated: true })} required pattern="^[A-Za-z]{4}[a-zA-Z0-9]{7}$" />
                  <button type="submit" className="color-btn w-100 ">
                    {' '}
                    {isAccountDetailsPresent ? 'Update Details' : 'Save Details'}
                    {' '}
                  </button>
                </form>
              </div>
            </CollapseTransition>
            <div className="payments-top-div">
              <h1>
                Amount to redeem :
                <span>
                  {pendingPayment}
                </span>
                <small>Rs </small>
              </h1>
              <div className="flex items-center">
                <TextInput label="Amount " value={redeemAmount} type="number" className="w-100" onTextChange={(text) => this.setState({ redeemAmount: text })} required />
                <button type="button" onClick={this.redeem.bind(this)} className="color-btn h-100 pa2 "> redeem </button>
              </div>
              <p className="err-txt">{redeemError}</p>
            </div>
            <div className="redeem-payment-history-div">
              <h2>
                Redeem history
              </h2>
              <ol>
                {
                paymentRedeemHistory.map((h, i) => (
                  <li className="redeem-payment-history" key={i}>
                    <h4>
                      {`${this.formatDate(h.created_at)} `}
                    </h4>
                    <h4>
                      {`${h.amount}`}
                      {' '}
                      <small>Rs </small>
                    </h4>

                    { h.paid ? <p className="green"> Paid </p> : <p className="err-txt"> Pending</p> }

                  </li>
                ))
              }
              </ol>
            </div>


          </div>
          {/* <div className="payments-right-div"> */}


          {/* <div className=" bb">
              <h2> Payment Wallets </h2>
              <div>
                {
                        wallets.map((w, i) => {
                          i += 1;
                          return (
                            <div>
                              <div className="payment-link" key={i}>
                                <div className="flex">
                                  <img src={w.img} />
                                  <h3>{w.name}</h3>
                                </div>
                                <div>
                                  <button className="color-btn" type="button" onClick={() => this.setState({ visibleIndex: i })}>Link</button>
                                </div>

                              </div>
                              <CollapseTransition visible={visibleIndex === i}>
                                <div className="flex items-center ">
                                  <TextInput label="Enter Mobile No." value={this.state[w.key]} type="text" className="w-100" onTextChange={(text) => this.setState({ [w.key]: text })} required />
                                  <button className="green-btn h-100">Link Wallet</button>
                                </div>
                              </CollapseTransition>
                            </div>
                          );
                        })
                    }
              </div>

            </div>
            <div>
              <h2> UPI  </h2>
              <div>
                {
                       upi.map((w, i) => {
                         i += 1;
                         return (
                           <div>
                             <div className="payment-link" key={i}>
                               <div className="flex">
                                 <img src={w.img} />
                                 <h3>{w.name}</h3>
                               </div>
                               <div>
                                 <button className="color-btn" type="button" onClick={() => this.setState({ visibleIndex: i * 10 })}>Link</button>
                               </div>

                             </div>
                             <CollapseTransition visible={visibleIndex === i * 10}>
                               <div className="flex items-center ">
                                 <TextInput label="Enter Mobile No." value={this.state[w.key]} type="text" className="w-100" onTextChange={(text) => this.setState({ [w.key]: text })} required />
                                 <button className="green-btn h-100">Link UPI</button>
                               </div>
                             </CollapseTransition>
                           </div>
                         );
                       })
                    }
              </div>
            </div> */}
          {/* </div> */}

        </div>
        {
          loading ? <Loader /> : null
        }

      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  pendingPayment: state.PaymentsReducers.pendingPayment,
  paymentRedeemHistory: state.PaymentsReducers.paymentRedeemHistory,
  bankDetails: state.PaymentsReducers.bankDetails,
  
});

const mapDispatchToProps = (dispatch) => ({
  getPendingPayment: () => dispatch({ type: GET_PENDING_PAYMENT, payload: agent.Payments.getPendingPayment() }),
  getRedeemHistory: () => dispatch({ type: GET_REDEEM_HISTORY, payload: agent.Payments.getRedeemHistory() }),
  getBankDetails: () => dispatch({ type: GET_BANK_DETAILS, payload: agent.Payments.getBankDetails() }),
  setBankDetails: (details) => dispatch({ type: GET_BANK_DETAILS, payload: details }),
  
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);
