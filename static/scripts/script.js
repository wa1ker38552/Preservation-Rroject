var errors_l = ["Username not found!", "Password doesn't match!"]
var errors_s = ["Account already exists!", "Password cannot be empty!", "Username cannot be blank!", "Length of username must be between 4 and 20!"]
var usernameInput
var passwordInput
var modal

window.onload = function() {
  modal = document.getElementById("modal")
  usernameInput = document.getElementById("username-input")
  passwordInput = document.getElementById("password-input")
}

function createErrorElement(message) {
  var parent = document.createElement("div")
  var child = document.createElement("div")
  parent.className = "error-container"
  child.className = "error-message"
  child.innerHTML = message
  parent.append(child)
  modal.insertBefore(parent, modal.children[1])
}

async function attemptLogin() {
  username = usernameInput.value
  password = passwordInput.value
  const response = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"username": username, "password": password})
  })
    .then(response => response.json())
    .then(data => {
      if (data['errors'] != null) {
        if (document.getElementsByClassName("error-message")[0] == null) {
          createErrorElement(errors_l[data['errors']])
        } else {
          document.getElementsByClassName("error-message")[0].innerHTML = errors_l[data['errors']]
        }
      } else {
        window.location.href = "/callback?token="+data['token']
      }
    })
}

async function attemptSignup() {
  username = usernameInput.value
  password = passwordInput.value
  const response = await fetch("/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"username": username, "password": password})
  })
    .then(response => response.json())
    .then(data => {
      if (data['errors'] != null) {
        if (document.getElementsByClassName("error-message")[0] == null) {
          createErrorElement(errors_s[data['errors']])
        } else {
          document.getElementsByClassName("error-message")[0].innerHTML = errors_s[data['errors']]
        }
      } else {
        window.location.href = "/callback?token="+data['token']
      }
    })
}
