const existingServiceInfoFixture = {
  message: 'success',
  serviceInfo: {
    container_image: 'cdp-portal-frontend',
    container_port: 3000,
    container_version: '0.86.0',
    desired_count: 2,
    healthcheck: '/cdp-portal-frontend/health',
    name: 'cdp-portal-frontend',
    env_vars: {
      CDP_REDEPLOY: '2023-08-29T16:04:20.353Z'
    },
    secrets: {
      SESSION_COOKIE_PASSWORD:
        'cdp/services/cdp-portal-frontend:SESSION_COOKIE_PASSWORD'
    },
    task_cpu: 1024,
    task_memory: 2048,
    deploy_metrics: false,
    env_files: [
      {
        value:
          'arn:aws:s3:::cdp-infra-dev-service-configs/global/global_frontend_fixed.env',
        type: 's3'
      },
      {
        value:
          'arn:aws:s3:::cdp-infra-dev-service-configs/services/cdp-portal-frontend/infra-dev/cdp-portal-frontend.env',
        type: 's3'
      },
      {
        value:
          'arn:aws:s3:::cdp-infra-dev-service-configs/services/cdp-portal-frontend/defaults.env',
        type: 's3'
      },
      {
        value:
          'arn:aws:s3:::cdp-infra-dev-service-configs/environments/infra-dev/defaults.env',
        type: 's3'
      }
    ]
  }
}

export { existingServiceInfoFixture }
