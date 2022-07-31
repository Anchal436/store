/* eslint-disable react/jsx-props-no-spreading */
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { ConnectedRouter } from 'connected-react-router';
import React, { lazy, Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { push } from 'react-router-redux';
import { Slide, ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@material-ui/core/CircularProgress';
import LogRocket from 'logrocket';
import agent from './agent';
import {
  APP_LOAD, REDIRECT, SET_USER,
} from './constants/actionTypes';
import { store } from './store';
import { WEB_TOKEN, USER_DETAILS_OBJECT } from './constants/otherConstants';

import AdminPage from './components/AdminPage/AdminPage';
import LandingPage from './components/LandingPage/LandingPage';
// import Pricing from './components/LandingPage/components/Pricing';
import PrivacyPolicy from './components/LandingPage/components/PrivacyPolicy';
import Login from './components/Auth/Login/Login';
import Signup from './components/Auth/SignUp/Signup';
import FAQ from './components/LandingPage/components/FAQ';
import Purchase from './components/Purchase/Purchase';
import PurchaseOutput from './components/Purchase/PurchaseOutput';
import OrderHistory from './components/OrderHistory/OrderHistory';
import ProductsPage from './components/ProductsPage/ProductsPage';
import TermsAndConditions from './components/LandingPage/components/TermsAndConditions';
import Payment from './components/HomePage/components/Payment';
import SuccessPayment from './components/HomePage/components/SuccessPayment';
import FailedPayment from './components/HomePage/components/FailedPayment';
import Payments from './components/Payments/Payments';
import ContactUs from './components/LandingPage/components/ContactUs';
import RefundPolicy from './components/LandingPage/components/RefundPolicy';
import PublicPageProductsPage from './components/HomePage/components/ProductsPage';
import ProductDetails from './components/HomePage/components/ProductDetails';
import CartDetails from './components/HomePage/components/CartDetails';
import ChangeHeader from './components/AdminPage/components/ChangeHeader';
import DesignHomePage from './components/DesignHomePage/DesignHomePage';


// LogRocket.init('asjnjo/myweblink');

const HomePage = lazy(() => import('./components/HomePage/HomePage'));
const PublicHomePage = lazy(() => import('./components/HomePage/PublicHomePage'));


const AdminRoutes = [
  { path: '/admin', component: AdminPage },
  { path: '/order-history/', component: OrderHistory },
  { path: '/admin/products/', component: ProductsPage },
  { path: '/admin/payments/', component: Payments },
  { path: '/admin/design-homepage/', component: DesignHomePage },
  
];

const LandingRoutes = [
  { path: '/', component: LandingPage },
  { path: '/privacy-policy', component: PrivacyPolicy },
  { path: '/refund-policy', component: RefundPolicy },
  { path: '/terms-and-conditions', component: TermsAndConditions },
  { path: '/login', component: Login },
  { path: '/purchase', component: Purchase },
  { path: '/purchase/result', component: PurchaseOutput },
  { path: '/signup', component: Signup },
  { path: '/faqs', component: FAQ },
  { path: '/contact-us/', component: ContactUs },
];

const PublicRoutes = [
  { path: '/user-payment/', component: Payment },
  { path: '/user-payment/success/', component: SuccessPayment },
  { path: '/user-payment/fail/', component: FailedPayment },
  { path: '/:userName/', component: PublicHomePage },
  { path: '/:userName/products/', component: PublicPageProductsPage },
  { path: '/:userName/products/:productSlug', component: ProductDetails },
];

toast.configure();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

      // openSideDrawer: false,
      // user: {},
    };
    this.currentLocation = {};
  }

  componentWillMount() {
    const token = window.localStorage.getItem(WEB_TOKEN);
    const userDetailsObject = window.localStorage.getItem(USER_DETAILS_OBJECT);
    if (this.props.location) {
      this.currentLocation = this.props.location;
    }
    if (token == null) {
      // store.dispatch(replace('/'));
      // this.props.onRedirect('/');
    } else {
      agent.setToken(token);
    }
    try {
      if (userDetailsObject) {
        const user = JSON.parse(userDetailsObject);
        this.props.setUser({ user });
      }
    } catch {

    }
    // const { history } = this.props;

    // history.listen((newLocation, action) => {
    //   if (action === 'PUSH') {
    //     if (
    //       newLocation.pathname !== this.currentPathname
    //       || newLocation.search !== this.currentSearch
    //     ) {
    //       // Save new location
    //       this.currentPathname = newLocation.pathname;
    //       this.currentSearch = newLocation.search;

    //       // Clone location object and push it to history
    //       history.push({
    //         pathname: newLocation.pathname,
    //         search: newLocation.search,
    //       });
    //       history.push({
    //         pathname: newLocation.pathname,
    //         search: newLocation.search,
    //       });
    //       history.push({
    //         pathname: newLocation.pathname,
    //         search: newLocation.search,
    //       });
    //     }
    //   }
    // });
    // if (this.props.user) this.setState({ user: this.props.user });
    this.props.onLoad(token ? 1 : null, token);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.history.location !== this.currentLocation) {
      this.props.onRedirect(nextProps.history.location);
    }
    if (nextProps.redirectTo && nextProps.redirectTo !== this.props.redirectTo) {
      store.dispatch(push(nextProps.redirectTo));
    }
    if (nextProps.user) this.setState({ user: nextProps.user });
  }

  render() {
    const { history } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <React.Suspense fallback={(
          <div style={{
            width: '40px', height: '40px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }}
          >
            <h4>Loading...</h4>
            <CircularProgress />
          </div>
        )}
        >
          <ConnectedRouter history={history}>
            <Switch>
              { LandingRoutes.map((props, i) => <Route {...props} exact key={i} />) }
              { AdminRoutes.map((props, i) => <Route {...props} exact key={i + 100} />) }
              { PublicRoutes.map((props, i) => <Route {...props} exact key={i + 1000} />) }
              {/* Route Not found */}
              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
          </ConnectedRouter>
        </React.Suspense>
        <div style={{ display: 'none' }}>
          <CartDetails />
          {/* <ProductDetails /> */}
          <ChangeHeader />
        </div>
        <ToastContainer
          autoClose={2000}
          closeOnClick
          transition={Slide}
          pauseOnFocusLoss={false}
          position="top-right"
        />
      </div>
    );
  }
}
function NoMatch() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    }}
    >
      <center>
        <h1>
            404 Page not found
        </h1>

        <a href="/">Go To Home</a>

      </center>
    </div>
  );
}

const mapStateToProps = (state) => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  redirectTo: state.common.redirectTo,
  apiKey: state.common.apiKey,
  user: state.AuthReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload, apiKey) => dispatch({
    type: APP_LOAD,
    payload,
    apiKey,
    skipTracking: true,

  }),
  onRedirect: (route) => dispatch({ type: REDIRECT, payload: route }),
  clearReducer: () => dispatch({ type: 'CLEAR' }),
  setUser: (user) => dispatch({ type: SET_USER, payload: user }),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
