
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
            <h1>Terms & Conditions</h1>
            <p>MyWebLink.store (ONKAR BEARING COMPANY) </p>
            <b>TERMS AND CONDITIONS</b>
            <p>
              The terms "We" / "Us" / "Our"/”Company” individually and collectively refer to MyWebLink.store (ONKAR BEARING COMPANY) and the terms "Visitor” ”User” refer to the users. This page states the Terms and Conditions under which you (Visitor) may visit this App (“App”). Please read this page carefully. If you do not accept the Terms and Conditions stated here, we would request you to exit this app. The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this App.
            </p>
            <b>USE OF CONTENT</b>
            <p>
              {`All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this app, except as otherwise noted, are properties either owned, or used under licence , by the business and / or its associate entities who feature on this App. The use of these properties or any other content on this app, except as provided in these terms and conditions or in the app content, is strictly prohibited.
You may not sell or modify the content of this App  or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organisation’s or entity’s written permission.`}
            </p>
            <b>ACCEPTABLE APP USE</b>
            <p>
              {`(A) Security Rules
                                Visitors are prohibited from violating or attempting to violate the security of the Web app, including, without limitation, (1) accessing data not intended for such user or logging into a server or account which the user is not authorised to access, (2) attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorisation, (3) attempting to interfere with service to any user, host or network, including, without limitation, via means of submitting a virus or "Trojan horse" to the App, overloading, "flooding", "mail bombing" or "crashing", or (4) sending unsolicited electronic mail, including promotions and/or advertising of products or services. Violations of system or network security may result in civil or criminal liability. The business and / or its associate entities will have the right to investigate occurrences that they suspect as involving such violations and will have the right to involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations.
(B) General Rules
Visitors may not use the Web app in order to transmit, distribute, store or destroy material (a) that could constitute or encourage conduct that would be considered a criminal offence or violate any applicable law or regulation, (b) in a manner that will infringe the copyright, trademark, trade secret or other intellectual property rights of others or violate the privacy or publicity of other personal rights of others, or (c) that is libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful.`}
            </p>

            <b>INDEMNITY</b>
            <p>
              The User unilaterally agree to indemnify and hold harmless, without objection, the Company, its officers, directors, employees and agents from and against any claims, actions and/or demands and/or liabilities and/or losses and/or damages whatsoever arising from or resulting from their use.
            </p>
            <b>LIABILITY	</b>
            <p>
              {`User agrees that neither Company nor its group companies, directors, officers or employee shall be liable for any direct or/and indirect or/and incidental or/and special or/and consequential or/and exemplary damages, resulting from the use or/and the inability to use the service or/and for cost of procurement of substitute goods or/and services or resulting from any goods or/and data or/and information or/and services purchased or/and obtained or/and messages received or/and transactions entered into through or/and from the service or/and resulting from unauthorized access to or/and alteration of user's transmissions or/and data or/and arising from any other matter relating to the service, including but not limited to, damages for loss of profits or/and use or/and data or other intangible, even if Company has been advised of the possibility of such damages. 
                            User further agrees that Company shall not be liable for any damages arising from interruption, suspension or termination of service, including but not limited to direct or/and indirect or/and incidental or/and special consequential or/and exemplary damages, whether such interruption or/and suspension or/and termination was justified or not, negligent or intentional, inadvertent or advertent. 
                            User agrees that Company shall not be responsible or liable to user, or anyone, for the statements or conduct of any third party of the service. In sum, in no event shall Company's total liability to the User for all damages or/and losses or/and causes of action exceed the amount paid by the User to Company, if any, that is related to the cause of action.`}
            </p>
            <b>DISCLAIMER OF CONSEQUENTIAL DAMAGES</b>
            <p>
              In no event shall Company or any parties, organizations or entities associated with the corporate brand name us or otherwise, mentioned at this App be liable for any damages whatsoever (including, without limitations, incidental and consequential damages, lost profits, or damage to computer hardware or loss of data information or business interruption) resulting from the use or inability to use the App and the App material, whether based on warranty, contract, tort, or any other legal theory, and whether or not, such organization or entities were advised of the possibility of such damages.
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
