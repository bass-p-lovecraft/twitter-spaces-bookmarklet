javascript: (function () {
  try {
    const storageKeys = {
      toggleSpeak: "xSpaceToggleSpeakKey",
      laugh: "xSpaceLaughKey",
      astonished: "xSpaceAstonishedKey",
      cry: "xSpaceCryKey",
      purple: "xSpacePurpleKey",
      hundred: "xSpaceHundredKey",
      clap: "xSpaceClapKey",
      fist: "xSpaceFistKey",
      thumbsup: "xSpaceThumbsUpKey",
      thumbsdown: "xSpaceThumbsDownKey",
      wave: "xSpaceWaveKey",
      raisehand: "xSpaceRaiseHandKey",
    }
    let savedKeys = {}
    for (const action in storageKeys) {
      const val = localStorage.getItem(storageKeys[action])
      savedKeys[action] = val === " " ? " " : val || ""
    }
    let toggleSpeakBtn = document.querySelector(
      'button[aria-label*="Request"],button[aria-label*="Mute"],button[aria-label*="Unmute"],button[data-testid="micButton"]'
    )
    let reactBtn = document.querySelector(
      'button[aria-label="React"][role="button"],button[data-testid="reactionsButton"],button[aria-label*="React"]'
    )
    const findButtons = () => {
      toggleSpeakBtn = document.querySelector(
        'button[aria-label*="Request"],button[aria-label*="Mute"],button[aria-label*="Unmute"],button[data-testid="micButton"]'
      )
      reactBtn = document.querySelector(
        'button[aria-label="React"][role="button"],button[data-testid="reactionsButton"],button[aria-label*="React"]'
      )
    }
    document.addEventListener("visibilitychange", findButtons)
    new MutationObserver(findButtons).observe(document.body, {
      childList: true,
      subtree: true,
    })
    const toast = document.createElement("div")
    toast.style.cssText =
      "position:fixed;bottom:120px;left:50%;transform:translateX(-50%);background:#ff3b30;color:#fff;padding:16px 24px;border-radius:12px;font-size:16px;font-weight:600;z-index:10000;max-width:90%;box-shadow:0 4px 12px rgba(0,0,0,0.3);opacity:0;transition:opacity 0.4s;pointer-events:none;text-align:center;"
    function showToast(msg) {
      toast.textContent = msg
      document.body.appendChild(toast)
      setTimeout(() => (toast.style.opacity = "1"), 100)
      setTimeout(() => {
        toast.style.opacity = "0"
        setTimeout(() => toast.remove(), 400)
      }, 5000)
    }
    const origFetch = window.fetch
    window.fetch = async (...args) => {
      const response = await origFetch(...args)
      if (response.status === 429) {
        const url = args[0]
        if (typeof url === "string" && url.includes("graphql")) {
          try {
            const cloned = response.clone()
            const data = await cloned.json()
            if (
              data.errors?.some(
                (e) =>
                  e.message?.includes("speak") ||
                  e.message?.includes("AudioSpace")
              )
            ) {
              showToast(
                "X responded with too many requests to speak. Wait a few minutes and request again."
              )
            }
          } catch {}
        }
      }
      return response
    }
    const overlay = document.createElement("div")
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
    const popup = document.createElement("div")
    popup.style.cssText =
      "background:#fff;padding:24px;border-radius:16px;width:90%;max-width:500px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 50px rgba(0,0,0,0.3);"
    const title = document.createElement("h2")
    title.textContent = "X Spaces Hotkeys"
    title.style.cssText =
      "margin:0 0 20px;font-size:22px;font-weight:700;text-align:center;"
    popup.appendChild(title)
    const muteWrapper = document.createElement("div")
    muteWrapper.style.cssText =
      "display:flex;justify-content:center;margin-bottom:24px;"
    const muteCell = document.createElement("div")
    muteCell.style.cssText =
      "display:flex;flex-direction:column;align-items:center;gap:8px;"
    const muteIcon = document.createElement("span")
    muteIcon.textContent = "🎤"
    muteIcon.style.fontSize = "32px"
    const muteLabel = document.createElement("div")
    muteLabel.textContent = "Mute / Speak"
    muteLabel.style.fontSize = "16px"
    muteLabel.style.fontWeight = "600"
    const muteInput = document.createElement("input")
    muteInput.type = "text"
    muteInput.placeholder = "-"
    muteInput.style.cssText =
      "width:80px;padding:10px;font-size:18px;text-align:center;border:1px solid #ddd;border-radius:8px;"
    muteInput.value =
      savedKeys.toggleSpeak === " " ? "Space" : savedKeys.toggleSpeak || ""
    muteInput.onkeydown = (e) => {
      e.preventDefault()
      muteInput.value =
        e.key === " "
          ? "Space"
          : e.key.length === 1
          ? e.key.toUpperCase()
          : muteInput.value
    }
    muteCell.appendChild(muteIcon)
    muteCell.appendChild(muteLabel)
    muteCell.appendChild(muteInput)
    muteWrapper.appendChild(muteCell)
    popup.appendChild(muteWrapper)
    const grid = document.createElement("div")
    grid.style.cssText =
      "display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;"
    const emojiActions = [
      { action: "laugh", emoji: "😂" },
      { action: "astonished", emoji: "😲" },
      { action: "cry", emoji: "😢" },
      { action: "purple", emoji: "💜" },
      { action: "hundred", emoji: "💯" },
      { action: "clap", emoji: "👏" },
      { action: "fist", emoji: "✊" },
      { action: "thumbsup", emoji: "👍" },
      { action: "thumbsdown", emoji: "👎" },
      { action: "wave", emoji: "👋" },
      { action: "raisehand", emoji: "✋" },
    ]
    const inputs = { toggleSpeak: muteInput }
    emojiActions.forEach((item) => {
      const cell = document.createElement("div")
      cell.style.cssText =
        "display:flex;flex-direction:column;align-items:center;gap:8px;"
      const span = document.createElement("span")
      span.textContent = item.emoji
      span.style.fontSize = "32px"
      const input = document.createElement("input")
      input.type = "text"
      input.placeholder = "-"
      input.style.cssText =
        "width:50px;padding:8px 4px;font-size:18px;text-align:center;border:1px solid #ddd;border-radius:8px;"
      input.value =
        savedKeys[item.action] === " " ? "Space" : savedKeys[item.action] || ""
      input.onkeydown = (e) => {
        e.preventDefault()
        input.value =
          e.key === " "
            ? "Space"
            : e.key.length === 1
            ? e.key.toUpperCase()
            : input.value
      }
      inputs[item.action] = input
      cell.appendChild(span)
      cell.appendChild(input)
      grid.appendChild(cell)
    })
    popup.appendChild(grid)
    const btns = document.createElement("div")
    btns.style.cssText =
      "display:flex;gap:12px;justify-content:flex-end;margin-top:20px;"
    const cancel = document.createElement("button")
    cancel.textContent = "Cancel"
    cancel.style.cssText =
      "padding:10px 20px;border:1px solid #ddd;border-radius:999px;background:transparent;cursor:pointer;"
    cancel.onclick = () => document.body.removeChild(overlay)
    const save = document.createElement("button")
    save.textContent = "Save & Close"
    save.style.cssText =
      "padding:10px 24px;background:#000;color:#fff;border:none;border-radius:999px;cursor:pointer;font-weight:600;"
    save.onclick = () => {
      const used = {}
      for (const a in inputs) {
        let v = inputs[a].value.trim()
        if (v === "Space") v = " "
        if (v && used[v]) {
          alert(`Duplicate "${v === " " ? "Space" : v}"!`)
          return
        }
        used[v] = true
      }
      for (const a in inputs) {
        let v = inputs[a].value.trim()
        if (v === "Space") v = " "
        localStorage.setItem(storageKeys[a], v || "")
        savedKeys[a] = v
      }
      document.body.removeChild(overlay)
      findButtons()
      setupListener()
    }
    btns.appendChild(cancel)
    btns.appendChild(save)
    popup.appendChild(btns)
    overlay.appendChild(popup)
    document.body.appendChild(overlay)
    overlay.onclick = (e) =>
      e.target === overlay && document.body.removeChild(overlay)
    function setupListener() {
      document.removeEventListener("keydown", handler)
      document.addEventListener("keydown", handler)
      function handler(e) {
        if (e.target.tagName === "INPUT" || e.target.isContentEditable) return
        const k = e.key.toUpperCase()
        const s = e.code === "Space"
        for (const a in savedKeys) {
          const v = savedKeys[a]
          if (!v) continue
          if ((s && v === " ") || k === v.toUpperCase()) {
            if (v === " ") e.preventDefault()
            if (a === "toggleSpeak") {
              toggleSpeakBtn?.click()
              return
            }
            reactBtn?.click?.()
            const map = {
              laugh: "😂",
              astonished: "😲",
              cry: "😢",
              purple: "💜",
              hundred: "💯",
              clap: "👏",
              fist: "✊",
              thumbsup: "👍",
              thumbsdown: "👎",
              wave: "👋",
              raisehand: "✋",
            }
            const t = map[a]
            const existing = Array.from(
              document.querySelectorAll("button[aria-label]")
            ).find((b) => b.getAttribute("aria-label")?.includes(t))
            if (existing) {
              existing.click()
              return
            }
            const obs = new MutationObserver(() => {
              const b = Array.from(
                document.querySelectorAll("button[aria-label]")
              ).find((x) => x.getAttribute("aria-label")?.includes(t))
              if (b) {
                b.click()
                obs.disconnect()
              }
            })
            obs.observe(document.body, { childList: true, subtree: true })
            setTimeout(() => obs.disconnect(), 3000)
            return
          }
        }
      }
    }
    setupListener()
  } catch (e) {
    alert("Error: " + e.message)
  }
})()
