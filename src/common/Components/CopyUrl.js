/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable camelcase */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DialogActions from '@material-ui/core/DialogActions';
import { push, goBack } from 'react-router-redux';

import { store } from '../../store';
import ToolTip from './ToolTip';
import copy from '../../assets/Images/copy.png';
import { BASE_URL, USER_DETAILS } from '../../constants/otherConstants';
import copyCodeToClipboard from './copyText';


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

class CopyUrl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copySuccess: false,
      user: {},
      previewWebsiteDialog: false,

    };
    this.links = [];
    this.location = '';
    this.togelPreviewWebsiteDialogOpen = this.togelPreviewWebsiteDialogOpen.bind(this);
  }

  componentDidMount() {
    // console.log(this.props);
    const { user } = this.props;
    if (user && user.user) {
      this.setState({ user: user.user });
    }
  }

  UNSAFE_componentWillReceiveProps(np) {
    const { user, previewWebsiteDialog } = this.state;
    if (np.user) {
      if (user !== np.user.user) {
        this.setState({ user: np.user.user });
      }
    }

    if (np.routingLocation) {
      const { previewWebsite } = np.routingLocation.location.query;
      if (previewWebsite !== previewWebsiteDialog) {
        this.setState({ previewWebsiteDialog: previewWebsite });
      }
    }
  }


  copy = () => {
    // navigator.clipboard.writeText();
    if (copyCodeToClipboard(`${window.location.origin}${BASE_URL}/${this.state.user.username}`)) {
      this.setState({ copySuccess: true });
      setTimeout(() => this.setState({ copySuccess: false }), 1000);
    }
  }

  togelPreviewWebsiteDialogOpen() {
    // this.setState({ myAccountDialogOpen: !this.state.myAccountDialogOpen });
    const { previewWebsiteDialog } = this.state;

    if (previewWebsiteDialog) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&previewWebsite=true`
        : `${window.location.pathname}?previewWebsite=true`;
      store.dispatch(push(path));
    }
  }


  render() {
    const { user, copySuccess, previewWebsiteDialog } = this.state;
    const { username } = user;

    return (

      <div className='preview-website'>
        <ToolTip innertext="Add this Sharable link to your bio">
          <div className="  bg-white w-100  center pt2  flex tc justify-center bb">

            <p className="  center mt0 mb0  block flex-wrap  " style={{ overflowY: 'auto' }}>
                        Your Website Link
              <br />

              <a
                className="blue pointer grow"
                onClick={this.togelPreviewWebsiteDialogOpen}
                ref={(linkref) => this.linkref = linkref}
              >
                {`${window.location.origin}${BASE_URL}/${username}`}
              </a>
            </p>

            <button className="pointer grow  bg-blue white bl b flex items-center ma2 pa2 br2 " style={{ border: 'none' }} type="button" onClick={() => this.copy()}>
              <img width={25} src={copy} alt="" />
            Copy
            </button>
          </div>

        </ToolTip>
        {
        copySuccess
          ? (
            <div className="copied-succes-div">
              <DoneOutlineIcon />
              <p>
          Copied!!!
              </p>
            </div>
          ) : null
      }
        <Dialog
          open={previewWebsiteDialog}
          TransitionComponent={Transition}
          fullScreen
          onClose={this.togelPreviewWebsiteDialogOpen}
        >


          <DialogContent style={{ flexWrap: 'wrap', position: 'relative' }}>
            <iframe src={`${window.location.origin}${BASE_URL}/${username}`} style={{ width: '100%', height: '100%' }} title="Website preview" />
          </DialogContent>
          <DialogActions>
            <button type="button" className="color-btn w-100" onClick={() => this.togelPreviewWebsiteDialogOpen()}> Close </button>
          </DialogActions>
        </Dialog>
      </div>


    );
  }
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  links: state.AdminPageReducers.links,
  profileViews: state.AdminPageReducers.profileViews,
  routingLocation: state.router,

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CopyUrl);
