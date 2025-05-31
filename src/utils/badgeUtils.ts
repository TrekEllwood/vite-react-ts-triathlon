let badgeCount = 0

export async function incrementAppBadge() {
  badgeCount++
  if ('setAppBadge' in navigator) {
    try {
      await navigator.setAppBadge(badgeCount)
    } catch (err) {
      console.warn('Badge error:', err) // DEBUG
    }
  }
}

export async function clearAppBadge() {
  badgeCount = 0
  if ('clearAppBadge' in navigator) {
    try {
      await navigator.clearAppBadge()
    } catch (err) {
      console.warn('Clear badge error:', err) // DEBUG
    }
  }
}
