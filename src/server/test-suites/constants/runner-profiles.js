/**
 * Test runner profiles
 * @typedef {Object} RunnerProfile
 * @type {{regular: {cpu: {value: number, text: string}, memory: {value: number, text: string}}, large: {cpu: {value: number, text: string}, memory: {value: number, text: string}}}}
 */
const runnerProfiles = {
  regular: {
    cpu: { value: 4096, text: '4096 (4 vCPU)' },
    memory: { value: 8192, text: '8 GB (8192 MB)' }
  },
  large: {
    cpu: { value: 8192, text: '8192 (8 vCPU)' },
    memory: { value: 16384, text: '16 GB (16384 MB)' }
  }
}

export { runnerProfiles }
