function hasVerticalScrollbar($element) {
  return $element?.scrollHeight > $element?.clientHeight
}

export { hasVerticalScrollbar }
