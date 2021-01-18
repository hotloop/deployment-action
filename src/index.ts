import { getInput, info, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { CorrelationId, HotLoopSdkFactory } from '@hotloop/hotloop-sdk'
import { Config, ConfigFactory } from './ConfigFactory'

const syncDeployment = (config: Config) => {
  const opts = { userAgent: 'coverage-action', timeout: 5000, retries: 3, retryDelay: 1000 }
  const client = HotLoopSdkFactory.getInstance(config.key, opts)
  return client.syncDeployment(config.options)
}

const setFailure = (error: Error) => setFailed(error.message)

const logCorrelation = (correlationId: CorrelationId) => info(`Correlation ID: ${correlationId}`)

Promise.resolve()
  .then(() => ConfigFactory.get(getInput, context))
  .then(syncDeployment)
  .then(logCorrelation)
  .catch(setFailure)
