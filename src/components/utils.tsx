import { CommandParameters } from '../redux/slices/command';

export interface ICommandParametersProps<T extends keyof CommandParameters> {
  parameter: CommandParameters[T];
  onChange: (payload: Partial<CommandParameters[T]>) => void;
}
