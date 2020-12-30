# HotLoop deployment action

This action publishes deployment events to HotLoop analytics

## Inputs

### `service`

**Required** The service that has been deployed

### `environment`

**Required** The environment that has been deployed to

### `success`

A boolean indicating if the deployment succeeded. Default: `true`

### `started-at`

A DateTime indicating the time at which the deployment started. Default: `new Date()`

### `ended-at`

A DateTime indicated the time at which the deployment completed. Default: `new Date()`

## Example usage

```
uses: hotloop/deployment-action@main
with:
  service: my-service
  environment: production
  token: your-hotloop-token
```