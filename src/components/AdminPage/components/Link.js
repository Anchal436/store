/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';
import 'tachyons';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DragIndicatorTwoToneIcon from '@material-ui/icons/DragIndicatorTwoTone';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PhotoLibraryTwoToneIcon from '@material-ui/icons/PhotoLibraryTwoTone';
import ClearTwoToneIcon from '@material-ui/icons/ClearTwoTone';
import TimelineIcon from '@material-ui/icons/Timeline';
import { Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

import { store } from '../../../store';
import LineGraph from './LineGraph';
import BarGraph from './BarGraph';
import SelectImage from '../../../common/Components/SelectImage';
import agent from '../../../agent';
import './styles.css';
import Switch from '../../../common/Components/Switch';
import {
  GET_LINKS, SET_LINK_INFO, DELETE_LINK_INFO, GET_USER_DETAILS,
} from '../../../constants/actionTypes';
import DisabledDiv from '../../../common/Components/DisabledDiv';
import Loader from '../../../common/Components/Loader';
import CollapseTransition from '../../../common/Components/CollapseTransition';
import { ERROR_MSG } from '../../../constants/otherConstants';


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function importAll(r) {
  return r.keys().map(r);
}

const logos = importAll(require.context('../../../assets/Images/LinkLogos/', false, /\.(png|jpe?g|svg)$/));

const logosNames = logos.map((l) => ({ logo: l, name: l.split('/')[3].split('.')[0].split('-')[0] }));
class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: false,
      updated: false,
      loading: false,
      iconDialogOpen: false,
      error: '',
      isNormalUser: true,
      link: {},
      clicks: { weekly: 0, monthly: 0, total: 0 },

    };
    this.weeklyData = [];
    this.monthlyData = [];
    this.handleIconDialogOpen = this.handleIconDialogOpen.bind(this);
    this.onCustomIconSelect = this.onCustomIconSelect.bind(this);
  }


  componentWillMount() {
    let temp;
    let data = { ...this.props.link };
    let updated = false;
    const {
      linkInfo, user, link, linkClicks,
    } = this.props;
    if (linkInfo) {
      this.linkInfo = linkInfo;
      linkInfo.map((l) => {
        if (l.id === data.id) {
          data = l;
          updated = true;
        }
      });
    }
    if (user) {
      temp = user.user.user_type === 'normal';
    }

    this.setState({
      updated, link: data, showDelete: false, iconSrc: link.icon, isNormalUser: temp,
    });
    if (linkClicks) {
      this.preProcessData(linkClicks, data);
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    if (np.link) {
      let data = { ...np.link };
      this.linkInfo = np.linkInfo;
      let updated = false;
      if (np.linkInfo) {
        np.linkInfo.map((l) => {
          if (l.id === data.id) {
            data = l;
            updated = true;
          }
        });
      }
      if (np.linkClicks && np.linkClicks !== this.linkClicks) {
        this.preProcessData(np.linkClicks, data);
      }
      this.setState({
        updated, link: data, showDelete: false,
      });
    }
    if (np.routingLocation && np.link) {
      if (np.routingLocation.query) {
        const { selectIcon, imageZoom } = np.routingLocation.query;
        this.setState({ iconDialogOpen: selectIcon === `${np.link.id}` });
      }
    }
  }

  deleteLink(link) {
    this.props.deleteLink(link);
  }

  togelSwitch(val) {
    const data = { ...this.state.link, visible: (val.target.checked) };
    // this.props.setLinkInfo(data);
    // this.setState({ link:data , updated: false, showDelete: false });
    this.createLink(null, data);
  }

  handleIconDialogOpen() {
    const { iconDialogOpen, link } = this.state;

    if (iconDialogOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&selectIcon=${link.id}`
        : `${window.location.pathname}?selectIcon=${link.id}`;
      store.dispatch(push(path));
    }
    this.setState({ iconDialogOpen: !this.state.iconDialogOpen });
  }

  selectIcon(icon) {
    const { link } = this.state;
    fetch(icon)
      .then((response) => response.blob())
      .then((blob) => {
        blob.name = 'icon';
        blob.lastModified = new Date();
        blob.lastModifiedDate = new Date();
        blob.webkitRelativePath = icon;
        this.setState({
          link: { ...link, icon: blob }, updated: false,
        });

        this.uploadLinkIcon(link, blob);
      });
  }

  uploadLinkIcon(link, icon) {
    this.props.uploadLinkIcon(link, icon);
  }

  onCustomIconSelect({ blob, imageDataUrl }) {
    this.setState({
      link: { ...this.state.link, icon: blob }, iconSrc: imageDataUrl, iconDialogOpen: false, updated: false,
    });
    this.uploadLinkIcon(this.state.link, blob);
  }

  createLink(e, link) {
    // this.setState({ error: '' });
    if (e) {
      e.preventDefault();
    }
    
    if (link.url && link.title) {
      this.setState({ showDelete: false });
      const initial = link.url.substring(0, 4);
      if (initial !== 'http') {
        link.url = `https://${link.url}`;
      }
      let icon = null;
      if (!link.icon) {
        const filteredIcons = logosNames.filter((l) => link.url.toLowerCase().indexOf(l.name.toLowerCase()) > -1);
        if (filteredIcons.length > 0) {
          icon = filteredIcons[0].logo;
        } else {
          icon = null;
        }
      } else {
        icon = link.icon;
      }

      const data = {
        url: link.url,
        visible: link.visible,
        title: link.title,
        index: link.index,
        icon,
      };
      
      if (link.id) data.id = link.id;
      // toast.error('an error occurred !!!');
      this.setState({ loading: true });
      agent.AdminPage.createLink(data).then((res) => {  
        const {
          links, updateLinks, getLinks, deleteLinkInfo, user, setUserInfo
        } = this.props;
        if (links && links.links) {
          const temp = links.links.map((l) => {
            if (l.id === data.id) {
              return data;
            }
            return l;
          });
          updateLinks({ links: temp });
          const tempUser = {...user.user, links: temp }
          setUserInfo({user: tempUser });
        } else {
          getLinks();
        }
        this.setState({ updated: false, loading: false });
        deleteLinkInfo(data);
      }).catch((err) => {
        console.log(err);
        toast.error(ERROR_MSG);
        if (err.response) console.log(err.response);
        this.setState({ loading: false });
      });
    } else {
      this.setState({ error: 'Title or url cannot be empty!!!' });
    }
  }

  handleTextChange(key, value) {
    const { link } = this.state;
    
    const { setLinkInfo } = this.props;
    let data = { ...link };

    data = { ...data, [key]: value, visible: true };

    setLinkInfo(data);

    this.setState({
      error: '', link: data, updated: true, showDelete: false,
    });
  }

  preProcessData(linkClicks, link) {
    const onWeekAgo = new Date();
    onWeekAgo.setDate(onWeekAgo.getDate() - 7);
    const onMonthAgo = new Date();
    onMonthAgo.setDate(onMonthAgo.getDate() - 28);
    let total = 0;
    let monthly = 0;
    let weekly = 0;
    this.linkClicks = linkClicks.analytics.filter((l) => l.link_id === link.id);
    if (this.linkClicks.length > 0) {
      total = this.linkClicks[0].total_clicks;
      this.weeklyData = [];
      this.monthlyData = [];
      this.linkClicks[0].clicks.forEach((c) => {
        const dataWeek = {
          name: 'Page A', clicks: 0, amt: 0,
        };
        const dataMonth = {
          name: 'Page A', clicks: 0, amt: 0,
        };
        let name = c.day.split('-');
        name = `${name[2]}-${name[1]}`;
        dataWeek.name = name;
        dataMonth.name = name;
        const date = new Date(c.day);
        if (date.getTime() >= onWeekAgo.getTime()) {
          dataWeek.clicks = c.clicks;
          weekly += c.clicks;
          this.weeklyData = [...this.weeklyData, dataWeek];
        }
        if (date.getTime() >= onMonthAgo.getTime()) {
          dataMonth.clicks = c.clicks;
          monthly += c.clicks;
        }
        this.monthlyData = [...this.monthlyData, dataMonth];
      });
    }
    this.setState({ clicks: { total, monthly, weekly } });
  }

  render() {
    const {
      showLinkAnalysis, isNormalUser, showDelete, error, updated, clicks, link,
    } = this.state;
    const {
      title, url, visible, icon,
    } = link;
    return (
      <Draggable
        draggableId={`${this.props.link.index + 100}`}
        index={this.props.link.index}
        key={this.props.link.index}
      >
        {
        (provided, snapshot) => (
          <div
            className=" link-div "
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{ backgroundColor: snapshot.isDragging ? '#0095f6' : 'white', ...provided.draggableProps.style, color: snapshot.isDragging ? 'white' : 'black' }}
            {...provided.dragHandleProps}
          >
            <div className="flex items-center justify-between pa3">
              <div className=" h-100">
                <DragIndicatorTwoToneIcon />
              </div>
              <div className="bl pl2 w-100">

                {/* <form onSubmit={(e) => this.createLink(e, this.state.link)}> */}
                <div className="flex justify-between">
                  <div className="flex flex-column w-80">

                    <input
                      className="b"
                      value={title}
                      placeholder="Enter Link Title"
                      onChange={(e) => this.handleTextChange('title', e.target.value)}
                    />
                    <input
                      value={url}
                      type="url"
                      placeholder="https://example.com"
                      onChange={(e) => this.handleTextChange('url', e.target.value)}
                    />
                  </div>
                  <Switch togelswitch={this.togelSwitch.bind(this)} val={visible} />
                </div>
                <div className="visible-link-icon " />
                <p className="err-txt">{`${error}`}</p>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex justify-between">
                      <div className="relative pointer icon-btn" onClick={this.handleIconDialogOpen}>
                        {
                            icon && icon !== '' ? (
                              <img src={icon} alt="icon" onError={() => this.setState({ link: { ...link, icon: null } })} />
                            )
                              : (
                                <PhotoLibraryTwoToneIcon style={{ color: '#0095f6' }} />
                              )
                          }
                      </div>
                      <div className="relative pointer ml2" onClick={() => this.setState({ showLinkAnalysis: !showLinkAnalysis })}>
                        <TimelineIcon style={{ color: '#0095f6' }} />
                      </div>
                    </div>
                    {
                        updated && (
                          <button className="color-btn w-50" type="submit" onClick={() => this.createLink(null, this.state.link)}>
                            Save
                          </button>
                        )
                      }
                    <DeleteTwoToneIcon className="pointer " onClick={() => this.setState({ showDelete: !this.state.showDelete })} />
                  </div>
                </div>
                <CollapseTransition visible={showDelete}>
                  <div className="bt mt2 pt2 ">
                    <p className="b"> Are you sure to delete link? </p>
                    <div className="flex items-center mt2 justify-between">
                      <button className="color-btn w-50 tc ml1 mr1" onClick={() => this.setState({ showDelete: false })} type="button">Cancel</button>
                      <button className="color-btn w-50 tc ml1 mr1" onClick={() => this.deleteLink(this.state.link)} type="button">Delete</button>
                    </div>
                  </div>
                </CollapseTransition>
                <Dialog
                  open={this.state.iconDialogOpen}
                  TransitionComponent={Transition}
                  keepMounted
                  onClose={this.handleIconDialogOpen}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogTitle id="alert-dialog-slide-title">Choose Icon for your link.</DialogTitle>
                  <DialogContent style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {
                    logos.map((l, i) => (
                      <button className="link-logo-img" type="button" onClick={() => this.selectIcon(l)}>
                        <img src={l} overlaySrc={l} />
                      </button>
                    ))
                  }
                  </DialogContent>
                  <DialogActions>
                    <div className="center" className="select-img-icon color-btn relative ">
                      <SelectImage onSelectFile={this.onCustomIconSelect.bind(this)} isCroppingRequired />
                      Choose custom icons
                    </div>
                    <button onClick={() => this.selectIcon(null)} color="primary" className="btn ba " type="button">
                        Remove Icon
                    </button>
                    <button
                      onClick={this.handleIconDialogOpen}
                      color="primary"
                      className="btn ba "
                      type="button"
                    >
                        Cancel
                    </button>
                  </DialogActions>
                  {
                  isNormalUser
                    ? <DisabledDiv message="Purchase a pro pack to get this feature." /> : null
                }
                </Dialog>
                {/* </form> */}
              </div>
            </div>
            <CollapseTransition visible={showLinkAnalysis}>
              <div className="link-analysis">
                <div className="link-analysis-header">
                  <p> Link Analysis </p>
                  <button type="button" onClick={() => this.setState({ showLinkAnalysis: !showLinkAnalysis })}>
                    <ClearTwoToneIcon />
                  </button>
                </div>
                {
                  isNormalUser
                    ? (
                      <div className="link-analysis-middle">
                        <p>
                          This link has been clicked
                          <span className="ml2 mr2">
                            {clicks.total}
                          </span>
                          times
                        </p>
                        <div>
                          <p>
                          Join pro to get more analytics
                          </p>
                          <button type="button" className="color-btn w-100 " onClick={() => window.location.href = '/#pricing'}>
                          Join pro
                          </button>
                        </div>
                      </div>
                    )
                    : (
                      <div className="link-analysis-middle">
                        <div>
                          <p>
                          Total Clicked :
                            <span className="ml2 mr2">
                              {clicks.total}
                            </span>
                          times
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p>
                          Last 28 Days:
                            <span className="ml2 mr2">
                              {clicks.monthly}
                            </span>
                          times

                          </p>
                          <LineGraph
                            data={this.monthlyData}
                            linkInfo={link}
                            attributes={{
                              heading: 'Monthly Link Click Analysis', noOfLines: 1, dataKeys: ['clicks'], colors: ['#05f244'],
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <p>
                          Last 7 Days:
                            <span className="ml2 mr2">
                              {clicks.weekly}
                            </span>
                          times
                          </p>
                          <BarGraph
                            data={this.weeklyData}
                            linkInfo={link}
                            attributes={{
                              heading: 'Weekly Link Click Analysis', noOfLines: 1, dataKeys: ['clicks'], colors: ['#05f244'],
                            }}
                          />
                        </div>
                      </div>
                    )
                }
              </div>
            </CollapseTransition>
            {
              this.state.loading ? <Loader /> : null
            }
          </div>
        )
      }

      </Draggable>

    );
  }
}

const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  links: state.AdminPageReducers.links,

  routingLocation: state.router.location,
  linkInfo: state.AdminPageReducers.linkInfo,
  linkClicks: state.AdminPageReducers.linkClicks,
});

const mapDispatchToProps = (dispatch) => ({
  getLinks: () => dispatch({ type: GET_LINKS, payload: agent.AdminPage.getLinks() }),
  setLinkInfo: (link) => dispatch({ type: SET_LINK_INFO, payload: link }),
  deleteLinkInfo: (link) => dispatch({ type: DELETE_LINK_INFO, payload: link }),
  updateLinks: (links) => dispatch({ type: GET_LINKS, payload: links }),
  setUserInfo: (user) => dispatch({type: GET_USER_DETAILS, payload: user }),

});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Link);
