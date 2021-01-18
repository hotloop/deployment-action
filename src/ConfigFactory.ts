import { InputOptions } from '@actions/core'
import { Context } from '@actions/github/lib/context'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import { SyncDeploymentOptions } from '@hotloop/hotloop-sdk'

interface Config {
  key: string,
  options: SyncDeploymentOptions
}

type InputFunction = (name: string, options?: InputOptions) => string
const nullOrEmpty = (val: String) => val === null || val === ''

class ConfigFactory {
  public static get (inputFn: InputFunction, githubContext: Context): Config {
    const opts = { required: true }
    const key: string = inputFn('hotloop-key', opts)
    const service: string = inputFn('service', opts)
    const environment: string = inputFn('environment', opts)
    const success: boolean = inputFn('success') ? inputFn('success') === 'true' : true
    const startedAtEnv: string | undefined = inputFn('started-at') || process.env['HOTLOOP_START_TIME']
    const endedAtEnv: string = inputFn('ended-at')

    const startedAt: number = startedAtEnv ? new Date(parseInt(startedAtEnv) * 1000).getTime() : new Date().getTime()
    const endedAt: number = endedAtEnv ? new Date(parseInt(endedAtEnv) * 1000).getTime() : new Date().getTime()

    const context: WebhookPayload = githubContext.payload

    if (nullOrEmpty(key)) throw new Error('Invalid token')
    if (!context.repository || !context.repository.html_url) throw new Error('invalid github context')
    if (nullOrEmpty(context.repository.html_url)) throw new Error('Invalid repository')
    if (nullOrEmpty(service)) throw new Error('Invalid service')
    if (nullOrEmpty(environment)) throw new Error('Invalid environment')

    return {
      key,
      options: {
        repository: context.repository.html_url,
        branch: context.pull_request ? context.pull_request.head.ref : context.ref.substr(11),
        deployment: {
          service,
          environment,
          success,
          startedAt,
          endedAt
        }
      }
    }
  }
}

export { ConfigFactory, Config }
