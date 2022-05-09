import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'react-jss';

import { store, select } from './store';
import { getActiveTab } from './store/selectors';
import { changeActiveTab } from './store/slices/app';
import { createTheme } from './styles';
import { Message } from './models';

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

browser.tabs.onActivated.addListener(async (activeInfo) => {
  const currentTab = await browser.tabs.get(activeInfo.tabId);
  store.dispatch(changeActiveTab(currentTab));
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const activeTab = select(getActiveTab);
  if (activeTab?.id === tabId && changeInfo.status === "complete")
    store.dispatch(changeActiveTab(tab));
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
