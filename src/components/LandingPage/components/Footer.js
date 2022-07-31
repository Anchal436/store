/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';

import '../LandingPage.css';


import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
// import TwitterIcon from '@material-ui/icons/Twitter';
import Logo from '../../../common/Components/Logo';
import { store } from '../../../store';

class LandingFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <>
        <footer className="footer pb2">
          <div className="tc flex flex-column items-center justify-center">
            <div className="footer-logo">
              <Logo parent="landing-page" />
            </div>
            <div className="flex items-center justify-center ma2 ">

              <a href="https://www.facebook.com/myweblink-109709170726917/" className="ml1 mr1">
                <FacebookIcon style={{ background: '#0095f6', color: 'white', padding: '3px' }} />
              </a>
              <a href="https://www.instagram.com/myweblink/" className="ml1 mr1">
                <InstagramIcon style={{ background: '#0095f6', color: 'white', padding: '3px' }} />
              </a>
              <a href="https://www.linkedin.com/in/myweblink-store-3996aa1b1" className="ml1 mr1">
                <LinkedInIcon style={{ background: '#0095f6', color: 'white', padding: '3px' }} />
              </a>
              {/* <TwitterIcon style={{background:'#0095f6',color:'white',padding:'3px'}}/> */}
            </div>
            <p className="mb0 mt0 b">support@myweblink.store</p>

          </div>
          <div className="footer-links tc">
            <ul>
              <li>
                <a onClick={() => store.dispatch(push('/faqs'))}>FAQs</a>
              </li>
              <li>
                <a onClick={() => store.dispatch(push('/terms-and-conditions'))}>Terms & Conditions</a>
              </li>
              <li>
                <a onClick={() => store.dispatch(push('/privacy-policy'))}>Privacy Policy</a>
              </li>
              <li>
                <a onClick={() => store.dispatch(push('/refund-policy/'))}>Refund Policy</a>
              </li>

              <li>
                <a>Help & Support</a>
              </li>
              <li>
                <a onClick={() => store.dispatch(push('/contact-us/'))}>Contact Us</a>
              </li>
            </ul>
            <h3 style={{ color: '#0095f6' }} className="i mb0 pb0">Handcrafted In India!</h3>
          </div>

        </footer>
        <div style={{ backgroundColor: 'lightgray',padding : " 5px 0" }} className='tc'>
          <b className="mt1 mb0 pt2 pb2 black ml3 tc f6 ">
            A product by
            <a href="https://yavtechnology.com/" className="black"> YAV Technologies</a>
          </b>
        </div>
      </>

    );
  }
}


const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingFooter);
