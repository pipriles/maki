import browser from 'webextension-polyfill';
import { finder } from '@medv/finder';
import { Command } from './store/slices/command';

console.log('Listening to commands...');

interface ILocator {
  query: string;
  queryType: string;
  elementIndex?: number | null;
};

interface IMessage {
  type: string;
  payload?: Command;
}

interface IResponse<T> {
  type: string;
  payload: T;
}

const getElementByXPATH = (query: string) => {
  const result = document.evaluate(
    query, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
  return result.singleNodeValue;
};

const getElementByCSS = (query: string, index?: number) => {
  index = !index ? 0 : index;
  return document.querySelectorAll(query)[index];
};

const getElement = (locator: ILocator) => {

  const { query, queryType } = locator;
  const extractor = queryType !== 'XPATH' ? getElementByCSS : getElementByXPATH;

  return !query ? null : extractor(query);
};

const extractText = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const element = locator ? getElement(locator) : null;

  if (!element) return null;

  const stripText = parameters['strip'];
  const string    = element.textContent;

  return string && stripText ? string.trim() : string;
};

const extractAttribute = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const element = locator ? getElement(locator) : null;

  if (!(element instanceof Element))
    return;

  const name = parameters['attribute'];
  const stripText = parameters['strip'];
  const attribute = name ? element.getAttribute(name) : null;

  return attribute && stripText ? attribute.trim() : attribute;
}

const extractUrl = async () => {
  return window.location.href;
};

const extractTitle = async () => {
  return document.title;
};

const doClick = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const element = locator ? getElement(locator) : null;

  if (!(element instanceof HTMLElement)) {
    /* Throw error saying that element is not clickable */
    return;
  }

  return element.click()
};

const waitForElementPresent = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const timeout = parameters['timeout'];
  const dtStart = Date.now();

  if (!locator || !timeout) return;

  while (!getElement(locator)) {
    if (Date.now() - dtStart > timeout ) 
      throw new Error('Timeout exceeded!');
    await new Promise( resolve => requestAnimationFrame(resolve) ); 
  }

  return true;
};

const waitForElementNotPresent = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const timeout = parameters['timeout'];
  const dtStart = Date.now();

  if (!locator || !timeout) return;

  while (getElement(locator)) {
    if (Date.now() - dtStart > timeout ) 
      throw new Error('Timeout exceeded!');
    await new Promise( resolve => requestAnimationFrame(resolve) ); 
  }

  return true;
};

const sendKeys = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const keys  = parameters['text'];
  const element = locator ? getElement(locator) : null;

  if (!(element instanceof HTMLInputElement)) {
    /* Throw error saying that element is not an input */
    return;
  }

  if (!keys) return;

  element.scrollIntoView();
  element.focus();

  if (element.tagName !== 'INPUT')
    throw new Error('Element is not an INPUT tag');

  for(let i=0; i < keys.length; i++) {

    const keydown = new KeyboardEvent('keypress', { 'key': keys[i] });
    element.dispatchEvent(keydown);

    // edit input and trigger input event
    element.value += keys[i];

    const input = new Event('input', { bubbles: true, cancelable: true, });
    element.dispatchEvent(input);
  }

  return true
};

const pageWait = () => {
  return new Promise((resolve) => {
    if (['interactive', 'complete'].indexOf(document.readyState) >= 0) {
      resolve(true);
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve(true));
    }
  });
};

const openUrl = async ({ parameters }: Command) => {
  const url = parameters['url'];

  if (!url) return;

  window.location.href = url;
  return url
};

const makeResponse      = <T>(payload: T): IResponse<T> => ({ type: 'SUCCESS', payload });
const makeErrorResponse = <T>(payload: T): IResponse<T> => ({ type: 'ERROR'  , payload });

const responseFromPromise = async <T>(promise: Promise<T>) => {
  try {
    const value = await promise;
    return makeResponse(value);
  } catch(e) {
    const payload = { 'message': e instanceof Error ? e.message : null }
    return makeErrorResponse(payload);
  }
}

const commandExecutorMap = {
  'EXTRACT_TEXT':                 extractText,
  'EXTRACT_ATTRIBUTE':            extractAttribute,
  'EXTRACT_URL':                  extractUrl,
  'EXTRACT_TITLE':                extractTitle,
  'WAIT_FOR_ELEMENT_PRESENT':     waitForElementPresent,
  'WAIT_FOR_ELEMENT_NOT_PRESENT': waitForElementNotPresent,
  'CLICK':                        doClick,
  'SEND_KEYS':                    sendKeys,
  'PAGE_WAIT':                    pageWait,
  'OPEN':                         openUrl
  // 'CLEAR_INPUT' clear input value
};

const executeCommand = async (command: Command) => {

  console.log(command);
  const action = commandExecutorMap[command.commandType as keyof typeof commandExecutorMap];

  if ( action === undefined ) {
    const payload = { 'message': 'Invalid command type' }
    return makeErrorResponse(payload);
  }

  const promise = action(command)
  return responseFromPromise(promise);
};

const highlightElement = (event: Event) => {
  /* change this to svg overlay or something */
  const elem = event.target;
  if (!(elem instanceof HTMLElement)) return;

  elem.style['border'] = '1px solid black';
}

const removeHightlightElement = (event: Event) => {
  /* change this to svg overlay or something */
  const elem = event.target;
  if (!(elem instanceof HTMLElement)) return;

  elem.style['border'] = '';
};

const preventActions = (event: Event) => {
  event.stopPropagation();
  event.preventDefault();
};

const findElementSelector = () => {
  const promise = new Promise((resolve, reject) => {
    const locate = (event: MouseEvent) => {

      event.stopPropagation();
      event.preventDefault();

      const element = document.elementFromPoint(event.x, event.y);

      if (!(element instanceof Element)) {
        reject("Can't find element at that position");
        return;
      }

      const selector = finder(element);

      /* Detach event listeners */
      document.removeEventListener('mouseover', highlightElement);
      document.removeEventListener('mouseout', removeHightlightElement);
      document.removeEventListener('mouseup', locate);

      /* Force remove overlay */
      removeHightlightElement(event);

      resolve(selector);
    };

    document.addEventListener('mouseover', highlightElement)
    document.addEventListener('mouseout', removeHightlightElement)
    document.addEventListener('click', preventActions);
    document.addEventListener('mouseup', locate);
  });

  return responseFromPromise(promise);
};

const handleMessage = (message: IMessage) => {
  switch (message.type) {
    case 'COMMAND':
      if (message.payload != null) 
        return executeCommand(message.payload);
    case 'LOCATOR':
      return findElementSelector();
  }
};

browser.runtime.onMessage.addListener(
  (message, sender) => {
    const url = window.location.href;
    console.log(message, sender, url);
    return handleMessage(message);
  }
);
