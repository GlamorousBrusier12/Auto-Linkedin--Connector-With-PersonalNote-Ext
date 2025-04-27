function setIntervalX(callback, delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function () {
       callback();
       if (++x === repetitions) {
           window.clearInterval(intervalID);
       }
    }, delay);
  }
  
  function findProfileName() {
    // Try multiple possible selectors for the profile name
    let profileNameElement = document.querySelector('.text-heading-xlarge');
    
    if (!profileNameElement) {
      profileNameElement = document.querySelector('.pv-top-card-section__name');
    }
    
    if (!profileNameElement) {
      profileNameElement = document.querySelector('h1.inline');
    }
    
    if (!profileNameElement) {
      // Look for any h1 on the page that might contain a name
      const h1Elements = document.querySelectorAll('h1');
      for (let h1 of h1Elements) {
        // Names usually have a space in them (first and last name)
        if (h1.textContent.trim().includes(' ')) {
          profileNameElement = h1;
          break;
        }
      }
    }
    
    return profileNameElement;
  }
  
  function setNote() {
    console.log("Attempting to find profile and connect button...");
    
    // Check if we're on a profile page
    if (!window.location.href.includes('/in/')) {
      console.log("Not on a profile page. Current URL:", window.location.href);
      return;
    }
    
    const profileNameElement = findProfileName();
    
    if (profileNameElement) {
        const profileName = profileNameElement.textContent.trim();
        console.log("Found profile:", profileName);
        
        // Try multiple possible selectors for the connect button
        let inviteButton = document.querySelector(`[aria-label^="Invite ${profileName} to connect"]`);
        
        if (!inviteButton) {
            inviteButton = document.querySelector('button[aria-label*="connect"]');
        }
        
        if (!inviteButton) {
            // Try to find a button that says "Connect"
            const buttons = Array.from(document.querySelectorAll('button'));
            inviteButton = buttons.find(btn => 
                (btn.textContent && btn.textContent.includes('Connect')) || 
                (btn.getAttribute('aria-label') && btn.getAttribute('aria-label').toLowerCase().includes('connect'))
            );
        }
        
        if (!inviteButton) {
          // Try to find the connect button in the dropdown menu
          const moreButton = document.querySelector('button[aria-label="More actions"]');
          if (moreButton) {
            console.log("Found 'More actions' button, clicking it");
            moreButton.click();
            
            // Wait for dropdown to appear and look for Connect option
            setTimeout(() => {
              const connectOption = Array.from(document.querySelectorAll('div[role="button"]')).find(div => 
                div.textContent && div.textContent.includes('Connect')
              );
              
              if (connectOption) {
                console.log("Found Connect option in dropdown, clicking it");
                connectOption.click();
                
                // Continue with the rest of the flow
                setTimeout(() => {
                  lookForAddNoteButton(profileName);
                }, 1000);
              } else {
                console.log("Could not find Connect option in dropdown");
              }
            }, 500);
            return;
          }
        }
    
        if (inviteButton) {
            console.log("Found and clicking connect button");
            inviteButton.click();
            
            // Continue with the rest of the flow
            setTimeout(() => {
              lookForAddNoteButton(profileName);
            }, 1000);
        } else {
            console.log("Could not find connect button. The person might already be in your network.");
        }
    } else {
        console.log("Could not find profile name element. DOM elements found:", document.body.innerHTML.substring(0, 500));
    }
  }
  
  function lookForAddNoteButton(profileName) {
    // Look for the "Add a note" button
    const addNoteButton = document.querySelector('[aria-label="Add a note"]');
    
    if (!addNoteButton) {
        console.log("Didn't find 'Add a note' button by aria-label, trying text content");
        // Try finding by text content
        const buttons = Array.from(document.querySelectorAll('button'));
        const noteButton = buttons.find(btn => btn.textContent && btn.textContent.includes('Add a note'));
        
        if (noteButton) {
            console.log("Found and clicking 'Add a note' button by text content");
            noteButton.click();
            setTimeout(() => setNoteValue(profileName), 800);
        } else {
            // It's possible the "Add a note" dialog opened automatically
            console.log("Looking for the textarea directly");
            setTimeout(() => setNoteValue(profileName), 800);
        }
    } else {
        console.log("Found and clicking 'Add a note' button by aria-label");
        addNoteButton.click();
        setTimeout(() => setNoteValue(profileName), 800);
    }
  }
  
  function setNoteValue(profileName) {
    console.log("Looking for textarea...");
    const noteTextarea = document.querySelector('#custom-message');
    
    if (noteTextarea) {
        console.log("Found textarea, setting value");
        // Set the value
        noteTextarea.value = `Hello ${profileName}, I trust you're doing well. I'm Naveen, an aspiring `;
        
        // Trigger input events to make LinkedIn recognize the text entry
        noteTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        noteTextarea.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Wait for the send button to be enabled and click it
        setTimeout(function() {
            const sendButton = document.querySelector('button[aria-label="Send invitation"]');
            
            if (!sendButton) {
              console.log("Looking for send button by text content");
              const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
                btn.textContent && btn.textContent.trim() === 'Send'
              );
              
              if (buttons.length > 0) {
                const sendBtn = buttons[0];
                if (!sendBtn.classList.contains('artdeco-button--disabled')) {
                  console.log("Clicking send button found by text");
                  sendBtn.click();
                } else {
                  console.log("Send button is disabled");
                }
              } else {
                console.log("No send button found");
              }
            } else if (!sendButton.classList.contains('artdeco-button--disabled')) {
                console.log("Clicking send button");
                sendButton.click();
            } else {
                console.log("Send button is disabled. Waiting a bit longer...");
                // Wait a bit longer and try again
                setTimeout(function() {
                    if (!sendButton.classList.contains('artdeco-button--disabled')) {
                        console.log("Now clicking send button");
                        sendButton.click();
                    } else {
                        console.log("Send button still disabled");
                    }
                }, 1000);
            }
        }, 1000);
    } else {
        console.log("Textarea not found, retrying...");
        // Retry with increasing delay, but limit retries
        if (!window.retryCount) window.retryCount = 0;
        
        if (window.retryCount < 5) {
            window.retryCount++;
            setTimeout(function() {
                setNoteValue(profileName);
            }, 800 * window.retryCount);
        } else {
            console.log("Failed to find textarea after 5 attempts");
            window.retryCount = 0;
        }
    }
  }
  
  // Wait for page to fully load before running
  window.addEventListener('load', function() {
    console.log("Page fully loaded, starting script");
    // Wait an additional second for any dynamic content to load
    setTimeout(function() {
      setNote();
    }, 2000);
  });
  
  // Also set up the interval to check periodically
  console.log("Setting up interval checks");
  setIntervalX(setNote, 7000, 3); // Check every 7 seconds for a total of 3 times