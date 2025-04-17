function cpuToVCpu(cpu) {
  const vCpu = 1 * Number(cpu / 1024).toFixed(2)

  return vCpu.toString().replace(/^0/g, '').replace(/0$/g, '')
}

export { cpuToVCpu }
