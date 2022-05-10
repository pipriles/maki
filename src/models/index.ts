import browser from 'webextension-polyfill';

export interface Locator {
  query: string;
  queryType: string;
  elementIndex?: number | null;
};

export interface CommandMessage {
  type: 'COMMAND';
  payload: Command;
}

export interface TabMessage {
  type: 'TAB';
  payload: browser.Tabs.Tab;
}

export interface LocatorMessage {
  type: 'LOCATOR';
}

export type Message = CommandMessage | TabMessage | LocatorMessage;
export type Payload = unknown;

export interface Response {
  type: 'SUCCESS' | 'ERROR';
  payload: Payload;
}

export type Executor = (command: Command) => Promise<Payload>;

/* Reducers */

export interface IApp {
  activeTab?: browser.Tabs.Tab
  running: boolean;
}

interface ContextMenu {
  command?: Command['id'];
  left?: number;
  top?: number;
};

export interface IUi {
  currentRecipe?: Recipe['id'];
  currentCommand?: Command['id'];
  commandCopied?: Command['id'];
  contextMenu?: ContextMenu;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  executionSpeed: number;
  exportFormat: "JSON" | "CSV";
  commands: Command['id'][];
  logger: string[];
  inputs: string[];
  output: Result[];
}

export interface Result {
  label: string;
  data: Record<Command['id'], unknown>;
}

interface LocatorParameter {
  query: string;
  queryType: string;
  elementIndex?: number | null;
}

interface CoordinatesParameter {
  x?: number | null;
  y?: number | null;
}

export interface CommandParameters {
  locator: LocatorParameter;
  text: string;
  url: string;
  timeout: number;
  coordinates: CoordinatesParameter;
  strip: boolean;
  collection: boolean;
  attribute: string;
  regex: string;
}

export interface Command {
  id: string;
  recipeId: string;
  commandType: string;
  description: string;
  parameters: CommandParameters;
  commandStatus?: "running" | "done" | "error";
  field: string;
}

export interface CommandPayload extends Omit<Partial<Command>, 'parameters' | 'recipeId'> { 
  recipeId: string;
  parameters?: Partial<CommandParameters>
}

