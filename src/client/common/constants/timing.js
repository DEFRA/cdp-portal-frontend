/**
 * Timing constants for client-side JavaScript
 * Centralises magic numbers for timeouts, intervals, and delays
 */

// Polling
const pollIntervalDefault = 5000 // 5 seconds
const pollLimitDefault = 60 // 60 minutes

// Notifications and banners
const notificationTimeout = 20000 // 20 seconds

// UI feedback
const copyFeedbackDuration = 1500 // 1.5 seconds

export {
  pollIntervalDefault,
  pollLimitDefault,
  notificationTimeout,
  copyFeedbackDuration
}
