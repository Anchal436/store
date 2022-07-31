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
import StyleIcon from '@material-ui/icons/Style';
import Slide from '@material-ui/core/Slide';

import './styles.css';
import { toast } from 'react-toastify';
import { GET_HEADER_INFO, GET_BG_STYLE } from '../../../constants/actionTypes';
import { store } from '../../../store';
import Loader from '../../../common/Components/Loader';
import DisabledDiv from '../../../common/Components/DisabledDiv';
import SelectImage from '../../../common/Components/SelectImage';
import { DEFAULT_BG_STYLE, DEFAULT_TEXT_COLOR, ERROR_MSG } from '../../../constants/otherConstants';
import agent from '../../../agent';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../../../assets/Images/premiumBgImages', false, /\.(png|jpe?g|svg)$/));
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
const themes = [
  
  {
    bgStyle: {
      ...JSON.parse(DEFAULT_BG_STYLE),
    },
    textColor: DEFAULT_TEXT_COLOR,
  },
  {
    bgStyle: {
      backgroundColor: '#b8c6db',
      backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)',
    } ,
    textColor: '#5d67f9'
  },
  {
    bgStyle: {
      backgroundColor: '#b8c6db',
      backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)',
    } ,
    textColor: '#474747',
  },
  {
    bgStyle: {
      backgroundColor: '#b8c6db',
      backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)',
    } ,
    textColor: '#936e66',
  },
  {
    bgStyle: {
      backgroundColor: '#b8c6db',
      backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)',
    } ,
    textColor: '#3C071B',
  },
  // {
  //   bgStyle: {
  //     backgroundColor: '#861657',
  //     backgroundImage: 'linear-gradient(326deg, #861657 0%, #ffa69e 74%)',
  //   },
  //   textColor: DEFAULT_TEXT_COLOR,
  // },
  // {
  //   bgStyle: {
  //     backgroundColor: '#f39f86',
  //     backgroundImage: 'linear-gradient(315deg, #f39f86 0%, #f9d976 74%)',
  //   },
  //   textColor: DEFAULT_TEXT_COLOR,
  // },
  {
    bgStyle: {
      backgroundColor: '#f9d29d',
      backgroundImage: 'linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%)',
    },
    textColor: '#000000',
  },
  {
    bgStyle: {
      backgroundColor: '#f9d29d',
      backgroundImage: 'linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%)',
    },
    textColor: '#3C071B',
  },
  // {
  //   bgStyle: {
  //     backgroundColor: '#bd4f6c',
  //     backgroundImage: 'linear-gradient(326deg, #bd4f6c 0%, #d7816a 74%)',
  //   },
  //   textColor: '#000000',
  // },
  // {
  //   bgStyle: {
  //     backgroundColor: '#a4508b',
  //     backgroundImage: 'linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)',
  //   },
  //   textColor: DEFAULT_TEXT_COLOR,
  // },
  // {
  //   bgStyle: {
  //     backgroundColor: '#a40606',
  //     backgroundImage: 'linear-gradient(315deg, #a40606 0%, #d98324 74%)',
  //   },
  //   textColor: DEFAULT_TEXT_COLOR,
  // },
  {
    bgStyle: {
      backgroundColor: '#7ee8fa',
      backgroundImage: 'linear-gradient(315deg, #7ee8fa 0%, #80ff72 74%)',
    },
    textColor: '#000000',

  },
  {
    bgStyle: {
      backgroundColor: '#eec0c6',
      backgroundImage: 'linear-gradient(315deg, #eec0c6 0%, #7ee8fa 74%)',
    },
    textColor: '#00000',

  },
  // {
  //   bgStyle: {
  //     backgroundColor: '#fd8f67',

  //     backgroundImage: 'linear-gradient(0deg, rgb(253, 143, 103), rgb(212, 99, 163))',
  //   },
  //   textColor: DEFAULT_TEXT_COLOR,

  // },
  {
    bgStyle: {
      backgroundColor: '#9fa4c4',
      backgroundImage: 'linear-gradient(315deg, #9fa4c4 0%, #9e768f 74%)',
    },
    textColor: '#000000',

  },
  {
    bgStyle: {
      backgroundColor: '#6b0f1a',
      backgroundImage: 'linear-gradient(315deg, #6b0f1a 0%, #b91372 74%)',
    },
    textColor: '#000000',

  },
  {
    bgStyle: {
      backgroundColor: '#e9bcb7',
      backgroundImage: 'linear-gradient(315deg, #e9bcb7 0%, #29524a 74%)',
    },
    textColor: '#000000',
  },
  {
    bgStyle: {
      backgroundColor: '#90d5ec',
      backgroundImage: 'linear-gradient(315deg, #90d5ec 0%, #fc575e 74%)',
    },
    textColor: '#000000',

  },
  // {
  //   bgStyle: {
  //     backgroundColor: '#d5adc8',
  //     backgroundImage: 'linear-gradient(315deg, #d5adc8 0%, #ff8489 74%)',
  //   },
  //   textColor: DEFAULT_TEXT_COLOR,
  // },
  {
    bgStyle: {
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(315deg, #3f0d12 0%, #a71d31 74%)',
    },
    textColor: '#000000',
  },
  // {
  //   bgStyle: {
  //     backgroundColor: '#3f0d12',
  //     backgroundImage: 'linear-gradient(315deg, #3f0d12 0%, #a71d31 74%)',
  //   },
  //   textColor: DEFAULT_TEXT_COLOR,
  // },
  {
    bgStyle: {
      backgroundColor: '#fff',
      backgroundImage: 'linear-gradient(315deg, #fff 0%, #fff 74%)',
    },
    textColor: '#000000',
  },
];
const premiumThemes = images.map((i) => ({ img: i, style: { backgroundImage: `url(${i})` } }));
class ChangeBgColor extends Component {
  constructor(props) {
    super(props);
    this.state = {

      loading: false,
      selectedStyle: JSON.parse(DEFAULT_BG_STYLE),
      isNormalUser: true,
      changeThemeOpen: false,
      user: {},
      fontColor: DEFAULT_TEXT_COLOR,
      colorUpdated: false,
    };
    this.togelChangeThemeDialogOpen = this.togelChangeThemeDialogOpen.bind(this);
  }
  
  componentWillMount() {
    const { user, selectedStyle } = this.props;
    if (user && user.user) {
      const temp = user.user.user_type === 'normal';
      this.setState({ user: user.user, isNormalUser: temp });
    }
    if (selectedStyle) {
      let data = JSON.parse(DEFAULT_BG_STYLE);
      let fontColor = DEFAULT_TEXT_COLOR;
      if (selectedStyle.background_color) {
        try {
          data = JSON.parse(selectedStyle.background_color);
        } catch {
          data = JSON.parse(DEFAULT_BG_STYLE);
        }
      }
      if (selectedStyle.link_style) {
        fontColor = selectedStyle.link_style;
      }
      this.setState({ selectedStyle: data, fontColor });
    }
  }

  componentWillReceiveProps(np) {
    // console.log('cwm', window.location);
    if (np.user && np.user.user !== this.state.user) {
      const temp = np.user.user.user_type === 'normal';
      this.setState({ user: np.user.user, isNormalUser: temp });
    }
    if (np.selectedStyle) {
      let data = JSON.parse(DEFAULT_BG_STYLE);
      let fontColor = DEFAULT_TEXT_COLOR;
      if (np.selectedStyle.background_color) {
        try {
          data = JSON.parse(np.selectedStyle.background_color);
        } catch {
          data = JSON.parse(DEFAULT_BG_STYLE);
        }
      }
      if (np.selectedStyle.link_style) {
        fontColor = np.selectedStyle.link_style;
      }
      this.setState({ selectedStyle: data, fontColor });
    }
    if (np.routingLocation) {
      if (np.routingLocation.location.query) this.setState({ changeThemeOpen: np.routingLocation.location.query.changeTheme });
    }
  }


  onSelectFile(file) {
    const { blob } = file;
    const data = [
      { key: 'photo', file: blob },
    ];
    this.uploadChanges(data);
  }

  setDefaultTheme() {
    const data = [
      { key: 'link_style', file: '' },
      { key: 'background_color', file: '' },
      { key: 'photo', file: null },
    ];
    this.uploadChanges(data);
  }

  uploadFontColor() {
    const { fontColor } = this.state;
    const data = [
      { key: 'link_style', file: fontColor },
    ];
    this.uploadChanges(data);
  }

  uploadPremiumBg(img) {
    fetch(img)
      .then((response) => response.blob()).catch((err) => console.log(err))
      .then((blob) => {
        blob.name = 'bg-img';
        blob.lastModified = new Date();
        blob.lastModifiedDate = new Date();
        blob.webkitRelativePath = img;
        this.onSelectFile({ blob });
      })
      .catch((err) => console.log(err, err.response));
  }

  uploadChanges(data) {
    const { loading } = this.state;
    const { setBackgroundStyle } = this.props;
    if (!loading) this.setState({ loading: true });
    
    agent.AdminPage.uploadBackground(data).then((res) => {
      setBackgroundStyle(res.data);
      
      this.setState({ loading: false, colorUpdated: false });
      this.togelChangeThemeDialogOpen();
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err, err.response);
      toast.error(ERROR_MSG);
    });
  }

  selectBg(bg) {
    const data = [
      { key: 'background_color', file: JSON.stringify(bg.bgStyle) },
      { key: 'photo', file: null },
      { key: 'link_style', file: bg.textColor },
      
    ];
    
    this.uploadChanges(data);
  }

  showLoader() {
    this.setState({ loading: true });
  }

  togelChangeThemeDialogOpen() {
    const { changeThemeOpen } = this.state;

    if (changeThemeOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&changeTheme=true`
        : `${window.location.pathname}?changeTheme=true`;
      store.dispatch(push(path));
    }
  }

  renderThemes() {
    const { selectedStyle, fontColor } = this.state;
    const style = JSON.stringify(selectedStyle);
    return themes.map((t, i) => {
      if (style === JSON.stringify(t.bgStyle) && fontColor === t.textColor ) {
        return (
          <button type="button" onClick={() => this.selectBg(t)} key={i} className="change-bg-theme active-theme" style={{ background: t.textColor }}>
            <div className="secondary-color" style={t.bgStyle} />
          </button>
        );
      }
      return (
        <button type="button" onClick={() => this.selectBg(t)} key={i} className="change-bg-theme " style={{ background: t.textColor }}>
          <div className="secondary-color" style={t.bgStyle} />
        </button>
      );
    });
  }

  renderPremiumThemes() {
    const { isNormalUser } = this.state;
    return premiumThemes.map((t, i) => (
      <div className="premium-bg-theme">
        <button style={t.style} key={i} type="button" onClick={isNormalUser ? () => window.location.href = '/#pricing' : () => this.uploadPremiumBg(t.img)} />
        {
          isNormalUser
            ? <span>Upgrade</span>
            : null
        }
      </div>
    ));
  }


  render() {
    const {
      isNormalUser, changeThemeOpen, fontColor, loading, colorUpdated,
    } = this.state;
    return (
      <div className="justify-center self-center mt2  center">
        <div className="side-drawer-link relative" onClick={() => this.togelChangeThemeDialogOpen()}>
          <StyleIcon />
            Choose Theme

        </div>
        <Dialog
          open={changeThemeOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.togelChangeThemeDialogOpen}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"

        >

          <DialogTitle id="alert-dialog-slide-title">Choose Theme</DialogTitle>
          <div className="w-100 relative flex ">
            <button className="change-bg-image-btn relative ">
              Choose Custom Background Image
              <SelectImage onSelectFile={this.onSelectFile.bind(this)} isCroppingRequired showLoader={this.showLoader.bind(this)} />
            </button>
            {
              isNormalUser ? <DisabledDiv /> : null
            }
          </div>
          <div className="flex w-100 justify-center items-center relative">
            <div className="line-div" />
            <p className="b f3">OR</p>
            <div className="line-div" />

          </div>

          <DialogContent style={{ flexWrap: 'wrap', position: 'relative' }}>

            <div className="flex items-center just justify-around bb bt change-input-color relative">
              {
              isNormalUser ? <DisabledDiv /> : null
            }
              <b className="f5 mt0 mb0">change secondary color : </b>
              <input type="color" value={fontColor} onChange={(e) => this.setState({ fontColor: e.target.value, colorUpdated: true })} />
              {
                colorUpdated ? <button onClick={() => this.uploadFontColor()} className="color-btn"> Upload </button> : null
              }


            </div>
            <div className="flex flex-wrap center justify-center items-center">
              {/* {
                this.renderPremiumThemes()
              } */}
              {
                this.renderThemes()
              }
            </div>

          </DialogContent>
          <DialogActions>
            <button type="button" className="color-btn w-100" onClick={() => this.setDefaultTheme()}> Set Default Theme </button>
            <button type="button" className="btn w-100" onClick={() => this.togelChangeThemeDialogOpen()}> Cancel </button>
          </DialogActions>
          {
            loading ? <Loader /> : null
          }
        </Dialog>


      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  selectedStyle: state.AdminPageReducers.homeBgStyle,
  headerInfo: state.AdminPageReducers.headerInfo,
  routingLocation: state.router,
});

const mapDispatchToProps = (dispatch) => ({
  getHeaderInfo: (user) => dispatch({ type: GET_HEADER_INFO, payload: agent.AdminPage.getHeaderInfo(user) }),
  getBackgroundStyle: (user) => dispatch({ type: GET_BG_STYLE, payload: agent.AdminPage.getBackground(user) }),
  setBackgroundStyle: (bgStyle) => dispatch({ type: GET_BG_STYLE, payload: bgStyle }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeBgColor);
