import browser from 'webextension-polyfill';

type ListenerCallback = Parameters<typeof browser.runtime.onMessage.addListener>[0];
let opened: number | undefined = undefined;

const waitWindowReady = (tab: browser.Tabs.Tab) => {

  return new Promise((resolve) => {

    const handleMessage: ListenerCallback = (message, sender) => {
      browser.runtime.sendMessage(sender.id, { type: 'TAB', payload: tab })
      browser.runtime.onMessage.removeListener(handleMessage);
      resolve(message);
    }; 

    browser.runtime.onMessage.addListener(handleMessage);
  });
}

const openPanel = async (tab: browser.Tabs.Tab) => {

  if (opened !== undefined) 
    return;

  const window = await browser.windows.create({
    url: browser.runtime.getURL("index.html"),
    type: "panel",
    width: 900,
    height: 600,
  });

  opened = window.id ?? undefined;
  await waitWindowReady(tab);
};

const closePanel = (windowId: number) => {
  if ( windowId === opened ) opened = undefined;
};

browser.action.onClicked.addListener(openPanel);
browser.windows.onRemoved.addListener(closePanel);
