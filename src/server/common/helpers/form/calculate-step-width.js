function calculateStepWidth(isComplete) {
  const totalSteps = Object.keys(isComplete).length
  const completedStepsCount = Object.values(isComplete).filter(Boolean).length

  if (completedStepsCount === totalSteps) {
    return 100
  }

  return (100 / (totalSteps - 1)) * completedStepsCount
}

export { calculateStepWidth }
