import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import componentsReducers from './components/reducer';
// import auth from './components/Auth/AuthReducer';
import common from './common/reducers';

export const appReducer = (history) => combineReducers({
  ...componentsReducers,
  common,
  router: connectRouter(history),

});

export const rootReducer = (history) => (state, action) => {
  if (action.type === 'LOGOUT') {
    const { router, common } = state;
    state = { router, common };
  }
  return appReducer(history)(state, action);
};
