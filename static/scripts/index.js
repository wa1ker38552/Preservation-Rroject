function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function openModal() {
  var modal = document.getElementById("modal")
  if (modal.style.visibility == "visible") {
    modal.style.visibility = "hidden"
  } else {modal.style.visibility = "visible"}
}

async function fetchPostData() {
  var contentPostTitle = document.getElementById("contentPostTitle")
  var contentPostSubtitle = document.getElementById("contentPostSubtitle")
  var contentPostContent = document.getElementById("contentPostContent")
  var contentPostTimestamp = document.getElementById("contentPostTimestamp")
  var type = window.location.href.split("/")[4]
  var id = window.location.href.split("/")[5]

  var a = await fetch(`/posts/${type}/${id}`)
  var b = await a.json()

  contentPostTitle.innerHTML = b.title
  contentPostSubtitle.innerHTML = "By "+b.author.username
  contentPostSubtitle.href = "/profile/"+b.author.username
  contentPostContent.innerHTML = b.content
  contentPostTimestamp.innerHTML = moment.unix(b.time).utc().tz("America/Los_Angeles").format("MM/DD/YYYY HH:mm:ss")
}

async function loadupFunction() {
  var username = getCookie("Authorization").split('.')[1]
  var profilePicture = document.getElementById("profilePicture")

  const a = await fetch("/users/"+username)
  const b = await a.json()

  profilePicture.src = b.profile
  profilePicture.onclick = function() {window.location.href="/profile/"+username}

  window.onclick = function(e) {
    if (e.target == document.getElementById("modal")) {
      document.getElementById("modal").style.visibility = "hidden"
    }
  }
}
