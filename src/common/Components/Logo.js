/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */

import React, { Component } from 'react';
import 'tachyons';
import { connect } from 'react-redux';
import './styles.css';
import { push } from 'react-router-redux';

import { store } from '../../store';
import { APP_NAME } from '../../constants/otherConstants';
import instalink_logo from '../../assets/Images/instalink_logo.png';
import { GET_HEADER_INFO } from '../../constants/actionTypes';
import agent from '../../agent';

class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {},
      user: {},
      isNormalUser: true,
      isLogoEditable: false,
      headerInfo: {
        header_icon: instalink_logo,
        header_text: APP_NAME,
      },
    };
  }

  UNSAFE_componentWillMount() {
    const {
      logostyles, parent, headerInfo, hideText, publicHeaderInfo,
    } = this.props;
    if (logostyles) {
      this.setState({ style: logostyles });
    } else {
      this.setState({ hideText: false });
    }
    if (parent !== 'login' && parent !== 'signup' && parent !== 'landing-page') {
      if (hideText) {
        this.setState({ hideText });
      }
      if (parent === 'public-home-page') {
        if (publicHeaderInfo) {
          if (publicHeaderInfo.header_icon && publicHeaderInfo.header_text) {
            this.setState({ headerInfo: publicHeaderInfo });
          } else {
            this.setState({ headerInfo: { header_text: APP_NAME, header_icon: instalink_logo } });
          }
        }
      } else if (headerInfo) {
        if (headerInfo.header_icon && headerInfo.header_text) {
          if (headerInfo !== this.state.headerInfo) {
            this.setState({ headerInfo });
          }
        } else {
          this.setState({ headerInfo: { header_text: APP_NAME, header_icon: instalink_logo } });
        }
      }
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const {
      parent, hideText,
    } = this.props;
    if (parent !== 'login' && parent !== 'signup' && parent !== 'landing-page') {
      if (hideText) {
        this.setState({ hideText, style: np.logostyles });
      } else {
        this.setState({ hideText: false, style: np.logostyles });
      }
      if (parent === 'public-home-page') {
        if (np.publicHeaderInfo) {
          let data = {};
          if (np.publicHeaderInfo.header_icon) {
            data = { header_icon: np.publicHeaderInfo.header_icon };
          } else {
            data = { header_icon: instalink_logo };
          }
          if (np.publicHeaderInfo.header_text) {
            data = { ...data, header_text: np.publicHeaderInfo.header_text };
          } else {
            data = { ...data, header_text: APP_NAME };
          }
          this.setState({ headerInfo: data });
        }
      } else if (np.headerInfo) {
        if (np.headerInfo.header_icon && np.headerInfo.header_text) {
          if (np.headerInfo !== this.state.headerInfo) {
            this.setState({ headerInfo: np.headerInfo });
          }
        } else {
          this.setState({ headerInfo: { header_text: APP_NAME, header_icon: instalink_logo } });
        }
      } else {
        this.setState({ headerInfo: { header_text: APP_NAME, header_icon: instalink_logo } });
      }

      if (np.user && np.user.user !== this.state.user) {
        const { user_type } = np.user.user;
        const temp = user_type === 'normal';
        this.setState({ isNormalUser: temp, isLogoEditable: (parent !== 'public-home-page'), user: np.user.user });
      }
    }
  }

  showChangeHeaderDialog() {
    const path = window.location.search ? `${window.location.pathname}${window.location.search}&changeHeader=true`
      : `${window.location.pathname}?changeHeader=true`;

    store.dispatch(push(path));
  }

  render() {
    const { header_text, header_icon } = this.state.headerInfo;
    const {
      style, isLogoEditable, isNormalUser, hideText,
    } = this.state;
    return (
      <div className="logo-img-div  " style={style}>
        <img src={header_icon} alt="" />
        {
          hideText ? null : <p>{`${header_text}`}</p>
        }

        <div className="logo-change-logo-div">

          {
            isLogoEditable ? <button onClick={this.showChangeHeaderDialog} className="hidden-btn" /> : null
          }

        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  headerInfo: state.AdminPageReducers.headerInfo,
  user: state.AuthReducer.user,
  publicHeaderInfo: state.HomePageReducers.publicHeaderInfo,
});

const mapDispatchToProps = (dispatch) => ({
  getHeaderInfo: (user) => dispatch({ type: GET_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Logo);
