function createMessage(avatar, username, content) {
  var message = document.createElement("div")
  var messageProfile = document.createElement("div")
  var messageProfileIcon = document.createElement("img")
  var messageText = document.createElement("div")
  var messageAuthor = document.createElement("div")
  var messageContent = document.createElement("div")

  message.className = "message"
  messageProfile.className = "message-profile"
  messageProfileIcon.src = avatar
  messageProfileIcon.style.borderRadius = "50%"
  messageProfile.append(messageProfileIcon)

  messageText.className = "message-text-container"
  messageAuthor.className = "message-author"
  messageContent.className = "message-content"
  messageAuthor.innerHTML = username
  messageContent.innerHTML = content
  messageText.append(messageAuthor)
  messageText.append(messageContent)

  message.append(messageProfile)
  message.append(messageText)
  return message
}

async function sendQuery(value) {
  var parent = document.getElementById("chatContent")
  var username = getCookie("Authorization").split('.')[1]
  const a = await fetch("/users/"+username)
  const b = await a.json()

  var e = createMessage(b.profile, username, value)
  e.style.fontStyle = "italic"
  parent.append(e)
  
  const response = await fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"prompt": value})
  })  
    .then(response => response.json())
    .then(data => {
      parent.append(createMessage("/static/assets/gpt.png", "GPT-3", data.result))
      e.style.fontStyle = ""
    })
}

function chatLoadup() {
  var input = document.getElementById("chatInput")
  input.addEventListener("keydown", function(e) {
    if (e.code == "Enter") {
      sendQuery(e.target.value)
      e.target.value = ""
    }
  })
}
