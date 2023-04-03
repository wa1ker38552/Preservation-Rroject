var counterData = {
  "drought": {
    "text": "Liters of Water You Have Used",
    "seed": 1611,
    "change": 0.1
  },
  "air-pollution": {
    "text": "Deaths From Air Pollution",
    "seed": 2203872,
    "change": 0.5
  },
  "wildfires": {
    "text": "Percent of Wild Forests Left",
    "seed": 28.00777000,
    "change": 0.00000001
  },
  "ocean-pollution": {
    "text": "Great Pacific Garbage Patch",
    "seed": 2439597,
    "change": 0.02
  },
  "climate-change": {
    "text": "Tons of Melting Ice",
    "seed": 185226543300,
    "change": 100
  },
  "habitat-destruction": {
    "text": "Hectares of Forests Cut Down",
    "seed": 6926145,
    "change": 0.1
  }
}

var typeBackground = {
  "drought": "/static/assets/desert.png",
  "air-pollution": "https://images.nationalgeographic.org/image/upload/v1607340363/videos/posters/Air%20Pollution%20101.jpg",
  "wildfires": "/static/assets/wildfire.png",
  "ocean-pollution": "/static/assets/oceanpollution.png",
  "climate-change": "/static/assets/climate.png",
  "habitat-destruction": "/static/assets/habitat.png" 
}

function counter(type) {
  var counterValue = document.getElementById("counterValue")
  var counter = parseFloat(counterValue.innerHTML)
  counter += counterData[type]["change"]
  if (type == "wildfires") {
    counterValue.innerHTML = counter.toFixed(8)
  } else {
    counterValue.innerHTML = counter.toFixed(2).toLocaleString()
  }
}

function runOnload(type) {
  loadupFunction()
  fetchIssueData(type)
  getNews(type)

  var container = document.getElementById("counterContainer")
  container.style.background = `url("${typeBackground[type]}")`
  container.style.backgroundSize = "cover"
  container.style.backgroundRepeat = "no-repeat"
  
  document.getElementById("counterText").innerHTML = counterData[type]["text"]+"&nbsp;"
  document.getElementById("counterValue").innerHTML = counterData[type]["seed"]
  setInterval(function() {counter(type)}, 500)
}
