// Session timeout management utility
export class SessionManager {
  constructor() {
    this.timeoutDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
    this.checkInterval = 60 * 1000; // Check every minute
    this.timeoutId = null;
    this.intervalId = null;
  }

  // Set session with current timestamp
  setSession(userData) {
    const sessionData = {
      ...userData,
      loginTime: Date.now(),
      lastActivity: Date.now()
    };
    localStorage.setItem('user', JSON.stringify(sessionData));
    this.startSessionMonitoring();
  }

  // Update last activity timestamp
  updateActivity() {
    const user = this.getSession();
    if (user) {
      user.lastActivity = Date.now();
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Get current session
  getSession() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  // Check if session is expired
  isSessionExpired() {
    const user = this.getSession();
    if (!user || !user.lastActivity) {
      return true;
    }

    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - user.lastActivity;
    return timeSinceLastActivity > this.timeoutDuration;
  }

  // Get remaining session time in minutes
  getRemainingTime() {
    const user = this.getSession();
    if (!user || !user.lastActivity) {
      return 0;
    }

    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - user.lastActivity;
    const remainingTime = this.timeoutDuration - timeSinceLastActivity;
    
    return Math.max(0, Math.floor(remainingTime / (60 * 1000))); // Return in minutes
  }

  // Clear session and logout
  logout() {
    localStorage.removeItem('user');
    this.stopSessionMonitoring();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Start monitoring session timeout
  startSessionMonitoring() {
    this.stopSessionMonitoring(); // Clear any existing monitoring

    // Check session expiry every minute
    this.intervalId = setInterval(() => {
      if (this.isSessionExpired()) {
        alert('เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่');
        this.logout();
      }
    }, this.checkInterval);

    // Set up automatic logout timer
    this.timeoutId = setTimeout(() => {
      alert('เซสชันของคุณหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่');
      this.logout();
    }, this.timeoutDuration);
  }

  // Stop session monitoring
  stopSessionMonitoring() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Initialize session monitoring on app start
  initializeSession() {
    if (typeof window === 'undefined') return;

    const user = this.getSession();
    if (user) {
      if (this.isSessionExpired()) {
        this.logout();
      } else {
        this.startSessionMonitoring();
      }
    }
  }

  // Setup activity listeners to track user interaction
  setupActivityListeners() {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      this.updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Hook for React components to use session management
export const useSession = () => {
  const getUser = () => sessionManager.getSession();
  const logout = () => sessionManager.logout();
  const getRemainingTime = () => sessionManager.getRemainingTime();
  const isExpired = () => sessionManager.isSessionExpired();
  
  return {
    user: getUser(),
    logout,
    getRemainingTime,
    isExpired,
    updateActivity: () => sessionManager.updateActivity()
  };
};