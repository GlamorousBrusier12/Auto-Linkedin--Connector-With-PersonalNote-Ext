// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // You can do something with the name received from content.js
    console.log('Received name:', message.name);
  });
  