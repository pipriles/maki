import { Payload, Response } from '../models';

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

export const isTruthy = <T>(x: T | false | undefined | null | "" | 0): x is T => !!x;
