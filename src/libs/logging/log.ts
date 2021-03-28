
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

export let log: iLogger
if (process.env.mod == 'production') {
    log = new noLog()
}
else {
    log = console//new noLog()
}

