interface iLogger {
    log(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

class noLog implements iLogger {
    log = () => { }
    info = () => { }
    warn = () => { }
    error = () => { }
}
class consoleLog implements iLogger {
    log = console.log.apply
    info = console.info.apply
    warn = console.warn.apply
    error = console.error.apply
}

export const logger: iLogger = new noLog()


