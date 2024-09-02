console.log("Popup script is running.");
document.addEventListener('DOMContentLoaded', () => {
  const sendEmailButton = document.getElementById('sendEmailButton');
  const confirmEmailButton = document.getElementById('confirmEmailButton');
  const emailAddressInput = document.getElementById('emailAddress');

  let confirmedEmailAddress = ""; // Variable to store the confirmed email address

  // Confirm the email address when the "Confirm" button is pressed
  if (confirmEmailButton) {
    confirmEmailButton.addEventListener('click', () => {
      const emailAddress = emailAddressInput.value.trim();

      // Validate that the email address is not empty
      if (!emailAddress) {
        console.error('No email address entered.');
        alert('Please enter a valid email address.');
        return;
      }

      confirmedEmailAddress = emailAddress; // Store the confirmed email address
      alert(`Email address confirmed: ${confirmedEmailAddress}`);
      console.log(`Confirmed email address: ${confirmedEmailAddress}`);
    });
  } else {
    console.error('Button with id "confirmEmailButton" not found.');
  }

  // Send the confirmed email address when the "Send Email" button is pressed
  if (sendEmailButton) {
    sendEmailButton.addEventListener('click', () => {
      // Check if an email address has been confirmed
      if (!confirmedEmailAddress) {
        console.error('No confirmed email address.');
        alert('Please confirm an email address first.');
        return;
      }

      // Send the confirmed email address to the background script
      chrome.runtime.sendMessage({ type: 'SEND_EMAIL_TO_CONTENT', email: confirmedEmailAddress });
      console.log(`Captured email address: ${confirmedEmailAddress}`);

      // Execute the content script in the current active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }, () => {
          // Optional: Call a function in content.js if needed
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: checkGpuAvailability // Example function, modify if necessary
          });
        });
      });
    });
  } else {
    console.error('Button with id "sendEmailButton" not found.');
  }
});