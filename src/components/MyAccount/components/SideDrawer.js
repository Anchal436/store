// import React from 'react';
// import PropTypes from 'prop-types';
// import AppBar from '@material-ui/core/AppBar';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Divider from '@material-ui/core/Divider';
// import Drawer from '@material-ui/core/Drawer';
// import Hidden from '@material-ui/core/Hidden';
// import Toolbar from '@material-ui/core/Toolbar';
// import { makeStyles, useTheme } from '@material-ui/core/styles';
// import { push } from 'react-router-redux';
// import IconButton from '@material-ui/core/IconButton';
// import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
// import MenuIcon from '@material-ui/icons/Menu';

// import { connect } from 'react-redux';
// import { store } from '../../../store';
// import ToolTip from '../../../common/Components/ToolTip';
// import ChangeHeader from './ChangeHeader';
// import ChangeBgColor from './ChangeBgColor';
// import Logo from '../../../common/Components/Logo';
// import { LOGOUT } from '../../../constants/actionTypes';

// import { APP_NAME } from '../../../constants/otherConstants';

// const drawerWidth = 150;

// const flowSequence = [
//   { index: 0, name: 'My Account', action: () => store.dispatch(push('/account')) },
// ];
// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//   },
//   drawer: {
//     [theme.breakpoints.up('sm')]: {
//       width: drawerWidth,
//       flexShrink: 0,
//     },
//   },
//   appBar: {
//     [theme.breakpoints.up('sm')]: {
//       display: 'none',
//     },
//     background: '#0095f6',
//     border: 'none',
//     boxShadow: 'none',
//     color: 'black',
//     justifyContent: 'space-between',
//     boxShadow: '0px 5px 22px 1px rgba(31,91,128,1)',
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//     [theme.breakpoints.up('sm')]: {
//       display: 'none',
//     },
//   },
//   // necessary for content to be below app bar
//   toolbar: theme.mixins.toolbar,
//   drawerPaper: {
//     width: drawerWidth,
//     display: 'flex',
//     justifyContent: 'flex-end',

//   },
//   content: {
//     flexGrow: 1,
//     padding: theme.spacing(3),
//   },
// }));

// function ResponsiveDrawer(props) {
//   const { container } = props;
//   const classes = useStyles();
//   const theme = useTheme();
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const [user, setUser] = React.useState({});
//   const [isNormalUser, setIsNormalUser] = React.useState(true);
//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   React.useEffect(() => {
//     const data = { ...props.user };
//     if (typeof (data.profile_pic) === 'undefined') data.profile_pic = 'https://cdn-images-1.medium.com/max/1200/1*PkrwrLwaq68CaqLPn7jBIw.png';
//     setUser(data);
//     let temp;
//     if (data.user_type) {
//       temp = data.user_type === 'normal';
//     }
//     // console.log(props,"dsfdsgf")
//     setIsNormalUser(temp);
//   }, [props.user]);

//   const drawer = (
//     <div className="h-100">
//       <div className=" flex flex-column justify-between h-100 side-drawer-bg">
//         <div className="tc">
//           <Logo logostyles={{ display: 'flex', flexDirection: 'column' }} />
//         </div>
//         <Divider />
//         <div className="mb3">
//           <div>
//             {/* <ChangeBgColor/> */}
//             {/* <ChangeHeader isNormalUser={isNormalUser}/> */}
//           </div>
//           <ToolTip innertext="Adming Page">
//             <button type="button" onClick={() => store.dispatch(push('/admin'))} className="side-drawer-link">
//               <SupervisorAccountIcon /> Go To Admin
//             </button>
//           </ToolTip>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className={classes.root}>
//       <CssBaseline />
//       <AppBar position="fixed" className={classes.appBar}>
//         <Toolbar className="flex justify-between">

//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             className={classes.menuButton}
//           >
//             <MenuIcon style={{ color: 'white' }} />
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//       <nav className={classes.drawer} aria-label="mailbox folders">
//         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
//         <Hidden smUp implementation="css">
//           <Drawer
//             container={container}
//             variant="temporary"
//             anchor={theme.direction === 'rtl' ? 'right' : 'left'}
//             open={mobileOpen}
//             onClose={handleDrawerToggle}
//             classes={{
//               paper: classes.drawerPaper,
//             }}
//             ModalProps={{
//               keepMounted: true, // Better open performance on mobile.
//             }}
//           >
//             {drawer}
//           </Drawer>
//         </Hidden>
//         <Hidden xsDown implementation="css">
//           <Drawer
//             classes={{
//               paper: classes.drawerPaper,
//             }}
//             variant="permanent"
//             open
//           >
//             {drawer}
//           </Drawer>
//         </Hidden>
//       </nav>

//     </div>
//   );
// }

// ResponsiveDrawer.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   container: PropTypes.any,
// };
// const mapDispatchToProps = (dispatch) => ({
//   logout: () => dispatch({ type: LOGOUT }),
// });
// export default connect(null, mapDispatchToProps)(ResponsiveDrawer);
