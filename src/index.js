import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, history, persistor } from './store';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

import ErrorBoundary from './ErrorBoundary';
// import ErrorPage from './ErrorPage';

const render = (Component) => {
  ReactDOM.render(

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContainer>
          <ErrorBoundary>
            <App history={history} />
          </ErrorBoundary>
        </AppContainer>
      </PersistGate>
    </Provider>,
    document.getElementById('root'),
  );
};

render(App);


if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => { render(App); });
}

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
