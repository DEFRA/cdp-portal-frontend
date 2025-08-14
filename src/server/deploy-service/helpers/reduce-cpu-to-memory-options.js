function reduceCpuToMemoryOptions({ cpuOptions, ecsCpuToMemoryOptionsMap }) {
  const reducedOptions = 2 // Limit to first 2 options for prototypes
  const reducedCpuOptions = cpuOptions?.slice(0, reducedOptions)
  const reducedCpuToMemoryOptionsMap = Object.fromEntries(
    Object.entries(ecsCpuToMemoryOptionsMap)
      .slice(0, reducedOptions)
      .map(([key, value]) => [key, value.slice(0, reducedOptions)])
  )

  return {
    reducedCpuOptions,
    reducedCpuToMemoryOptionsMap
  }
}

export { reduceCpuToMemoryOptions }
