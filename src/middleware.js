
import { toast } from 'react-toastify';
import { replace } from 'connected-react-router';

import agent from './agent';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  REGISTER,
  GET_USER_DETAILS,
  SET_USER
} from './constants/actionTypes';

import { WEB_TOKEN, USER_DETAILS } from './constants/otherConstants';

function isPromise(v) {
  return v && typeof v.then === 'function';
}

const promiseMiddleware = (store) => (next) => (action) => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const { skipTracking } = action;

    action.payload
      .then(
        (response) => {
          // console.log(response)
          const currentState = store.getState();
          if (!skipTracking && currentState.viewChangeCounter !== currentView) {
            return;
          }

          action.payload = response.data;
          store.dispatch({ type: ASYNC_END, promise: action.payload });
          store.dispatch(action);
        },
        (error) => {
          console.log(error);

          let status;
          let errorMessage = 'Check your Connection';
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            if(error.response.data.error)
              errorMessage = error.response.data.error;
            status = error.response.status;
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          const currentState = store.getState();
          if (!skipTracking && currentState.viewChangeCounter !== currentView) {
            return;
          }
          if (status === 404) {
            try {
              toast.error(errorMessage);
              store.dispatch(replace('/'))
            } catch (err) {
              console.debug(err);
            }
            console.debug('ERRIIOIIO----->', error.response.status);
            action.payload = error.response.data;
            store.dispatch(action);
          }
          if (status === 500) {
            // toast.error(' 500 Response Internal Server Error !!');
          }
          action.error = true;
          // action.payload = {};
          if (error.response) {
            action.payload = error.response.body || {};
          } else {
            action.payload = {};
          }
          if (!action.skipTracking) {
            store.dispatch({ type: ASYNC_END, promise: action.payload });
          }
          if (action.type !== LOGIN && (status === 401 || status === 403)) {
            try {
              toast.error('Token Expired. Login Again!!!');
            } catch (err) {
              console.log('error ', error.response);
            }
            store.dispatch({ type: LOGOUT, promise: action.payload });
          } else {
            try {
              toast.error(errorMessage);
            } catch (err) {
              console.debug(err);
            }
          }
        },
      );

    return;
  }

  next(action);
};

const localStorageMiddleware = (store) => (next) => (action) => {
  if (action.type === REGISTER || action.type === LOGIN) {
    if (!action.error) {
      
      window.localStorage.setItem(WEB_TOKEN, action.payload.data.token);
      agent.setToken(action.payload.data.token);
    }
  }else if( action.type === SET_USER){
    // console.log("user details",action.payload)
    window.localStorage.setItem(USER_DETAILS,action.payload.user.username)

  }else if (action.type === LOGOUT) {
    window.localStorage.clear()
    
    store.dispatch(replace('/'));
    agent.setToken(null);
  }

  next(action);
};


export { promiseMiddleware, localStorageMiddleware };
