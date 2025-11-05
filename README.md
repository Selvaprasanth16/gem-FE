# 🌿 Gem Real Estate

A modern, responsive real estate platform for buying and selling land properties. Built with React and designed with a focus on user experience and clean aesthetics.

## 📋 Project Overview

Gem Real Estate is a comprehensive web application that connects land buyers and sellers, providing an intuitive interface for property listings, detailed information, and seamless communication.

## ✨ Features

### 🏠 Core Functionality
- **Buy Land**: Browse available properties with detailed information
- **Sell Land**: Multi-step form to list your property
- **Property Showcase**: Beautiful landing page with featured properties
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

### 🎨 Design Highlights
- Clean, modern UI with Poppins font family
- Smooth animations and transitions
- Interactive counter animations on statistics
- Instagram integration with brand colors
- Professional color scheme with green accent theme

### 📱 User Experience
- Animated statistics counters
- Hover effects and micro-interactions
- Mobile-first responsive design
- Clickable contact information (WhatsApp, Email, Maps)
- Social media integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gem-realstate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Docker Setup

You can also run the application using Docker:

1. Build the Docker image:
```bash
docker build -t gem-realstate .
```

2. Run the container:
```bash
docker run -p 6103:6103 gem-realstate
```

The app will be available at [http://localhost:6103](http://localhost:6103)

## 📁 Project Structure

```
gem-realstate/
├── public/
│   └── assests/
│       └── gemlogof.jpg          # Logo image
├── src/
│   ├── components/
│   │   ├── landing.js            # Landing page component
│   │   ├── BuyLand.js            # Buy land page
│   │   ├── SellLandForm.js       # Sell land form
│   │   ├── Navbar.js             # Navigation component
│   │   └── landingPageFooter.js  # Footer component
│   ├── style/
│   │   ├── landing.css           # Landing page styles
│   │   ├── BuyLand.css           # Buy land page styles
│   │   ├── SellLandForm.css      # Sell form styles
│   │   ├── Navbar.css            # Navigation styles
│   │   └── landingPageFooter.css # Footer styles
│   ├── App.js                    # Main app component
│   ├── index.css                 # Global styles & CSS variables
│   └── index.js                  # App entry point
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#10b981`
- **Dark Green**: `#047857`, `#065f46`
- **Light Green**: `#ecfdf5`, `#d1fae5`
- **Instagram Gradient**: `#833AB4` → `#C13584` → `#E1306C`
- **WhatsApp Green**: `#25D366`

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

## 📞 Contact Information

- **Phone/WhatsApp**: +91 98943 51011
- **Email**: Gemrealestate100@gmail.com
- **Instagram**: @gem_realestate_
- **Location**: 123 Nature Drive, Green Valley, CA 94041

## 🛠️ Built With

- **React** - Frontend framework
- **React Router** - Navigation
- **Lucide React** - Icon library
- **CSS3** - Styling with custom properties
- **Google Fonts** - Poppins typography

## 📦 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

## 🌟 Key Features Implementation

### Animated Statistics
- Counter animation from 0 to target value
- Intersection Observer for scroll-triggered animations
- Smooth easing functions

### Responsive Design
- Mobile-first approach
- Breakpoints: 375px, 480px, 768px, 1024px
- Flexible grid layouts

### Interactive Elements
- Clickable contact information
- Social media integration
- Hover effects and transitions
- Form validation

## 📱 Pages

1. **Landing Page** (`/`)
   - Hero section with call-to-action
   - Statistics showcase
   - Why Choose Us section
   - Client testimonials
   - Instagram section in footer

2. **Buy Land** (`/buy-land`)
   - Property listings
   - Filter and search functionality

3. **Sell Land** (`/sell-land`)
   - Multi-step form
   - Land type selection
   - Property details input
   - Success confirmation

## 🔗 Social Media

- Instagram: [https://instagram.com/gem_realestate_](https://instagram.com/gem_realestate_)
- WhatsApp: [https://wa.me/919894351011](https://wa.me/919894351011)

## 📄 License

This project is private and proprietary.

## 👥 Contact

For any inquiries, please reach out via:
- Email: Gemrealestate100@gmail.com
- WhatsApp: +91 98943 51011

---

**Built with 💚 by Gem Real Estate Team**
