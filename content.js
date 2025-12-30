// X Spaces Hotkeys - Content Script
// This script runs on all x.com pages and handles keyboard shortcuts

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const STORAGE_KEYS = {
    toggleSpeak: 'xSpaceToggleSpeakKey',
    laugh: 'xSpaceLaughKey',
    astonished: 'xSpaceAstonishedKey',
    cry: 'xSpaceCryKey',
    purple: 'xSpacePurpleKey',
    hundred: 'xSpaceHundredKey',
    clap: 'xSpaceClapKey',
    fist: 'xSpaceFistKey',
    thumbsup: 'xSpaceThumbsUpKey',
    thumbsdown: 'xSpaceThumbsDownKey',
    wave: 'xSpaceWaveKey',
    raisehand: 'xSpaceRaiseHandKey'
  };

  const EMOJI_MAP = {
    laugh: '😂',
    astonished: '😲',
    cry: '😢',
    purple: '💜',
    hundred: '💯',
    clap: '👏',
    fist: '✊',
    thumbsup: '👍',
    thumbsdown: '👎',
    wave: '👋',
    raisehand: '✋'
  };

  const BUTTON_SELECTORS = {
    toggleSpeak: [
      'button[aria-label*="Mute"]',
      'button[aria-label*="Unmute"]',
      'button[aria-label*="mic"]',
      'button[aria-label*="Microphone"]',
      'button[aria-label*="Request"]',
      'button[aria-label*="Speak"]',
      'button[data-testid*="mic"]',
      'button[data-testid*="audio"]'
    ],
    react: [
      'button[aria-label*="React"]',
      'button[aria-label*="reaction"]',
      'button[aria-label*="heart"]',
      'button[aria-label*="emoji"]',
      'button[data-testid="reactionsButton"]'
    ]
  };

  // ============================================================================
  // STATE
  // ============================================================================

  const state = {
    savedKeys: {},
    toggleSpeakBtn: null,
    reactBtn: null,
    isInitialized: false
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function log(message, data) {
    if (data !== undefined) {
      console.log('[X Spaces Hotkeys]', message, data);
    } else {
      console.log('[X Spaces Hotkeys]', message);
    }
  }

  function warn(message, data) {
    if (data !== undefined) {
      console.warn('[X Spaces Hotkeys]', message, data);
    } else {
      console.warn('[X Spaces Hotkeys]', message);
    }
  }

  function error(message, err) {
    if (err !== undefined) {
      console.error('[X Spaces Hotkeys]', message, err);
    } else {
      console.error('[X Spaces Hotkeys]', message);
    }
  }

  // ============================================================================
  // BUTTON FINDING
  // ============================================================================

  function findButtonBySelectors(selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      try {
        const button = document.querySelector(selector);
        if (button) {
          return button;
        }
      } catch (err) {
        warn('Invalid selector:', selector);
      }
    }
    return null;
  }

  function findButtons() {
    const oldToggleSpeakBtn = state.toggleSpeakBtn;
    const oldReactBtn = state.reactBtn;

    state.toggleSpeakBtn = findButtonBySelectors(BUTTON_SELECTORS.toggleSpeak);
    state.reactBtn = findButtonBySelectors(BUTTON_SELECTORS.react);

    const toggleChanged = oldToggleSpeakBtn !== state.toggleSpeakBtn;
    const reactChanged = oldReactBtn !== state.reactBtn;

    if (toggleChanged || reactChanged) {
      log('Buttons updated:', {
        toggleSpeakBtn: state.toggleSpeakBtn !== null,
        reactBtn: state.reactBtn !== null
      });
    }
  }

  function startButtonWatcher() {
    // Find buttons immediately
    findButtons();

    // Watch for visibility changes
    document.addEventListener('visibilitychange', function() {
      log('Visibility changed, finding buttons...');
      findButtons();
    });

    // Watch for DOM mutations
    const observer = new MutationObserver(function() {
      findButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    log('Button watcher started');
  }

  // ============================================================================
  // STORAGE
  // ============================================================================

  function loadKeysFromStorage(callback) {
    const storageKeyValues = Object.values(STORAGE_KEYS);

    chrome.storage.sync.get(storageKeyValues, function(items) {
      if (chrome.runtime.lastError) {
        error('Failed to load keys from storage:', chrome.runtime.lastError);
        return;
      }

      log('Loaded storage items:', items);

      // Convert storage items to savedKeys format
      for (const action in STORAGE_KEYS) {
        if (STORAGE_KEYS.hasOwnProperty(action)) {
          const storageKey = STORAGE_KEYS[action];
          const value = items[storageKey];

          if (value === ' ') {
            state.savedKeys[action] = ' ';
          } else if (value && value.length > 0) {
            state.savedKeys[action] = value;
          } else {
            state.savedKeys[action] = '';
          }
        }
      }

      log('Configured hotkeys:', state.savedKeys);

      if (callback) {
        callback();
      }
    });
  }

  function handleStorageChange(changes, areaName) {
    if (areaName !== 'sync') {
      return;
    }

    log('Storage changed:', changes);

    let updated = false;

    for (const action in STORAGE_KEYS) {
      if (STORAGE_KEYS.hasOwnProperty(action)) {
        const storageKey = STORAGE_KEYS[action];

        if (changes.hasOwnProperty(storageKey)) {
          const change = changes[storageKey];
          const newValue = change.newValue;

          if (newValue === ' ') {
            state.savedKeys[action] = ' ';
          } else if (newValue && newValue.length > 0) {
            state.savedKeys[action] = newValue;
          } else {
            state.savedKeys[action] = '';
          }

          updated = true;
        }
      }
    }

    if (updated) {
      log('Updated hotkeys:', state.savedKeys);
    }
  }

  // ============================================================================
  // TOAST NOTIFICATIONS
  // ============================================================================

  function createToastElement() {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '120px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#ff3b30';
    toast.style.color = '#fff';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '16px';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '10000';
    toast.style.maxWidth = '90%';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s';
    toast.style.pointerEvents = 'none';
    toast.style.textAlign = 'center';
    return toast;
  }

  function showToast(message) {
    const toast = createToastElement();
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
      toast.style.opacity = '1';
    }, 100);

    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 5000);
  }

  // ============================================================================
  // RATE LIMIT DETECTION
  // ============================================================================

  function setupRateLimitDetection() {
    const originalFetch = window.fetch;

    window.fetch = function() {
      const args = arguments;

      return originalFetch.apply(this, args).then(function(response) {
        if (response.status === 429) {
          const url = args[0];

          if (typeof url === 'string' && url.indexOf('graphql') !== -1) {
            response.clone().json().then(function(data) {
              if (data.errors && Array.isArray(data.errors)) {
                for (let i = 0; i < data.errors.length; i++) {
                  const err = data.errors[i];
                  if (err.message &&
                      (err.message.indexOf('speak') !== -1 ||
                       err.message.indexOf('AudioSpace') !== -1)) {
                    showToast('X responded with too many requests to speak. Wait a few minutes and request again.');
                    break;
                  }
                }
              }
            }).catch(function() {
              // Ignore JSON parse errors
            });
          }
        }
        return response;
      });
    };

    log('Rate limit detection installed');
  }

  // ============================================================================
  // EMOJI REACTION HANDLING
  // ============================================================================

  function findEmojiButton(emoji, action) {
    // Try aria-label with emoji
    let selector = 'button[aria-label*="' + emoji + '"]';
    let button = document.querySelector(selector);
    if (button) {
      return button;
    }

    // Try aria-label with action name
    selector = 'button[aria-label*=":' + action + ':"]';
    button = document.querySelector(selector);
    if (button) {
      return button;
    }

    // Try searching through all buttons
    const allButtons = document.querySelectorAll('button');
    for (let i = 0; i < allButtons.length; i++) {
      const btn = allButtons[i];
      const textContent = btn.textContent || '';
      const innerHTML = btn.innerHTML || '';

      if (textContent.indexOf(emoji) !== -1 || innerHTML.indexOf(emoji) !== -1) {
        return btn;
      }
    }

    return null;
  }

  function clickEmojiReaction(action) {
    const emoji = EMOJI_MAP[action];

    if (!emoji) {
      warn('No emoji mapping for action:', action);
      return;
    }

    // First, try to find the emoji button (in case tray is already open)
    let emojiButton = findEmojiButton(emoji, action);

    if (emojiButton) {
      log('Found emoji button immediately:', emoji);
      emojiButton.click();
      return;
    }

    // Open the reactions tray
    if (!state.reactBtn) {
      warn('Reactions button not found!');
      return;
    }

    log('Opening reactions tray...');
    state.reactBtn.click();

    // Wait for tray to open and then find emoji button
    setTimeout(function() {
      emojiButton = findEmojiButton(emoji, action);

      if (emojiButton) {
        log('Clicked emoji reaction:', emoji);
        emojiButton.click();
      } else {
        warn('Emoji button not found after opening tray:', emoji);
      }
    }, 300);
  }

  // ============================================================================
  // KEYBOARD HANDLING
  // ============================================================================

  function handleKeyDown(event) {
    // Don't trigger if user is typing in an input
    const targetTag = event.target.tagName;
    if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
      return;
    }

    if (event.target.isContentEditable) {
      return;
    }

    const pressedKey = event.key.toUpperCase();
    const isSpaceKey = event.code === 'Space';

    log('Key pressed:', {
      key: event.key,
      code: event.code,
      pressedKey: pressedKey,
      isSpaceKey: isSpaceKey
    });

    // Check each configured action
    for (const action in state.savedKeys) {
      if (!state.savedKeys.hasOwnProperty(action)) {
        continue;
      }

      const configuredKey = state.savedKeys[action];

      // Skip if no key configured for this action
      if (!configuredKey || configuredKey.length === 0) {
        continue;
      }

      // Check if this key matches
      let keyMatches = false;

      if (configuredKey === ' ' && isSpaceKey) {
        keyMatches = true;
      } else if (configuredKey.toUpperCase() === pressedKey) {
        keyMatches = true;
      }

      if (!keyMatches) {
        continue;
      }

      // Prevent default for space key
      if (configuredKey === ' ') {
        event.preventDefault();
      }

      log('Hotkey matched! Action:', action);

      // Handle toggle speak
      if (action === 'toggleSpeak') {
        if (state.toggleSpeakBtn) {
          log('Clicking mute/speak button');
          state.toggleSpeakBtn.click();
        } else {
          warn('Mute/speak button not found!');
        }
        return;
      }

      // Handle emoji reactions
      clickEmojiReaction(action);
      return;
    }
  }

  function setupKeyboardListener() {
    document.addEventListener('keydown', handleKeyDown);
    log('Keyboard listener installed');
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  function initialize() {
    if (state.isInitialized) {
      warn('Already initialized, skipping...');
      return;
    }

    log('Initializing extension...');

    // Setup rate limit detection
    setupRateLimitDetection();

    // Start watching for buttons
    startButtonWatcher();

    // Setup keyboard listener
    setupKeyboardListener();

    // Setup storage change listener
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Load saved keys from storage
    loadKeysFromStorage(function() {
      state.isInitialized = true;
      log('Initialization complete!');
    });
  }

  // ============================================================================
  // START
  // ============================================================================

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
