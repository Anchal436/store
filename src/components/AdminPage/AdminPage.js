/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import './AdminPage.css';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { push, goBack } from 'react-router-redux';
import SideDrawer from './components/SideDrawer';
import Link from './components/Link';
import { store } from '../../store';
import agent from '../../agent';
import {
  GET_LINK_CLICKS, GET_LINKS, GET_USER_DETAILS, GET_PROFILE_VIEWS, GET_BG_STYLE, GET_PRODUCTS, GET_HEADER_INFO, GET_SHOP_DETAILS, GET_PUBLIC_PAGE_USER,
} from '../../constants/actionTypes';
import { USER_DETAILS, ERROR_MSG } from '../../constants/otherConstants';
import CopyUrl from '../../common/Components/CopyUrl';
import Tabs from '../../common/Components/Tabs';
import Loader from '../../common/Components/Loader';
import HomePage from '../HomePage/PublicHomePage';
import IsEmailVerified from '../IsEmailVerified/IsEmailVerified';
import Switch from '../../common/Components/Switch';
import LinkAnalysis from './components/LinkAnalysis';


class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      loading: false,
      mobileView: false,
      is_category_view_enabled: false,
      user: {},
    };
    this.links = [];
    this.location = '';
    this.products = [];
  }

  componentDidMount() {
    // console.log(this.props);
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    const { user } = this.props;
    if (user && user.user) {
      this.setState({ user: user.user });
    }

    const username = window.localStorage.getItem(USER_DETAILS);
    const data = { username };
    const {
      getProfileViews, getLinkClicks, getUserDetails, getBackgroundStyle, getHeaderInfo, getLinks,
    } = this.props;
    getUserDetails(data);
    getBackgroundStyle(data);
    getHeaderInfo(data);
    getLinks();
    getProfileViews();
    getLinkClicks();
  }

  componentWillReceiveProps(np) {
    const { user, render } = this.state;
    if (np.links && this.links !== np.links.links) {
      this.links = np.links.links;
      this.setState({ loading: false });
    }
    if (np.shopDetails) {
      this.setState({ is_category_view_enabled: np.shopDetails.is_category_view_enabled });
    }
    if (np.user) {
      if (user !== np.user.user) {
        if (np.user.user.links) {
          this.links = np.user.user.links;
        }
        this.setState({ user: np.user.user, loading: false });
      }
    }
  }

  resize() {
    this.setState({ mobileView: window.innerWidth <= 600 });
  }

  addLink() {
    const link = {
      title: '',
      url: '',
      visible: true,
    };
    this.links = [link, ...this.links];
    this.setState({ render: !this.state.render });
  }

  createLink(link) {
    // this.links[link.index] = link;
    const data = {
      url: link.url,
      visible: link.visible,
      title: link.title,
      index: link.index,
      icon: link.icon,
    };
    if (link.id) data.id = link.id;
    this.setState({ loading: true });
    agent.AdminPage.createLink(data).then((res) => {
      let temp = [res.data.link, ...this.links];
      temp = temp.sort((l, m) => l.index < m.index);
      this.props.updateLinks({ links: temp });
      this.setState({ loading: false });
      // this.props.getLinks();
    }).catch((err) => {
      if (err.response) console.log(err.response);
      this.setState({ loading: false });
    });
    this.setState({ render: !this.state.render });
  }

  uploadLinkIcon(link, icon) {
    const data = [{ key: 'link_id', file: link.id }, { key: 'photo', file: icon }];
    this.setState({ loading: true });
    agent.AdminPage.uploadLinkIcon(data).then((res) => {
      store.dispatch(goBack());
      const {
        links, updateLinks, getLinks, deleteLinkInfo, user, setUserInfo
      } = this.props;
      if (links && links.links) {
        console.log(links.links, res.data.link)
        const temp = links.links.map((l) => {
          if (l.id === res.data.link.id) {
            return res.data.link;
          }
          return l;
        });
        updateLinks({ links: temp });
        const tempUser = {...user.user, links: temp }
        setUserInfo({user: tempUser });
      } else {
        getLinks();
      }
  
    }).catch((err) => {
      toast.error(ERROR_MSG);
      this.setState({ loading: false });
      console.log(err.response);
    });
  }

  deleteLink(link) {
    if (link.id) {
      const data = {
        id: link.id,
      };
      this.setState({ loading: true });
      agent.AdminPage.deleteLink(data).then((res) => {
        let temp = this.links.filter((l) => l.id !== link.id);
        temp = temp.sort((l, m) => l.index < m.index);

        this.setState({ loading: false });
        const {
          updateLinks, user, setUserInfo,
        } = this.props;
        this.links = temp;
        updateLinks({ links: temp });
        const tempUser = { ...user.user, links: temp };
        setUserInfo({ user: tempUser });
        // this.props.getLinks();
      }).catch((err) => {
        if (err.response) console.log(err.response);
        this.setState({ loading: false });
      });
    } else {
      this.links = this.links.filter((l, i) => i !== link.index);
    }
    this.setState({ render: !this.state.render });
  }


  componentWillUnmount() {
    window.removeEventListener('resize', () => console.log('removed'));
  }

  onDragEnd(e) {
    if (!e.destination || e.source.index === e.destination.index) return;
    if (e.source && e.destination) {
      const srcIndex = e.source.index;
      const desIndex = e.destination.index;
      if (srcIndex < desIndex) {
        const temp = this.links[srcIndex];
        for (let i = srcIndex + 1; i <= desIndex; i++) {
          this.links[i - 1] = this.links[i];
        }
        this.links[desIndex] = temp;
      } else {
        const temp = this.links[srcIndex];
        for (let i = srcIndex - 1; i >= desIndex; i--) {
          this.links[i + 1] = this.links[i];
        }
        this.links[desIndex] = temp;
      }
      const linksSequence = this.links.map((l) => l.id);
      agent.AdminPage.updateLinkSequence({	links: linksSequence }).then((res) => {
        const {
          updateLinks, user, setUserInfo,
        } = this.props;
        this.links = res.data.links;
        updateLinks({ links: res.data.links });
        const tempUser = { ...user.user, links: res.data.links };
        setUserInfo({ user: tempUser });
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  onDragStart(e) {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }


  editLinkComponent() {
    return (
      <article className="  ">
        <IsEmailVerified />

        <div className="justify-center  self-center ">
          <CopyUrl />
          <LinkAnalysis />

          <div className=" center  flex flex-column ">
            <div className="flex">
              <button
                className="    tc center w-40 mt2 color-btn b "
                onClick={() => this.createLink({
                  url: '', visible: false, title: '', index: -1, icon: null,
                })}
                style={{ padding: '15px', borderRadius: '15px' }}
              >
              Add new Link
              </button>
              <button
                className="    tc center w-40 mt2 color-btn b "
                style={{ padding: '15px', borderRadius: '15px' }}
                type="button"
                onClick={() => store.dispatch(push('/admin/products/'))}
              >

              Sell Products
              </button>
            </div>

            <div className="render-links-div">
              <Droppable droppableId="link-dropppabel">
                { (provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {
              this.links.map((l, i) => (

                <Link
                  link={{ ...l, index: i }}
                  key={l.id}
                  deleteLink={this.deleteLink.bind(this)}
                  createLink={this.createLink.bind(this)}
                  uploadLinkIcon={this.uploadLinkIcon.bind(this)}

                />
              ))
            }
                    {provided.placeholder}

                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </article>

    );
  }

  togelDefaultCategoryView() {
    const { is_category_view_enabled } = this.state;

    const { shopDetails, setShopDetails } = this.props;
    const details = { ...shopDetails, is_category_view_enabled: !is_category_view_enabled };
    this.setState({ loading: true });
    agent.ProductsPage.setShopDetails(details).then((res) => {
      this.setState({ is_category_view_enabled: !is_category_view_enabled });
      this.setState({ loading: false });
      setShopDetails(details);
    }).catch((err) => {
      console.log('err in updaing previe preference', err, err.response);
      if (err.response) {
        toast.error(err.response.data.error);
      } else {
        toast.error(ERROR_MSG);
      }
      this.setState({ loading: false });
    });
  }

  previewComponent() {
    const { is_category_view_enabled } = this.state;
    return (
      <div className="admin-home-page">
        {/* <div className="flex justify-between items-center bg-white bl br">
          <p className="  center mt0 mb0 b flex block flex-wrap " style={{ overflowY: 'auto' }}>
            <p className="  center mt0 mb0 b block  ">Categories View </p>
          </p>
          <Switch togelswitch={this.togelDefaultCategoryView.bind(this)} val={!is_category_view_enabled} />
          <p className="  center mt0 mb0 b block  ">All Products </p>
        </div> */}
        <HomePage parent="admin-page" />
      </div>
    );
  }


  render() {
    const { loading, user, mobileView } = this.state;
    const { username } = user;
    return (
      <div>
        <SideDrawer user={user} location={this.props.location} />

        <DragDropContext
          onDragEnd={this.onDragEnd.bind(this)}
          onDragStart={this.onDragStart.bind(this)}
        >
          {
            mobileView

              ? (
                <div className="nav-margin admin-bg">
                  <Tabs tabsData={[{ tabHeading: 'Edit Links', components: this.editLinkComponent.bind(this) }, { tabHeading: 'Preview', components: this.previewComponent.bind(this) }]} />
                </div>
              )
              : (
                <div className="admin-bg nav-margin flex ">
                  {
                    this.editLinkComponent(username)
                  }
                  {
                    this.previewComponent()
                  }

                </div>
              )
          }
        </DragDropContext>
        {
          loading ? <Loader /> : null
        }
      </div>

    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  links: state.AdminPageReducers.links,
  profileViews: state.AdminPageReducers.profileViews,
  shopDetails: state.ProductsPageReducers.shopDetails,
  products: state.ProductsPageReducers.products,
});

const mapDispatchToProps = (dispatch) => ({
  getUserDetails: (user) => store.dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
  getLinks: () => dispatch({ type: GET_LINKS, payload: agent.AdminPage.getLinks() }),
  getBackgroundStyle: (user) => dispatch({ type: GET_BG_STYLE, payload: agent.AdminPage.getBackground(user) }),
  getProfileViews: () => dispatch({ type: GET_PROFILE_VIEWS, payload: agent.AdminPage.getProfileViews() }),
  getLinkClicks: (link) => dispatch({ type: GET_LINK_CLICKS, payload: agent.AdminPage.getLinkClicks(link) }),
  updateLinks: (links) => dispatch({ type: GET_LINKS, payload: links }),
  getProducts: (user, pageNumber) => dispatch({ type: GET_PRODUCTS, pageNumber, payload: agent.ProductsPage.getProducts(user, pageNumber) }),
  getHeaderInfo: (user) => dispatch({ type: GET_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
  getShopDetails: (user) => dispatch({ type: GET_SHOP_DETAILS, payload: agent.ProductsPage.getShopDetails(user) }),
  setShopDetails: (address) => dispatch({ type: GET_SHOP_DETAILS, payload: address }),
  setPublicPageUserDetails: (user) => dispatch({ type: GET_PUBLIC_PAGE_USER, payload: user }),
  setUserInfo: (user) => dispatch({ type: GET_USER_DETAILS, payload: user }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminPage);
