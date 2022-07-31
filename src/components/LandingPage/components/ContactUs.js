
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import NavBar from './NavBar';
import Footer from './Footer';

import defaultLogo from '../../../assets/Images/instalink_logo.png'
import { APP_NAME} from '../../../constants/otherConstants'
import ContactMailIcon from '@material-ui/icons/ContactMail';
import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';

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
        <div className=" flex-column justify-center items-center relative flex" style={{ flexGrow: 1 ,zIndex:1}}>
            <div className='contact-us-logo' >
                <img src={defaultLogo}/>
                <h1 >{APP_NAME}</h1>
            </div>
            <div className='contact-us-details' >
               
                <h3>
                    <MailIcon/> support@myweblink.store
                </h3>
                <h3>
                    <PhoneIcon/> +91 70034 42036
                </h3>
                <h3>
                     Onkar Bearing Co , No 38/1 Laxmipura , Vaderahalli -Sakalvara Road , Anekal Taluk , Bangalore -560083
                </h3>
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
