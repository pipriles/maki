import { store, select } from '../store';
import { getActiveTab } from '../store/selectors';
import { changeRunningState } from '../store/slices/app';
import { Command, changeCommand } from '../store/slices/command';
import browser from 'webextension-polyfill';
import { 
  Message, 
  Executor, 
  Response, 
  makeResponse, 
  makeErrorResponse, 
  delay
} from '../common/utils';

const openUrl: Executor = async ({ parameters }: Command) => {

  const url = parameters.url;
  const activeTab = select(getActiveTab);

  browser.tabs.update(activeTab?.id, { url });

  return url
};

/* Commands that need to use background script browser api */

const commandExecutorMap: Record<string, Executor> = {
  'OPEN': openUrl
};

export const sendCommand = async (command: Command): Promise<Response<unknown>> => {

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
      updateCommandStatus(cmd.id, 'error');
      break;
    }
      
    try {
      /* Store command results on an intermediate area */ 
      const resp = await sendCommand(cmd);
      updateCommandStatus(cmd.id, 'done')
      updateCommandResult(cmd.id, resp.payload)
    } catch(e) {
      updateCommandStatus(cmd.id, 'error')
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

