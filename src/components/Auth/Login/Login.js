
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { replace } from 'react-router-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


import './Login.css';
import Loader from '../../../common/Components/Loader';
import { WEB_TOKEN } from '../../../constants/otherConstants';
import agent from '../../../agent';
import NavBar from '../../LandingPage/components/NavBar';
import { SET_USER } from '../../../constants/actionTypes';
import { store } from '../../../store';

// import Logo from '../../../common/Components/Logo';
import '../../LandingPage/LandingPage.css';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        password: '',
      },
      loading: false,
      error: '',
      showPassword: true,
      isPaymentSignUp: false,
    };
  }

  componentWillMount() {
    // if (this.props.user && this.props.) this.setState({ user: this.props.user.user });
    if (this.props.location.hash === '#payment') {
      this.setState({ isPaymentSignUp: true });
    }
  }

  login(e) {
    e.preventDefault();
    this.setState({ loading: true, error: '' });
    const { email, password } = this.state.user;
    const data = { username: email.toLowerCase(), password };
    
    agent.Auth.login(data).then((res) => {
      agent.setToken(res.data.token);
      window.localStorage.setItem(WEB_TOKEN, res.data.token);

      this.props.setUser({ user: res.data.user });
      if (this.state.isPaymentSignUp) {
        const data = {
          plan_id: this.props.choosenPlan.plan_id,
          total_count: 1,
          sub_type: 'PROPACK',
        };

        agent.Purchase.createSubscription(data).then((res) => {
          window.location.href = res.data.payment_url;
          this.setState({ loading: false });
        }).catch((err) => {
          console.log('err in the paymetn', err.response);
        });
      } else {
        store.dispatch(replace('/admin/'));
      }
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err);
      if (err.response) {
        this.setState({ error: err.response.data.error, loading: false });
      }
    });
  }

  render() {
    const { email, password } = this.state.user;
    const { showPassword, user } = this.state;
    return (
      <div>
        <div className="mobile_header_sdk_img">
          <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 1418 995" id="svg-icon">

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
          <NavBar />
          <div className="auth-div center">


            <article className="center  ">

              <div>
                <div>
                  <div className="tc box vertical-align " style={{ position: 'relative' }}>
                    {/* <Logo
                  logostyles={{
                    display: 'flex', flexDirection: 'row', maxWidth: '200px', margin: 'auto',
                  }}
                  parent="login"
                /> */}
                    <h2> Login</h2>
                    <form onSubmit={this.login.bind(this)}>
                      <div className="input-label-div-login">
                        <input
                          type="text"
                          name="phone-number"
                          className="inp"
                          value={email}
                          placeholder=" "
                          onChange={(e) => this.setState({ user: { ...user, email: e.target.value } })}
                          required
                        />
                        <label className="inp-label">
                      Email
                        </label>
                      </div>
                      <div className="input-label-div-login">
                        <input
                          type={!showPassword ? 'text' : 'password'}
                          name="phone-number"
                          className="inp"
                          required
                          value={password}
                          placeholder=" "

                          onChange={(e) => this.setState({ user: { ...user, password: e.target.value.toLowerCase() } })}
                        />
                        <label className="inp-label">
                      password
                        </label>
                        <button type="button" onClick={() => this.setState({ showPassword: !showPassword })}>
                          {showPassword ? <VisibilityOffIcon style={{ color: 'white' }} /> : <VisibilityIcon style={{ color: 'white' }} /> }
                          {' '}
                        </button>
                      </div>
                      <p className="err-txt">{this.state.error}</p>
                      <input type="submit" value="Login" className="login-btn w-100" />
                    </form>
                    <a href="/forgot-password" className="mt2 ">
                  Forgot password
                    </a>
                  </div>

                  <button
                    onClick={() => store.dispatch(replace('/signup'))}
                    className="btn ba w-100 ml0 "
                    type="button"
                    style={{
                      marginLeft: 0, marginTop: '1rem', border: 'solid 1px rgba(0,0,0,0.5)', padding: '10px',
                    }}
                  >
            Don't have an account? Sign up
                  </button>

                  {
                this.state.loading
                  ? (
                    <Loader />
                  ) : null
              }
                </div>
              </div>

            </article>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  choosenPlan: state.PurchaseReducers.choosenPlan,

});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch({ type: SET_USER, payload: user }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
