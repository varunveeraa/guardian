# Safety Shield Browser Extension

A friendly browser extension designed to protect elderly users from dangerous websites and email scams.

## Iteration 1 Features

### 🛡️ Website Warning Demonstration
- Click the extension icon on any website
- Use the "Test the Warning Screen" button to see how dangerous sites would be blocked
- Big, clear warning overlay with easy-to-understand messaging

### 📧 Gmail Email Reader
- When on Gmail with an email open, the extension popup shows the email content
- Basic safety analysis of email content
- Helpful tips for identifying suspicious emails

## Installation for Testing

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Icon Files**
   - Open `public/icons/create-icons.html` in your browser
   - Download the generated icon files to the `public/icons/` directory
   - You need: icon-16.png, icon-32.png, icon-48.png, icon-128.png
   - And the safety variants: icon-safe-*.png, icon-warning-*.png, icon-danger-*.png

3. **Build for Chrome**
   ```bash
   npm run build:extension:chrome
   ```
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

4. **Build for Firefox**
   ```bash
   npm run build:extension:firefox
   ```
   - Open Firefox and go to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `dist` folder

## Testing the Extension

### Test Website Warning
1. Visit any website
2. Click the Safety Shield extension icon
3. Click "Test the Warning Screen" button
4. You should see a full-page red warning overlay
5. Click "Go Back to Safety" to return

### Test Gmail Integration
1. Go to Gmail (mail.google.com)
2. Open any email
3. Click the Safety Shield extension icon
4. The popup should show the email content and safety analysis

## Project Structure

```
public/
├── manifest.json          # Extension manifest
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup logic
├── content-script.js     # Main content script
├── content-script.css    # Content script styles
├── gmail-content.js      # Gmail-specific content script
├── background.js         # Background service worker
├── warning-overlay.html  # Warning page template
└── icons/               # Extension icons

src/                     # Original React app (not used in extension)
```

## Development Notes

- The extension uses Manifest V3 for modern browser compatibility
- Elderly-friendly design with large fonts and clear colors
- Context-aware popup that changes based on the current website
- Basic safety analysis (will be enhanced in future iterations)

## Next Steps (Future Iterations)

- Real-time threat database integration
- Advanced email scam detection
- Automatic blocking of known dangerous sites
- Family member notification system
- Enhanced accessibility features
