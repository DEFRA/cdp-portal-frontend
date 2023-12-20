function transformDeploymentToEntityDataList(deploymentDetail) {
  return [
    {
      heading: 'Instances',
      entity: {
        kind: 'text',
        value: deploymentDetail.instanceCount
      }
    },
    {
      heading: 'CPU',
      entity: {
        kind: 'text',
        value: deploymentDetail.cpu
      }
    },
    {
      heading: 'Memory',
      entity: {
        kind: 'text',
        value: deploymentDetail.memory
      }
    },
    {
      heading: 'Image name',
      entity: {
        kind: 'text',
        value: deploymentDetail.service
      }
    },
    {
      heading: 'Deployed by',
      entity: {
        kind: 'text',
        value: deploymentDetail.user,
        size: 'small'
      }
    },
    {
      heading: 'Updated',
      entity: {
        kind: 'date',
        value: deploymentDetail.updatedAt,
        size: 'large'
      }
    },
    {
      heading: 'Created',
      entity: {
        kind: 'date',
        value: deploymentDetail.createdAt,
        size: 'large'
      }
    }
  ]
}

export { transformDeploymentToEntityDataList }
