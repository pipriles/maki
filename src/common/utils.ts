import { Command } from '../store/slices/command';

export interface Locator {
  query: string;
  queryType: string;
  elementIndex?: number | null;
};

export interface Message {
  type: string;
  payload?: Command;
}

export interface Response<T> {
  type: string;
  payload: T;
}

export type Executor = (command: Command) => Promise<unknown>;

export const makeResponse      = <T>(payload: T): Response<T> => ({ type: 'SUCCESS', payload });
export const makeErrorResponse = <T>(payload: T): Response<T> => ({ type: 'ERROR'  , payload });
