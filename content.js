var capturedEmailAddress = "";
var EMAIL_API_URL = "";

// Listen for messages of email from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RECEIVE_EMAIL') {
    capturedEmailAddress = message.email;
    EMAIL_API_URL = message.EMAIL_API_URL;
    sendResponse({ status: 'Email received in content script' });
  }
});

// Function to get an element within a shadow DOM
function getShadowRootElement(root, selectors) {
  let element = root; 
  for (const selector of selectors) {
    element = element.querySelector(selector);
    if (element && element.shadowRoot) {
      element = element.shadowRoot;
    }
  }
  return element;
}

// Function to check GPU availability
function checkGpuAvailability() {
  const buttonContainerSelector = 'body > div.notebook-vertical > div.notebook-horizontal > div.layout.vertical.grow';
  const buttonContainer = document.querySelector(buttonContainerSelector);

  if (!buttonContainer) {
    alert("Button container not found.");
    return;
  }

  const selectors = [
    'colab-notebook-toolbar',
    'colab-connect-button',
    'colab-toolbar-button',
    'md-text-button',
    'button'
  ];

  const connectButton = getShadowRootElement(buttonContainer, selectors);

  if (connectButton) {
    connectButton.click();

    setTimeout(() => {
      let errorMessage = document.querySelector('h2#title.mdc-dialog__title');
      console.log("Error message found:", errorMessage !== null);

      if (errorMessage) {
        alert("T4 GPU is not currently available for free users.");
        sendNotification("Connection Status", "T4 GPU is not currently available for free users.");
        sendEmail(capturedEmailAddress, "GPU Availability Alert", "T4 GPU is not currently available for free users.");
      } else {
        alert("T4 GPU is available and connected.");
        sendNotification("Connection Status", "T4 GPU is available and connected.");
        sendEmail(capturedEmailAddress, "GPU Availability Alert", "T4 GPU is available and connected.");
      }
    }, 10000);
  } else {
    alert("Connect button not found.");
    sendNotification("Connection Status", "Couldn't retrieve connection status.");
    sendEmail(capturedEmailAddress, "Connection Status", "Couldn't retrieve connection status.");
  }
}

// Function to send a Google notification
function sendNotification(title, message) {
  chrome.runtime.sendMessage({
    type: "notification",
    options: {
      title: title,
      message: message,
      iconUrl: "images/ELT Logo 16x16.jpg",
      type: "basic"
    }
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
    } else {
      console.log("Message sent, response:", response);
    }
  });
}

// Function to send an email
function sendEmail(to, subject, text, html) {
    fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to, subject, text, html })
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
  }

checkGpuAvailability();