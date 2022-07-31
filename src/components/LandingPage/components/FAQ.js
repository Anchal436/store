
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push } from 'react-router-redux';
import NavBar from './NavBar';
import Question from './Question';
import { store } from '../../../store';
import Footer from './Footer';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

const faq = [{ question: 'Can I use it for free?', answer: 'Yes, there will always be a free plan. Free plan provides you unlimimted links creation, changing background theme, but free pack will now allow you to change the header logo or assign your own custom background image.' },
  { question: 'Can I automatically publish to instagram for free?', answer: 'yes! of course' }, { question: 'What does the MyWebLink mean?', answer: 'MyWebLink is a partner in your business growth. Create your account with us and show  all of your online links in one place and with this one link grow your business.' }];
class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {

  }


  render() {
    return (
      <div className=" ">
        <div className="mobile_header_sdk_img">
          <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 1418 995" id='svg-icon' >

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
        <NavBar />
        <div className="faq-content relative flex" style={{ flexGrow: 1 ,zIndex:1}}>
          <div className='question-img' >
          <LiveHelpIcon />
          </div>
          <div className='faq-question' >
            <h1>FAQs</h1>
            <div className='faq-question-div' >
            {
              faq.map((f, i) => (
                <Question data={f} key={i} />
              ))
            }
            </div>
          </div>
        </div>
        <Footer />
      </div>
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
)(FAQ);
