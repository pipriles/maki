import { store, select } from '../store';
import { getActiveTab } from '../store/selectors';
import { Command, changeCommand } from '../store/slices/command';
import browser from 'webextension-polyfill';
import { Message, Executor, Response, makeResponse, makeErrorResponse } from '../common/utils';

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
      console.log(updated.status);

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

  for (const cmd of commands) {

    updateCommandStatus(cmd.id, 'running');
    console.log(cmd);

    await waitPageLoad();

    // Wait until it is ready
    const resp = await sendCommand(cmd);
    console.log(resp);

    /* Store command results on an intermediate area */ 
    const commandStatus = resp.type === 'SUCCESS' ? 'done' : 'error';

    updateCommandStatus(cmd.id, commandStatus)
    updateCommandResult(cmd.id, resp.payload)
  }

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

browser.runtime.onMessage.addListener(
  (request, sender) => {
    console.log('Message received!', request, sender);
  }
);

