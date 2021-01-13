import { InputOptions } from '@actions/core';
import { Context } from '@actions/github/lib/context';
import { SyncDeploymentOptions } from '@hotloop/hotloop-sdk';
interface Config {
    token: string;
    options: SyncDeploymentOptions;
}
declare type InputFunction = (name: string, options?: InputOptions) => string;
declare class ConfigFactory {
    static get(inputFn: InputFunction, githubContext: Context): Config;
}
export { ConfigFactory, Config };
