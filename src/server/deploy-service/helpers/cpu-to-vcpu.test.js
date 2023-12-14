import { cpuToVCpu } from '~/src/server/deploy-service/helpers/cpu-to-vcpu'

describe('#cpuToVCpu', () => {
  test('Should provide expected fixed point vCPU value', () => {
    expect(cpuToVCpu(1200)).toEqual('1.17')
  })

  test('Should provide expected whole vCPU value', () => {
    expect(cpuToVCpu(1024)).toEqual('1')
  })

  test('Should provide expected vCPU value without leading zero', () => {
    expect(cpuToVCpu(512)).toEqual('.5')
  })

  test('Should provide expected fixed point vCPU value without leading zero', () => {
    expect(cpuToVCpu(70)).toEqual('.07')
  })

  test('Should provide expected fixed point vCPU value', () => {
    expect(cpuToVCpu(442)).toEqual('.43')
  })
})
