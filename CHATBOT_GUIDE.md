# SheNergy Assist - Chatbot UI Guide

## Overview
SheNergy Assist is a modern, futuristic AI-powered chatbot UI for the vehicle service platform. It features a sleek side panel that slides in from the right and collapses into a glowing floating circle when minimized.

## 🎨 Design System

### Color Palette
- **Primary Dark**: `#0A1A2F` - Main background
- **Electric Blue**: `#00E5FF` - Primary accent (bot messages, highlights)
- **Neon Green**: `#00FF9D` - Success states, confirmations
- **Electric Cyan**: `#54FFFF` - Secondary accent
- **Warning Yellow**: `#FFE066` - Alerts, warnings
- **Card Dark**: `#1a2f4f` - Card backgrounds

### Typography
- **Font Family**: Inter, Poppins, or SF Pro (sans-serif)
- **Headings**: Bold, 18-24px
- **Body Text**: Regular, 14-16px
- **Small Text**: 12px, gray-400 color

### Visual Effects
- **Glow**: Neon glow on buttons, cards, and FAB
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur
- **Rounded Corners**: 12-20px border radius
- **Shadows**: Soft shadows with glow effects

## 📱 Component Structure

### 1. Floating Action Button (FAB)
**Location**: Bottom-right corner (fixed position)
**Size**: 64px diameter
**Features**:
- Electric blue neon outer ring
- Pulsing glow animation
- MessageCircle icon inside
- Hover effect: brighter neon ring
- Click: expands chatbot panel

```tsx
<button className="fixed bottom-6 right-6 w-16 h-16 rounded-full 
  bg-gradient-to-br from-electric-blue to-electric-cyan 
  shadow-lg hover:shadow-glow animate-pulse">
  <MessageCircle className="w-8 h-8 text-primary-dark" />
</button>
```

### 2. Chatbot Panel
**Width**: 360-420px (responsive on mobile)
**Position**: Right side overlay
**Animation**: Slide-in from right (0.4s)

#### Top Bar
- Bot name: "SheNergy Assist"
- Status: "Always online"
- Glowing profile icon (electric blue)
- Close button (X)

#### Chat Window
- Auto-scrolling message list
- Bot bubbles: Electric blue glow, left-aligned
- User bubbles: Neon green, right-aligned
- Timestamps: Small gray text
- Smooth message animations

#### Quick Reply Chips
- Horizontal scrollable buttons
- Chip style with border
- Hover glow effect
- Options:
  - "Book a Service"
  - "Check Predictive Report"
  - "Fastest Dealership"
  - "Is it safe to drive?"

#### Message Input
- Rounded text box
- Send button with paper plane icon
- Glow on focus
- Placeholder: "Type a message..."

### 3. Predictive Maintenance Card
**Trigger**: User selects "Check Predictive Report"

**Layout**:
- Alert icon + title
- Vehicle info (2024 Tata Nexon EV)
- Component status cards:
  - 🛑 Brake Pads (warning yellow)
  - 🔋 Battery Health (electric blue)
  - ⚙️ Engine (neon green)
- "Book Service Now" button

**Styling**:
- Dark glossy card
- Warning yellow border
- Component cards with colored borders

### 4. Dealership Ranking List
**Trigger**: User selects "Fastest Dealership"

**Card Layout** (per dealership):
- Name (bold)
- Distance with MapPin icon
- Status badge (Ready/Delay)
- Availability text
- "Select & Continue" button

**Status Colors**:
- Ready: Neon green badge
- Delay: Warning yellow badge

**Example Data**:
```
1. Bangalore EV Service Center
   2.3 km | Ready | All parts ready

2. Whitefield Tata Service
   5.1 km | Delay | Delay: 2 days

3. Koramangala Auto Care
   8.7 km | Ready | All parts ready
```

### 5. Appointment Scheduler
**Trigger**: User selects a dealership

**Components**:
- Date selector (pill-style buttons)
- Time selector (pill-style buttons)
- Parts availability indicator
- "Confirm Appointment" button

**Features**:
- Glowing selected state
- Hover effects on buttons
- Green checkmark for "All parts ready"

### 6. Confirmation Card
**Trigger**: User confirms appointment

**Layout**:
- Large green checkmark (animated bounce)
- "Appointment Confirmed!" heading
- Appointment details:
  - Date & Time
  - Service Center
  - Service Type
- QR code box
- "Add to Calendar" button

**Styling**:
- Neon green glow
- Centered layout
- Bouncing checkmark animation

## 🎬 Animations

### Slide-In Animation
```css
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Pulse Glow Animation
```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 229, 255, 0.8);
  }
}
```

### Bounce Animation
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

## 🔄 User Flow

1. **Initial State**
   - FAB visible in bottom-right
   - Pulsing glow animation

2. **Open Chatbot**
   - Click FAB
   - Panel slides in from right
   - Overlay appears
   - Initial bot message displayed

3. **Quick Reply**
   - User clicks quick reply chip
   - Message added to chat
   - Relevant component appears

4. **Predictive Report Flow**
   - Maintenance card shown
   - User can book service

5. **Dealership Selection Flow**
   - Dealership list shown
   - User selects dealership
   - Scheduler appears

6. **Appointment Booking Flow**
   - Select date and time
   - Confirm appointment
   - Confirmation card with QR code

7. **Close Chatbot**
   - Click X or overlay
   - Panel slides out
   - FAB reappears

## 📦 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── SheNergyAssist.tsx (Main chatbot component)
│   ├── app/
│   │   └── customer/
│   │       └── chat/
│   │           └── page.tsx (Chat page)
│   └── styles/
│       └── globals.css (Animations)
```

## 🚀 Usage

### Import in any page:
```tsx
import SheNergyAssist from '@/components/SheNergyAssist'

export default function Page() {
  return (
    <div>
      {/* Your content */}
      <SheNergyAssist />
    </div>
  )
}
```

### Features:
- ✅ Fully responsive (mobile & desktop)
- ✅ Smooth animations
- ✅ Dark theme with neon accents
- ✅ Interactive chat flow
- ✅ Predictive maintenance display
- ✅ Dealership ranking
- ✅ Appointment scheduling
- ✅ Confirmation with QR code

## 🎯 Key Features

1. **Floating Action Button**
   - Always visible
   - Pulsing glow
   - Smooth expand/collapse

2. **Chat Interface**
   - Real-time messaging
   - Auto-scroll
   - Timestamps
   - Bot & user bubbles

3. **Quick Replies**
   - Pre-defined actions
   - Smooth animations
   - Context-aware

4. **Predictive Maintenance**
   - Vehicle health overview
   - Component status
   - Booking integration

5. **Dealership Finder**
   - Distance-based ranking
   - Availability status
   - Quick selection

6. **Appointment Scheduler**
   - Date/time selection
   - Parts availability check
   - Confirmation flow

7. **Confirmation Card**
   - QR code generation
   - Calendar integration
   - Appointment summary

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to modify color values:
```js
colors: {
  'electric-blue': '#00E5FF',
  'neon-green': '#00FF9D',
  // ... etc
}
```

### Adjust Panel Width
In `SheNergyAssist.tsx`:
```tsx
<div className="w-full md:w-96"> {/* Change w-96 to desired width */}
```

### Modify Messages
Update the initial message in the `useState`:
```tsx
const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    type: 'bot',
    content: 'Your custom message here',
    timestamp: new Date(),
  },
])
```

## 📱 Responsive Design

- **Mobile**: Full-width panel
- **Tablet**: 360px width
- **Desktop**: 420px width

## ✨ Best Practices

1. Keep messages concise
2. Use quick replies for common actions
3. Provide clear call-to-action buttons
4. Maintain consistent branding
5. Test on multiple devices
6. Monitor performance with animations

## 🔗 Integration Points

- Connect to backend API for real messages
- Integrate with appointment booking system
- Link to dealership database
- Connect to vehicle health monitoring
- Add calendar integration for "Add to Calendar"

---

**Version**: 1.0
**Last Updated**: November 29, 2024
**Status**: Production Ready
