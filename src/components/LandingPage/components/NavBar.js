/* eslint-disable camelcase */
import React, { Component } from 'react';
import { push } from 'react-router-redux';
import 'tachyons';
// import { push } from 'react-router-redux';

import './styles.css';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import { store } from '../../../store';
import Logo from '../../../common/Components/Logo';
import { APP_NAME, WEB_TOKEN } from '../../../constants/otherConstants';

import instalink_logo from '../../../assets/Images/instalink_logo.png';

const li = [
  {
    link: '/',
    text: 'Home',
  },
  {
    link: '/#products',
    text: 'Products',
  },
  {
    link: 'https://yavtechnology.com/',
    text: 'About Us',
  },


];
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      mobileView: true,
      loggedIn: false,
      navBgStyle: null,
    };
    this.path = '';
  }

  componentDidMount() {
  //   const path = window.location.pathname.split('/');
  //   this.path = path[path.length - 1];
    window.addEventListener('resize', this.resize.bind(this));

    this.resize();
    if (this.props.loggedIn) {
      this.setState({ loggedIn: this.props.loggedIn });
    }
    const token = window.localStorage.getItem(WEB_TOKEN);
    if (token) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }


  toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.Toggle();
  };

  Toggle = () => {
    this.setState({ toggle: !this.state.toggle });
  }

  list = () => (

    <ul className="nav-links pa0">
      {
          li.map((objLink, i) => (
            <li key={i} onClick={() => this.setState({ toggle: false })}>
              <a href={objLink.link}>{objLink.text}</a>
            </li>
          ))
      }
      {
        this.state.mobileView
          && (
            this.state.loggedIn
              ? (
                <li>
                  <a onClick={() => store.dispatch(push('/admin/'))}>Go To My Account</a>
                </li>
              ) : (
                <div>
                  <li>
                    <a onClick={() => store.dispatch(push('/signup'))}>Get started for free</a>
                  </li>
                  <li>
                    <a onClick={() => store.dispatch(push('/login'))}>Login</a>
                  </li>
                </div>
              )
          )
      }
    </ul>

  );

  render() {
    const { mobileView, loggedIn, toggle } = this.state;
    return (

      <div className="navBar items-center " >
        <div className="flex">
          <div className="logo-img-div" >
            <img src={instalink_logo} alt="" />
            <p>{`${APP_NAME}`}</p>
          </div>
          {!mobileView && this.list() }
        </div>
        <div className="flex">
          {
                mobileView
                  ? (
                    <button onClick={this.Toggle} className="drawer-btn" type="button">
                      <MenuIcon style={{ color: 'black' }} />
                    </button>
                  ) : (
                    <div className="flex align-center justify-center">
                      {
                        loggedIn
                          ? (
                            <button onClick={() => store.dispatch(push('/admin/products'))} type="button" className="  nav-btn center ">
                                Go To My Account
                            </button>
                          ) : (
                            <div className="flex">
                              <button onClick={() => store.dispatch(push('/signup'))} type="button" className=" nav-btn  ">
                              Get Started
                              </button>
                              <button onClick={() => store.dispatch(push('/login'))} type="button" className="nav-btn ">
                              Login
                              </button>
                            </div>
                          )
                      }
                    </div>
                  )
              }

        </div>
        <Drawer anchor="top" open={toggle} onClose={this.toggleDrawer('right', false)} className="" style={{ width: window.innerWidth }}>
          <div className="drawer">
            <Logo parent="landing-page" />
            {this.list('right')}
          </div>
        </Drawer>
      </div>
    );
  }
}
