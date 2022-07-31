/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
// import { push } from 'react-router-redux';

import './IsEmailVerified.css';
import CancelTwoToneIcon from '@material-ui/icons/CancelTwoTone';
import Loader from '../../common/Components/Loader';
import { store } from '../../store';
import agent from '../../agent';
import CollapseTransition from '../../common/Components/CollapseTransition';

import { GET_USER_DETAILS } from '../../constants/actionTypes';

class IsEmailVerified extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      show: false,
      showSuccess: false,
    };
  }

  componentWillMount() {
    if (this.props.user && this.props.user.user) {
      this.setState({ user: this.props.user.user, show: !this.props.user.user.is_validated });
    }
  }


  componentWillReceiveProps(np) {
  }

  emailSent() {
    setTimeout(() => this.setState({ show: false, showSuccess: true, loading: false }), 3000);
  }

  sendLink() {
    this.setState({ show: true, loading: true, showSuccess: false });

    const { email } = this.state.user;
    agent.Auth.sendVerificationEmail({ email })
      .then((res) => {
        this.setState({ show: true, loading: false, showSuccess: true });
        const { userName } = this.state.user;
        const data = { username: userName };


        this.emailSent();
      })
      .catch((err) => {
        console.log('err in sending verification email', err);
        this.setState({ show: true, showSuccess: false, loading: false });
      });
  }

  render() {
    const { show, showSuccess, loading } = this.state;
    return (

      <CollapseTransition visible={show} className="isVerified-div flex ">
        <div style={{ position: 'relative', width: '100%' }}>

          {
                showSuccess ? (

                  <div>
                    <p>A link has been sent to your email check it to verify the account.</p>
                  </div>

                )
                  : (
                    <div className="flex items-center">

                      <p>
                        {"Email not verified "}
                        <b className="underline b a" onClick={this.sendLink.bind(this)}>click here</b>
                        
                        {" to verify your Verify."}
                      </p>

                      <CancelTwoToneIcon
                        style={{ color: 'white', width: '20px', height: '20px' }}
                        className="pointer grow"
                        onClick={() => this.setState({ show: false })}
                      />


                    </div>
                  )

              }
          {
                loading ? <Loader size="small" /> : null
              }
        </div>
      </CollapseTransition>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (user) => store.dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IsEmailVerified);
