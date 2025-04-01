/**
 * Test runner profiles
 * @type {{regular: {cpu: {value: number, text: string}, memory: {value: number, text: string}}, large: {cpu: {value: number, text: string}, memory: {value: number, text: string}}}}
 */
const runnerProfiles = {
  regular: {
    cpu: { value: 4096, text: '4 vCPU' },
    memory: { value: 8192, text: '8 GB' }
  },
  large: {
    cpu: { value: 8192, text: '8 vCPU' },
    memory: { value: 16384, text: '16 GB' }
  }
}

export { runnerProfiles }
