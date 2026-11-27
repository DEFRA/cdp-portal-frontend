export const removeUserController = {
  handler: async (request, h) => {
    const { userId } = request.payload

    const stepData = request.app.getStepData()
    const usersToCreate = stepData.usersToCreate ?? []

    const updatedUsers = usersToCreate.filter((user) => user.userId !== userId)

    await request.app.initStepData({
      ...stepData,
      usersToCreate: updatedUsers
    })

    return h.redirect('/admin/users/summary')
  }
}
