# Testing X Spaces Hotkeys Extension

## Setup Instructions

1. **Reload the Extension**
   - Go to `chrome://extensions`
   - Find "X Spaces Hotkeys"
   - Click the reload icon (circular arrow)

2. **Test the Popup**
   - Click the extension icon in the Chrome toolbar
   - The popup should open showing:
     - Title: "X Spaces Hotkeys"
     - Microphone emoji (🎤) with "Mute / Speak" label
     - Grid of 11 emoji reactions with input fields
     - Cancel and "Save & Close" buttons

3. **Configure Hotkeys**
   - Click on any input field
   - Press a key (e.g., "8" for Mute/Speak, "1" for 😂, etc.)
   - The key will appear in the input field
   - Click "Save & Close"

4. **Test on X Spaces**
   - Go to an X Spaces page: `https://x.com/i/spaces/[space-id]`
   - Try pressing the hotkeys you configured
   - Check the browser console for debug logs

## How It Works

### Popup Flow
1. Click extension icon → popup.html opens
2. popup.js loads saved keys from `chrome.storage.sync`
3. User configures keys and clicks "Save & Close"
4. Keys are saved to `chrome.storage.sync`

### Content Script Flow
1. content.js loads on all x.com pages
2. Listens to `chrome.storage.onChanged` for updates
3. When hotkey is pressed:
   - Finds button using selectors
   - Clicks the button
   - Logs action to console

### Storage Keys
All settings are stored in `chrome.storage.sync` with these keys:
- `xSpaceToggleSpeakKey` - Mute/Speak toggle
- `xSpaceLaughKey` - 😂 reaction
- `xSpaceAstonishedKey` - 😲 reaction
- `xSpaceCryKey` - 😢 reaction
- `xSpacePurpleKey` - 💜 reaction
- `xSpaceHundredKey` - 💯 reaction
- `xSpaceClapKey` - 👏 reaction
- `xSpaceFistKey` - ✊ reaction
- `xSpaceThumbsUpKey` - 👍 reaction
- `xSpaceThumbsDownKey` - 👎 reaction
- `xSpaceWaveKey` - 👋 reaction
- `xSpaceRaiseHandKey` - ✋ reaction

## Debugging

### Check Storage
Open console on any page and run:
```javascript
chrome.storage.sync.get(null, (items) => console.log(items))
```

### Check if Content Script Loaded
On an X Spaces page, check console for:
- `[X Spaces Hotkeys] Buttons refreshed: { toggleSpeakBtn: true/false, reactBtn: true/false }`

### Test Hotkey Trigger
Press a configured hotkey and check console for:
- `[X Spaces Hotkeys] Triggered: toggleSpeak with key 8`
- `[X Spaces Hotkeys] Mute/Speak button clicked`

## Common Issues

1. **Emojis showing as garbled text**
   - The HTML file now has `<meta charset="UTF-8">` to fix this
   - Reload the extension

2. **Hotkeys not working**
   - Check if content script loaded (see debugging above)
   - Verify buttons are found: look for console log with `toggleSpeakBtn: true`
   - Make sure you saved the hotkeys in the popup

3. **Popup not opening**
   - Verify manifest.json has `"default_popup": "popup.html"`
   - Reload the extension
   - Check for errors in chrome://extensions

## Keyboard Shortcut
You can also open the popup with:
- **Windows/Linux**: Ctrl+Shift+K
- **Mac**: Command+Shift+K
