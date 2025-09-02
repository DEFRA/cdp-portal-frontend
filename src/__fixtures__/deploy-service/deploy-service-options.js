const deployServiceOptionsFixture = {
  cpuOptions: [
    {
      value: 512,
      text: '512 (.5 vCPU)'
    },
    {
      value: 1024,
      text: '1024 (1 vCPU)'
    },
    {
      value: 2048,
      text: '2048 (2 vCPU)'
    },
    {
      value: 4096,
      text: '4096 (4 vCPU)'
    },
    {
      value: 8192,
      text: '8192 (8 vCPU)'
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
      },
      {
        value: 3072,
        text: '3 GB'
      },
      {
        value: 4096,
        text: '4 GB'
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
      },
      {
        value: 4096,
        text: '4 GB'
      },
      {
        value: 5120,
        text: '5 GB'
      },
      {
        value: 6144,
        text: '6 GB'
      },
      {
        value: 7168,
        text: '7 GB'
      },
      {
        value: 8192,
        text: '8 GB'
      }
    ],
    2048: [
      {
        value: 4096,
        text: '4 GB'
      },
      {
        value: 5120,
        text: '5 GB'
      },
      {
        value: 6144,
        text: '6 GB'
      },
      {
        value: 7168,
        text: '7 GB'
      },
      {
        value: 8192,
        text: '8 GB'
      },
      {
        value: 9216,
        text: '9 GB'
      },
      {
        value: 10240,
        text: '10 GB'
      },
      {
        value: 11264,
        text: '11 GB'
      },
      {
        value: 12288,
        text: '12 GB'
      },
      {
        value: 13312,
        text: '13 GB'
      },
      {
        value: 14336,
        text: '14 GB'
      },
      {
        value: 15360,
        text: '15 GB'
      },
      {
        value: 16384,
        text: '16 GB'
      }
    ],
    4096: [
      {
        value: 8192,
        text: '8 GB'
      },
      {
        value: 9216,
        text: '9 GB'
      },
      {
        value: 10240,
        text: '10 GB'
      },
      {
        value: 11264,
        text: '11 GB'
      },
      {
        value: 12288,
        text: '12 GB'
      },
      {
        value: 13312,
        text: '13 GB'
      },
      {
        value: 14336,
        text: '14 GB'
      },
      {
        value: 15360,
        text: '15 GB'
      },
      {
        value: 16384,
        text: '16 GB'
      },
      {
        value: 17408,
        text: '17 GB'
      },
      {
        value: 18432,
        text: '18 GB'
      },
      {
        value: 19456,
        text: '19 GB'
      },
      {
        value: 20480,
        text: '20 GB'
      },
      {
        value: 21504,
        text: '21 GB'
      },
      {
        value: 22528,
        text: '22 GB'
      },
      {
        value: 23552,
        text: '23 GB'
      },
      {
        value: 24576,
        text: '24 GB'
      },
      {
        value: 25600,
        text: '25 GB'
      },
      {
        value: 26624,
        text: '26 GB'
      },
      {
        value: 27648,
        text: '27 GB'
      },
      {
        value: 28672,
        text: '28 GB'
      },
      {
        value: 29696,
        text: '29 GB'
      },
      {
        value: 30720,
        text: '30 GB'
      }
    ],
    8192: [
      {
        value: 16384,
        text: '16 GB'
      },
      {
        value: 20480,
        text: '20 GB'
      },
      {
        value: 24576,
        text: '24 GB'
      },
      {
        value: 28672,
        text: '28 GB'
      },
      {
        value: 32768,
        text: '32 GB'
      },
      {
        value: 36864,
        text: '36 GB'
      },
      {
        value: 40960,
        text: '40 GB'
      },
      {
        value: 45056,
        text: '44 GB'
      },
      {
        value: 49152,
        text: '48 GB'
      },
      {
        value: 53248,
        text: '52 GB'
      },
      {
        value: 57344,
        text: '56 GB'
      },
      {
        value: 61440,
        text: '60 GB'
      }
    ]
  }
}

export { deployServiceOptionsFixture }
