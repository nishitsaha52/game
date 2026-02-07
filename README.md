# 💖 Love Gravity - Valentine's Day Hearts Game 💕

A mesmerizing interactive Valentine's Day experience where colorful hearts fall, bounce, and create magical love messages when they find their perfect match!

![Valentine's Day Theme](https://img.shields.io/badge/Theme-Valentine's%20Day-ff69b4)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 💝 Interactive Heart Spawning
- Click anywhere on the canvas to create beautiful animated hearts
- Each heart spawns with random size, color, and velocity
- Sparkle particle effects burst when hearts are created

### 🎨 Romantic Visual Design
- **Light pastel gradient background** with soft pink tones
- **7 romantic colors**: Hot Pink, Light Pink, Rose, Purple, Magenta, Deep Rose, and Soft Pink
- **Heart-shaped physics objects** with realistic bezier curves
- **Glowing effects** that intensify on collisions
- **Motion trails** that follow each heart's path

### ⚙️ Realistic Physics Engine
- **Gravity simulation** with adjustable strength (0 to 2)
- **Elastic collisions** between hearts with momentum transfer
- **Wall bouncing** with 80% energy retention
- **Air resistance** for natural movement
- **Mass-based physics** - larger hearts have more momentum

### 💌 Love Messages System
When hearts of the **same color** collide for the first time, they display romantic floating messages:
- "Perfect Match Made in Heaven! 💖"
- "Soul Mates United Forever! 💗"
- "Two Hearts Beat as One! 💞"
- "Destiny Brought You Together! 🌟"
- "Love Conquers All! ❤️"
- "Happily Ever After! 👑💖"
- ...and 19 more romantic messages!

### 📊 Interactive Controls
- **Hearts Counter** - Track how many hearts you've created
- **Love Matches Counter** - See how many same-color collisions occurred
- **Gravity Slider** - Adjust gravity from 0 (zero gravity) to 2 (double gravity)
- **Clear Button** - Reset all hearts and start fresh

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/parallel-hearts.git
cd parallel-hearts
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t valentine-game .
```

### Run Docker Container

```bash
docker run -p 8080:80 valentine-game
```

Then open [http://localhost:8080](http://localhost:8080) to view the game.

### Docker Image Details

- **Multi-stage build** for optimized image size
- **Stage 1**: Node.js 18 Alpine - builds the React application
- **Stage 2**: Nginx Alpine - serves the static files
- Final image size: ~25MB (much smaller than full Node image)
- Runs on port 80 inside container (map to any host port)


## 🎮 How to Play

1. **Create Hearts**: Click anywhere on the screen to spawn colorful hearts
2. **Watch the Magic**: Hearts fall with gravity, bounce off walls, and collide with each other
3. **Find Matches**: When two hearts of the same color touch for the first time, a romantic message appears!
4. **Adjust Gravity**: Use the slider to control how fast hearts fall
5. **Clear and Restart**: Click "Clear All Hearts" to start over

## 🎨 Color Palette

The game features a romantic Valentine's Day color scheme:

- **Background**: Soft gradient from `#ffe0f0` to `#fff0f8`
- **Hearts**: 7 shades of pink, rose, and purple
- **Messages**: Deep wine color `#8b1538` for maximum visibility
- **UI Panel**: White translucent with rose accents

## 🛠️ Technologies Used

- **React** - UI framework
- **HTML5 Canvas** - Graphics rendering
- **CSS3** - Styling and gradients
- **JavaScript ES6+** - Game logic and physics

## 📁 Project Structure

```
parallel-hearts/
├── public/
│   ├── index.html          # Main HTML file
│   ├── hearts.png          # App icon
│   └── manifest.json       # PWA manifest
├── src/
│   ├── App.js              # Main app component
│   ├── App.css             # Global styles
│   ├── GravityPlayground.jsx  # Main game component
│   └── index.js            # React entry point
└── README.md               # This file
```

## 🎯 Key Game Mechanics

### Heart Physics
- Each heart is a physics object with position, velocity, mass, and trail
- Gravity accelerates hearts downward
- Damping simulates air resistance
- Collision detection uses distance between heart centers
- Elastic collision resolution transfers momentum based on mass

### Love Message System
- Each heart tracks if it has found a match (`hasMatched` flag)
- Messages only appear on first collision between same-color hearts
- Messages float upward with scale-in animation
- Text fades out after 120 frames

## 💡 Tips for Best Experience

- **Create variety**: Spawn hearts in different locations for interesting interactions
- **Adjust gravity**: Lower gravity creates floaty, dreamy movement
- **Find patterns**: Try to match specific colors by watching their positions
- **Screenshot moments**: The game is perfect for capturing romantic screenshots!

## 🐛 Known Issues

- ESLint warning about `colors` dependency (harmless, does not affect functionality)

## 📝 License

This project is open source and available under the MIT License.

## 💕 Happy Valentine's Day!

Enjoy creating your own romantic physics playground! Perfect for:
- Valentine's Day celebrations
- Romantic gestures
- Physics demonstrations with a twist
- Creative coding portfolios

---

Made with ❤️ for Valentine's Day 2026
