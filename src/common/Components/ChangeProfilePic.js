/* eslint-disable react/no-deprecated */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { toast } from 'react-toastify';

import agent from '../../agent';
import ProfilePIc from './ProfilePIc';
import Loader from './Loader';
import { GET_USER_DETAILS } from '../../constants/actionTypes';

class ChangeProfilPic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      error: '',
      version: 'picture',
    };
  }


  componentWillMount() {
    if (this.props.user && this.props.user.user) {
      this.setState({ user: this.props.user.user });
    }
    if (this.props.version) {
      this.setState({ version: this.props.version });
    }
  }

  componentWillReceiveProps(np) {
    if (np.user && np.user.user) {
      if (this.state.user !== np.user.user) this.setState({ user: np.user.user });
    }
  }

  selectProfilePic({ blob }) {
    this.setState({ loading: true, error: '' });
    const data = [{ key: 'photo', file: blob }];
    agent.Auth.uploadProfileImage(data).then((res) => {
      const data = { username: this.state.user.username };
      this.props.getUserDetails(data);
      this.setState({ loading: false });
    }).catch((err) => {
      this.setState({ loading: false });
      console.log('err in uploading image', err);

      if (err.response) {
        console.log(err.response);
        this.setState({ error: err.response.data.error });
        toast.error(err.response.data.error);
      } else {
        toast.error('Error ocurred in uploading profile picture!!!');
      }
    });
  }

  toggleLoader() {
    
    this.setState({ loading: !this.state.loading });
  }

  render() {
    const { username, profile_pic } = this.state.user;
    const { version } = this.state;
    return (
      <div>

        <ProfilePIc photo={profile_pic} selectProfilePic={this.selectProfilePic.bind(this)} changProfile version={version} showLoader={this.toggleLoader.bind(this)} />
        <p className="err-txt">{`${this.state.error}`}</p>
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
  user: state.AuthReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (user) => dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeProfilPic);
