# Session Timeout Implementation

## Overview
This implementation provides a comprehensive 30-minute session timeout system with automatic logout functionality for the Best Medical web application.

## Features

### 1. **Automatic Session Management**
- 30-minute session timeout from last activity
- Automatic logout when session expires
- Session persistence across page refreshes
- Activity tracking (mouse, keyboard, scroll, touch events)

### 2. **Visual Feedback**
- Real-time session timer in bottom-right corner
- Warning popup when 5 minutes remaining
- Progressive color coding (green → yellow → red)
- Session status in navigation bar

### 3. **Security Features**
- Secure session storage with timestamps
- Automatic redirect on session expiry
- Role-based access control integration
- Activity-based session renewal

## Files Modified/Created

### Core Session Management
- **`src/app/lib/sessionTimeout.js`** - Main session management utility
- **`src/app/lib/useAuth.js`** - React hooks for authentication

### UI Components
- **`src/app/components/SessionTimeout.jsx`** - Session timer and warning popup
- **`src/app/components/Nav.jsx`** - Updated with session management
- **`src/app/layout.jsx`** - Includes session timeout component

### Authentication
- **`src/app/login/page.jsx`** - Updated login with session management
- **`src/app/admin/dashboard/page.jsx`** - Example of protected route

### Testing
- **`src/app/session-test/page.jsx`** - Session testing interface

## How It Works

### 1. **Session Creation (Login)**
```javascript
// When user logs in
sessionManager.setSession(userData);
// Sets loginTime and lastActivity timestamps
```

### 2. **Activity Tracking**
```javascript
// Automatically tracks user activity
const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
// Updates lastActivity timestamp on any interaction
```

### 3. **Session Monitoring**
```javascript
// Checks every minute for expiration
setInterval(() => {
  if (sessionManager.isSessionExpired()) {
    alert('เซสชันหมดอายุแล้ว');
    sessionManager.logout();
  }
}, 60000);
```

### 4. **Automatic Logout**
```javascript
// Logout function
sessionManager.logout() {
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

## Usage Examples

### 1. **Protecting Routes**
```javascript
import { useAdminAuth } from '@/app/lib/useAuth';

export default function AdminPage() {
  const { user, loading, isAuthenticated, LoadingComponent } = useAdminAuth();
  
  if (loading) return <LoadingComponent />;
  if (!isAuthenticated) return null; // Auto-redirect happens
  
  return <div>Admin Content</div>;
}
```

### 2. **Manual Session Check**
```javascript
import { sessionManager } from '@/app/lib/sessionTimeout';

// Check if session is valid
if (sessionManager.isSessionExpired()) {
  // Handle expired session
}

// Get remaining time
const minutes = sessionManager.getRemainingTime();

// Update activity manually
sessionManager.updateActivity();
```

### 3. **Using Session Hook**
```javascript
import { useSession } from '@/app/lib/sessionTimeout';

function MyComponent() {
  const { user, logout, getRemainingTime, updateActivity } = useSession();
  
  return (
    <div>
      <p>Welcome {user?.firstname}</p>
      <p>Time left: {getRemainingTime()} minutes</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Configuration

### Timeout Duration
```javascript
// In sessionTimeout.js
this.timeoutDuration = 30 * 60 * 1000; // 30 minutes
this.checkInterval = 60 * 1000; // Check every minute
```

### Warning Threshold
```javascript
// Show warning when 5 minutes remaining
if (remaining <= 5 && remaining > 0) {
  setShowWarning(true);
}
```

## User Experience

### 1. **Login Process**
1. User enters credentials
2. System validates and creates session with timestamp
3. User redirected to appropriate dashboard
4. Session monitoring starts automatically

### 2. **Active Session**
1. Session timer shows in bottom-right corner
2. Color changes as time decreases (green → yellow → red)
3. Activity automatically extends session
4. Warning appears at 5 minutes remaining

### 3. **Session Warning**
1. Modal popup appears with 5 minutes remaining
2. Options to extend session or logout manually
3. Clear indication of remaining time

### 4. **Session Expiry**
1. Automatic logout when time expires
2. Alert notification before redirect
3. Redirect to login page
4. All session data cleared

## Testing

### Visit Test Page
Navigate to `/session-test` after logging in to see:
- Real-time session status
- Remaining time countdown
- Manual session controls
- Activity simulation buttons

### Test Scenarios
1. **Normal Activity**: Use the app normally, session should extend automatically
2. **Inactivity**: Leave browser idle for 30 minutes, should auto-logout
3. **Warning Test**: Wait for 25 minutes to see warning popup
4. **Manual Extension**: Use "Extend Session" button to reset timer
5. **Manual Logout**: Use logout button to end session immediately

## Browser Compatibility
- Uses localStorage for session storage
- Works in all modern browsers
- Graceful fallback for browsers without localStorage

## Security Considerations
- Session data stored locally only
- No sensitive data in localStorage
- Automatic cleanup on logout
- Protection against session fixation
- Role-based access control integration

## Future Enhancements
- Server-side session validation
- Multiple device session management
- Session activity logging
- Configurable timeout per user role
- Remember me functionality with longer sessions