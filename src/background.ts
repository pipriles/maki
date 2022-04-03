import browser from 'webextension-polyfill';

let opened: number | undefined = undefined;

const openPanel = async () => {

  if (opened !== undefined) 
    return;

  const window = await browser.windows.create({
    url: browser.runtime.getURL("index.html"),
    type: "popup",
    width: 900,
    height: 600
  });

  opened = window.id ?? undefined;
};


const closePanel = (windowId: number) => {
  if ( windowId === opened ) opened = undefined;
};

browser.action.onClicked.addListener(openPanel);
browser.windows.onRemoved.addListener(closePanel);
