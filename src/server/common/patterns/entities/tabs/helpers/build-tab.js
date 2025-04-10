import startCase from 'lodash/startCase.js'

export function buildTab(response, request, root, tabName, imageName) {
  response.source.context.tabDetails.tabs.push({
    isActive: request.path.startsWith(`/${root}/${imageName}/${tabName}`),
    url: request.routeLookup(`${root}/{serviceId}/${tabName}`, {
      params: {
        serviceId: imageName
      }
    }),
    label: startCase(tabName)
  })
}
