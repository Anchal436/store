/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';

import './AuthScreen.css';

import Signup from './SignUp/Signup';
import Login from './Login/Login';
import agent from  '../../agent'
import { GET_COLLEGES }from  '../../constants/actionTypes'

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignup: false,
      user:{username: '',
      password: '',}
    };
    this.auth = {};
    this.colleges=[];
  }

  changeScreen(user) {
    if(user)
    this.setState({ showSignup: !this.state.showSignup,user:{username:user.username,password:user.password} });
    else
    this.setState({ showSignup: !this.state.showSignup });
  }

  componentWillMount() {
    // this.props.getColleges();
  }

  componentWillReceiveProps(np) {
    if(np.auth){
      if (this.auth !== np.auth) {
        this.auth = np.auth;
      }
      this.colleges = np.auth.colleges
    }
  }

  render() {
    return (
      <div className="auth-div center">
        <article className="center  ">
          <div>
            {
                this.state.showSignup ? <Signup changeScreen={this.changeScreen.bind(this)} colleges={this.colleges} /> : <Login changeScreen={this.changeScreen.bind(this)} user={this.state.user} />
            }


          </div>

        </article>


      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  auth: state.AuthReducer,
});

const mapDispatchToProps = (dispatch) => ({
  getColleges: () => dispatch({ type: GET_COLLEGES, payload: agent.Auth.getColleges() }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthScreen);
