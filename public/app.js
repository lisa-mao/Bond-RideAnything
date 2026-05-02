const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-input')
const chatMessages = document.getElementById('chat-messages')
const submitButton = document.getElementById('send-btn')

const userid = `ride-radar-${crypto.randomUUID()}`

window.onload = () => {
    addMessage("Hoi, ik ben Bond. Ik help je met veiligheidseisen en actuele weersomstandigheden in Walibi. Wat wil je weten?", 'bot')
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const userInput = chatInput.value.trim()
    if (!userInput) return

    addMessage(userInput, 'user')
    chatInput.value = ''
    submitButton.disabled = true
    if  (submitButton.disabled) {
        submitButton.innerHTML = "Pending..."
    }

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: userInput, userid}),
        })

        if (!response.ok) throw new Error('Netwerkfout')

        const data = await response.json()

        //opzoek naar specifieke data
        const serverMessage = data.response.message || data.response
        const serverTools = data.response.tools || []

        addMessage(serverMessage, 'bot', serverTools)

    } catch (error) {
        console.error('Error:', error)
        addMessage('Oeps! Bond heeft even geen verbinding. Probeer het later nog eens.', 'bot')
    } finally {
        submitButton.disabled = false
        if  (!submitButton.disabled) {
            submitButton.innerHTML = "Send"
        }
        chatInput.focus()
    }
})

//creeërt dynamische text bubbels
function addMessage(text, sender, tools = []) {
    const messageElement = document.createElement('div')
    const bubbleClass = sender === 'user' ? 'user-bubble' : 'bot-bubble'
    messageElement.classList.add(bubbleClass)

    const textNode = document.createElement('div')
    textNode.textContent = text
    messageElement.appendChild(textNode)

    if (sender === 'bot' && tools.length > 0) {
        const toolContainer = document.createElement('div')
        toolContainer.classList.add('tool-labels')

        tools.forEach(tool => {
            const label = document.createElement('span')
            label.classList.add('tool-badge')
            label.textContent = `Tool: ${tool}`
            toolContainer.appendChild(label)
        })

        messageElement.appendChild(toolContainer)
    }

    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight
}