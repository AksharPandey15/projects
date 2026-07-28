
export enum LineType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  ERROR = 'ERROR',
  SYSTEM = 'SYSTEM'
}

export interface TerminalLine {
  id: string;
  type: LineType;
  content: string;
  timestamp: number;
  path?: string;
}

export interface CommandResponse {
  output: string;
  type: LineType;
}
