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
import { GET_USER_DETAILS, GET_PUBLIC_PAGE_HEADER_INFO, CLEAR_CART } from '../../../constants/actionTypes';
import { DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';
import paymentReceipt from '../../../assets/Images/payment-receipt.png';


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: { profile_pic: null, link: [], username: '' },
      textColor: DEFAULT_TEXT_COLOR,
    };
    this.cartItems = [];
  }

  componentWillMount() {
    const { clearCart, publicPageUser } = this.props;
    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
    clearCart();
  }

  componentWillReceiveProps(np) {
    if (np.publicPageUser) {
      this.setState({ user: np.publicPageUser });
    }
  }

  render() {
    const { user, profile_pic } = this.state;
    const { textColor } = this.state;
    return (
      <div className="  ">
        {/* <div className="home-page-nav-div">
          <Logo
            logostyles={{
              display: 'flex', flexDirection: 'row',
            }}
            parent="public-home-page"
            username={user.username}
          />
          <button className="home-page-cart-div relative" type="button" onClick={() => store.dispatch(push(`/${user.username}/`))}>
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
                    parent="public-home-page"
                    username={user.username}
                  />
                </div>
                <img src={paymentReceipt} alt="" />
                <h2> Order Confirmed  </h2>
                <p>We have received your order.</p>
                <p>You will receive a message regarding your order shortly.</p>
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
              this.state.loading
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
  clearCart: () => store.dispatch({ type: CLEAR_CART }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
