/* eslint-disable no-unused-vars */
interface iLogger {
    log(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

class noLog {
    log = () => { }
    info = () => { }
    warn = () => { }
    error = () => { }
}

export const log: iLogger = console//new noLog()


