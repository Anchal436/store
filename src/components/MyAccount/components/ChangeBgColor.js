// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable react/button-has-type */

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import 'tachyons';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Slide from '@material-ui/core/Slide';

// import './styles.css';
// import default_logo from '../../../assets/Images/instalink_logo.png';
// import { GET_HEADER_INFO } from '../../../constants/actionTypes';
// import Logo from '../../../common/Components/Logo';
// import Loader from '../../../common/Components/Loader';
// import { DEFAULT_BG_STYLE } from '../../../constants/otherConstants';
// import agent from '../../../agent';

// const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// class AdminPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       render: false,
//       loading: false,
//       changeHeaderOpen: false,
//       error: '',
//       bgStyle: JSON.parse(DEFAULT_BG_STYLE),
//       isNormalUser: true,

//     };
//     this.handleChangeHeaderDialogOpen = this.handleChangeHeaderDialogOpen.bind(this);
//   }

//   handleChangeHeaderDialogOpen() {
//     this.setState({ changeHeaderOpen: !this.state.changeHeaderOpen });
//   }
//   saveChanges(icon) {
//     console.log(this.state, icon);
//     // this.props.uploadLinkIcon(link, icon);
//     const data = { background_color: this.state.color };
//     this.setState({ loading: true });
//   }
//   selectBg(bg){
    
//   }

//   render() {
//     return (
//       <div>
//         <button type="button" className="color-btn flex hover-color-change pointer items-center justify-center mt0 mb0" onClick={() => this.handleChangeHeaderDialogOpen()}>
//               Style BackGround
//         </button>
//         <Dialog
//           open={this.state.changeHeaderOpen}
//           TransitionComponent={Transition}
//           keepMounted
//           onClose={this.handleChangeHeaderDialogOpen}
//           aria-labelledby="alert-dialog-slide-title"
//           aria-describedby="alert-dialog-slide-description"
//         >
//           <DialogTitle id="alert-dialog-slide-title">Choose Your Background.</DialogTitle>
//           <DialogContent style={{ flexWrap: 'wrap' }} >
//             <div style={{...this.state.bgStyle,width:500,height:500,marginLeft:'auto',marginRight:'auto'}}  >

//             </div>
//             </DialogContent>

//           <DialogActions>


//             <button onClick={() => this.saveChanges(default_logo)} color="primary" className="color-btn ma1 " style={{ width: '40%' }}>
//                     Save Changes
//             </button>

//             <button onClick={() => this.selectBg(DEFAULT_BG_STYLE)} color="primary" className="btn ba ">
//                     Choose Default BackGround
//             </button>
//             <button onClick={this.handleChangeHeaderDialogOpen} color="primary" className="btn ba ">
//                 Cancel
//             </button>

//           </DialogActions>
//           {
//             this.state.loading ? <Loader /> : null
//           }
//         </Dialog>


//       </div>


//     );
//   }
// }



// const mapStateToProps = (state) => ({

// });

// const mapDispatchToProps = (dispatch) => ({
//   getHeaderInfo: () => dispatch({ type: GET_HEADER_INFO, payload: agent.MyAccount.getHeaderInfo() }),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(AdminPage);
