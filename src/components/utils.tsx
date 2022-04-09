import { CommandParameters } from '../store/slices/command';

export interface ICommandParametersProps<T extends keyof CommandParameters> {
  parameter: CommandParameters[T];
  onChange: (payload: Partial<CommandParameters[T]>) => void;
}

export const hasOwnProperty = <X extends {}>(obj: X, key: PropertyKey): key is keyof X => {
  return obj.hasOwnProperty(key);
}

