// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable react/button-has-type */

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import 'tachyons';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import BorderColorIcon from '@material-ui/icons/BorderColor';
// import Slide from '@material-ui/core/Slide';
// import PolymerIcon from '@material-ui/icons/Polymer';

// import './styles.css';
// import { toast } from 'react-toastify';

// import default_logo from '../../../assets/Images/instalink_logo.png';
// import { GET_HEADER_INFO } from '../../../constants/actionTypes';
// import Loader from '../../../common/Components/Loader';
// import DisabledDiv from '../../../common/Components/DisabledDiv';
// import { APP_NAME } from '../../../constants/otherConstants';
// import agent from '../../../agent';

// const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// class AdminPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       render: false,
//       iconSrc: default_logo,
//       loading: false,
//       changeHeaderOpen: false,
//       error: '',
//       headerText: APP_NAME,
//       isNormalUser: true,
//       iconBlob: null,
//       headerInfo: { header_icon: default_logo, header_text: APP_NAME },
      
//     };
//     this.handleChangeHeaderDialogOpen = this.handleChangeHeaderDialogOpen.bind(this);
//     this.onCustomIconSelect = this.onCustomIconSelect.bind(this);
//   }

//   componentWillMount() {
//     if(this.props.user ){
//       let temp = this.props.user.user.user_type === 'normal';
//       this.setState({user:this.props.user.user,isNormalUser:temp});
//     }
//     if (this.props.headerInfo && this.props.headerInfo !== this.state.headerInfo) {
//       this.setState({ headerInfo: this.props.headerInfo, changeHeaderOpen: false });
//     }
//   }

//   componentWillReceiveProps(np) {
//     if(np.user && np.user.user !== this.state.user){
//       let temp = np.user.user.user_type === 'normal';
//       // console.log("user type",temp,np)
//       this.setState({user:np.user.user,isNormalUser:temp})
//     }
//     if (np.headerInfo && np.headerInfo !== this.state.headerInfo) {
//       this.setState({ headerInfo: np.headerInfo, });
//     }
//   }

//   handleChangeHeaderDialogOpen() {
//     this.setState({ changeHeaderOpen: !this.state.changeHeaderOpen });
//   }

//   selectIcon(icon) {
//     fetch(icon)
//       .then((response) => response.blob())
//       .then((blob) => {
//         blob.name = 'icon';
//         blob.lastModified = new Date();
//         blob.lastModifiedDate = new Date();
//         blob.webkitRelativePath = icon;
//         this.setState({
//           imgBlob: blob,
//           headerInfo: { ...this.state.headerInfo, header_icon: icon },
//         });
//       });
//   }


//   saveChanges(icon) {
//     // this.props.uploadLinkIcon(link, icon);
//     const { header_icon, header_text } = this.state.headerInfo;
//     const { imgBlob } = this.state;
//     const data = [{ key: 'icon', file: imgBlob }, { key: 'header_text', file: header_text }];

//     this.setState({ loading: true });
//     agent.MyAccount.uploadHeaderInfo(data).then((res) => {
//       if (this.props.user) {
//         const { username } = this.props.user.user;
//         const data = { username };
//         this.props.getHeaderInfo(data);
//         setTimeout(() => {
//           this.setState({ loading: false, changeHeaderOpen: false });
//         }, 1000);
//       }
//     }).catch((err) => {
//       console.log(err);
//       toast.error('an error occured in updating the header !!!');
//       if (err.response) {
//         console.log(err.response);
//       }
//     });
//   }

//   async onCustomIconSelect(e) {
//     if (e.target.files && e.target.files.length > 0) {
//       const blob = e.target.files[0];
//       const imageDataUrl = await readFile(blob);
//       this.setState({
//         imgBlob: blob,
//         headerInfo: { ...this.state.headerInfo, header_icon: imageDataUrl },
//       });
//     }
//   }

//   render() {
//     const { headerInfo, isNormalUser } = this.state;
//     return (
//       <div className="w-100 h-100">
//         <button type="button" className="side-drawer-link relative" onClick={() => this.handleChangeHeaderDialogOpen()}>
//           <PolymerIcon />
//             Change Header
//           {
//                isNormalUser ? (
//                 <DisabledDiv message=""/>
//                ) : null
//              }
//         </button>
//         <Dialog
//           open={this.state.changeHeaderOpen}
//           TransitionComponent={Transition}
//           keepMounted
//           onClose={this.handleChangeHeaderDialogOpen}
//           aria-labelledby="alert-dialog-slide-title"
//           aria-describedby="alert-dialog-slide-description"

//         >
          
//           <DialogTitle id="alert-dialog-slide-title">Choose Your header.</DialogTitle>
          
//           <DialogContent style={{ flexWrap: 'wrap', position: 'relative' }}>
//             <div className="img-div  ">
//               <img src={headerInfo.header_icon} alt="" />
//               <p>{`${headerInfo.header_text}`}</p>

//             </div>
//             <div className="flex justify-between bt bb">
//               <div className="center" className="select-img-icon btn ba w-50 self-center ">
//                 <input
//                   type="file"
//                   id="avatar"
//                   name="avatar"
//                   accept="image/png, image/jpeg"

//                   onChange={this.onCustomIconSelect}
//                 />
//                   Choose custom Icon
//               </div>
//               <div className="header-text-input w-50 self-center flex items-center">
//                 <input
//                   type="text"
//                   name="header-name"
//                   className="inp"
//                   value={headerInfo.header_text}
//                   onChange={(e) => this.setState({ headerInfo: { ...headerInfo, header_text: e.target.value } })}
//                 />
//                 <BorderColorIcon />
//               </div>
//             </div>

//           </DialogContent>
//           <DialogActions>


//             <button onClick={() => this.saveChanges(default_logo)} color="primary" className="color-btn ma1 " style={{ width: '40%' }}>
//                     Save Changes
//             </button>

//             <button onClick={() => this.selectIcon(default_logo)} color="primary" className="btn ba ">
//                     Choose Default Icon
//             </button>
//             <button onClick={this.handleChangeHeaderDialogOpen} color="primary" className="btn ba ">
//                 Cancel
//             </button>

//           </DialogActions>
//           {
//             this.state.loading ? <Loader /> : null
//           }
//           {
//             isNormalUser
//               ? (
//                 <DisabledDiv message="Pro Pack coming soon."/>
//               ) : null
//           }
//         </Dialog>


//       </div>
//     );
//   }
// }

// function readFile(file) {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => resolve(reader.result), false);
//     reader.readAsDataURL(file);
//   });
// }

// const mapStateToProps = (state) => ({
//   user: state.AuthReducer.user,
//   headerInfo: state.MyAccountReducers.headerInfo,
// });

// const mapDispatchToProps = (dispatch) => ({
//   getHeaderInfo: (user) => dispatch({ type: GET_HEADER_INFO, payload: agent.MyAccount.getHeaderInfo(user) }),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(AdminPage);
