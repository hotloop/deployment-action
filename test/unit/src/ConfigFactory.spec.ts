import { createSandbox, SinonSandbox, SinonStub } from 'sinon'
import { Context } from '@actions/github/lib/context'
import { Config, ConfigFactory } from '../../../src/ConfigFactory'
import { default as MockDate } from 'mockdate'

describe('ConfigFactory', () => {
  let sandbox: SinonSandbox = createSandbox()
  let inputFn: SinonStub

  const token = 'test-token'
  const service = 'test-service'
  const environment = 'test-environment'
  const htmlUrl = 'https://github.com/hotloop/coverage-action'
  const repository = { html_url: htmlUrl }
  const issueNumber = 1
  const headRef = 'test-head-ref'
  const baseBranch = 'main'
  const ref = `refs/heads/${baseBranch}`

  const pullRequestGithubContext = {
    payload: {
      ref,
      repository,
      pull_request: {
        number: issueNumber,
        head: {
          ref: headRef
        }
      }
    }
  } as any as Context

  const mergeGithubContext = {
    payload: {
      ref,
      repository
    }
  } as any as Context

  beforeEach(() => {
    inputFn = sandbox.stub()
    MockDate.set('2021-01-01T00:00:00.000Z')
  })

  afterEach(() => {
    sandbox.restore()
    MockDate.reset()
  })

  it('throws when the token is not supplied', () => {
    const message = 'token not supplied'

    inputFn
      .withArgs('hotloop-key')
      .throws(new Error(message))

    const exec = () => ConfigFactory.get(inputFn, mergeGithubContext)
    return exec.should.throw(message)
  })

  it('throws when the service is not supplied', () => {
    const message = 'service not supplied'

    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .throws(new Error(message))

    const exec = () => ConfigFactory.get(inputFn, mergeGithubContext)
    return exec.should.throw(message)
  })

  it('throws when the token is not supplied', () => {
    const message = 'token not supplied'

    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .throws(new Error(message))

    const exec = () => ConfigFactory.get(inputFn, mergeGithubContext)
    return exec.should.throw(message)
  })

  it('sets the token correctly', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.key.should.deep.equal(token)
  })

  it('sets the service correctly', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.service.should.deep.equal(service)
  })

  it('sets the environment correctly', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.environment.should.deep.equal(environment)
  })

  it('sets the success to true when supplied as true', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)
      .withArgs('success')
      .returns('true')

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.success.should.deep.equal(true)
  })

  it('sets the success to false when supplied as false', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)
      .withArgs('success')
      .returns('false')

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.success.should.deep.equal(false)
  })

  it('sets the success to true when not supplied', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.success.should.deep.equal(true)
  })

  it('sets the branch name to the head ref when in the context of a Pull Request', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, pullRequestGithubContext)
    config.options.branch.should.deep.equal(headRef)
  })

  it('sets the branch name to the base branch when in the context of a merge', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.branch.should.deep.equal(baseBranch)
  })

  it('sets the start time correctly when it is supplied', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)
      .withArgs('started-at')
      .returns('1577836800')

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.startedAt.should.equal(1577836800000)
  })

  it('sets the start time to the system time when it is not supplied', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.startedAt.should.equal(1609459200000)
  })

  it('sets the end time correctly when iti is supplied', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)
      .withArgs('ended-at')
      .returns('1577836800')

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.endedAt.should.equal(1577836800000)
  })

  it('sets the end time to the system time when it is not supplied', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('service')
      .returns(service)
      .withArgs('environment')
      .returns(environment)

    const config: Config = ConfigFactory.get(inputFn, mergeGithubContext)
    config.options.deployment.endedAt.should.equal(1609459200000)
  })
})
