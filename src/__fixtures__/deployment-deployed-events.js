// Deployment deployed events created via the src/server/deployments/transformers/transform-deployment transformer

const deploymentDeployedEventsFixture = {
  'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e':
    {
      cpu: '1024',
      deployedAt: '2024-01-16T17:24:27Z',
      deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
      dockerImage:
        '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
      ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
      environment: 'management',
      instanceCount: 2,
      instanceTaskId:
        'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/118daf6fe0fe4893bff72048f25fc67e',
      memory: '2048',
      service: 'cdp-portal-frontend',
      status: {
        classes: 'govuk-tag--green',
        hasFinished: true,
        text: 'deployed'
      },
      taskId:
        'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
      user: 'RoboCop',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      version: '0.225.0'
    },
  'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e':
    {
      cpu: '1024',
      deployedAt: '2024-01-16T17:24:23Z',
      deploymentId: '3f5dff54-9bea-4a53-830d-96610af8c2b4',
      dockerImage:
        '123456789.dkr.ecr.eu-west-2.amazonaws.com/cdp-portal-frontend:0.225.0',
      ecsSvcDeploymentId: 'ecs-svc/8544336582308964577',
      environment: 'management',
      instanceCount: 2,
      instanceTaskId:
        'arn:aws:ecs:eu-west-2:123456789:task/management-ecs-public/9bbfdb65e16449a781107c40d2bd175e',
      memory: '2048',
      service: 'cdp-portal-frontend',
      status: {
        classes: 'govuk-tag--green',
        hasFinished: true,
        text: 'deployed'
      },
      taskId:
        'arn:aws:ecs:eu-west-2:123456789:task-definition/cdp-portal-frontend:108',
      user: 'RoboCop',
      userId: '1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
      version: '0.225.0'
    }
}

export { deploymentDeployedEventsFixture }
