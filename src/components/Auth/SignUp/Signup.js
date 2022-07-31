/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { replace } from 'react-router-redux';
import './Signup.css';
import '../Login/Login.css';
import '../../LandingPage/LandingPage.css';
import agent from '../../../agent';
import { WEB_TOKEN } from '../../../constants/otherConstants';
import NavBar from '../../LandingPage/components/NavBar';
import { SET_USER } from '../../../constants/actionTypes';
// import Logo from '../../../common/Components/Logo';
import { store } from '../../../store';


class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        name: '',
        phone: '',
        college: {
          id: 2,
          created_at: '2020-04-05T15:05:04Z',
          updated_at: '2020-04-05T15:05:17.482Z',
          name: 'Test College 2',
          address: 'Test College 2 address',
          state: 'Test College 2 state',
          has_college_email: false,
        },
        password: '',
        email: '',
      },
      activeStep: 0,
      loading: false,
      err: '',
      confirmPassword: '',
      isPaymentSignUp: false,
    };
    this.colleges = [];
  }

  componentDidMount() {
    if (this.props.location.hash === '#payment') {
      this.setState({ isPaymentSignUp: true });
    }
  }

  componentWillReceiveProps(np) {
  }

  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleChangeCollege(e) {
    this.setState({ user: { ...this.state.user, college: e.target.value } });
  }

  signUp(e) {
    e.preventDefault();

    const {
      email, password, name, phone, username,
    } = this.state.user;
    if (password === this.state.confirmPassword) {
      if (!(username.includes(' ') || username.includes('%') || username.includes('@'))) {
        const data = {
          college: 1,
          name,
          phone,
          email: email.toLowerCase(),
          password: password.toLowerCase(),
          username,
        };
        this.setState({ error: '' });

        this.setState({ loading: true, error: '' });

        agent.Auth.register(data).then((res) => {
          agent.Auth.sendVerificationEmail({ email }).catch((err) => { console.log(err.response); });
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
              this.setState({ loading: false, error: '' });
            });
          } else {
            store.dispatch(replace('/admin/'));
            this.setState({ loading: false, error: '' });
          }
        }).catch((err) => {
          console.log(err);
          if (err.response) {
            this.setState({ error: err.response.data.error, loading: false });
          } else {
            this.setState({ loading: false, error: 'An error occured!!!' });
          }
        });
      } else {
        this.setState({ error: 'username cannot contain @, space or %' });
      }
    }
  }

  confirmPassword(pass) {
    const { password } = this.state.user;
    if (password !== pass) {
      this.setState({ error: 'Password Does not match !!!' });
    } else {
      this.setState({ error: '' });
    }
    this.setState({ confirmPassword: pass });
  }

  render() {
    const { college } = this.state.user;
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
                <div className="">
                  <div className="  tc box vertical-align center" style={{ position: 'relative' }}>
                    {/* <Logo
                      logostyles={{
                        display: 'flex', flexDirection: 'row', maxWidth: '200px', margin: 'auto',
                      }}
                      parent="login"
                    /> */}
                    <h2> SignUp </h2>
                    <form className="tc" onSubmit={this.signUp.bind(this)}>
                      <div className="input-label-div">
                        <input
                          type="text"
                          name="name"
                          placeholder=" "
                          className="inp"
                          value={this.state.user.name}
                          onChange={(e) => this.setState({ user: { ...this.state.user, name: e.target.value } })}
                          required
                        />
                        <label className="inp-label" name="name">
                        Name
                        </label>
                      </div>
                      <div className="input-label-div">
                        <input
                          type="number"
                          name="phone"
                          className="inp"
                          placeholder=" "
                          required
                      // maxLength="10"
                        // minLength={10}
                          pattern="[1-9]{1}[0-9]{9}"
                          value={this.state.user.phone}
                          onChange={(e) => this.setState({ user: { ...this.state.user, phone: e.target.value } })}
                        />
                        <label className="inp-label">
                        Mobile number
                        </label>
                      </div>
                      <div className="input-label-div">
                        <input
                          type="email"
                          name="email"
                          placeholder=" "
                          className="inp"
                          value={this.state.user.email}
                          onChange={(e) => this.setState({ user: { ...this.state.user, email: e.target.value } })}
                          required
                        />
                        <label className="inp-label">
                      Email
                        </label>

                      </div>
                      <div className="input-label-div">
                        <input
                          type="text"
                          name="username"
                          className="inp"
                          placeholder=" "
                          required
                      // maxLength="10"
                        // minLength={10}

                          value={this.state.user.username}
                          onChange={(e) => this.setState({ user: { ...this.state.user, username: e.target.value } })}
                        />
                        <label className="inp-label">
                        Username
                        </label>
                      </div>
                      <div className="input-label-div">
                        <input
                          type="password"
                          name="password"
                          placeholder=" "
                          className="inp"
                          required
                          value={this.state.user.password}
                          onChange={(e) => this.setState({ user: { ...this.state.user, password: e.target.value } })}
                        />
                        <label className="inp-label">
                      Password
                        </label>
                      </div>
                      <div className="input-label-div">
                        <input
                          type="password"
                          name="password"
                          className="inp"
                          required
                          placeholder=" "
                          value={this.state.confirmPassword}
                          onChange={(e) => this.confirmPassword(e.target.value)}
                        />
                        <label className="inp-label">
                      Confirm Password
                        </label>
                      </div>
                      {/* <div className="input-label-div">
                      <select id="college" className=" inp mt1" onChange={(e) => this.handleChangeCollege(e)}>
                        {
                        this.colleges.map((c, i) => (
                          <option value={c} key={c.id}>{c.name}</option>
                        ))
                      }
                      </select>
                      <label className="inp-label">
                       Select College
                      </label>
                    </div> */}

                      <div className="flex  w-100  ">
                        <input type="submit" value="Sign up" className="login-btn w-100 self-center center" />

                      </div>
                      <p className="err-txt">{this.state.error}</p>
                    </form>
                    {
            this.state.loading
              ? (
                <div className="loading">
                  <CircularProgress />
                </div>
              ) : null
          }
                  </div>
                  <button
                    onClick={() => store.dispatch(replace(`/login${this.props.location.hash}`))}
                    className="btn ba w-100 ml0  "
                    style={{
                      marginLeft: 0, marginTop: '1rem', border: 'solid 1px rgba(0,0,0,0.5)', padding: '15px',
                    }}
                  >
          Have an account? Login
                  </button>
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
  choosenPlan: state.PurchaseReducers.choosenPlan,
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch({ type: SET_USER, payload: user }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);
