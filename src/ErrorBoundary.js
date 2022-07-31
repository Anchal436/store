import React from 'react';
import { connect } from 'react-redux';
import { store } from './store';
import ErrorPage from './ErrorPage';

import agent from './agent';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error, np) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service

    const { user, routingLocation, publicPageUser } = this.props;
    let tempData = {};
    if (user && user.user) {
      tempData = { ...tempData, user: user.user };
    }
    if (publicPageUser) {
      tempData = {
        ...tempData, user: publicPageUser,
      };
    }
    if (routingLocation) {
      tempData = { ...tempData, routingLocation };
    }
    const data = {
      stack_trace: JSON.stringify({ error: `${error}`, errorInfo }),
      url: routingLocation ? JSON.stringify(tempData.routingLocation) : window.location.pathname,
      username: tempData.user ? tempData.user.username : '',
    };
    console.log(data);
    // store.dispatch({ type: 'LOGOUT' });
    window.localStorage.clear();
    agent.setToken(null);
    agent.PublicPage.logError(data).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err, err.response);
    });
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ErrorPage />
      );
    }

    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  publicPageUser: state.HomePageReducers.user,
  routingLocation: state.router.location,
});
export default connect(mapStateToProps)(ErrorBoundary);
