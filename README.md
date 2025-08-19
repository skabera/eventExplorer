# Event Explorer

A modern web application for discovering and exploring events built with Next.js and React.

## 🚀 Features

- **Event Browsing**: View and explore various events
- **User Profiles**: Personalized user profiles
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Radix UI components for a polished look
- **Type Safety**: Written in TypeScript for better developer experience

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 13+ (App Router)
- **Styling**: CSS Modules with PostCSS
- **UI Components**: Radix UI Primitives
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript
- **Build Tool**: Vite (if applicable, based on project structure)

## 📦 Prerequisites

- Node.js 18.0.0 or later
- npm or yarn or pnpm

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/skabera/eventExplorer.git
   cd eventExplorer
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # or using yarn
   yarn install
   
   # or using pnpm
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   # Add other environment variables as needed
   ```

4. **Run the development server**
   ```bash
   # Using npm
   npm run dev
   
   # or using yarn
   yarn dev
   
   # or using pnpm
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser to see the application.

## 🚀 Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🌐 API Integration

The application integrates with the following APIs:

- **Events API**: Fetches event data (endpoint: `/api/events`)
- **User API**: Handles user authentication and profiles (endpoint: `/api/users`)

## 🐛 Known Issues

- [ ] Authentication flow needs to be implemented
- [ ] Mobile responsiveness needs improvement on some pages
- [ ] Loading states need to be added for better UX

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This  project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
