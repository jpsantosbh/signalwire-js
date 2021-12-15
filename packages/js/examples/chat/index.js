import { __sw__PubSub } from '@signalwire/js'

window.connect = async ({ channels, host, token }) => {
  const chat = new __sw__PubSub.Chat({
    host,
    token,
  })

  chat.on('message', (args) => {
    const { message, channel, timestamp } = args
    const messageEl = document.createElement('div')
    messageEl.classList.add('message', 'bg-indigo-200', 'p-2')
    messageEl.innerHTML = `
      <div class="message-meta"><span class="font-bold">when</span>: ${timestamp}</div>
      <div class="message-body">${message}</div>
    `
    const channelEl = document.querySelector(
      `.chat-messages-channel-${channel}`
    )

    channelEl.appendChild(messageEl)
  })

  await chat.subscribe(channels)

  // UI Sample code.
  // --------------------------
  const messageEl = document.getElementById('message')
  const messagesContainerEl = document.getElementById('chat-messages')
  const formEl = document.getElementById('chat-box')
  const channelSelectorEl = document.getElementById('chat-channels-selector')

  window.disconnect = (channel) => {
    const el = document.querySelector(`.chat-messages-channel-${channel}`)
    el.classList.add('opacity-20', 'pointer-events-none')

    chat.unsubscribe(channel)
  }

  channels.forEach((channel) => {
    messagesContainerEl.insertAdjacentHTML(
      'beforeend',
      `<div
        class="chat-messages-channel-${channel} mt-6 px-4 py-5 bg-white space-y-6 sm:p-6"
       >
        <div class="font-bold">
          <button onclick="disconnect('${channel}')">Unsubscribe</button>
        </div>
        <p class="text-gray-700 text-xl font-extrabold tracking-tight mt-2">
          Channel: ${channel}
        </p>
      </div>`
    )
  })

  // Sets options for the channel selector.
  channelSelectorEl.innerHTML = channels
    .map((channel) => `<option value="${channel}">${channel}</option>`)
    .join('')

  formEl.addEventListener('submit', (e) => {
    e.preventDefault()

    const data = new FormData(formEl)

    chat.publish({
      channel: data.get('channel'),
      message: data.get('message'),
    })

    messageEl.value = ''
  })
}

// UI Initialization
// --------------------------
document.getElementById('host').value =
  localStorage.getItem('relay.chat.example.host') || ''
document.getElementById('token').value =
  localStorage.getItem('relay.chat.example.token') || ''

window.saveInLocalStorage = (e) => {
  const key = e.target.name || e.target.id
  localStorage.setItem('relay.chat.example.' + key, e.target.value)
}

const chatJoin = document.getElementById('chat-join')
const chatConnected = document.getElementById('chat-connected')
const chatConnectEl = document.getElementById('chat-connect')

chatConnectEl.addEventListener('submit', async (e) => {
  e.preventDefault()

  const data = new FormData(chatConnectEl)
  const channels = data
    .get('channel')
    .split(',')
    .filter((channel) => channel.trim())
    .map((channel) => channel.trim())

  if (channels.length === 0) {
    // TODO: show error message
    return
  }

  // TODO: add loading indicator and try/catch
  await window.connect({
    channels,
    host: data.get('host'),
    token: data.get('token'),
  })

  chatJoin.style.display = 'none'
  chatConnected.style.display = 'block'
})