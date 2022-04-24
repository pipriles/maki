import browser from 'webextension-polyfill';
import { finder } from '@medv/finder';
import { Command } from './store/slices/command';
import { Locator, Executor, Message, makeResponse, makeErrorResponse, Payload } from './common/utils';

console.log('Listening to commands...');

const getElementByXPATH = (query: string) => {
  const result = document.evaluate(
    query, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
  return result.singleNodeValue;
};

const getElementByCSS = (query: string, index?: number) => {
  index = !index ? 0 : index;
  return document.querySelectorAll(query)[index];
};

const getElement = (locator: Locator) => {

  const { query, queryType } = locator;

  console.log(query);
  if (!query) {
    console.log('ERROR!!!!!')
    throw new Error(`Please define a selector`);
  }

  const extractor = queryType !== 'XPATH' ? getElementByCSS : getElementByXPATH;

  return !query ? null : extractor(query);
};

const extractText = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const element = locator ? getElement(locator) : null;

  if (!element)
    throw new Error(`Element could not be found with selector: ${locator.query}`);

  const stripText = parameters['strip'];
  const str    = element.textContent;

  return str && stripText ? str.trim() : str;
};

const extractAttribute = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const element = locator ? getElement(locator) : null;

  if (!(element instanceof Element))
    throw new Error(`Element could not be found with selector: ${locator.query}`);

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

  if (!(element instanceof HTMLElement))
    throw new Error(`Clickable element could not be found with selector: ${locator.query}`);

  element.click()
  return 'true';
};

const waitForElementPresent = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const timeout = parameters['timeout'];
  const dtStart = Date.now();

  if (!locator)
    throw new Error(`Locator not defined`);

  if (!timeout)
    throw new Error(`Timeout exceeded`);

  while (!getElement(locator)) {
    if (Date.now() - dtStart > timeout ) 
      throw new Error('Timeout exceeded!');
    await new Promise( resolve => requestAnimationFrame(resolve) ); 
  }

  return 'true';
};

const waitForElementNotPresent = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const timeout = parameters['timeout'];
  const dtStart = Date.now();

  if (!locator)
    throw new Error(`Locator not defined`);

  if (!timeout)
    throw new Error(`Timeout exceeded`);

  while (getElement(locator)) {
    if (Date.now() - dtStart > timeout ) 
      throw new Error('Timeout exceeded!');
    await new Promise( resolve => requestAnimationFrame(resolve) ); 
  }

  return 'true';
};

const sendKeys = async ({ parameters }: Command) => {

  const locator = parameters['locator'];
  const keys  = parameters['text'];
  const element = locator ? getElement(locator) : null;

  if (!(element instanceof HTMLInputElement))
    /* Throw error saying that element is not an input */
    throw new Error(`Input element could not be found with selector: ${locator.query}`);

  if (!keys) 
    throw new Error(`Missing keys to send`);

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

  return 'true';
};

const pageWait = () => {
  return new Promise<Payload>((resolve) => {
    if (['interactive', 'complete'].indexOf(document.readyState) >= 0) {
      resolve('true');
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve('true'));
    }
  });
};

const openUrl = async ({ parameters }: Command) => {
  const url = parameters['url'];

  if (!url) 
    throw new Error('Missing url to be open');

  window.location.href = url;
  return url
};

const responseFromPromise = async (promise: Promise<Payload>) => {
  try {
    const value = await promise;
    return makeResponse(value);
  } catch(e) {
    const payload = { 'message': e instanceof Error ? e.message : 'Unknown error' }
    return makeErrorResponse(payload);
  }
}

const commandExecutorMap: Record<string, Executor> = {
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
  const action = commandExecutorMap[command.commandType];

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
  console.log('PREVENTED!')
  event.stopPropagation();
  event.preventDefault();
  document.removeEventListener('click', preventActions);
};

const findElementSelector = () => {
  const promise = new Promise<Payload>((resolve, reject) => {
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

const handleMessage = (message: Message) => {
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
