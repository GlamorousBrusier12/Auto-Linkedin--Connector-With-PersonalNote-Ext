// // Define a template (you can store it in a variable or retrieve it from storage)
// const noteTemplate = "This is my template text. You can customize this.";

// // Function to set the template
// function setNoteTemplate() {
//   chrome.storage.local.set({ 'noteTemplate': noteTemplate }, function () {
//     console.log('Template set.');
//   });
// }

// // Function to retrieve and send the template to content.js
// function getNoteTemplate() {
//   chrome.storage.local.get(['noteTemplate'], function (result) {
//     const template = result.noteTemplate || '';
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, { action: 'customizeNote', template: template });
//     });
//   });
// }

// const customizeButton = document.getElementById('customizeButton');

// if (customizeButton) {
//     console.log('====================================');
//     console.log("ji");
//     console.log('====================================');
//   customizeButton.addEventListener('click', getNoteTemplate);
// }
// document.addEventListener("DOMContentLoaded", function () {
//     const enableButton = document.getElementById("enableButton");
//     const disableButton = document.getElementById("disableButton");
  
//     enableButton.addEventListener("click", function () {
//       chrome.storage.local.set({ isEnabled: true });
//     });
  
//     disableButton.addEventListener("click", function () {
//       chrome.storage.local.set({ isEnabled: false });
//     });
//   });
  