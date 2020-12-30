const core = require('@actions/core')
const github = require('@actions/github')
const { HotLoopClient } = require('./HotLoopClient')

const getConfig = () => {
  const token = core.getInput('token')
  const service = core.getInput('service')
  const environment = core.getInput('environment')
  const success = core.getInput('success') || true
  const startedAtEnv = core.getInput('started-at')
  const endedAtEnv = core.getInput('ended-at')
  const startedAt = startedAtEnv ? new Date(startedAtEnv * 1000).getTime() : new Date().getTime()
  const endedAt = endedAtEnv ? new Date(endedAtEnv * 1000).getTime() : new Date().getTime()

  const context = github.context.payload
  const repository = context.repository.html_url
  const isPr = !!context.pull_request
  const branch = isPr ? context.pull_request.head.ref : context.ref.substr(11)

  const options = {
    repository,
    branch,
    deployment: {
      service,
      environment,
      success,
      startedAt,
      endedAt
    }
  }

  const nullOrEmpty = val => val === null || val === ''
  if (nullOrEmpty(token)) throw new Error('Invalid token')
  if (nullOrEmpty(options.repository)) throw new Error('Invalid repository')
  if (nullOrEmpty(options.branch)) throw new Error('Invalid branch')
  if (nullOrEmpty(options.deployment.service)) throw new Error('Invalid service')
  if (nullOrEmpty(options.deployment.environment)) throw new Error('Invalid environment')

  return {
    token,
    options
  }
}

const syncDeployment = config => {
  const client = new HotLoopClient(config.token)
  return client.syncDeployment(config.options)
}

const setFailure = error => core.setFailed(error.message)

const logCorrelation = correlationId => core.info(`Correlation ID: ${correlationId}`)

return Promise.resolve()
  .then(getConfig)
  .then(syncDeployment)
  .then(logCorrelation)
  .catch(setFailure)