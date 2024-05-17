export interface iLog {
    log(_message?: any, ..._optionalParams: any[]): void;
    info(_message?: any, ..._optionalParams: any[]): void;
    warn(_message?: any, ..._optionalParams: any[]): void;
    error(_message?: any, ..._optionalParams: any[]): void;
}

export const noLog: iLog = {
  log: () => { },
  info: () => { },
  warn: () => { },
  error: () => { }
};

export const consoleLog: iLog = console;
