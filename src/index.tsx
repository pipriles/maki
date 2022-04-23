import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'react-jss';

import { store } from './store';
import { changeActiveTab } from './store/slices/app';
import { createTheme } from './styles';
import { Message } from './common/utils';

import App from './components/App';

/* Initialize change tab listener */

const focusWindow = async (windowId: number) => {
  if ( windowId <= 0 ) return;
  let opts = { active: true, url: '*://*/*', windowId }
  let [ tab ] = await browser.tabs.query(opts);
  if ( !tab ) return;
  store.dispatch(changeActiveTab(tab));
}

browser.runtime.sendMessage(true).catch(() => undefined);
browser.runtime.onMessage.addListener((message: Message) => {
  if (message.type === 'TAB') 
    store.dispatch(changeActiveTab(message.payload));
});

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
