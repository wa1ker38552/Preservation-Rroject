var nameReference = {
  "drought": "Drought", 
  "air-pollution": "Air Pollution", 
  "wildfires": "Wildfires", 
  "ocean-pollution": "Ocean Pollution", 
  "climate-change": "Climate Change", 
  "habitat-destruction": "Habitat Destruction"
}

async function getNews(type) {
  var a = await fetch("/news/"+nameReference[type])
  var b = await a.json()
  var parent = document.getElementById("contentNewsContainer")

  for (var i=0; i<b.length; i++) {
    var news = document.createElement("div")
    var newsContainer = document.createElement("div")
    var newsTitle = document.createElement("a")
    var newsBlurb = document.createElement("div")
    var img = document.createElement("img")

    img.src = b[i].img

    news.className = "news"
    newsContainer.className = "news-container"
    newsTitle.className = "news-title"
    newsTitle.target = "_blank"
    newsBlurb.className = "news-blurb"

    newsTitle.innerHTML = b[i].title
    newsTitle.href = b[i].link
    newsBlurb.innerHTML = b[i].blurb

    newsContainer.append(newsTitle)
    newsContainer.append(newsBlurb)
    news.append(newsContainer)
    news.append(img)
    parent.append(news)
  }
}

function createPost(item) {
  var post = document.createElement("div")
  var postProfile = document.createElement("div")
  var postProfileIcon = document.createElement("img")
  var postText = document.createElement("div")
  var postTitle = document.createElement("a")
  var postTime = document.createElement("div")
  var date = moment.unix(item.time).utc().tz("America/Los_Angeles").format("MM/DD/YYYY HH:mm:ss")
  
  try {
    post.className = "post"
    postProfileIcon.src = item.author.profile
    postProfileIcon.style.borderRadius = "50%"
    postProfile.className = "post-profile"
    postProfile.onclick = function() {window.location.href = "/profile/"+item.author.username}
    postProfile.style.cursor = "pointer"
    postProfile.append(postProfileIcon)
  
    postText.className = "post-text"
    postTitle.href = `/issues/${item.type}/${item["id"]}`
    postTitle.className = "post-title"
    postTitle.innerHTML = item.title
    postTime.className = "post-time"
    postTime.innerHTML = date
    postText.append(postTitle)
    postText.append(postTime)
  
    post.append(postProfile)
    post.append(postText)
    return post
  } catch {
    return null
  }
}

async function uploadPost(type) {
  var postTitle = document.getElementById("postTitle").value
  var postDescription = document.getElementById("postDescription").value

  const response = await fetch("/create?type="+type, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"title": postTitle, "content": postDescription})
  })  
    .then(response => response.json())
    .then(data => {
      if (data.success == true) {
        window.location.href = `/issues/${type}/${data.id}`
      }
    })
}

async function fetchIssueData(type) {
  var centerContent = document.getElementById("center-content")
  var postsContainer = document.getElementById("contentPostsContainer")
  var a = await fetch("/fetch/"+type)
  var b = await a.json()

  centerContent.innerHTML = nameReference[type]

  for (var i=0; i<b.length; i++) {
    postsContainer.append(createPost(b[i]))
  }
}
