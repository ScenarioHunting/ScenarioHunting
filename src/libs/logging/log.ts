/* eslint-disable no-unused-vars */
export interface iLog {
    log(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

export const noLog: iLog = {
    log: () => { },
    info: () => { },
    warn: () => { },
    error: () => { }
}

export const consoleLog: iLog = console
