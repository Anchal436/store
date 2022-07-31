/* eslint-disable camelcase */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'tachyons';
import { push, goBack } from 'react-router-redux';
import { store } from '../../store';



class addSearch {
  addSearch(key,value) {
      console.log("Add search", key,value);
    const path = window.location.search ? `${window.location.pathname}${window.location.search}&${key}=${value}`
      : `${window.location.pathname}?${key}=${value}`;
    store.dispatch(push(path));
  }


  
}


const mapStateToProps = (state) => ({
  user: state.AuthReducer.user,
  cartItems: state.HomePageReducers.cartItems,
  routingLocation: state.router.location,

});

export default connect(
  mapStateToProps,
)(addSearch);
