import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';
import LogRocket from 'logrocket';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import { rootReducer } from './reducer';

import { BASE_URL } from './constants/otherConstants';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['router'] 
};

export const history = createBrowserHistory({basename:BASE_URL});

const persistedReducer = persistReducer(persistConfig, rootReducer(history));


// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history);

const getMiddleware = () => {
  if (process.env.NODE_ENV === 'production') {
    return applyMiddleware(
      myRouterMiddleware,
      promiseMiddleware,
      localStorageMiddleware,
      LogRocket.reduxMiddleware(),
    );
  }
  // Enable additional logging in non-production environments.
  return applyMiddleware(
    myRouterMiddleware,
    promiseMiddleware,
    localStorageMiddleware,
    // createLogger(),
    LogRocket.reduxMiddleware(),
  );
};


export const store = createStore(
  persistedReducer, composeWithDevTools(getMiddleware()),
);

export const persistor = persistStore(store);
