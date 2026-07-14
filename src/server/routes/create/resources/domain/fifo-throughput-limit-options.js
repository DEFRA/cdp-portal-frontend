export default [
  { value: 'perQueue', text: 'Per queue' },
  { value: 'perMessageGroupId', text: 'Per message group id' }
]

export const validForDeduplicationScope = {
  queue: ['perQueue'],
  messageGroup: ['perMessageGroupId']
}
