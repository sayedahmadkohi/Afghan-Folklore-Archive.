# Afghan Folklore Archive

A premium, cinematic web application for preserving and sharing Afghan folklore stories. Built with React, TailwindCSS, Framer Motion, and React Router.

## 🎨 Design Features

- **Dark cinematic UI** with elegant glassmorphism effects
- **Premium typography** using Vazirmatn font
- **Smooth animations** powered by Framer Motion
- **Fully responsive** design for desktop, tablet, and mobile
- **Atmospheric reading experience** similar to Medium

## 🛠️ Tech Stack

- **React.js** - UI framework
- **TailwindCSS** - Styling with custom color palette
- **React Router** - Navigation and routing
- **Framer Motion** - Animations and transitions
- **Lucide React** - Professional icon library

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

Due to PowerShell execution policy restrictions, you may need to run these commands in **Command Prompt** or **PowerShell with elevated privileges**:

#### Option 1: Using Command Prompt (Recommended)

1. Open Command Prompt (cmd.exe)
2. Navigate to the project directory:
   ```cmd
   cd C:\Users\Aaser\Desktop\myproject
   ```
3. Install dependencies:
   ```cmd
   npm install
   ```
4. Start the development server:
   ```cmd
   npm run dev
   ```

#### Option 2: Using PowerShell with Execution Policy Change

If you prefer PowerShell, you'll need to change the execution policy:

1. Open PowerShell as Administrator
2. Run the following command to allow script execution for the current session:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
   ```
3. Navigate to the project directory:
   ```powershell
   cd C:\Users\Aaser\Desktop\myproject
   ```
4. Install dependencies:
   ```powershell
   npm install
   ```
5. Start the development server:
   ```powershell
   npm run dev
   ```

#### Option 3: Permanent Execution Policy Change (Not Recommended)

To permanently change the execution policy (use with caution):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🚀 Running the Application

After installing dependencies:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── StoryCard.jsx
│   ├── Button.jsx
│   └── Input.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── Explore.jsx
│   ├── StoryDetails.jsx
│   └── Login.jsx
├── layouts/         # Layout components
│   └── AppLayout.jsx
├── data/            # JSON data files
│   └── stories.json
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🎯 Features

### Home Page
- Cinematic hero section with atmospheric effects
- Featured stories grid
- Category exploration
- Regional discovery section
- Call-to-action for story submission

### Explore Page
- Advanced search functionality
- Category and region filters
- Grid/List view toggle
- Responsive story cards with hover effects

### Story Details Page
- Premium reading experience
- Reading progress bar
- Font size controls
- Dark/light reading mode
- Bookmark and like functionality
- Suggested stories section

### Login Page
- Elegant glassmorphism design
- Atmospheric background effects
- Smooth animations

## 🎨 Color Palette

- **Background**: #0f0f0f
- **Secondary Background**: #171717
- **Card Background**: rgba(255,255,255,0.05)
- **Primary Accent**: #d6c7a1
- **Secondary Accent**: #8b7355
- **Text Primary**: #f5f5f5
- **Text Secondary**: #a1a1aa
- **Borders**: rgba(255,255,255,0.08)

## 📝 Data

The application uses local JSON data stored in `src/data/stories.json` with 8 realistic Afghan folklore stories including:

- The Legend of the Blue Mosque
- Rostam and Sohrab
- The Poetess of Herat
- The Valley of the Buddhas
- Shirin and Farhad
- The Guardian of the Hindu Kush
- The Merchant of Kabul
- The Garden of Paradise

## 🔧 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- Afghan folklore and cultural heritage
- Modern web design inspiration from Medium, Spotify, and museum websites
