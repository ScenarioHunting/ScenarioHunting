interface log{
    log(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}

const noLogger = {
    log: function () { },
    info: function () { },
    warn: function () { },
    error: function () { }
};

