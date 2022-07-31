import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './PublicFooter.css';

import Logo from '../../../common/Components/Logo';
import { APP_NAME, DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';
import getBgStyle from '../../../common/Components/getBgStyle';

function importAll(r) {
  return r.keys().map(r);
}

const paymentOptionsImages = importAll(require.context('../../../assets/Images/paymentOptionsImages', false, /\.(png|jpe?g|svg)$/));
class PublicFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      secondaryColor: DEFAULT_TEXT_COLOR,
      shopDetails: {},
      products: [],

    };
    this.cartItems = [];
  }

  componentWillMount() {
    const {
      publicPageBgStyle, publicPageUser, publicPageShopDetails, publicPageProducts,
    } = this.props;
    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
    if (publicPageShopDetails) {
      this.setState({ shopDetails: publicPageShopDetails });
    }
    if (publicPageProducts) {
      this.setState({ products: publicPageProducts });
    }
    const { secondaryColor, fontColor } = getBgStyle(publicPageBgStyle);
    this.setState({ secondaryColor, fontColor });
  }

  componentWillReceiveProps(np) {
    const { user, shopDetails, products } = this.state;
    if (np.publicPageUser && np.publicPageUser !== user) {
      this.setState({ user: np.publicPageUser });
    }
    if (np.publicPageShopDetails && np.publicPageShopDetails !== shopDetails) {
      this.setState({ shopDetails: np.publicPageShopDetails });
    }
    if (np.publicPageProducts && np.publicPageProducts !== products) {
      this.setState({ products: np.publicPageProducts });
    }
    const { secondaryColor, fontColor } = getBgStyle(np.publicPageBgStyle);
    this.setState({ secondaryColor, fontColor });
  }


  render() {
    const {
      secondaryColor, fontColor, user, shopDetails, products,
    } = this.state;
    // if (products && products.length <= 0) {
    //   return null;
    // }
    return (

      <footer className="public-page-footer" style={{ background: `${secondaryColor}`, borderTop: `2px solid ${secondaryColor}`, color: fontColor }}>
        <div className="content">
          {
            shopDetails.shop_address
              ? (
                <div className="address">
                  <small>
                    {`${shopDetails.shop_address}, ${shopDetails.city}, ${shopDetails.state}, ${shopDetails.country} - ${shopDetails.pincode} `}
                  </small>
                  <small>{`${user.email}`}</small>
                </div>
              )
              : null
          }

          <div className={shopDetails.shop_address ? 'footer-logo ' : 'footer-logo center'}>
            <Logo
              logostyles={{
                display: 'flex', flexDirection: 'row', margin: 'auto', color: fontColor,
              }}
              parent={!this.props.parent ? 'public-home-page' : this.props.parent}
            />
          </div>
        </div>
        <div className="bt w-100  flex justify-center items-center">
          {
            user.links && user.links.length > 0 ? (
              user.links.map((l) => {
                if (l.visible) {
                  return (
                    <a
                      key={l.id}
                      className="footer-link relative"
                      target="_blank"
                      href={l.url}
                      style={{ color: fontColor }}
                    >
                      <img src={l.icon} alt="" />
                      {/* <Image src={l.icon} /> */}
                    </a>
                  );
                }
                return null;
              })
            ) : null
          }
        </div>
        <div className="tc bt">
          <p>We Accept </p>
          <div className="w-100 footer-payment-options ">
            {
            paymentOptionsImages && paymentOptionsImages.length > 0 ? (
              paymentOptionsImages.map((l) => (
                <div
                  className="payment-option relative"
                  style={{ color: fontColor }}
                >
                  <img src={l} alt="" />
                  {/* <Image src={l.icon} /> */}
                </div>
              ))
            ) : null
          }
          </div>
        </div>
        <div className="bt w-100 pa1">
          <small>
             Powered by
            <a href="/" className="pointer" style={{ color: fontColor }}>{` ${APP_NAME}`}</a>
          </small>
        </div>

      </footer>


    );
  }
}


const mapStateToProps = (state) => ({
  homeBgStyle: state.AdminPageReducers.homeBgStyle,
  cartItems: state.HomePageReducers.cartItems,
  publicPageShopDetails: state.HomePageReducers.publicPageShopDetails,
  publicPageUser: state.HomePageReducers.publicPageUser,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,
  publicPageProducts: state.HomePageReducers.publicPageProducts,

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicFooter);
