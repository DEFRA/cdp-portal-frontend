// A default option as the first element in a select element allows:
// - On first load of the page an option with the below text value is displayed in the select element
// - When a user clicks/opens the select element this default option at the top is shown but is not selectable

const defaultOption = {
  value: '',
  text: ' - - select - - ',
  disabled: true,
  attributes: { selected: true }
}

export { defaultOption }
