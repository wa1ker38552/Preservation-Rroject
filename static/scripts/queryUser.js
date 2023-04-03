function createPost(item) {
  var post = document.createElement("div")
  var postProfile = document.createElement("div")
  var postProfileIcon = document.createElement("img")
  var postText = document.createElement("div")
  var postTitle = document.createElement("a")
  var postTime = document.createElement("div")
  var date = moment.unix(item.time).utc().tz("America/Los_Angeles").format("MM/DD/YYYY HH:mm:ss")

  post.className = "post"
  postProfileIcon.src = item.author.profile
  postProfileIcon.style.borderRadius = "50%"
  postProfile.className = "post-profile"
  postProfile.append(postProfileIcon)

  postText.className = "post-text"
  postTitle.href = `/issues/${item.type}/${item.id}`
  postTitle.className = "post-title"
  postTitle.innerHTML = item.title
  postTime.className = "post-time"
  postTime.innerHTML = date
  postText.append(postTitle)
  postText.append(postTime)

  post.append(postProfile)
  post.append(postText)
  return post
}

async function changeProfilePicture() {
  var url = document.getElementById("imageURL").value
  await fetch("/profile?url="+url)
  document.getElementById("modal").style.visibility = "hidden"
  document.getElementById("metaProfilePicture").src = url
}

async function changeBio() {
  var bio = document.getElementById("bioText").value
  await fetch("/bio?text="+bio)
  document.getElementById("bioModal").style.visibility = "hidden"
  document.getElementById("bioTitle").innerHTML = '"'+bio+'"'
}

window.onload = async function() {
  loadupFunction()
  var username = window.location.href.split('/')[4]
  var profilePicture = document.getElementById("profilePicture")
  var metaProfilePicture = document.getElementById("metaProfilePicture")
  var metaUsername = document.getElementById("usernameTitle")
  var metaBio = document.getElementById("bioTitle")
  var postsContainer = document.getElementById("postsContainer")

  var a = await fetch("/users/"+username)
  var b = await a.json()

  postsTitle.innerHTML = username+"'s Posts"
  metaUsername.innerHTML = username
  metaBio.innerHTML = '"'+b.bio+'"'
  metaProfilePicture.src = b.profile

  if (getCookie("Authorization").split('.')[1] == username) {
    metaProfilePicture.onclick = function() {document.getElementById("modal").style.visibility = "visible"}
    var button = document.createElement("div")
    button.innerHTML = "Logout"
    button.className = "button logout-button"
    button.style.position = "absolute"
    button.style.top = "1vh"
    button.style.right = "1vh"
    button.onclick = function() {window.location.href = "/logout"}
    metaBio.onclick = function() {document.getElementById("bioModal").style.visibility = "visible"}
    metaBio.style.cursor = "pointer"
    
    metaContainerText.append(button)
  }

  a = await fetch("/users/"+getCookie("Authorization").split('.')[1])
  b = await a.json()

  profilePicture.src = b.profile

  // Get posts
  a = await fetch(`/users/${username}/posts`)
  b = await a.json()

  for (var i=0; i<b.length; i++) {
    postsContainer.append(createPost(b[i]))
  }
}
