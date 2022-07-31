import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';


import agent from '../../../agent';
import ProfilePIc from '../../../common/Components/ProfilePIc';
import Loader from '../../../common/Components/Loader';
import { store } from '../../../store';
import { GET_USER_DETAILS, GET_HEADER_INFO, GET_PUBLIC_PAGE_USER } from '../../../constants/actionTypes';
import Logo from '../../../common/Components/Logo';
import { DEFAULT_BG_STYLE, DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';
import ChangeProfilePic from '../../../common/Components/ChangeProfilePic';
import getBgStyle from '../../../common/Components/getBgStyle';


const LinksPage = (props) => {
  const [user, setUser] = useState({
    email: 'shohanduttaroy99@gmail.com',
    links: [],
    username: 'shohan99',
  });
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [bgStyle, setBgStyle] = useState(DEFAULT_BG_STYLE);
  useEffect(() => {
  }, []);
  useEffect(() => {
    const { publicPageBgStyle, publicPageUser } = props;
    if (publicPageUser ) {
      
      setUser(publicPageUser);
    }
    if (publicPageBgStyle && publicPageBgStyle !== bgStyle) {
      setBgStyle(publicPageBgStyle);
      const { secondaryColor } = getBgStyle(publicPageBgStyle);
      setTextColor(secondaryColor);
    }
  }, [props]);

  const addClickToLink = (link) => {
    if (props.parent !== 'admin-page') {
      agent.AdminPage.addClickToLink({ link_id: link.id });
    }
  };

  if (user && user.links && user.links.length > 0) {
    return (
      <div style={{ borderBottom: `2px solid ${textColor}`, paddingBottom: '10px', flexGrow: 1}} className='flex flex-column justify-between'>
        <div className="dyna-width ">
          <div className=" center">
            <article className="center  tc ">
              {
                props.parent === 'admin-page' ? <ChangeProfilePic /> : <ProfilePIc photo={user.profile_pic} changeProfile={false} />
            }
              <h4 className=" white center tc" style={{ color: textColor }}>
                {`@${user.username}`}
              </h4>
            </article>
          </div>
          <div className="tc mt4">
            {
            user.links.map((link, i) => {
              if (link.visible) {
                return (
                  <a
                    href={link.url}
                    key={link.id}
                    className="link "
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => addClickToLink(link)}
                    style={{ color: textColor, border: `2px solid ${textColor}` }}
                  >
                    {link.icon ? <img src={link.icon} alt="" /> : null}
                    <p className="center ">
                      {`${link.title}`}
                    </p>
                  </a>
                );
              }
              return null;
            })
        }
          </div>
        </div>
        <Logo
          logostyles={{
            display: 'flex', flexDirection: 'row', margin: '0 auto', color: textColor,
            
          }}
          parent={!props.parent ? 'public-home-page' : props.parent}
          username={user.username}
        />

      </div>
    );
  }
  return null;
};

const mapStateToProps = (state) => ({
  publicPageUser: state.HomePageReducers.publicPageUser,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,

  // shippingAddress: state.ProductsPageReducers.shippingAddress,
});

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (user) => dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
  getPublicPageUserDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_USER, payload: agent.Auth.getUserDetails(user) }),


});

export default connect(mapStateToProps, mapDispatchToProps)(LinksPage);
