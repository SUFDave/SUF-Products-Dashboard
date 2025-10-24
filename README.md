# Golf Leaderboard Application

A real-time golf tournament leaderboard application with role-based access control for managing tournaments, groups, and scores.

## Features

- **User Authentication**: Secure login with Firebase Authentication
- **Role-Based Access Control**:
  - Admin: Manage users and assign roles
  - Organizer: Manage groups and update scores
- **Real-time Score Updates**: Live leaderboard updates
- **Group Management**: Organize players into groups for tournaments
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: CSS3

## Project Structure

```
golf-leaderboard-app/
├── public/
│   ├── index.html                 # Main HTML template
│   ├── favicon.ico               # App icon
│   └── manifest.json             # PWA manifest
├── src/
│   ├── components/               # React components
│   │   ├── LoginScreen.js        # Login form component
│   │   ├── AdminDashboard.js     # Admin management interface
│   │   ├── OrganizerDashboard.js # Organizer score management
│   │   └── GroupCard.js          # Reusable group display component
│   ├── context/                  # React context providers
│   │   └── AuthContext.js        # Authentication context
│   ├── firebase.js               # Firebase configuration
│   ├── App.js                    # Main App component with routing
│   ├── App.css                   # App-specific styles
│   ├── index.js                  # React app entry point
│   └── index.css                 # Global styles
├── package.json                  # Dependencies and scripts
├── package-lock.json            # Exact dependency versions
└── README.md                    # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd golf-leaderboard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase configuration
   - Update `src/firebase.js` with your Firebase configuration:
     ```javascript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Run the application**
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   ```

## Firebase Setup

### Firestore Database Structure

```
users/
  {userId}/
    - email: string
    - role: "admin" | "organizer"
    - createdAt: timestamp

groups/
  {groupId}/
    - name: string
    - players: array
      - id: string
      - name: string
      - score: number
    - createdAt: timestamp
```

### Security Rules

Add these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## Usage

### Admin Users

1. Log in with admin credentials
2. Navigate to Admin Dashboard
3. Add new users (organizers or other admins)
4. Manage user roles and permissions

### Organizer Users

1. Log in with organizer credentials
2. View assigned groups
3. Update player scores in real-time
4. View overall leaderboard

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (irreversible)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
