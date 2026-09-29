export const deployServicePrototypeOptionsFixture = {
  cpuOptions: [
    {
      value: 512,
      text: '512 (.5 vCPU)'
    },
    {
      value: 1024,
      text: '1024 (1 vCPU)'
    }
  ],
  ecsCpuToMemoryOptionsMap: {
    512: [
      {
        value: 1024,
        text: '1 GB'
      },
      {
        value: 2048,
        text: '2 GB'
      }
    ],
    1024: [
      {
        value: 2048,
        text: '2 GB'
      },
      {
        value: 3072,
        text: '3 GB'
      }
    ]
  }
}
