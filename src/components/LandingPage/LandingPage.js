/* eslint-disable camelcase */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';
import { Helmet } from 'react-helmet';
import { Carousel } from 'react-responsive-carousel';
import ScrollAnimation from 'react-animate-on-scroll';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

import './LandingPage.css';
import NavBar from './components/NavBar';
import { store } from '../../store';
import Footer from './components/Footer';

import TextTransition from '../../common/Components/TextTransition';

import phone from '../../assets/Images/LandingPage/feature-img.jpeg';

import shop_banner_2 from '../../assets/Images/LandingPage/shopping_banner-2.png';
import facebookPage from '../../assets/Images/LandingPage/facebook-page.jpeg';
import delivery from '../../assets/Images/LandingPage/delivery.png';
import analytics from '../../assets/Images/LandingPage/analytics-img.svg';
import mobile from '../../assets/Images/LandingPage/mobile.jpg';
import linkMobile from '../../assets/Images/LandingPage/feature-img.jpeg';

import arrow from '../../assets/Images/LandingPage/arrow.png';
import agent from '../../agent';
import { GET_PLANS } from '../../constants/actionTypes';
import { WEB_TOKEN, APP_NAME, THEME_COLOR } from '../../constants/otherConstants';


function importAll(r) {
  return r.keys().map(r);
}

const marketPlaceImages = importAll(require.context('../../assets/Images/LandingPage/marketplace-carousel/', false, /\.(png|jpeg|jpg|svg)$/));

const mobileImages = importAll(require.context('../../assets/Images/LandingPage/mobile-carousel', false, /\.(png|jpe?g|svg)$/));

const textColors = ['#3b5998', '#ff81a9', `${THEME_COLOR}`];
const textData = [
  { text: 'Facebook', style: { borderBottom: '5px solid white', color: 'white' } },
  { text: 'Instagram', style: { borderBottom: '5px solid  white', color: 'white' } },
  { text: 'Online', style: { borderBottom: '5px solid white', color: 'white' } },
];


class LandingPage extends Component {
  static renderImages() {
    return mobileImages.map((img, i) => (
      <img src={img} className="iframe" alt="" key={i} />
    ));
  }

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      colorIndex: 0,
    };
    this.myDivToFocus = React.createRef();
  }

  UNSAFE_componentWillMount() {
    const token = window.localStorage.getItem(WEB_TOKEN);
    if (token) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
  }

  componentDidMount() {
    const self = this;
    setInterval(() => {
      const { colorIndex } = self.state;
      self.setState({ colorIndex: ((colorIndex + 1) % textColors.length) });
    }, 3000);
  }

  render() {
    const { loggedIn, colorIndex } = this.state;

    return (
      <>
        <Helmet>
          <title>Create your own website for free</title>
          <meta name="description" content="Get your ecommerce business website with no setup cost , sell online books, shoes ,accessories, apparels." />
          <meta name="keywords " content="online store, ecommerce website , sell your product, get free website, online market place, increase your sales, for wholesellers and retailers , expand your business, sell books online , sell clothes online, sell shoes online, sell accessories online, easy to handle website, delivery facility , maintain tranparency, mobile friendly website." />

          <link rel="canonical" href="https://myweblink.store" />
          <meta name="play store app" content="https://play.google.com/store/apps/details?id=com.myweblink.myweblink" />
        </Helmet>
        <NavBar loggedIn={loggedIn} />

        <div className="gradient-bg-landing-page" style={{ background: textColors[colorIndex], transition: 'all 0.5s' }}>
          <div className="mobile_header_sdk_img">
            <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 1418 995" id="svg-icon">

              <defs>
                <clipPath id="clip-path">

                  <rect id="Rectangle_696" data-name="Rectangle 696" className="cls-1" width="1418" height="995" transform="translate(502)" />
                </clipPath>
              </defs>
              <g id="Mask_Group_36" data-name="Mask Group 36" className="cls-2" transform="translate(-502)">

                <path style={{ fill: textColors[(colorIndex + 1) % textColors.length], transition: 'all 0.5s ease' }} id="Path_546" data-name="Path 546" className="cls-3" d="M3690.005,707.591c133.569,324.227,422.867,194.932,474.868,344.832s-34.88,420.957,447.224,625.954,468.65,145.523,468.65,145.523-28.86-370.6,111.43-621.966-116.268-156.175-44.342-331.1S5091.89,707.666,5126.521,653.2s-274.385,42.715-356.968-32.25,50.616,8.33-303.69-13.883-58.607-24.989-338.322-22.212S3556.437,383.365,3690.005,707.591Z" transform="translate(-3235.185 -479.435) rotate(-4)" />

              </g>
            </svg>
          </div>
          
          <div className="main-background">
            <div className="">
              <div className="mobile-div main-div-width " style={{ height: '100vh' }}>
                <div className="tc  white home-page-header">
                  <h1 style={{ color: textColors[(colorIndex + 1) % textColors.length] }}>
                    Start your
                    <TextTransition data={textData} />
                    {' '}
Store in minutes
                    {' '}
                  </h1>
                  <p style={{ color: textColors[(colorIndex + 1) % textColors.length], fontWeight: '800' }}>
                    It's
                    <b style={{ color: 'white', borderBottomColor: 'white' }}> quick </b>
and
                    <b style={{ color: 'white', borderBottomColor: 'white' }}> easy</b>
                  </p>
                  {
                  loggedIn
                    ? (
                      <div className=" offer-div ">
                        <button style={{ background: textColors[(colorIndex + 1) % textColors.length] }} type="button" className="color-btn w-100 " onClick={() => store.dispatch(push('/admin/'))}>
                        Go To My Account
                        </button>
                      </div>
                    )
                    : (
                      <div className="landing-btn-div">
                        <button style={{ background: textColors[(colorIndex + 1) % textColors.length] }} type="button" onClick={() => store.dispatch(push('/signup'))}>
                        Get started for free
                        </button>
                        <button style={{ background: textColors[(colorIndex + 1) % textColors.length] }} type="button" onClick={() => store.dispatch(push('/login'))}>
                        Login
                        </button>
                      </div>
                    )
                }
                </div>

                <div>
                  <div className="mobile-outer-div">
                    <div className="showcase_instagram_profile " style={{ overflow: 'hidden' }}>
                      <Carousel autoPlay stopOnHover={false} swipeable={false} infiniteLoop showIndicators={false} showArrows={false} showStatus={false} showThumbs={false} interval={3000}>

                        <img
                          src={facebookPage}
                          className="iframe"
                          alt=""
                        />
                        <img
                          src={mobile}
                          className="iframe"
                          alt=""
                        />
                        <img
                          src={mobile}
                          className="iframe"
                          alt=""
                        />
                      </Carousel>
                    </div>


                    <img src={arrow} className="arrow" alt="" />

                    <div className="smartphone">
                      <div className="content">
                        <Carousel autoPlay stopOnHover={false} swipeable={false} infiniteLoop showIndicators={false} showArrows={false} showStatus={false} showThumbs={false} interval={3000}>
                          {LandingPage.renderImages()}
                        </Carousel>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="middle-content tilted-div" id="products">

                <ScrollAnimation animateOnce animateIn="zoomIn">
                  <div className="landing-page-feature-content">

                    <div
                      className="feature-img"
                      style={{ overflow: 'hidden' }}
                    >
                      <Carousel autoPlay infiniteLoop axis="vertical" showIndicators={false} showArrows={false} showStatus={false} showThumbs={false} renderThumbs={() => null}>
                        {
                            marketPlaceImages.map((img, i) => (
                              <img
                                src={img}
                                alt=""
                                className="iframe"
                                key={i}
                                style={{
                                  width: '395px', margin: '0px', maxHeight: '1000px', height: '495px',
                                }}
                              />
                            ))
                          }
                      </Carousel>

                    </div>


                    <div className="content">
                      <h1>
                        Resellers' Marketplace
                      </h1>
                      <h3>For Sellers</h3>
                      <h4> Selling has never become this easy!!</h4>

                      <p>
                        {`Get access to potential resellers with huge customer base across India and multiply your business! Set your own margin and MRP of the product and sell at your fingertips!
                        `}
                      </p>
                      <h3>For Resellers</h3>
                      <h4>Worried about inventory stock??</h4>
                      <h4>Now don't!</h4>
                      <p>Get access to over thousands of quality products with different varieties. With our authentic seller base, operate on higher sellers' base across the country and expand the realm of your business!</p>

                    </div>

                  </div>
                </ScrollAnimation>
                <ScrollAnimation animateOnce animateIn="flipInX" animateOut="fadeOut">

                  <div className="landing-page-feature-content">

                    <div className="content">
                      <h1>Hassle free shipping </h1>

                      <h3>Is delivery cost hampering your profit??</h3>
                      <h3>Don't worry, Now it won't!</h3>
                      <p>
The best and cheapest delivery option is just around the corner! Our partnership with Shiprocket will allow you to choose among 14+ top rated shipping companies with 26000+ pincodes!
                        <br />
                        {' '}
Isn't that a great deal?
                      </p>
                    </div>
                    <img src={delivery} alt="" className="feature-img-normal" />
                    {/* <img src={el4} className="bottom-decoration-img" alt="" /> */}
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animateOnce animateIn="bounceInRight">
                  <div className="landing-page-feature-content">
                    {/* <img src={el8} className="top-decoration-img" alt="" /> */}
                    <img src={shop_banner_2} alt="" className="feature-img-normal" />
                    <div className="content">
                      <h1>{`Sell Online With ${APP_NAME}`}</h1>
                      <h3>Beautiful themes that are responsive and customizable</h3>
                      <p>No design skills needed. You have complete control over the look and feel of your website, from its layout, to content and colors.</p>
                    </div>

                  </div>
                </ScrollAnimation>
                <ScrollAnimation animateOnce animateIn="fadeIn">
                  <div className="landing-page-feature-content" style={{justifyContent:'center'}}>
                    <div className="content center tc" >
                      <h1>
                        {`Manage your Facebook and Instagram Store from your ${APP_NAME} dashboard`}
                      </h1>
                      <h3>Beautiful themes that are responsive and customizable</h3>
                      <p>
                        {`Easily add, promote, and sell products, or manage all your Facebook and Instagram advertising in just a few clicks right from your ${APP_NAME} dashboard.`}
                      </p>
                    </div>
                    
                  </div>
                </ScrollAnimation>
              </div>
              <ScrollAnimation animateOnce animateIn="zoomIn">

                <div className=" landing-page-third-div">
                  <h1>Start your own website with ZERO setup fees</h1>
                  <h3>{`To start your own website through ${APP_NAME}, we will charge ZERO setup fee from you, Seriously.`}</h3>
                </div>
              </ScrollAnimation>
              <div className="middle-content">
                <ScrollAnimation animateOnce animateIn="bounceInRight">
                  <div className="landing-page-feature-content">
                    <img src={phone} alt="" className="feature-img" />
                    <div className="content">
                      <h1>Add Multiple Links In your Instagram Bio</h1>
                      <p>
                    Instagram only allows one clickable link, make the most out of it with MyWeblink
                      </p>
                      <div className="ul-list">
                        <ul>
                          <li>Unlimited Links</li>
                          <li>Link Scheduling</li>
                          <li>Social Media Integration</li>

                        </ul>
                        <ul>
                          <li>Analytics</li>
                          <li>Custom Themes</li>
                          <li>Custom Logos</li>
                        </ul>
                      </div>

                    </div>
                  </div>
                </ScrollAnimation>
                <ScrollAnimation animateOnce animateIn="fadeIn">

                  <div className="landing-page-feature-content">
                    <ScrollAnimation animateOnce animateIn="bounceInLeft">
                      <div className="content">
                        <h2>Analytics and Insights</h2>
                        <p>Know how many followers visit your website and discover which content is performing with your audience.</p>
                        <h2>Customize your Brand Experience</h2>
                        <p>We care for your brand experience.Modify the logo and the brand name as per your own company’s assets.</p>
                      </div>
                      
                    </ScrollAnimation>

                    <img src={analytics} alt="" />

                  </div>
                </ScrollAnimation>
              </div>

              {/* <div id="pricing">
              <Pricing />
            </div> */}
              <div className=" landing-page-second-div">
                <div className="  div-1">
                  <h1>2,000,000,000</h1>
                  <h3>potential customers</h3>
                </div>
                <div className="div-2">
                  <h4>
                  Harness the power of Facebook and Instagram with your own Facebook Store and access over 2 billion unique shoppers
                  </h4>
                </div>

              </div>
              <div className="tc signup-content">

                <h1>
                  Get the power of MyWebLink.store
                </h1>
                {
                loggedIn
                  ? <button className="signup" type="button" onClick={() => store.dispatch(push('/signup'))}>Go To My Account</button>
                  : (
                    <div>
                      <p> Sign up today or login </p>
                      <button className="signup" type="button" onClick={() => store.dispatch(push('/signup'))}>Start your journey</button>
                      <button className="login" type="button" onClick={() => store.dispatch(push('/login'))}>Login</button>
                    </div>
                  )
              }
              </div>
              <Footer />
            </div>

          </div>
          {/* </ScrollToTopWrapper> */}
        </div>

      </>
    );
  }
}


const mapStateToProps = (state) => ({
  plans: state.PurchaseReducers.plans,
});

const mapDispatchToProps = (dispatch) => ({
  getPlans: () => dispatch({ type: GET_PLANS, payload: agent.Purchase.getPlans() }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
