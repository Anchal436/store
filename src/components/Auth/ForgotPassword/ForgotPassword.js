
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';

import './ForgotPassword.css';
import Loader from '../../../common/Components/Loader';

import agent from '../../../agent';

import { store } from '../../../store';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
      error: '',
    };
  }

  componentWillMount() {
    
  }

  sendLink(e) {
    e.preventDefault();
    this.setState({ loading: true, error: '' });
    const email = this.state;
    const data = { email };
    console.log(data);
    // agent.Auth.login(data).then((res) => {
    //   agent.setToken(res.data.token);
    //   window.localStorage.setItem(WEB_TOKEN, res.data.token);
    //   // window.localStorage.setItem(USER_DETAILS, JSON.stringify(res.data.user));
    //   this.props.setUser({ user: res.data.user });
    //   store.dispatch(push('/account'));
    //   this.setState({ loading: false });
    // }).catch((err) => {
    //   this.setState({ loading: false });

    //   if (err.response) {
    //     this.setState({ error: err.response.data.error, loading: false });
    //   }
    // });
  }

  render() {
    const { email } = this.state;
    return (
      <div className="auth-div center">
        <article className="center  ">
          <div className=" ba tc pa4 box vertical-align " style={{ position: 'relative' }}>


            <h1 className=" heading center">Instagram</h1>
            <h3 className="">Forgot Password</h3>
            <p className="">A link will be sent to your email to set new password.</p>

            <form onSubmit={this.sendLink.bind(this)}>


              <div className="input-label-div">
                <input
                  type="text"
                  name="phone-number"
                  className="inp"
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                  required
                />
                <label className="inp-label">
                Enter your Email
                </label>
              </div>

              <p className="err-txt">{this.state.error}</p>
              <input type="submit" value="Send Link" className="color-btn" />
            </form>

          </div>

          {
        this.state.loading
          ? (
            <Loader />
          ) : null
            }
        </article>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
    user: state.AuthReducer.user,

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPassword);
