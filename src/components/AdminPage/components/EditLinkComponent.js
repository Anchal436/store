// /* eslint-disable jsx-a11y/anchor-is-valid */
// /* eslint-disable react/jsx-no-bind */
// /* eslint-disable react/button-has-type */

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import 'tachyons';

// import '../AdminPage.css';
// import { push } from 'react-router-redux';
// import { Toolbar } from '@material-ui/core';
// import { toast } from 'react-toastify';
// import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// import SideDrawer from './SideDrawer';
// import Link from './Link';
// import { store } from '../../../store';
// import agent from '../../../agent';
// import { GET_LINKS, GET_USER_DETAILS } from '../../../constants/actionTypes';
// import { BASE_URL, USER_DETAILS } from '../../../constants/otherConstants';
// import ToolTip from '../../../common/Components/ToolTip';
// // import Tabs from '../../../common/Components/Tabs';
// // import Loader from '../../../common/Components/Loader';
// // import HomePage from '../../HomePage/HomePage';

// class AdminPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       render: false,
//       loading: false,
//       mobileView: false,
//       user: {},
//     };
//     this.links = [];
//     this.location = '';
//   }

//   componentWillMount() {
//     // console.log(this.props);
//     window.addEventListener('resize', this.resize.bind(this));
//     this.resize();
//     const username = window.localStorage.getItem(USER_DETAILS);

//     const data = { username };
//     this.props.getUserDetails(data);
//     this.props.getLinks();
//   }

//   componentWillReceiveProps(np) {
//     if (np.links && this.links !== np.links.links) {
//       this.links = np.links.links;
//       this.setState({ loading: false });
//     }
//     if (np.user) {
//       if (this.state.user !== np.user.user) {
//         if (np.user.user.links) {
//           this.links = np.user.user.links;
//         }
//         this.setState({ user: np.user.user, loading: false });
//       }
//     }
//   }
//   shouldComponentUpdate(nextProps, nextState){
//     console.log(nextProps,nextState)
//     if(nextProps.links.links === this.links)
//     return false
//     return true;
//   }

//   resize() {
//     this.setState({ mobileView: window.innerWidth <= 600 });
//   }

//   addLink() {
//     const link = {
//       title: '',
//       url: '',
//       visible: true,
//     };
//     this.links = [link, ...this.links];
//     this.setState({ render: !this.state.render });
//   }

//   createLink(link) {
//     // this.links[link.index] = link;
//     const data = {
//       url: link.url,
//       visible: link.visible,
//       title: link.title,
//       index: link.index,
//       icon: link.icon,
//     };
//     if (link.id) data.id = link.id;

//     agent.AdminPage.createLink(data).then((res) => {
//       this.props.getLinks();
//     }).catch((err) => {
//       if (err.response) console.log(err.response);
//     });
//     this.setState({ render: !this.state.render });
//   }

//   uploadLinkIcon(link, icon) {
//     const data = [{ key: 'link_id', file: link.id }, { key: 'photo', file: icon }];
//     this.setState({ loading: true });
//     agent.AdminPage.uploadLinkIcon(data).then((res) => {
//       // console.log(res);
//       this.props.getLinks();
//     }).catch((err) => {
//       toast.error('error occured in updating the link icon');
//       this.setState({ loading: false });
//       console.log(err.response);
//     });
//   }

//   deleteLink(link) {
//     if (link.id) {
//       const data = {
//         id: link.id,
//       };

//       agent.AdminPage.deleteLink(data).then((res) => {
//         this.props.getLinks();
//       }).catch((err) => {
//         if (err.response) console.log(err.response);
//       });
//     } else {
//       this.links = this.links.filter((l, i) => i !== link.index);
//     }
//     this.setState({ render: !this.state.render });
//   }

//   onDragEnd(e) {
//     if (!e.destination || e.source.index === e.destination.index) return;
//     if (e.source && e.destination) {
//       const srcIndex = e.source.index;
//       const desIndex = e.destination.index;
//       if (srcIndex < desIndex) {
//         const temp = this.links[srcIndex];
//         for (let i = srcIndex + 1; i <= desIndex; i++) {
//           this.links[i - 1] = this.links[i];
//         }
//         this.links[desIndex] = temp;
//       } else {
//         const temp = this.links[srcIndex];
//         for (let i = srcIndex - 1; i >= desIndex; i--) {
//           this.links[i + 1] = this.links[i];
//         }
//         this.links[desIndex] = temp;
//       }
//       const linksSequence = this.links.map((l) => l.id);
//       agent.AdminPage.updateLinkSequence({	links: linksSequence }).then((res) => {
//         this.links = res.data.links;
//         this.props.getLinks();
//       }).catch((err) => {
//         console.log(err);
//       });
//     }
//   }

//   componentWillUnmount() {
//     window.removeEventListener('resize', () => console.log('removed'));
//   }

//   onDragStart(e) {
//     if (window.navigator.vibrate) {
//       window.navigator.vibrate(100);
//     }
// }

  

//   render() {
//     const { username } = this.state.user;

//     return (
      
//       <div className="justify-center self-center mt2">
//         <ToolTip innertext="Add this Sharable link to your bio">
//           <div className=" dyna-width center flex tc ">

//             <p className="  center ba pa1 w-100 block flex-wrap " style={{ overflowY: 'auto' }}>
//               Add this link to your bio
//               <br />
//               <a className="blue pointer grow" target="_blank" href={`${window.location.origin}${BASE_URL}/${this.state.user.username}`}>{`${window.location.origin}${BASE_URL}/${username}`}</a>
//             </p>
//           </div>
//         </ToolTip>
//         <DragDropContext
//           onDragEnd={this.onDragEnd.bind(this)}
//           onDragStart={this.onDragStart.bind(this)}
//         >
//         <div className=" center  flex flex-column ">
//           <button
//             className=" color-btn  dyna-width tc center  link-div"
//             onClick={() => this.createLink({
//               url: '', visible: false, title: '', index: -1, icon: null,
//             })}
//             style={{ padding: '15px', borderRadius: '15px' }}
//           >
//               Add new Link
//           </button>
//           <div className="render-links-div">
//             <Droppable droppableId="link-dropppabel">
//               { (provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   {
//               this.links.map((l, i) => (

//                 <Link
//                   link={{ ...l, index: i }}
//                   key={l.id}
//                   deleteLink={this.deleteLink.bind(this)}
//                   createLink={this.createLink.bind(this)}
//                   uploadLinkIcon={this.uploadLinkIcon.bind(this)}

//                 />
//               ))
//             }
//                   {provided.placeholder}

//                 </div>
//               )}
//             </Droppable>

//           </div>
//         </div>  
//         </DragDropContext>

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
// )(AdminPage);
