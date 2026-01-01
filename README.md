# X Spaces Hotkeys - Browser Extension Installation Guide

 <img width="627" height="635" alt="Screenshot 2026-01-01 at 7 00 12 AM" src="https://github.com/user-attachments/assets/71b4998d-714b-4691-a595-25317e0c1d91" />

A Chrome extension that adds configurable keyboard shortcuts to X/Twitter Spaces for faster control during live audio conversations.
 
## Features

- **Custom hotkeys** for:
  - Toggle Mute/Unmute (or Request to Speak)
  - 11 emoji reactions (😂 😲 😢 💜 💯 👏 ✊ 👍 👎 👋 ✋)
- Clean popup interface for quick key assignment
- Visual emoji icons with dedicated input fields
- Duplicate key detection
- Persistent storage across browser sessions
- Rate limit toast notifications
- Works instantly on all X Spaces
- Default keyboard shortcut: `Ctrl+Shift+K` (Windows/Linux) or `Cmd+Shift+K` (Mac) to open settings

## Installation

### Step 1: Download the Extension Files
<img width="1327" height="480" alt="Screenshot 2026-01-01 at 7 11 23 AM" src="https://github.com/user-attachments/assets/9cc94bfc-2660-45d2-bca2-bbc96289b906" />

You'll need these files from the repository:
- [manifest.json](manifest.json)
- [content.js](content.js)
- [popup.html](popup.html)
- [popup.js](popup.js)
- [icon.png](icon.png)

**Option B: Download Individual Files**
1. Create a new folder on your computer called `x-spaces-hotkeys`
2. Download each file above and save them all in that folder

### Step 2: Load the Extension in Chrome
<img width="1866" height="432" alt="Screenshot 2026-01-01 at 7 15 47 AM" src="https://github.com/user-attachments/assets/bdadde4c-49de-4fc5-b98a-2f5b29657951" />

1. Open X App, Chrome, Brave, Edge
2. Navigate to `<your browser>://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the folder containing the extension files (`twitter-browser-extension`)
6. The extension should now appear in your extensions list

### Step 3: Pin the Extension (Optional)

1. Click the puzzle piece icon in Chrome's toolbar
2. Find "X Spaces Hotkeys" in the list
3. Click the pin icon to keep it visible in your toolbar

## How to Use

### Initial Setup

1. Join or host a Space on [x.com](https://x.com)
2. Click the **X Spaces Hotkeys** extension icon in your toolbar
3. A popup will appear showing the configuration interface

### Configuring Shortcuts

1. Click in any input field
2. Press the key you want to assign (e.g., press `M` for the mute button)
3. For the spacebar, the input will show "Space"
4. Repeat for each action you want a shortcut for
5. Click **Save & Close** when finished

**Tips:**
- The extension will prevent you from assigning the same key twice
- Avoid keys that conflict with browser shortcuts (e.g., `T` opens a new tab)
- Recommended keys: `M` for mute, number keys `1-9` for reactions
- Leave any field blank if you don't want a shortcut for that action

### Using Your Shortcuts

Once configured, simply press your assigned keys while in a Space:
- Your shortcuts work immediately without needing to click anything
- Emoji reactions will automatically open the reactions tray and select the emoji
- The mute/speak toggle works instantly
- Shortcuts are disabled when typing in input fields or text areas

### Rate Limit Protection

If you request to speak too frequently, X may rate limit you. The extension will:
- Detect 429 (Too Many Requests) responses from X's API
- Show a toast notification: "X responded with too many requests to speak. Wait a few minutes and request again."
- The toast appears at the bottom center of your screen

## Compatibility

- **Browser:** Chrome, Edge, Brave, Browser Installed X App and other Chromium-based browsers
- **Platform:** Desktop only (Windows, Mac, Linux)
- **Tested:** December 2024 on x.com and twitter.com
- **Adaptive:** Automatically adjusts to X's UI changes

## Troubleshooting

### Extension Not Working

1. **Reload the extension:**
   - Go to `<your browser>://extensions/`
   - Click the refresh icon on the X Spaces Hotkeys extension
   - Reload the X Spaces page

2. **Check Developer Console:**
   - Press `F12` to open DevTools
   - Look for messages starting with `[X Spaces Hotkeys]`
   - Report any errors in a GitHub issue

3. **Verify you're on x.com or twitter.com:**
   - The extension only runs on these domains

### Shortcuts Not Responding

1. **Make sure you're not typing in an input field**
   - Shortcuts are disabled when typing in text boxes

2. **Verify buttons exist on the page:**
   - The extension needs the mute/speak and reaction buttons to be visible
   - Join or host a Space first

3. **Check your configuration:**
   - Click the extension icon to verify your keys are saved
   - Try different keys if some don't work

### Can't Find Buttons

The extension automatically searches for buttons using multiple selectors. If it can't find them:
- X may have updated their UI
- Open a GitHub issue with details
- Check the browser console for warnings

## Updating the Extension

When updates are available:

1. Download the latest files from the repository
2. Replace the old files in your extension folder
3. Go to `<your browser>://extensions/`
4. Click the refresh icon on the X Spaces Hotkeys extension
5. Your settings are preserved (stored in Chrome's sync storage)

## Uninstalling

1. Go to `<your browser>://extensions/`
2. Find "X Spaces Hotkeys"
3. Click **Remove**
4. Your hotkey settings will be deleted from Chrome storage

## Privacy

This extension:
- **Does not collect any data**
- **Does not send any information to external servers**
- Only stores your hotkey preferences in Chrome's local storage
- Only runs on x.com and twitter.com domains
- Source code is fully available for inspection

## Differences from Bookmarklet Version

| Feature | Chrome Extension | Bookmarklet |
|---------|-----------------|-------------|
| **Installation** | One-time setup | Must click on every page load |
| **Persistence** | Always active on X | Manual activation required |
| **Storage** | Chrome sync storage | localStorage |
| **Updates** | Manual file replacement | Copy/paste new code |
| **Configuration UI** | Popup accessible anytime | Shows on activation |
 

## Source Code

All extension files are available in this repository:
- [manifest.json](manifest.json) - Extension metadata and permissions
- [content.js](content.js) - Main functionality and keyboard handling
- [popup.html](popup.html) - Configuration UI structure
- [popup.js](popup.js) - Configuration UI logic
- [icon.png](icon.png) - Extension icon

## Contributing

Found a bug or want to suggest an improvement?
1. Open an issue on GitHub
2. Submit a pull request
3. Include details about your browser and X's current UI

## License

MIT License - feel free to use, modify, and share.

---

**Made for X Spaces enthusiasts who want faster control during live conversations.**
