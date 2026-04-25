const topDiv = document.getElementById("top-div")
topDiv.addEventListener("click", () => {
    console.log("clicked")
    topDiv.innerHTML = Number(topDiv.innerHTML || 0) + 1
})