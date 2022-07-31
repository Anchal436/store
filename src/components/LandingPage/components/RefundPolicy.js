
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import NavBar from './NavBar';
import Footer from './Footer';

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
          <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 1418 995" id="svg-icon">

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
        <div className="faq-content relative flex" style={{ flexGrow: 1, zIndex: 1 }}>
          <div className="faq-question">
            <h1>Refund and Cancellation Policy</h1>
            <p>MyWebLink.store (ONKAR BEARING COMPANY) </p>
            
            <p>
              {`Our focus is complete customer satisfaction. In the event, if you are displeased with the services provided, we will refund back the money, provided the reasons are genuine and proved after investigation. Please read the fine prints of each deal before buying it, it provides all the details about the services or the product you purchase.
In case of dissatisfaction from our services, clients have the liberty to cancel their projects and request a refund from us. Our Policy for the cancellation and refund will be as follows:`}
            </p>
            <b>Cancellation Policy</b>
            <p>
              {` For Cancellations please contact the us via contact us link.
prasadyash2411@gmail.com

Requests received later than 10 business days prior to the end of the current service period will be treated as cancellation of services for the next service period.`}
            </p>

            <b>Refund Policy</b>
            <p>
              {`We will try our best to create the suitable design concepts for our clients.
In case any client is not completely satisfied with our products we can provide a refund.
If paid by credit card, refunds will be issued to the original credit card provided at the time of purchase and in case of payment gateway name payments refund will be made to the same account.`}
            </p>
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
