/**
 * User ID Management
 * Generates and persists a unique user ID in localStorage
 * This allows for user-specific data isolation without authentication
 */

const USER_ID_KEY = 'job_hunt_user_id';

/**
 * Generates a unique user ID
 */
function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Gets the current user ID, creating one if it doesn't exist
 */
export function getUserId(): string {
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = generateUserId();
        localStorage.setItem(USER_ID_KEY, userId);
        console.log('🆔 New user ID generated:', userId);
    }

    return userId;
}

/**
 * Clears the current user ID (for testing/debugging)
 */
export function clearUserId(): void {
    localStorage.removeItem(USER_ID_KEY);
    console.log('🗑️ User ID cleared');
}

/**
 * Sets a custom user ID (for testing/debugging)
 */
export function setUserId(userId: string): void {
    localStorage.setItem(USER_ID_KEY, userId);
    console.log('🆔 User ID set to:', userId);
}
