import {
  APP_LOAD,
  REDIRECT,
  REGISTER,

} from '../constants/actionTypes';

export const defaultState = {
  appName: 'ProjectX',
  token: null,
  viewChangeCounter: 0,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
      };
    case REDIRECT:
      return { ...state, redirectTo: action.payload };
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        token: action.error ? null : action.payload.token,
        currentUser: action.error ? null : action.payload.data.name,
        role: action.payload.role,
        name: action.payload.name,
      };
    default:
      return state;
  }
};
