import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { push, goBack } from 'react-router-redux';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { connect } from 'react-redux';
import HistoryIcon from '@material-ui/icons/History';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HomeIcon from '@material-ui/icons/Home';

import { store } from '../../../store';
import ChangeProfilePic from '../../../common/Components/ChangeProfilePic';
import Logo from '../../../common/Components/Logo';
import { LOGOUT } from '../../../constants/actionTypes';
import ChangeHeader from './ChangeHeader';
import ChangeBgColor from './ChangeBgColor';
import MyAccount from './MyAccount';


const drawerWidth = 150;


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    background: 'white',
    border: 'none',
    boxShadow: 'none',
    color: 'black',
    justifyContent: 'space-between',
    borderBottom: '1px solid black',
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    color: '#000',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    display: 'flex',
    justifyContent: 'flex-end',

  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileView, setMobileView] = React.useState(false);
  const [isNormalUser, setIsNormalUser] = React.useState(true);

  React.useEffect(() => {
    let temp;
    if (props.user && props.user.user && props.user.user.user_type) {
      temp = props.user.user_type === 'normal';
    }
    setMobileView(window.innerWidth < 600);
    setIsNormalUser(temp);
  }, [props.user]);
  React.useEffect(() => {
    if (props.routingLocation.location.query) {
      setMobileOpen(props.routingLocation.location.query.sideDrawer);
    }
  }, [props.routingLocation]);

  React.useEffect(() => {
    setMobileView(window.innerWidth < 600);
  }, []);

  const handleDrawerToggle = () => {
    if (mobileOpen) {
      store.dispatch(goBack());
    } else {
      const path = window.location.search ? `${window.location.pathname}${window.location.search}&sideDrawer=true`
        : `${window.location.pathname}?sideDrawer=true`;
      store.dispatch(push(path));
    }
  };

  const drawer = (
    <div className="h-100">
      <div className=" flex flex-column justify-between h-100 side-drawer-bg">
        <div className="tc  center">
          <Logo logostyles={{ display: 'flex', flexDirection: 'column' }} />
        </div>
        <Divider />
        <div className="mb2">
          <div>
            {
              isNormalUser
                ? (
                  <button type="button" onClick={() => window.location.href = '/#pricing'} className="color-btn flex ba pointer items-center w-100 pa3 b f4 justify-center mt0 mb0">

                    Join Pro
                  </button>
                )
                : null
            }
            {
              !mobileView
                ? (
                  <button type="button" onClick={() => store.dispatch(push('/admin/payments/'))} style={{background:'none',border:'none',display:'flex',justifyContent:'center',alignItems:'center',fontSize:'1.2rem',fontWeight:'500'}}>
                    <MonetizationOnIcon style={{ color: '#0095f6',width:'2.5rem',height:'2.5rem' }} />
                    My Cash
                  </button>
                ) : null
            }

            <ChangeBgColor />
            
            <MyAccount />
            <button type="button" onClick={() => store.dispatch(push('/admin'))} className="side-drawer-link flex ba pointer items-center justify-center mt0 mb0">
              <SupervisorAccountIcon />
              My Links
            </button>
            {/* <button type="button" onClick={() => store.dispatch(push('/admin/products/sold-products/'))} className="side-drawer-link flex ba pointer items-center justify-center mt0 mb0">
              <LocalOfferIcon />
              Sold Products
            </button> */}
            <button type="button" onClick={() => store.dispatch(push('/admin/products'))} className="side-drawer-link flex ba pointer items-center justify-center mt0 mb0">
              <LocalMallIcon />
              My Products
            </button>
            <button type="button" onClick={() => store.dispatch(push('/admin/design-homepage/'))} className="side-drawer-link flex ba pointer items-center justify-center mt0 mb0">
              <HomeIcon />
              Design Homepage
            </button>
            <button type="button" onClick={() => store.dispatch(push('/order-history'))} className="side-drawer-link flex ba pointer items-center justify-center mt0 mb0">
              <HistoryIcon className=" " />
              Order History
            </button>
            <button type="button" onClick={() => props.logout()} className="side-drawer-link flex ba pointer items-center justify-center mt0 mb0">
              <ExitToAppIcon className=" " />
              LOGOUT
            </button>

            <div className=" pointer side-drawer-link center">
              <div className="center">
                <ChangeProfilePic />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>

        <Toolbar className="flex justify-between">
          <Logo logostyles={{ display: 'flex', flexDirection: 'column' }} hideText />
          <div className="flex jutify-between">
            {
              mobileView
                ? (
                  <button type="button" onClick={() => store.dispatch(push('/admin/payments/'))} style={{border:'none', background:'none'}} >
                    <MonetizationOnIcon style={{ color: '#0095f6',width:'2.5rem', height:'2.5rem' }} />
                  </button>
                ) : null
            }
            <IconButton
              color="black"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon style={{ color: 'black' }} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {
          mobileView
            ? (
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            )
            : (
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            )
        }
      </nav>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.any,
};
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({ type: LOGOUT }),
});
const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  routingLocation: state.router,

});

export default connect(mapStateToProps, mapDispatchToProps)(ResponsiveDrawer);
