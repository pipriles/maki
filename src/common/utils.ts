import browser from 'webextension-polyfill';
import { Command } from '../store/slices/command';

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
export type Payload = string | Record<string, string> | null;

export interface Response {
  type: 'SUCCESS' | 'ERROR';
  payload: Payload;
}

export type Executor = (command: Command) => Promise<Payload>;

export const makeResponse      = (payload: Payload): Response => ({ type: 'SUCCESS', payload });
export const makeErrorResponse = (payload: Payload): Response => ({ type: 'ERROR'  , payload });

export const delay = (milliseconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

export const hasOwnProperty = <
  X extends unknown, 
  K extends PropertyKey
>(obj: X, key: K): obj is X & Record<K, unknown> => {
  return obj instanceof Object && obj.hasOwnProperty(key);
}

export const isPropertyOf = <X extends {}>(key: PropertyKey, obj: X): key is keyof X => {
  return obj.hasOwnProperty(key);
}
