/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { toast } from 'react-toastify';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { push } from 'react-router-redux';
import './PublicNavBar.css';
import { store } from '../../../store';
import {
  CLEAR_CART,
} from '../../../constants/actionTypes';
import Logo from '../../../common/Components/Logo';
import CollapseTransition from '../../../common/Components/CollapseTransition';
import loader from '../../../assets/Images/loader.gif';
import { DEFAULT_TEXT_COLOR } from '../../../constants/otherConstants';
import getBgStyle from '../../../common/Components/getBgStyle';
import agent from '../../../agent';

class PublicNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { profile_pic: null, link: [], username: '' },
      mobileView: false,
      secondaryColor: DEFAULT_TEXT_COLOR,
      shippingAddress: '',
      searchString: '',
      searchResult: [],
      loadingSearch: false,
      showResult: false,
      cartItemsSize: 0,
      products: [],
      showSearchInput: false,
    };
    this.timeout = 0;

    this.searchProduct = this.searchProduct.bind(this);
  }

  componentWillMount() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    const {
      user, cartItems, clearCart, publicPageBgStyle, publicPageUser, publicPageProducts,
    } = this.props;

    if (publicPageUser) {
      this.setState({ user: publicPageUser });
    }
    const { secondaryColor, fontColor, bgStyle } = getBgStyle(publicPageBgStyle);
    this.setState({ secondaryColor, fontColor, bgStyle });
    if (cartItems) {
      if (user && user.id) {
        if (cartItems.filter((i) => i.seller.id !== this.state.user.id).length > 0) {
          clearCart();
        }
      }
      this.setState({ cartItemsSize: cartItems.length });
    }
    if (publicPageProducts) {
      this.setState({ products: publicPageProducts });
    }
  }


  UNSAFE_componentWillReceiveProps(np) {
    const {
      shippingAddress, user, products,
    } = this.state;
    const { clearCart } = this.props;

    if (np.publicPageUser && np.publicPageUser != user) {
      this.setState({ user: np.publicPageUser });
    }
    const { secondaryColor, fontColor, bgStyle } = getBgStyle(np.publicPageBgStyle);
    this.setState({ secondaryColor, fontColor, bgStyle });

    if (np.publicPageShopDetails) {
      if (np.publicPageShopDetails.shipping_area !== shippingAddress) {
        this.setState({ shippingAddress: np.publicPageShopDetails.shipping_area });
      }
    }
    if (user && user.id && np.cartItems) {
      if (np.cartItems.filter((i) => i.seller && i.seller.id !== user.id).length > 0) {
        clearCart();
      }
    }
    if (np.cartItems) {
      this.setState({ cartItemsSize: np.cartItems.length });
    }
    this.setState({ searchResult: [], searchString: '' });
    if (np.publicPageProducts && np.publicPageProducts !== products) {
      this.setState({ products: np.publicPageProducts });
    }
  }

  showCart = () => {
    const path = window.location.search ? `${window.location.pathname}${window.location.search}&cartDetails=true`
      : `${window.location.pathname}?cartDetails=true`;
    store.dispatch(push(path));
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }

  searchProduct(e) {
    const { user } = this.state;
    const searchString = e.target.value; // this is the search text
    this.setState({ searchString });
    if (searchString === '') this.setState({ showResult: false });

    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const data = { seller: user.username, query: searchString };

      if (searchString.length > 0) {
        this.setState({ loadingSearch: true, showResult: true });

        agent.PublicPage.searchProduct(data, 1).then((res) => {
          this.setState({ loadingSearch: false, searchResult: res.data.products });
        }).catch((err) => {
          this.setState({ loadingSearch: false });
        });
      }
    }, 300);
  }

  selectQuery(query, e) {
    if (e) {
      e.preventDefault();
    }
    const { user } = this.state;
    const path = `/${user.username}/?search=${query}`;

    this.setState({
      loadingSearch: false, searchString: '', searchResult: [], showResult: false,
    });
    store.dispatch(push(path));
  }

  renderSearchDiv() {
    const {
      searchResult, loadingSearch, searchString, mobileView, showResult, secondaryColor, showSearchInput, fontColor,
    } = this.state;
    return (
      <div className="public-page-search-div">
        <button type="button" onClick={() => this.setState({ showSearchInput: !showSearchInput })}>
          {
            showSearchInput ? <CloseIcon style={mobileView ? { color: secondaryColor } : null} /> : <SearchIcon style={mobileView ? { color: secondaryColor } : null} />
          }

        </button>
        <CollapseTransition visible={showSearchInput}>
          <div className="search-result-div">
            <form onSubmit={(e) => this.selectQuery(searchString, e)}>
              <input placeholder="Search " value={searchString} onChange={this.searchProduct} style={mobileView ? { color: fontColor } : null} />
              <button type="submit">
                <SearchIcon style={mobileView ? { color: fontColor } : null} />
              </button>

            </form>
            {
            showResult
              ? (
                <>
                  {
                    loadingSearch
                      ? (
                        <img
                          src={loader}
                          style={{
                            width: '50px', height: '50px', color: 'white', margin: 'auto',
                          }}
                          alt="Loading..."
                        />
                      )
                      : (
                        <>
                          {
                          searchResult.length === 0
                            ? (
                              <button type="button" className="search-row">
                            No Result Found
                              </button>
                            )
                            : searchResult.map((p) => (
                              <button type="button" className="search-row" onClick={() => this.selectQuery(p.name)}>
                                <p key={p.id}>
                                  {p.name}
                                </p>
                              </button>

                            ))
                        }
                        </>
                      )
                  }
                </>
              )
              : null
          }
          </div>
        </CollapseTransition>
      </div>
    );
  }

  render() {
    const {
      user, shippingAddress, mobileView, secondaryColor, cartItemsSize, fontColor, products, bgStyle,
    } = this.state;
    const { username } = user;
    const { parent } = this.props;

    return (
      < >
        <nav
          className="home-page-nav-bar"
          style={{
            borderBottom: `3px solid ${secondaryColor}`, ...bgStyle, backgroundSize: '300%', backgroundPosition: 'left',
          }}
        >
          {
              this.renderSearchDiv()
            }
          <Logo
            logostyles={{
              display: 'flex', flexDirection: 'column', color: secondaryColor,
            }}
            parent={!this.props.parent ? 'public-home-page' : this.props.parent}
            username={username}
          />
          <button className="cart-div " type="button" onClick={this.showCart}>
            <ShoppingCartIcon style={{ color: secondaryColor }} />

            <span style={{ color: fontColor, backgroundColor: secondaryColor }}>

              {cartItemsSize}

            </span>
          </button>

        </nav>

      </>
    );
  }
}


const mapStateToProps = (state) => ({
  cartItems: state.HomePageReducers.cartItems,
  publicPageShopDetails: state.HomePageReducers.publicPageShopDetails,
  publicPageBgStyle: state.HomePageReducers.publicPageBgStyle,
  publicPageUser: state.HomePageReducers.publicPageUser,
  routingLocation: state.router.location,
  publicPageProducts: state.HomePageReducers.publicPageProducts,
});

const mapDispatchToProps = (dispatch) => ({
  clearCart: () => dispatch({ type: CLEAR_CART }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicNavBar);
