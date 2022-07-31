// /* eslint-disable react/no-deprecated */
// /* eslint-disable react/button-has-type */

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import 'tachyons';
// import { push } from 'react-router-redux';

// import './MyAccount.css';

// import agent from '../../agent';
// import ProfilePIc from '../../common/Components/ProfilePIc';
// import Loader from '../../common/Components/Loader';
// import Logo from '../../common/Components/Logo';
// import { store } from '../../store';
// import { GET_USER_DETAILS, GET_LINKS } from '../../constants/actionTypes';

// import SideDrawer from './components/SideDrawer';

// import IsEmailVerified from '../IsEmailVerified/IsEmailVerified';


// class MyAccount extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//       user: {},
//       error: '',
//       isNormalUser:true
//     };
//     this.links = [];
//   }


//   componentWillMount() {
//     this.props.getLinks();

//     if (this.props.user) {
//       this.setState({user:this.props.user.user})
//       const { username } = this.props.user.user;
//       const data = { username };
//       // this.props.getUserDetails(data);
//     }
//   }


//   componentWillReceiveProps(np) {
//     if (np.user) {
//       // console.log(np.user.user);
//       if (this.state.user !== np.user.user) this.setState({ user: np.user.user });
//     }
//     // console.log(np);
//     if (np.links) if (this.links !== np.links.links) this.links = np.links.links;
//   }

//   selectProfilePic(pic) {
//     this.setState({ loading: true, error: '' });
//     const data = [{ key: 'photo', file: pic }];
//     agent.Auth.uploadProfileImage(data).then((res) => {
//       const data = { username: this.state.user.username };

//       this.props.getUserDetails(data);

//       this.setState({ loading: false });
//     }).catch((err) => {
//       this.setState({ loading: false });
//       console.log('err in uploading image', err);
//       if (err.response) {
//         console.log(err.response);
//         this.setState({ error: err.response.data.error });
//       }
//     });
//   }

//   movetoAdmin() {
//     store.dispatch(push('/admin'));
//   }

//   render() {
//     const { username, profile_pic } = this.state.user;
//     return (
//       <div className="gradientbg">
//         <div className="nav-margin">
//           <IsEmailVerified />
//           <SideDrawer user={this.state.user} />
//           <div className="main-div-width home-page-div ">
//             <div className="dyna-width">
//               <div className=" center">
//                 <article className="center  tc ">
//                   <ProfilePIc photo={profile_pic} selectProfilePic={this.selectProfilePic.bind(this)} changProfile />
//                   <h1 className="subheading white center tc" style={{ color: 'white' }}>
//                     {`@${username}`}
//                   </h1>
//                   <p className="err-txt">{`${this.state.error}`}</p>
//                 </article>
//               </div>
//               <div className="tc mt4 dyna-width">
//                 {
//                 this.links.map((link, i) => {
//                   if (link.visible) {
//                     return (
//                       <a href={link.url} key={i} className="link dyna-width" target="_blank" rel="noopener noreferrer">
//                         {link.icon ? <img src={link.icon} alt="" /> : null}
//                         <p className="center ">
//                           {`${link.title}`}
//                         </p>
//                       </a>
//                     );
//                   }
//                   return null;
//                 })
//               }
//               </div>

//             </div>
//             <footer>
//               <Logo logostyles={{ display: 'flex', flexDirection: 'row' }} />
//             </footer>
//           </div>
//           {
//             this.state.loading
//               ? <Loader />
//               : null
//         }
//         </div>
//       </div>
//     );
//   }
// }


// const mapStateToProps = (state) => ({
//   user: state.AuthReducer.user,
//   links: state.AdminPageReducers.links,

// });

// const mapDispatchToProps = (dispatch) => ({
//   getUserDetails: (user) => store.dispatch({ type: GET_USER_DETAILS, payload: agent.Auth.getUserDetails(user) }),
//   getLinks: () => dispatch({ type: GET_LINKS, payload: agent.AdminPage.getLinks() }),

// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(MyAccount);
