/* window.innerWidth-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import 'tachyons';
// import { push } from 'react-router-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import mobile from '../../../assets/Images/LandingPage/mobile.jpg';
import arrow from '../../../assets/Images/LandingPage/arrow.png';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../../../assets/Images/LandingPage/mobile-carousel', false, /\.(png|jpe?g|svg)$/));
export default class MobileDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
      mobileView: true,
      loggedIn: false,
    };
    this.path = '';
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }

  renderImages() {
    return images.map((img, i) => (
      <img src={img} className="iframe" alt="" key={i} />
    ));
  }

  render() {
    return (
      <div className='mobile-outer-div'>
        <img
          src={mobile}
          className="showcase_instagram_profile"
          alt="Instagram page with ContactInBio and AllMy.Link url"
          
          
        />

        <img src={arrow} className="arrow" />

        <div className="smartphone">
          <div className="content">
            <Carousel autoPlay  infiniteLoop showIndicators={false} showArrows={false} showStatus={false} showThumbs={false} renderThumbs={() => null}>
              {this.renderImages()}
            </Carousel>

          </div>
        </div>
      </div>
    );
  }
}
