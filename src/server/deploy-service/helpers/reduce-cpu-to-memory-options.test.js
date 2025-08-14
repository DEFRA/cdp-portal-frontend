import { reduceCpuToMemoryOptions } from './reduce-cpu-to-memory-options.js'

describe('reduceCpuToMemoryOptions', () => {
  test('Should return reduced CPU and memory options when both inputs are valid', () => {
    const result = reduceCpuToMemoryOptions({
      cpuOptions: ['256', '512', '1024'],
      ecsCpuToMemoryOptionsMap: {
        256: ['512', '1024'],
        512: ['1024', '2048'],
        1024: ['2048', '4096']
      }
    })

    expect(result).toEqual({
      reducedCpuOptions: ['256', '512'],
      reducedCpuToMemoryOptionsMap: {
        256: ['512', '1024'],
        512: ['1024', '2048']
      }
    })
  })

  test('Should handle empty cpuOptions gracefully', () => {
    const result = reduceCpuToMemoryOptions({
      cpuOptions: [],
      ecsCpuToMemoryOptionsMap: {
        256: ['512', '1024']
      }
    })

    expect(result).toEqual({
      reducedCpuOptions: [],
      reducedCpuToMemoryOptionsMap: { 256: ['512', '1024'] }
    })
  })

  test('Should handle empty ecsCpuToMemoryOptionsMap gracefully', () => {
    const result = reduceCpuToMemoryOptions({
      cpuOptions: ['256', '512'],
      ecsCpuToMemoryOptionsMap: {}
    })

    expect(result).toEqual({
      reducedCpuOptions: ['256', '512'],
      reducedCpuToMemoryOptionsMap: {}
    })
  })

  test('Should limit the number of CPU options to 2 even if more are provided', () => {
    const result = reduceCpuToMemoryOptions({
      cpuOptions: ['256', '512', '1024', '2048'],
      ecsCpuToMemoryOptionsMap: {
        256: ['512', '1024'],
        512: ['1024', '2048'],
        1024: ['2048', '4096']
      }
    })

    expect(result).toEqual({
      reducedCpuOptions: ['256', '512'],
      reducedCpuToMemoryOptionsMap: {
        256: ['512', '1024'],
        512: ['1024', '2048']
      }
    })
  })

  test('Should limis the number of memory options per CPU to 2', () => {
    const result = reduceCpuToMemoryOptions({
      cpuOptions: ['256', '512'],
      ecsCpuToMemoryOptionsMap: {
        256: ['512', '1024', '2048'],
        512: ['1024', '2048', '4096']
      }
    })

    expect(result).toEqual({
      reducedCpuOptions: ['256', '512'],
      reducedCpuToMemoryOptionsMap: {
        256: ['512', '1024'],
        512: ['1024', '2048']
      }
    })
  })

  test('Should return empty results when both inputs are empty', () => {
    const result = reduceCpuToMemoryOptions({
      cpuOptions: [],
      ecsCpuToMemoryOptionsMap: {}
    })

    expect(result).toEqual({
      reducedCpuOptions: [],
      reducedCpuToMemoryOptionsMap: {}
    })
  })
})
