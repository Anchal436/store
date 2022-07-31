/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';

import NavBar from '../LandingPage/components/NavBar';
import './Purchase.css';
import { store } from '../../store';
import { WEB_TOKEN, USER_DETAILS } from '../../constants/otherConstants';
import Footer from '../LandingPage/components/Footer';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      token: null,
      username: null,
    };
  }

  componentWillMount() {
    if (window.localStorage.getItem(WEB_TOKEN)) {
      this.setState({ token: window.localStorage.getItem(WEB_TOKEN), username: window.localStorage.getItem(USER_DETAILS), loggedIn: true });
    }

    this.setState({ choosenPlan: this.props.choosenPlan });
  }

  componentWillReceiveProps(np) {
  }

  render() {
    const {
      disc_price, features, planName, price, type,
    } = this.state.choosenPlan;
    const { loggedIn, username } = this.state;
    return (
      <div className="gradient-bg-landing-page">
        <div className="mobile_header_sdk_img">
          <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 1418 995">

            <defs>
              <clipPath id="clip-path">

                <rect id="Rectangle_696" data-name="Rectangle 696" className="cls-1" width="1418" height="995" transform="translate(502)" />
              </clipPath>
            </defs>
            <g id="Mask_Group_36" data-name="Mask Group 36" className="cls-2" transform="translate(-502)">

              <path id="Path_546" data-name="Path 546" className="cls-3" d="M3690.005,707.591c133.569,324.227,422.867,194.932,474.868,344.832s-34.88,420.957,447.224,625.954,468.65,145.523,468.65,145.523-28.86-370.6,111.43-621.966-116.268-156.175-44.342-331.1S5091.89,707.666,5126.521,653.2s-274.385,42.715-356.968-32.25,50.616,8.33-303.69-13.883-58.607-24.989-338.322-22.212S3556.437,383.365,3690.005,707.591Z" transform="translate(-3235.185 -479.435) rotate(-4)" />

            </g>
          </svg>
        </div>
        <div className="main-background">
          <NavBar loggedIn={this.state.loggedIn} />

          <div className="">

            <div className="purchase-main-div">

              <div className="purchase-header-div">
                <h1>{planName}</h1>
                <div className="purchase-price-div">
                  <strike>
                  Rs.
                    {price}
                  </strike>
                  <h1>
                    Rs.
                    {disc_price}
                    <span>

                      {type}
                    </span>
                  </h1>
                </div>
              </div>


              <div className="purchase-features-div">
                <h2>What are you getting</h2>
                <div className="ul-list">
                  <ul>
                    {
                        features.map((f, i) => {
                          if (i % 2 === 0) {
                            return (
                              <li key={i}>
                                {f}
                              </li>
                            );
                          }
                          return null;
                        })
                    }
                  </ul>
                  <ul>
                    {
                        features.map((f, i) => {
                          if (i % 2 !== 0) {
                            return (
                              <li key={i}>
                                {f}
                              </li>
                            );
                          }
                          return null;
                        })
                    }
                  </ul>
                </div>
              </div>
              <div className="purchase-button-div">
                {
                      loggedIn
                        ? (
                            
                          <button type="button" onClick={() => store.dispatch(push('/signup#payment'))}>
                          
                            {`Continue as ${username} ` }
                          
                          </button>
                          
                        
                        ) : null
                }
                {
                    loggedIn?
                    <div className='flex items-center mr5 ml5  justify-center'>
                        <p>OR</p>
                    </div>:null
                }
                <button type="button" onClick={() => store.dispatch(push('/signup#payment'))}> Sign up</button>
              </div>
            </div>
            <Footer />
          </div>

        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  choosenPlan: state.PurchaseReducers.choosenPlan,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
