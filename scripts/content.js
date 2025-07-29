/**
 * Called when the extension is ready.
 */
function init() {
  if (document.readyState === 'complete')
    return ready();
  window.addEventListener('load', () => { ready(); });
}

/**
 * Called once the page is ready and the extension is loaded.
 */
function ready() {
  update();
  observe(update);
}

/**
 * Observes dynamic content changes, if changes present calls update method.
 * @param {CallableFunction} updateMethod
 */
function observe(updateMethod) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        updateMethod();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Called when the page content is updated or the page was just loaded.
 * @param {String} replacerThumbnailUrl URL or a local path string;
 * @param {CallableFunction} videoElementValidator receives html video element and the replacerThumbnailUrl, should return bool;
 * @param {String} videosQuerySelector query selector string for youtube video elements;
 */
function update(
  replacerThumbnailUrl = 'images/smart-man-with-glasses-wallpaper-download.png',
  videoElementValidator = (videoElement, thumbnailUrl) => {
    const titleElement = videoElement.querySelector('#video-title');
    if (!titleElement || !titleElement.textContent.includes('ТОПЛЕС'))
      return false

    const thumbnailImg = videoElement.querySelector('img.yt-core-image');
    if (!thumbnailImg)
      return false

    // Replace with local image
    thumbnailImg.src = chrome.runtime.getURL(thumbnailUrl);
    // Remove srcset if it exists to prevent loading other resolutions
    thumbnailImg.removeAttribute('srcset');
    return true
  },
  videosQuerySelector = 'ytd-grid-video-renderer, ytd-rich-grid-media, ytd-video-renderer'
) {
  document.querySelectorAll(videosQuerySelector).forEach(video => {
    videoElementValidator(video, replacerThumbnailUrl);
  });
}

init();