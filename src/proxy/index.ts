import browser from 'webextension-polyfill';

import { store, select } from '../store';
import { getActiveTab, commandSelectors, getRecipeCommands } from '../store/selectors';
import { changeRunningState, changeActiveTab } from '../store/slices/app';
import { changeCommand } from '../store/slices/command';
import { pushMessage, upsertResult } from '../store/slices/recipe';
import { makeResponse, makeErrorResponse, delay, hasOwnProperty, } from '../common/utils';
import { Command, Recipe, Message, Executor, Response } from '../models';

const openUrl: Executor = async ({ parameters }: Command) => {

  const url = parameters.url;
  const activeTab = select(getActiveTab);

  if (!url) 
    throw new Error('Missing url to be open');

  browser.tabs.update(activeTab?.id, { url });

  return url
};

/* Commands that need to use background script browser api */

const commandExecutorMap: Record<string, Executor> = {
  'OPEN': openUrl
};

export const sendCommand = async (command: Command): Promise<Response> => {

  const action = commandExecutorMap[command.commandType];

  if (action) {
    return action(command)
      .then(makeResponse)
      .catch((e) => {
        const payload = { 'message': e.message }
        return makeErrorResponse(payload)
      });
  }

  /* Command needs to send message to content script */
  return await sendMessageActiveTab({ type: 'COMMAND', payload: command });
};

export const waitPageLoad = () => {

  return new Promise((resolve, reject) => {

    const interval = setInterval(async () => {
      const activeTab = select(getActiveTab);

      if (!activeTab || !activeTab.id) {
        reject("No active tab selected");
        return;
      }

      const updated = await browser.tabs.get(activeTab.id);

      if (updated.status === 'complete') {
        resolve(updated);
        clearInterval(interval);
      }

      /* reject after timeout? */

    }, 100);
  });
};

const updateCommandStatus = (id: Command['id'], commandStatus: Command['commandStatus']) => {
  const action = changeCommand({ id, commandStatus });
  return store.dispatch(action);
};

const updateCommandResult = (command: Command, payload: unknown) => {

  const currentTab = select(getActiveTab);
  const label = currentTab?.url;

  if (label === undefined) return;

  const result = { label, data: { [command.id]: payload } };
  const action = upsertResult({ recipeId: command.recipeId, result })
  return store.dispatch(action);
};

const updateRecipeLog = (id: Recipe['id'], message: string) => {
  const action = pushMessage({ recipeId: id, message });
  return store.dispatch(action);
};

const reportCommandError = (command: Command, error: unknown) => {

  updateCommandStatus(command.id, 'error')

  if (typeof error === "string") {
    updateRecipeLog(command.recipeId, error);
  } else if (error instanceof Error) {
    updateRecipeLog(command.recipeId, error.message);
  } else if (hasOwnProperty(error, 'message')) {
    const msg = typeof error.message === 'string' ? error.message : '';
    updateRecipeLog(command.recipeId, msg);
  }
}

export const runSingleCommandById = async (commandId: Command['id']) => {
  const command = select(state => commandSelectors.selectById(state, commandId));
  return command !== undefined ? runSingleCommand(command) : false;
};

export const runSingleCommand = async (command: Command) => {

  updateCommandStatus(command.id, 'running');

  try {
    // Wait until it is ready
    await waitPageLoad();
  } catch(e) {
    reportCommandError(command, 'Error waiting for page');
    return false;
  }

  try {
    /* Store command results on an intermediate area */ 
    const resp = await sendCommand(command);

    if (resp.type == 'ERROR') {
      reportCommandError(command, resp.payload);
      return false;
    }

    if (resp.type == 'SUCCESS') {
      updateCommandStatus(command.id, 'done')
      updateCommandResult(command, resp.payload)
    }

  } catch(e) {
    reportCommandError(command, e);
    return false;
  }

  /* Command might change tab state */
  const activeTab = select(getActiveTab);

  if (activeTab !== undefined && activeTab.id) {
    const tab = await browser.tabs.get(activeTab.id);
    store.dispatch(changeActiveTab(tab));
  }

  return true;
};

export const runCommands = async (recipe: Recipe) => {

  const isRunning = select(state => state.app.running);
  if (isRunning) return;

  const commands = select(state => getRecipeCommands(state, recipe.id));
  store.dispatch(changeRunningState(true));

  for (const cmd of commands) {

    const isRunning = select(state => state.app.running);
    if (!isRunning) return;

    if (cmd.commandStatus === 'done')
      continue;

    if(!await runSingleCommand(cmd)) 
      break;

    /* Execution speed */
    await delay(500)
  }

  store.dispatch(changeRunningState(false));
};

export const locateElement = async () => {
  /* Run locator process */
  const currentWindow = await browser.windows.getCurrent();
  const response = await sendMessageActiveTab({ type: 'LOCATOR' });
  if (currentWindow.id) 
    await browser.windows.update(currentWindow.id, { focused: true });

  return response;
};

const sendMessageActiveTab = async (message: Message) => {
  const activeTab = select(getActiveTab);
  if (!activeTab || !activeTab.id) return;
  return await browser.tabs.sendMessage(activeTab.id, message);
}

