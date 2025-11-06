# Wallet+ - Expense & Budget Tracker

## 🎯 Project Overview

**Wallet+** is a comprehensive, privacy-focused Progressive Web App (PWA) for tracking expenses, managing budgets, and achieving financial goals. The app works 100% offline with no servers, no tracking, and all data stored locally on your device.

### Key Features
- ✅ **Complete Offline Functionality** - Works without internet after installation
- ✅ **100% Private** - All data stored locally on your device only
- ✅ **No Authentication Required** - Simple, standalone app
- ✅ **PWA Ready** - Installable on Android/iOS devices
- ✅ **Modern UI/UX** - Dark theme with golden (#FF9500) accents
- ✅ **Zero Data Collection** - Complete privacy, no servers
- ✅ **Fast & Responsive** - Optimized for mobile devices
- ✅ **Input Sanitization** - Protected against malicious inputs

---

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **UI**: TailwindCSS (CDN)
- **Charts**: Recharts
- **Storage**: localStorage + IndexedDB (via service worker)
- **Storage**: Browser localStorage
- **PWA**: Service Worker + Web Manifest

### Project Structure
```
├── components/           # Reusable UI components
│   ├── icons/           # Custom SVG icons
│   ├── AddTransactionModal.tsx
│   ├── BottomNav.tsx
│   └── ... (30+ components)
├── screens/             # Main app screens
│   ├── HomeScreen.tsx
│   ├── TransactionsScreen.tsx
│   ├── CurrencySetupScreen.tsx (Enhanced onboarding)
│   └── ... (18 screens)
├── contexts/            # React Context providers
│   ├── SettingsContext.tsx
│   ├── SecurityContext.tsx (Balance visibility)
│   └── PrivacyContext.tsx
├── utils/               # Utility functions
│   ├── crypto.ts        # Cryptographic utilities (available for future use)
│   └── sanitize.ts      # Input sanitization (NEW)
├── public/
│   ├── sw.js            # Service Worker
│   ├── manifest.json    # PWA Manifest
│   ├── icons/           # App icons
│   └── privacy-policy.html
├── App.tsx              # Main app component
├── types.ts             # TypeScript definitions
├── constants.ts         # App constants
└── currencies.ts        # 150+ currencies
```

---

## 🔒 Security Features

### Data Storage
- **Local Storage**: All data stored in browser localStorage
- **Device Security**: Security depends on device-level protection
- **No Transmission**: Data never leaves your device
- **Backup/Export**: Users can backup data anytime

### Input Sanitization
- XSS prevention on all user inputs
- HTML entity encoding  
- Pattern-based dangerous content filtering
- Number validation for amounts
- Sanitization utilities in `utils/sanitize.ts`

### Privacy
- **No external requests** - 100% offline
- **No analytics** - Zero tracking
- **No cookies** - Only localStorage
- **No third-party tracking**
- **Transparent codebase**

### Best Practices for Users
- Use device password/PIN protection
- Keep browser and OS updated
- Don't share device with untrusted users
- Regular data backups recommended

---

## 🎨 Design System

### Color Palette
- **Primary**: #FF9500 (Golden Orange)
- **Dark 900**: #0F0F0F (Background)
- **Dark 800**: #1A1A1A (Cards)
- **Dark 700**: #2A2A2A (Borders)
- **Light 900**: #F5F5F5 (Text)
- **Light 800**: #A0A0A0 (Secondary Text)

### Typography
- System font stack for performance
- Responsive sizing (14px on mobile)
- Clear hierarchy

### Animations
- Fade-in, slide-down, scale-up
- Golden accent glows
- Smooth transitions
- Performance-optimized

---

## 📱 PWA Configuration

### Manifest (manifest.json)
- App name, icons, theme colors
- Standalone display mode
- Offline-enabled flag
- Shortcuts for quick actions
- Screenshots for app stores

### Service Worker (sw.js)
- **Cache-first** for static assets
- **Network-first** for navigation
- Versioned cache management
- Offline fallback support
- Asset caching for instant load

### Installation
Users can install from:
- Chrome: "Add to Home Screen"
- Safari: Share → "Add to Home Screen"
- Edge: Install icon in address bar

---

## 🚀 Deployment

### Replit Deployment
```bash
# Already configured via .replit
# Click "Deploy" button in Replit
```

### Configuration
- **Port**: 5000 (frontend)
- **Host**: 0.0.0.0
- **Allowed Hosts**: true (for Replit proxy)
- **Build Command**: `npm run build`
- **Start Command**: `npx vite preview --port 5000 --host`

### Environment Variables
None required! App works standalone.

---

## 📦 App Store Submission

### Status: Ready for Submission ✅

See [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) for complete instructions.

**Quick Summary:**
1. Deploy on Replit
2. Use PWABuilder.com to generate packages
3. Submit to Google Play Store (Android)
4. Submit to Apple App Store (iOS)

**Required Assets:** ✅ All created
- App icon (512x512)
- Privacy policy
- Store description
- Screenshots (user must capture)

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Install PWA on mobile device
- [ ] Test all features offline
- [ ] Verify data persistence
- [ ] Verify data persistence works
- [ ] Test backup/restore
- [ ] Verify onboarding flow
- [ ] Test all screens/features
- [ ] Check responsiveness

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: 90+
- Offline: 100% functional

---

## 📊 Data Models

### Main Data Types
- `Transaction`: Income/expense records
- `Account`: Financial accounts
- `Budget`: Monthly budgets by category
- `Goal`: Savings goals with progress
- `Subscription`: Recurring subscriptions
- `Debt`: Loans and debts to track
- `Product`: Warranty tracking
- All data types in `types.ts`

### Storage Strategy
- **Main Data**: localStorage (`appData` key)
- **Settings**: localStorage (individual keys)
- **Settings**: localStorage (individual keys)
- **Service Worker Cache**: Static assets

---

## 🔧 Development

### Setup
```bash
npm install
npm run dev
```

### Key Commands
- `npm run dev` - Start dev server (port 5000)
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Adding Features
1. Create component in `components/` or `screens/`
2. Import into `App.tsx`
3. Add to navigation if needed
4. Update types in `types.ts`
5. Test offline functionality

---

## 🎯 Roadmap & Future Enhancements

### Phase 1 (Current) ✅
- Core expense tracking
- Budget management
- Goals and savings
- Offline functionality
- Data privacy and local storage
- Modern onboarding
- PWA ready

### Phase 2 (Future)
- Multi-currency support improvements
- Advanced analytics
- Data export formats (CSV, PDF)
- Cloud backup (optional)
- Recurring transaction automation
- Receipt scanning

### Phase 3 (Future)
- Financial insights and recommendations
- Budget forecasting
- Bill payment reminders
- Investment tracking
- Collaborative budgets

---

## 📝 User Guide Highlights

### Getting Started
1. Select your currency (one-time setup)
2. Add your accounts (optional)
3. Start tracking transactions
4. Set budgets and goals
5. Monitor your progress

### Key Workflows
- **Add Transaction**: Bottom-right FAB button
- **View Analysis**: Charts screen (3rd tab)
- **Set Budget**: Settings → Budgets
- **Track Goal**: Goals screen (4th tab)
- **Backup Data**: Settings → Export Data

### Privacy Features
- **Hide Balances**: Eye icon toggle
- **Export Data**: Full backup anytime
- **Reset Data**: Complete wipe option
- **Local Storage**: All data on device

---

## 🐛 Known Issues & Limitations

### Current Limitations
- Browser-only (modern browser required)
- Single device (no cloud sync)
- Manual transaction entry (no bank linking)
- No collaborative features

### Browser Requirements
- Modern browser with:
  - Modern JavaScript APIs
  - Service Workers
  - localStorage
  - ES2022 support

---

## 📞 Support & Maintenance

### Updates
- Monitor for security updates
- Keep dependencies current
- Test on new OS versions
- Respond to user feedback

### Common User Issues
1. **Data lost**: Emphasize backup feature
2. **Slow performance**: Clear browser cache
3. **Install issues**: Check HTTPS requirement
4. **Offline not working**: Reinstall PWA

---

## 🏆 Key Achievements

- ✅ 100% offline functionality
- ✅ Local-first data storage
- ✅ Zero data collection/tracking
- ✅ Modern, accessible UI
- ✅ Fast and responsive
- ✅ App store ready
- ✅ Privacy-first design
- ✅ No dependencies on external services

---

## 📄 License & Credits

### License
Proprietary - All rights reserved

### Technologies
- React (Meta)
- Vite (Evan You)
- TypeScript (Microsoft)
- TailwindCSS (Tailwind Labs)
- Recharts (Recharts Team)

---

## 🎓 Learning Resources

### For Developers
- localStorage API: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- PWA Guide: [web.dev/pwa](https://web.dev/progressive-web-apps/)
- Service Workers: [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Last Updated**: November 6, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
