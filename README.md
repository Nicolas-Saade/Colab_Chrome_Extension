# Google Colab GPU Availability Checker Chrome Extension

## Overview

This Chrome extension automates the process of checking GPU availability on Google Colab. It interacts with the Google Colab interface to check the availability of a T4 GPU and automatically clicks the "Connect" button if available. This extension leverages the concepts of DOM and nested Shadow DOM, navigation and JavaScript.

## Technologies and Concepts Used - Google Chrome Extension Development:

### Manifest V3: 
Utilized the latest manifest version for defining the extension's configuration and permissions.

#### Code Structure:
- manifest.json: The configuration file that specifies the extension's metadata, permissions, and background script.

- background.js: The background script that handles events like clicking the extension icon and executing scripts on the active tab.

- content.js: The script injected into the Google Colab page to interact with the DOM and Shadow DOM.

- Popup HTML/CSS/JS: Files that define the popup UI when the extension icon is clicked.

### Background Script: 
Implemented logic to handle extension events like clicking the extension button that will check for availability.

### Google Cloud Functions:

Used to handle email notifications when a GPU is available or unavailable.

#### Technologies and Concepts Used:
- **Node.js 20**: Runtime used in cloud function code.
- **Google Cloud Functions**: Serverless computing for backend logic, ensuring scalability, security (API keys isolated from browser extension) cost-efficiency.
- **Async Functions**: For non-blocking code execution to handle asynchronous operations with MailerSend API.
- **MailerSend API**: For sending emails, with secure API key authentication and verified sender email.
- **node-fetch**: For making HTTP requests to the MailerSend API.
- **Environment Variables**: Secure storage of API keys.
- **Logging**: Integrated logging for monitoring and debugging.


### JavaScript:

Nested DOM and Shadow DOM Manipulation and Navigation: Accessed elements within Shadow DOMs and the main website DOM, to reach the collab connect button and begin connection process.

Event Handling: Managed user interactions with the extension icon to trigger scripts.

### HTML and CSS Selectors:

CSS Selectors: Utilized various selectors to accurately target and manipulate DOM elements.

XPath Understanding: Translated XPath expressions to CSS selectors for effective shadow DOM traversal.

## How It Works

Regular DOM Traversal
The script navigates the regular DOM to reach the container holding the button using a CSS selector.

Shadow DOM Traversal
A utility function getShadowRootElement is used to traverse through nested Shadow DOMs to reach the target button.

Element Interaction
The script finds the "Connect" button within the Shadow DOM and clicks it.

Error Handling and Feedback
Checks and feedback mechanisms are implemented to handle cases where elements are not found.
