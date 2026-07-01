export default function transformResources(resources = {}) {
  return Object.fromEntries(
    Object.entries(resources).map(([key, value]) => {
      if (key === 'metrics') {
        return [key, { ...Object.groupBy(value, (item) => item.type) }]
      }

      return [key, value]
    })
  )
}
