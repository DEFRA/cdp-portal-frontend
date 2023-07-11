// A blank option as the first element in a select element allows:
// - On first load of the page an option is not displayed in the select element
// - When a user clicks/opens the select element this blank option at the top is not shown

const blankOption = {
  attributes: { hidden: true }
}

export { blankOption }
