import config from './config.js';

// Handle the button click to execute content.js on the active tab
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

// Handling notifications
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "notification") {
    chrome.notifications.create("", message.options, (notificationId) => {
      sendResponse({ status: "Notification sent" });
    });
  }
  return true;
})

// Relay email address and Google Cloud function URL to content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEND_EMAIL_TO_CONTENT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "RECEIVE_EMAIL", email: message.email, EMAIL_API_URL: config.EMAIL_API_URL }, (response) => {
          sendResponse({ status: "Email forwarded to content script" });
        });
      } else {
        sendResponse({ status: "No active tab found" });
      }
    });
  }
});