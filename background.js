import config from './config.js';

// Handle messages from content scripts
// Step 1: Query the active tab in the current window

console.log("Background script is running.");

// Handle messages for Google Drive interaction using gapi
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getDriveFiles") {
    gapi.client.drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)"
    }).then((response) => {
      sendResponse({ status: "success", files: response.result.files });
    }).catch((error) => {
      sendResponse({ status: "error", error: error.message });
    });
    return true; // Keep the message channel open for async response
  }
});

// Handle the button click to execute content.js on the active tab
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received a message:", message);
  // Handling notifications
  if (message.type === "notification") {
    console.log("Received notification message:", message);
    chrome.notifications.create("", message.options, (notificationId) => {
      console.log("Notification created with ID:", notificationId);
      sendResponse({ status: "Notification sent" });
    });
  }
  return true;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Relay email address to content.js
  if (message.type === "SEND_EMAIL_TO_CONTENT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Sending email address to content script:", message.email);
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "RECEIVE_EMAIL", email: message.email, EMAIL_API_URL: config.EMAIL_API_URL }, (response) => {
          console.log("Email sent to content script:", message.email, config.EMAIL_API_URL);
          sendResponse({ status: "Email forwarded to content script" });
        });
      } else {
        sendResponse({ status: "No active tab found" });
      }
    });
  }
});