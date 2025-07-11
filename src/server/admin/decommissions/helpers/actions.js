/** @constant {string} */
const gitHubOrg = 'https://github.com/DEFRA'

/**
 * @typedef {object} ActionDetail
 * @property {string} text - action name
 * @property {string} href - action href
 */

/**
 * Microservice and test-suite actions
 * @type {ActionDetail[]}
 */
const microServiceAndTestSuiteActions = [
  {
    text: 'cdp-app-config',
    href: `${gitHubOrg}/cdp-app-config/actions/workflows/remove-service.yml`
  },
  {
    text: 'cdp-squid-proxy',
    href: `${gitHubOrg}/cdp-squid-proxy/actions/workflows/remove-service.yml`
  },
  {
    text: 'cdp-tf-svc-infra - remove service',
    href: `${gitHubOrg}/cdp-tf-svc-infra/actions/workflows/remove-service.yml`
  },
  {
    text: 'cdp-tf-svc-infra - remove ECR',
    href: `${gitHubOrg}/cdp-tf-svc-infra/actions/workflows/remove-ecr.yml`
  },
  {
    text: 'cdp-tf-svc-infra - remove DockerHub',
    href: `${gitHubOrg}/cdp-tf-svc-infra/actions/workflows/remove-dockerhub.yml`
  }
]

/**
 * Microservice actions
 * @type {ActionDetail[]}
 */
const microServiceActions = [
  {
    text: 'cdp-app-deployments',
    href: `${gitHubOrg}/cdp-app-deployments/actions`
  },
  {
    text: 'cdp-grafana-svc',
    href: `${gitHubOrg}/cdp-grafana-svc/actions/workflows/remove-service.yml`
  },
  {
    text: 'cdp-nginx-upstreams',
    href: `${gitHubOrg}/cdp-nginx-upstreams/actions/workflows/remove-service.yml`
  }
]

/**
 *
 * @param {('Microservice'|'TestSuite')} entityType
 * @returns {ActionDetail[]}
 */
export function getActions(entityType) {
  switch (entityType) {
    case 'Microservice':
      return [...microServiceAndTestSuiteActions, ...microServiceActions]
    case 'TestSuite':
      return microServiceAndTestSuiteActions
    default:
      return []
  }
}
