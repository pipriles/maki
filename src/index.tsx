import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'react-jss';

import { store } from './redux/store';
import { changeActiveTab } from './redux/slices/app';
import App from './components/App';
import { createTheme } from './styles';

/* Initialize change tab listener */

const focusWindow = async (windowId: number) => {
  if ( windowId <= 0 ) return;
  let opts = { active: true, url: '*://*/*', windowId }
  let [ tab ] = await browser.tabs.query(opts);
  if ( !tab ) return;
  store.dispatch(changeActiveTab(tab));
}

browser.windows.onFocusChanged.addListener(focusWindow);

const theme = createTheme();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
