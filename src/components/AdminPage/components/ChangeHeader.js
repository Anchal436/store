/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/button-has-type */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import PolymerIcon from '@material-ui/icons/Polymer';
import Slide from '@material-ui/core/Slide';

import './styles.css';
import { toast } from 'react-toastify';
import { store } from '../../../store';

import default_logo from '../../../assets/Images/instalink_logo.png';
import { GET_HEADER_INFO } from '../../../constants/actionTypes';
import Loader from '../../../common/Components/Loader';
import DisabledDiv from '../../../common/Components/DisabledDiv';
import { APP_NAME, ERROR_MSG } from '../../../constants/otherConstants';
import agent from '../../../agent';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class ChangeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      changeHeaderOpen: false,
      isNormalUser: true,
      headerInfo: { header_icon: default_logo, header_text: APP_NAME, style: {} },

    };
    this.handleChangeHeaderDialogOpen = this.handleChangeHeaderDialogOpen.bind(this);
    this.onCustomIconSelect = this.onCustomIconSelect.bind(this);
  }

  componentWillMount() {
    const { user, headerInfo } = this.props;
    if (user && user.user) {
      const temp = user.user.user_type === 'normal';
      this.setState({ user: user.user, isNormalUser: temp });
    }
    if (headerInfo) {
      let data = {};
      if (headerInfo.header_icon) {
        data = { header_icon: headerInfo.header_icon };
      } else {
        data = { header_icon: default_logo };
      }
      if (headerInfo.header_text) {
        data = { ...data, header_text: headerInfo.header_text };
      } else {
        data = { ...data, header_text: APP_NAME };
      }
      this.setState({ headerInfo: { ...data, style: { color: '#fff' } }, changeHeaderOpen: false });
    }
  }

  componentWillReceiveProps(np) {
    const { user, headerInfo } = this.state;
    if (np.user && np.user.user && np.user.user !== user) {
      const temp = np.user.user.user_type === 'normal';
      // console.log("user type",temp,np)
      this.setState({ user: np.user.user, isNormalUser: temp });
    }
    if (np.headerInfo && np.headerInfo !== headerInfo) {
      let data = {};
      if (np.headerInfo.header_icon) {
        data = { header_icon: np.headerInfo.header_icon };
      } else {
        data = { header_icon: default_logo };
      }
      if (np.headerInfo.header_text) {
        data = { ...data, header_text: np.headerInfo.header_text };
      } else {
        data = { ...data, header_text: APP_NAME };
      }
      this.setState({ headerInfo: { ...data, style: { color: '#fff' } } });
    }
    if (np.routingLocation) {
      if (np.routingLocation.location.query) {
        this.setState({ changeHeaderOpen: np.routingLocation.location.query.changeHeader });
      }
    }
  }

  selectIcon(icon) {
    fetch(icon)
      .then((response) => response.blob())
      .then((blob) => {
        blob.name = 'icon';
        blob.lastModified = new Date();
        blob.lastModifiedDate = new Date();
        blob.webkitRelativePath = icon;
        this.setState({
          imgBlob: blob,
          headerInfo: { ...this.state.headerInfo, header_icon: icon },
        });
      });
  }


  saveChanges(icon) {
    // this.props.uploadLinkIcon(link, icon);
    const { header_icon, header_text } = this.state.headerInfo;
    const { imgBlob } = this.state;
    const data = [{ key: 'icon', file: imgBlob }, { key: 'header_text', file: header_text }];

    this.setState({ loading: true });
    agent.AdminPage.uploadHeaderInfo(data).then((res) => {
      if (this.props.user) {
        const { username } = this.props.user.user;
        const data = { username };
        this.props.getHeaderInfo(data);
        setTimeout(() => {
          this.setState({ loading: false, changeHeaderOpen: false });
        }, 1000);
      }
    }).catch((err) => {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.error)
      }else{
        toast.error(ERROR_MSG);
      }
    });
  }

  async onCustomIconSelect(e) {
    if (e.target.files && e.target.files.length > 0) {
      const blob = e.target.files[0];
      const imageDataUrl = await readFile(blob);
      this.setState({
        imgBlob: blob,
        headerInfo: { ...this.state.headerInfo, header_icon: imageDataUrl },
      });
    }
  }


  handleChangeHeaderDialogOpen() {
    // this.setState({ changeHeaderOpen: !this.state.changeHeaderOpen });
    const { changeHeaderOpen } = this.state;

    if (changeHeaderOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&changeHeader=true`
        : `${window.location.pathname}?changeHeader=true`;

      store.dispatch(push(path));
    }
  }

  render() {
    const { headerInfo, isNormalUser } = this.state;
    return (
      <div className="w-100 h-100">
        <button type="button" className="side-drawer-link relative" onClick={() => this.handleChangeHeaderDialogOpen()}>
          <PolymerIcon />
          Change Branding

        </button>
        
        <Dialog
          open={this.state.changeHeaderOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleChangeHeaderDialogOpen}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"

        >

          <DialogTitle id="alert-dialog-slide-title">Choose Your header.</DialogTitle>

          <DialogContent style={{ flexWrap: 'wrap', position: 'relative' }}>
            <div className="logo-img-div center " style={headerInfo.style}>
              <img src={headerInfo.header_icon} alt="" />
              <p className="black">{`${headerInfo.header_text}`}</p>

            </div>
            <div className="flex justify-between bt bb pt2 pb2 ">
              <div className="center" className="select-img-icon btn ba self-center ">
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"

                  onChange={this.onCustomIconSelect}
                />
                  Choose custom Icon
              </div>
              <div className="header-text-input  self-center flex items-center">
                <input
                  type="text"
                  name="header-name"
                  placeholder='Brand Name'
                  value={headerInfo.header_text}
                  onChange={(e) => this.setState({ headerInfo: { ...headerInfo, header_text: e.target.value } })}
                />
                <BorderColorIcon />
              </div>
            </div>
            
          </DialogContent>
          <DialogActions>


            <button onClick={() => this.saveChanges(default_logo)} color="primary" className="color-btn ma1 " style={{ width: '40%' }}>
                    Save Changes
            </button>

            <button onClick={() => this.selectIcon(default_logo)} color="primary" className="btn ba ">
                    Choose Default Icon
            </button>
            <button onClick={this.handleChangeHeaderDialogOpen} color="primary" className="btn ba ">
                Cancel
            </button>

          </DialogActions>
          {
            this.state.loading ? <Loader /> : null
          }
          {
            isNormalUser
              ? (
                <DisabledDiv message="Purchase a Pro pack to unlock this feature" />
              ) : null
          }
        </Dialog>


      </div>
    );
  }
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  headerInfo: state.AdminPageReducers.headerInfo,
  routingLocation: state.router,

});

const mapDispatchToProps = (dispatch) => ({
  getHeaderInfo: (user) => dispatch({ type: GET_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeHeader);
