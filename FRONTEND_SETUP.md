# GEM Frontend - Setup & Integration Guide

## 📁 Project Structure

```
gem-FE/
├── .env                          # Environment variables
├── src/
│   ├── services/                 # API Integration Layer
│   │   ├── api.js               # Base API configuration
│   │   ├── auth/
│   │   │   └── authService.js   # Authentication API calls
│   │   └── sellLand/
│   │       └── sellLandService.js # Sell land API calls
│   ├── pages/                    # Page Components
│   │   ├── Login/
│   │   │   ├── Login.js
│   │   │   └── Login.css
│   │   ├── Signup/
│   │   │   ├── Signup.js
│   │   │   └── Signup.css
│   │   ├── UserDashboard/
│   │   │   ├── UserDashboard.js
│   │   │   └── UserDashboard.css
│   │   └── AdminDashboard/
│   │       ├── AdminDashboard.js
│   │       └── AdminDashboard.css
│   ├── components/
│   │   ├── ProtectedRoute.js    # Route protection component
│   │   ├── landing.js
│   │   ├── Navbar.js
│   │   ├── SellLandForm.js      # ✅ Integrated with API
│   │   └── BuyLand.js
│   └── App.js                    # ✅ Updated with routes
```

## 🚀 Setup Instructions

### 1. Environment Configuration

The `.env` file has been created with:
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

**Note:** Make sure your backend is running on `http://localhost:5000`

### 2. Install Dependencies (if needed)

```bash
cd gem-FE
npm install
```

### 3. Start the Development Server

```bash
npm start
```

The app will run on `http://localhost:3000`

## 🔐 Authentication Flow

### Login
1. User navigates to `/login`
2. Enters username and password
3. API call to `/api/login/login`
4. On success:
   - Token stored in `localStorage`
   - User data stored in `localStorage`
   - Redirects based on role:
     - **Admin** → `/admin/dashboard`
     - **User** → `/user/dashboard`

### Signup
1. User navigates to `/signup`
2. Fills registration form (username, email, password, full name)
3. API call to `/api/user/create`
4. On success:
   - Shows success message
   - Redirects to `/login` after 2 seconds

### Logout
- Clears `localStorage` (token and user data)
- Redirects to `/login`

## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected User Routes (requires authentication)
- `/user/dashboard` - User dashboard
- `/sell` - Sell land form (✅ API integrated)
- `/buy` - Buy land page

### Protected Admin Routes (requires admin role)
- `/admin/dashboard` - Admin dashboard (placeholder)

## 🔒 Route Protection

The `ProtectedRoute` component handles:
- ✅ Checking if user is authenticated
- ✅ Redirecting to login if not authenticated
- ✅ Role-based access control (admin vs user)
- ✅ Preventing admins from accessing user routes
- ✅ Preventing users from accessing admin routes

## 📡 API Integration

### Services Structure

#### `api.js` - Base API Configuration
```javascript
import { apiCall } from './services/api';

// Automatically adds:
// - Base URL from .env
// - Content-Type: application/json
// - token header from localStorage
```

#### `authService.js` - Authentication
```javascript
import authService from './services/auth/authService';

// Available methods:
authService.login(username, password)
authService.signup(userData)
authService.logout()
authService.getCurrentUser()
authService.isAuthenticated()
authService.isAdmin()
authService.getToken()
authService.changePassword(username, oldPassword, newPassword)
```

#### `sellLandService.js` - Sell Land Operations
```javascript
import sellLandService from './services/sellLand/sellLandService';

// Available methods:
sellLandService.createSubmission(formData)
sellLandService.getMySubmissions()
sellLandService.getSubmissionById(id)
sellLandService.updateSubmission(id, updateData)
sellLandService.deleteSubmission(id)
```

## ✅ Integrated Features

### 1. Login Page (`/login`)
- ✅ Form validation
- ✅ API integration
- ✅ Error handling
- ✅ Role-based redirection
- ✅ Loading states

### 2. Signup Page (`/signup`)
- ✅ Form validation
- ✅ Password confirmation
- ✅ Email validation
- ✅ API integration
- ✅ Success message
- ✅ Auto-redirect to login

### 3. Sell Land Form (`/sell`)
- ✅ API integration with `/api/user/sell-land/create`
- ✅ Form data mapping to backend
- ✅ Error handling
- ✅ Loading states
- ✅ Success modal
- ✅ Protected route (requires login)

### 4. User Dashboard (`/user/dashboard`)
- ✅ Displays user information
- ✅ Quick access cards
- ✅ Logout functionality
- ✅ Protected route

### 5. Admin Dashboard (`/admin/dashboard`)
- ✅ Admin-only access
- ✅ Placeholder for future features
- ✅ Protected route

## 🔄 Data Flow Example

### Submitting a Land Listing

```javascript
// 1. User fills form in SellLandForm.js
const formData = {
  name: "John Doe",
  phone: "9876543210",
  location: "Chennai",
  price: 5000000,
  area: 2400,
  landType: "Coconut Land"
};

// 2. Form submits → calls sellLandService
await sellLandService.createSubmission(formData);

// 3. sellLandService → calls api.js
await apiCall('/user/sell-land/create', {
  method: 'POST',
  body: JSON.stringify(formData)
});

// 4. api.js adds token from localStorage
headers: {
  'Content-Type': 'application/json',
  'token': localStorage.getItem('token')
}

// 5. Request sent to backend
POST http://localhost:5000/api/user/sell-land/create

// 6. Backend response → Success modal shown
```

## 🎨 UI/UX Features

### Login & Signup
- Modern gradient backgrounds
- Smooth animations
- Responsive design
- Clear error messages
- Loading indicators

### Dashboards
- Clean, card-based layout
- Role-specific branding
- Quick action cards
- Account information display

### Sell Land Form
- Multi-step wizard
- Visual land type selection
- Real-time validation
- Success confirmation
- Error alerts

## 🧪 Testing the Integration

### 1. Test Signup
```bash
# Navigate to signup
http://localhost:3000/signup

# Fill form and submit
# Should redirect to login after success
```

### 2. Test Login
```bash
# Navigate to login
http://localhost:3000/login

# Login with credentials
# User role → redirects to /user/dashboard
# Admin role → redirects to /admin/dashboard
```

### 3. Test Sell Land Form
```bash
# Login as user first
# Navigate to /sell
# Fill and submit form
# Check browser console for API call
# Check backend logs for request
```

## 🐛 Debugging

### Check if backend is running
```bash
# Backend should be on http://localhost:5000
curl http://localhost:5000/health
```

### Check localStorage
```javascript
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')
```

### Check API calls
- Open browser DevTools → Network tab
- Filter by "Fetch/XHR"
- Submit forms and watch requests

### Common Issues

**Issue:** "Token required" error
- **Solution:** User not logged in, redirect to `/login`

**Issue:** CORS error
- **Solution:** Make sure backend has CORS enabled for `http://localhost:3000`

**Issue:** "Invalid token" error
- **Solution:** Token expired or invalid, logout and login again

## 📝 Next Steps

### User Side (Priority)
1. ✅ Login/Signup - **DONE**
2. ✅ Sell Land Form Integration - **DONE**
3. 🔲 My Submissions Page - View user's land submissions
4. 🔲 Buy Land Page - Browse available lands
5. 🔲 Land Details Page - View individual land details
6. 🔲 User Profile Page - Edit profile, change password

### Admin Side (After User Side)
1. 🔲 Admin Dashboard - Statistics and overview
2. 🔲 User Management - View/Edit/Delete users
3. 🔲 Submission Management - Approve/Reject submissions
4. 🔲 Move to Land - Transfer approved submissions to Land model
5. 🔲 Land Management - Manage all land listings
6. 🔲 Bulk Operations - Bulk approve/delete

## 🔑 Key Files Modified/Created

### Created
- ✅ `.env` - Environment configuration
- ✅ `src/services/api.js` - Base API config
- ✅ `src/services/auth/authService.js` - Auth API calls
- ✅ `src/services/sellLand/sellLandService.js` - Sell land API calls
- ✅ `src/pages/Login/` - Login page
- ✅ `src/pages/Signup/` - Signup page
- ✅ `src/pages/UserDashboard/` - User dashboard
- ✅ `src/pages/AdminDashboard/` - Admin dashboard
- ✅ `src/components/ProtectedRoute.js` - Route protection

### Modified
- ✅ `src/App.js` - Added all routes with protection
- ✅ `src/components/SellLandForm.js` - Integrated with API
- ✅ `src/style/SellLandForm.css` - Added error styling

## 🎯 Current Status

✅ **Completed:**
- Environment setup
- API service layer
- Authentication (Login/Signup)
- Role-based routing
- Protected routes
- User dashboard
- Admin dashboard (placeholder)
- Sell land form API integration

🔲 **Pending:**
- User-side features (My Submissions, Buy Land, etc.)
- Admin-side features (full implementation)

---

**Ready to continue with user-side features!** 🚀
