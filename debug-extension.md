# Debug Safety Shield Extension

## Current Issue
The Gmail content script is loading ("Safety Shield content script loaded") but the popup is not receiving responses from it.

## Debugging Steps

### 1. Check Extension Loading
1. Go to `chrome://extensions/`
2. Click "Reload" on Safety Shield extension
3. Go to Gmail and refresh the page

### 2. Check Console Messages
Open Developer Tools (F12) and look for these messages:

**Expected in Gmail tab console:**
- `"Gmail Safety Shield content script loaded and ready"`
- `"Gmail content script message listeners set up"`

**Expected in Extension Popup console:**
- `"Loading email content for tab: [number]"`
- `"Testing Gmail content script connection..."`
- `"Ping response: {success: true, message: 'Gmail content script is working!'}"`
- `"Requesting email content..."`

### 3. Manual Test
In the Gmail tab console, try running:
```javascript
// Test if the content script is loaded
console.log('Testing content script...');

// Try to trigger the message handler directly
chrome.runtime.sendMessage({action: 'ping'}, (response) => {
    console.log('Direct ping response:', response);
});
```

### 4. Check Manifest Permissions
The extension needs these permissions for Gmail:
- `"https://mail.google.com/*"`
- `"https://gmail.com/*"`

### 5. Common Issues

**Issue: "Could not establish connection"**
- Content script not loaded
- Wrong URL pattern in manifest
- Extension needs reload

**Issue: No response from content script**
- Message listener not set up correctly
- Async response not handled properly
- Content script crashed

**Issue: "Gmail content script not responding"**
- Ping test failed
- Content script loaded but message handler broken

## Next Steps Based on Console Output

**If you see "Gmail Safety Shield content script loaded and ready":**
- Content script is loading correctly
- Issue is in message passing

**If you don't see the content script message:**
- Content script not injecting
- Check manifest.json content_scripts section
- Check if Gmail URL matches the patterns

**If ping fails:**
- Message passing system broken
- Check chrome.runtime.onMessage listener
- Check if sendResponse is being called

## Quick Fix Attempts

1. **Reload everything:**
   - Reload extension
   - Refresh Gmail page
   - Try again

2. **Check URL:**
   - Make sure you're on `mail.google.com` not `gmail.com`
   - Try both URLs

3. **Check email state:**
   - Make sure an email is actually open
   - Try different emails
   - Try different Gmail views (conversation vs single email)
