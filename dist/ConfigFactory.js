"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFactory = void 0;
var nullOrEmpty = function (val) { return val === null || val === ''; };
var ConfigFactory = /** @class */ (function () {
    function ConfigFactory() {
    }
    ConfigFactory.get = function (inputFn, githubContext) {
        var opts = { required: true };
        var key = inputFn('hotloop-key', opts);
        var service = inputFn('service', opts);
        var environment = inputFn('environment', opts);
        var success = inputFn('success') ? inputFn('success') === 'true' : true;
        var startedAtEnv = inputFn('started-at') || process.env['HOTLOOP_START_TIME'];
        var endedAtEnv = inputFn('ended-at');
        var startedAt = startedAtEnv ? new Date(parseInt(startedAtEnv) * 1000).getTime() : new Date().getTime();
        var endedAt = endedAtEnv ? new Date(parseInt(endedAtEnv) * 1000).getTime() : new Date().getTime();
        var context = githubContext.payload;
        if (nullOrEmpty(key))
            throw new Error('Invalid token');
        if (!context.repository || !context.repository.html_url)
            throw new Error('invalid github context');
        if (nullOrEmpty(context.repository.html_url))
            throw new Error('Invalid repository');
        if (nullOrEmpty(service))
            throw new Error('Invalid service');
        if (nullOrEmpty(environment))
            throw new Error('Invalid environment');
        return {
            key: key,
            options: {
                repository: context.repository.html_url,
                branch: context.pull_request ? context.pull_request.head.ref : context.ref.substr(11),
                deployment: {
                    service: service,
                    environment: environment,
                    success: success,
                    startedAt: startedAt,
                    endedAt: endedAt
                }
            }
        };
    };
    return ConfigFactory;
}());
exports.ConfigFactory = ConfigFactory;
//# sourceMappingURL=ConfigFactory.js.map