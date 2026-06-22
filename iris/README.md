📱 Project Iris (Zeni App)

Iris is the mobile frontend of the Zeni ecosystem. Built with React Native (via Expo) and TypeScript, it is designed to offer a fluid, offline-first, and visually attractive experience using a Cyberpunk Otaku aesthetic.

🛠️ Tech Stack

Framework: React Native + Expo

Language: TypeScript

Styling: NativeWind (Tailwind for React Native)

Graphics: React Native Skia

Local Database: WatermelonDB

🚀 Quick Start

Make sure the backend infrastructure (Athena and Pluto) is running via Docker Compose at the root of the monorepo before making network requests.

Install dependencies:

npm install


Configure environment variables:
Create a .env file based on .env.example (if it exists) and set the API base URL pointing to http://localhost:3000 (Project Athena).

Start the development server (Expo):

npm start


Run on device/emulator:

Press a in the terminal to open on Android.

Press i to open on iOS (requires macOS).

Or scan the QR code with the Expo Go app on your physical phone.

🎨 Style Guide (Coming Soon)

Here we will document the neon color palette, typography, and standardized UI components.