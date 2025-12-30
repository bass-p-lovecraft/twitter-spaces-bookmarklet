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

const inputs = {}
for (const action in storageKeys) {
  inputs[action] = document.getElementById(action)
  inputs[action].onkeydown = (e) => {
    e.preventDefault()
    inputs[action].value =
      e.key === " "
        ? "Space"
        : e.key.length === 1
        ? e.key.toUpperCase()
        : inputs[action].value
  }
}

let savedKeys = {}

async function loadKeys() {
  const items = await chrome.storage.sync.get(Object.values(storageKeys))
  for (const action in storageKeys) {
    const val = items[storageKeys[action]]
    savedKeys[action] = val === " " ? " " : val || ""
    inputs[action].value =
      savedKeys[action] === " " ? "Space" : savedKeys[action]
  }
}

loadKeys()

document.querySelector(".cancel").onclick = () => window.close()

document.querySelector(".save").onclick = async () => {
  const used = {}
  for (const a in inputs) {
    let v = inputs[a].value.trim()
    if (v === "Space") v = " "
    else if (v.length === 1) v = v.toUpperCase()
    else v = ""
    if (v && used[v]) {
      alert(`Duplicate "${v === " " ? "Space" : v}"!`)
      return
    }
    used[v] = true
  }
  for (const a in inputs) {
    let v = inputs[a].value.trim()
    if (v === "Space") v = " "
    else if (v.length === 1) v = v.toUpperCase()
    else v = ""
    if (v !== savedKeys[a]) {
      await chrome.storage.sync.set({ [storageKeys[a]]: v })
    }
  }
  window.close()
}
