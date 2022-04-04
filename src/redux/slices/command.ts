import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import COMMANDS from '../defaults/commands.json';
import CommandTypes from '../../constants/commandTypes.json';

interface ILocatorParameter {
  query: string;
  queryType: string;
  elementIndex?: number;
}

interface ICoordinatesParameter {
  x?: number;
  y?: number;
}

export interface ICommand {
  id: string;
  commandType: string;
  description: string;
  parameters: ICommandParameters;
}

export interface ICommandParameters {
  locator?: ILocatorParameter;
  text?: string;
  url?: string;
  timeout?: number;
  coordinates?: ICoordinatesParameter;
  strip?: boolean;
  collection?: boolean;
  attribute?: string;
  regex?: string;
}

const initialState: ICommand[] = COMMANDS;

export const commandFactory = (): ICommand => ({
  id: uuidv4(),
  commandType: "",
  description: "",
  parameters: {},
});

export const commandSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    addCommand: (state: ICommand[], action: PayloadAction<Partial<ICommand> | undefined>) => {
      const command = action.payload;
      const defaultCommand = commandFactory();
      return [ ...state, { ...defaultCommand, ...command ?? {} } ];
    },
    removeCommand: (state: ICommand[], action: PayloadAction<number>) => {
      const commandIndex = action.payload;
      return state.filter((_, index) => index !== commandIndex);
    },
    changeCommand: (state: ICommand[], action: PayloadAction<Partial<ICommand>>) => {
      return state.map(
        command => 
        command.id !== action.payload.id ? command : { ...command, ...action.payload }
      );
    },
  }
});

const defaultParameterTypes: {
  [K in keyof ICommandParameters as Uppercase<K>]: ICommandParameters[K]
} = {
  "LOCATOR": {
    "query": "",
    "queryType": "CSS",
    "elementIndex": undefined
  },
  "TEXT": "",
  "URL": "",
  "TIMEOUT": 1000,
  "COORDINATES": {
    "x": undefined,
    "y": undefined
  },
  "STRIP": true,
  "COLLECTION": false,
  "ATTRIBUTE": "",
  "REGEX": ""
};

function hasPropertyType<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, keyof typeof defaultParameterTypes> {
  return obj.hasOwnProperty(prop)
}

function hasCommandType<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, Uppercase<keyof ICommandParameters>[]> {
  return obj.hasOwnProperty(prop)
}

const initializeParameter = (parameterType?: string) => {

  if ( parameterType === undefined || !(hasPropertyType(defaultParameterTypes, parameterType)))
    return undefined;

  return defaultParameterTypes[parameterType];
};

const initializeCommandType = (commandType?: string) => {

  if (commandType === undefined || !(hasCommandType(CommandTypes, commandType)))
    return {};

  const parameters = CommandTypes[commandType];
  let payload: ICommandParameters = parameters.reduce((obj, k) => (
    { ...obj, [k]: initializeParameter(k) }
  ), {})

  return { parameters: payload };
};

const mergeCommand = (command: ICommand, payload: Partial<ICommand>) => {

  const commandType = payload.commandType;
  let parameters: { parameters?: ICommandParameters } = {};

  // we are changing the command type
  if (commandType !== undefined) {
    parameters = initializeCommandType(commandType);
  }
  
  return { ...command, ...parameters, ...payload };
};

export const { addCommand, removeCommand, changeCommand } = commandSlice.actions;

export default commandSlice.reducer;
