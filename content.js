function setIntervalX(callback, delay, repetitions) {
  var x = 0;
  var intervalID = window.setInterval(function () {
     callback();
     if (++x === repetitions) {
         window.clearInterval(intervalID);
     }
  }, delay);
}

function setNote() {
  const profileNameElement = document.querySelector('.text-heading-xlarge');
  if (profileNameElement) {
      const profileName = profileNameElement.textContent;
      const inviteButton = document.querySelector(`[aria-label^="Invite ${profileName} to connect"]`);
  
      if (inviteButton) {
          inviteButton.click();
          chrome.runtime.sendMessage({ name: profileName });
  
          // After clicking the inviteButton, locate and click the "Add a note" button with a delay of 150 milliseconds
          setTimeout(function() {
              const addNoteButton = document.querySelector('[aria-label="Add a note"]');
              if (addNoteButton) {
                  addNoteButton.click();
  
                  // After clicking "Add a note," populate the textarea with your text
                  setNoteValue(profileName);
              }
          }, 150); // 150 milliseconds
      }
  }
}

function setNoteValue(profileName) {
  const noteTextarea = document.querySelector('#custom-message');
  console.log('====================================');
  console.log("hi");
  console.log('====================================');
  console.log(noteTextarea);
  if (noteTextarea) {
      // Replace 'Your text goes here' with the desired note
      noteTextarea.value = `Hello ${profileName},  I trust you're doing well. I'm Naveen, an aspiring software engineer. I'm reaching out to inquire about potential job opportunities in your company. Your profile is inspiring, and I'm excited to bring my skills to your team. Can you share my resume with HR`;
  } else {
      // If the noteTextarea is not yet available, retry after a delay
      setTimeout(function() {
          setNoteValue(profileName);
      }, 150);
  }
}

// Start the process
setIntervalX(setNote, 2000, 5); // Check every 2 seconds for a total of 5 times

  
