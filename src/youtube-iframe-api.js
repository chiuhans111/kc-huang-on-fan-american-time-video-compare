var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.append(tag)

var APIResolved

// eslint-disable-next-line
var YTPromise = new Promise((resolve, reject) => {
    APIResolved = resolve
})

window.onYouTubeIframeAPIReady = function () {
    APIResolved(window.YT)
}

export {
    YTPromise
}

