/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';
import './styles.css';

import HomeIcon from '@material-ui/icons/Home';
import agent from '../../../agent';

import Loader from '../../../common/Components/Loader';
import Logo from '../../../common/Components/Logo';
import { store } from '../../../store';
import { GET_USER_DETAILS, GET_PUBLIC_PAGE_HEADER_INFO } from '../../../constants/actionTypes';
import paymentReceipt from '../../../assets/Images/payment-receipt.png';

import { DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: { profile_pic: null, link: [], username: '' },
      textColor: DEFAULT_TEXT_COLOR,
    };
    this.links = [];
    this.cartItems = [];
  }

  componentWillMount() {
    const { publicPageUser } = this.props;
    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
  }

  componentWillReceiveProps(np) {
    if (np.publicPageUser) {
      this.setState({ user: np.publicPageUser });
    }
  }

  render() {
    const { user, loading, textColor } = this.state;
    const { parent } = this.props;
    return (
      <div className=" ">
        {/* <div className="home-page-nav-div">
          <Logo
            logostyles={{
              display: 'flex', flexDirection: 'row', color: textColor,
            }}
            parent={!parent ? 'public-home-page' : parent}
            username={user.username}
          />
          <button className="home-page-cart-div relative" type="button" onClick={() => store.dispatch(push(`/${user.username}`))}>
            <HomeIcon style={{ color: 'white' }} />
            <span style={{ color: textColor, fontWeight: 'bold' }}>
                Home
            </span>
          </button>
        </div> */}

        <div className=" payment-output ">
          <div className="dyna-width">
            <div className=" center">
              <article className="payment-output-main-div">
                <div className="logo-div">
                  <Logo
                    logostyles={{
                      display: 'flex', flexDirection: 'row', margin: 'auto', color: 'black',
                    }}
                    parent={!parent ? 'public-home-page' : parent}
                    username={user.username}
                  />
                </div>
                <img src={paymentReceipt} alt='' />

                <h2> Payment Failed  </h2>
                <p>Sorry , We are facing some issue, It will get resolved shortly.</p>
                <p>If some money is deducted from your account then money will get transferred to our account within 5-7 working days.</p>
                <p>Please try after some time.</p>
                <p>Thank you for shopping with us.</p>
                <button className=" relative" type="button" onClick={() => store.dispatch(push(`/${user.username}`))}>
                  <HomeIcon />
                  <span style={{ fontWeight: 'bold' }}>
                Go To Home
                  </span>
                </button>
              </article>
            </div>
          </div>
        </div>


        {
              loading
                ? <Loader />
                : null
          }
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  publicPageUser: state.HomePageReducers.publicPageUser,

});

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (user) => store.dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
  getPublicPageHeaderInfo: (user) => dispatch({ type: GET_PUBLIC_PAGE_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
