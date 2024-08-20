import { cpuToVCpu } from '~/src/server/deploy-service/helpers/cpu-to-vcpu'

describe('#cpuToVCpu', () => {
  test('Should provide expected fixed point vCPU value', () => {
    expect(cpuToVCpu(1200)).toBe('1.17')
  })

  test('Should provide expected whole vCPU value', () => {
    expect(cpuToVCpu(1024)).toBe('1')
  })

  test('Should provide expected vCPU value without leading zero', () => {
    expect(cpuToVCpu(512)).toBe('.5')
  })

  test('Should provide expected fixed point vCPU value without leading zero', () => {
    expect(cpuToVCpu(70)).toBe('.07')
  })

  test('Should provide expected less than zero fixed point vCPU value', () => {
    expect(cpuToVCpu(442)).toBe('.43')
  })
})
