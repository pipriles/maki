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

export interface Response<T> {
  type: 'SUCCESS' | 'ERROR';
  payload: T;
}

export type Executor = (command: Command) => Promise<unknown>;

export const makeResponse      = <T>(payload: T): Response<T> => ({ type: 'SUCCESS', payload });
export const makeErrorResponse = <T>(payload: T): Response<T> => ({ type: 'ERROR'  , payload });

export const delay = (milliseconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}
