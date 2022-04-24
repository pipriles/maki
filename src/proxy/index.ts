import { store, select } from '../store';
import { getActiveTab } from '../store/selectors';
import { changeRunningState } from '../store/slices/app';
import { Command, changeCommand, commandLogMessage } from '../store/slices/command';
import browser from 'webextension-polyfill';
import { 
  Message, 
  Executor, 
  Response, 
  makeResponse, 
  makeErrorResponse, 
  delay, 
  hasOwnProperty,
} from '../common/utils';

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

const updateCommandResult = (id: Command['id'], commandResult: Command['commandResult']) => {
  const action = changeCommand({ id, commandResult });
  return store.dispatch(action);
};

const updateCommandLogger = (id: Command['id'], message: string) => {
  const action = commandLogMessage({ commandId: id, message });
  return store.dispatch(action);
};

const reportCommandError = (command: Command, error: unknown) => {

  updateCommandStatus(command.id, 'error')

  if (typeof error === "string") {
    updateCommandLogger(command.id, error);
  } else if (error instanceof Error) {
    updateCommandLogger(command.id, error.message);
  } else if (hasOwnProperty(error, 'message')) {
    const msg = typeof error.message === 'string' ? error.message : '';
    updateCommandLogger(command.id, msg);
  }
}

export const runCommands = async (commands: Command[]) => {

  const isRunning = select(state => state.app.running);
  if (isRunning) return;

  store.dispatch(changeRunningState(true));

  for (const cmd of commands) {

    const isRunning = select(state => state.app.running);
    if (!isRunning) return;

    if (cmd.commandStatus === 'done')
      continue;

    updateCommandStatus(cmd.id, 'running');

    try {
      // Wait until it is ready
      await waitPageLoad();
    } catch(e) {
      reportCommandError(cmd, 'Error waiting for page');
      break;
    }
      
    try {
      /* Store command results on an intermediate area */ 
      const resp = await sendCommand(cmd);

      if (resp.type == 'ERROR') {
        reportCommandError(cmd, resp.payload);
        break;
      }

      if (resp.type == 'SUCCESS') {
        updateCommandStatus(cmd.id, 'done')
        updateCommandResult(cmd.id, resp.payload)
      }

    } catch(e) {
      reportCommandError(cmd, e);
      break;
    }

    /* Execution speed */
    await delay(500)
  }

  store.dispatch(changeRunningState(false));
};

export const locateElement = async () => {
  /* Run locator process */
  return await sendMessageActiveTab({ type: 'LOCATOR' });
};

const sendMessageActiveTab = async (message: Message) => {
  const activeTab = select(getActiveTab);
  if (!activeTab || !activeTab.id) return;
  return await browser.tabs.sendMessage(activeTab.id, message);
}

