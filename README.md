# Shakespearian Pokedex 🎭

A web application that transforms Pokemon descriptions into Shakespearean poetry. Search for your favorite Pokemon and discover their descriptions translated in the style of the Bard!

## ✨ Features

- 🔍 **Pokemon Search**: Search for any Pokemon with autocomplete functionality
- 🎭 **Shakespearean Translation**: Descriptions are translated into Shakespeare's style
- ❤️ **Favorites System**: Save your favorite Pokemon
- 💾 **Flexible Storage**: Supports Firebase Firestore or localStorage
- 🎨 **Pokemon-themed Design**: UI inspired by classic Pokemon games

## 🛠️ Technologies Used

### Frontend
- **React 19.2.0** - UI library for building user interfaces
- **TypeScript 5.9.3** - JavaScript superset with static typing
- **Vite 7.2.4** - Fast and modern build tool for frontend development
- **SCSS** - CSS preprocessor for modular styling

### Backend & Storage
- **Firebase Firestore** - Cloud NoSQL database for favorites persistence
- **LocalStorage** - Browser local storage (fallback)

### External APIs
- **PokeAPI** - Free and open-source API for Pokemon data
- **FunTranslations API** - API for Shakespeare-style translations

### Development Tools
- **ESLint** - Linter for JavaScript/TypeScript
- **TypeScript ESLint** - ESLint rules specific for TypeScript

## 📋 Requirements

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm)

## 🚀 Installation and Local Usage

### 1. Clone the repository

```bash
git clone <repository-url>
cd shakesperian-pokedex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configuration (Optional - for Firebase)

To use Firebase as favorites storage, create a `.env.local` file in the project root:

```env
VITE_STORAGE_PROVIDER=firebase_storage
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: If Firebase is not configured, the app will automatically use `localStorage` for favorites.

### 4. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for production

```bash
npm run build
```

The compiled files will be in the `dist/` folder

### 6. Preview the build

```bash
npm run preview
```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
shakesperian-pokedex/
├── public/                 # Static files
│   └── logo.png
├── src/
│   ├── assets/            # Images and icons
│   │   └── icons/
│   ├── components/        # React components
│   │   ├── favourites-button/    # Favorites button
│   │   ├── favourites-section/   # Favorites section
│   │   ├── pokemon-display/      # Pokemon display
│   │   └── pokemon-search/       # Search bar
│   ├── config/            # Configuration files
│   │   ├── environment.ts        # Environment variables
│   │   └── firebase.ts           # Firebase configuration
│   ├── services/          # Business logic
│   │   ├── firebaseFavourites.ts # Firebase operations
│   │   ├── pokefavourite.ts      # Favorites management
│   │   ├── pokedisplay.ts        # Pokemon display logic
│   │   ├── pokesearch.ts         # Pokemon search
│   │   └── shakespeareApi.ts     # Translation API
│   ├── types/             # TypeScript definitions
│   │   └── pokemon.ts
│   ├── utils/             # Utilities
│   │   └── localStorage.ts
│   ├── App.tsx            # Main component
│   └── main.tsx           # Entry point
├── .env.local             # Local environment variables (don't commit)
├── package.json
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Firebase Configuration (Optional)

1. Create a project on [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Configure security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /favourites/{document=**} {
      allow read, write: if true; // For development
    }
  }
}
```

4. Get credentials from your Firebase project
5. Add environment variables to the `.env.local` file

## 📝 Notes

- FunTranslations API has a rate limit of ~5 requests/hour without an API key. For intensive use, consider obtaining an API key.
- PokeAPI is free and doesn't require authentication.
- For production on Vercel, configure environment variables in the Vercel dashboard.

## 📄 License