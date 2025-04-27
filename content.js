import { Message } from "./message";

function setIntervalX(callback, delay, repetitions) {
    let x = 0;
    const intervalID = window.setInterval(function () {
        callback();
        if (++x === repetitions) {
            window.clearInterval(intervalID);
        }
    }, delay);
}

function findProfileName() {
    let profileNameElement = document.querySelector('.text-heading-xlarge') ||
        document.querySelector('.pv-top-card-section__name') ||
        document.querySelector('h1.inline');

    if (!profileNameElement) {
        const h1Elements = document.querySelectorAll('h1');
        for (let h1 of h1Elements) {
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

    if (!window.location.href.includes('/in/')) {
        console.log("Not on a profile page. Current URL:", window.location.href);
        return;
    }

    const profileNameElement = findProfileName();

    if (profileNameElement) {
        const profileName = profileNameElement.textContent.trim();
        console.log("Found profile:", profileName);

        let inviteButton = document.querySelector(`[aria-label^="Invite ${profileName} to connect"]`) ||
            document.querySelector('button[aria-label*="connect"]');

        if (!inviteButton) {
            const buttons = Array.from(document.querySelectorAll('button'));
            inviteButton = buttons.find(btn =>
                (btn.textContent && btn.textContent.includes('Connect')) ||
                (btn.getAttribute('aria-label') && btn.getAttribute('aria-label').toLowerCase().includes('connect'))
            );
        }

        if (!inviteButton) {
            const moreButton = document.querySelector('button[aria-label="More actions"]');
            if (moreButton) {
                console.log("Found 'More actions' button, clicking it");
                moreButton.click();

                setTimeout(() => {
                    const connectOption = Array.from(document.querySelectorAll('div[role="button"]')).find(div =>
                        div.textContent && div.textContent.includes('Connect')
                    );

                    if (connectOption) {
                        console.log("Found Connect option in dropdown, clicking it");
                        connectOption.click();
                        setTimeout(() => lookForAddNoteButton(profileName), 1000);
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
            setTimeout(() => lookForAddNoteButton(profileName), 1000);
        } else {
            console.log("Could not find connect button. The person might already be in your network.");
        }
    } else {
        console.log("Could not find profile name element.");
    }
}

function lookForAddNoteButton(profileName) {
    const addNoteButton = document.querySelector('[aria-label="Add a note"]');

    if (addNoteButton) {
        console.log("Found and clicking 'Add a note' button by aria-label");
        addNoteButton.click();
        setTimeout(() => setNoteValue(profileName), 800);
    } else {
        console.log("Didn't find 'Add a note' button, trying by text content");
        const buttons = Array.from(document.querySelectorAll('button'));
        const noteButton = buttons.find(btn => btn.textContent && btn.textContent.includes('Add a note'));

        if (noteButton) {
            console.log("Found and clicking 'Add a note' button by text content");
            noteButton.click();
            setTimeout(() => setNoteValue(profileName), 800);
        } else {
            console.log("Looking for the textarea directly (maybe it opened automatically)");
            setTimeout(() => setNoteValue(profileName), 800);
        }
    }
}

function setNoteValue(profileName) {
    console.log("Looking for textarea...");
    const noteTextarea = document.querySelector('#custom-message');

    if (noteTextarea) {
        console.log("Found textarea, setting value");
        noteTextarea.value = CUSTOM_MESSAGE;

        noteTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        noteTextarea.dispatchEvent(new Event('change', { bubbles: true }));

        setTimeout(() => {
            const sendButton = document.querySelector('button[aria-label="Send invitation"]') ||
                Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Send');

            if (sendButton && !sendButton.classList.contains('artdeco-button--disabled')) {
                console.log("Clicking send button");
                sendButton.click();

                // ✅ After sending, STOP any further retries
                window.retryCount = 999;
            } else {
                console.log("Send button not found or disabled, will retry once");
                retryFindingTextarea(profileName);
            }
        }, 1000);
    } else {
        retryFindingTextarea(profileName);
    }
}

function retryFindingTextarea(profileName) {
    if (typeof window.retryCount === 'undefined') window.retryCount = 0;

    if (window.retryCount < 5) {
        window.retryCount++;
        console.log(`Textarea not found, retrying... attempt ${window.retryCount}`);
        setTimeout(() => setNoteValue(profileName), 800 * window.retryCount);
    } else {
        console.log("Failed to find textarea after 5 attempts. Stopping retries.");
        window.retryCount = 999;
    }
}

// Start when page loads
window.addEventListener('load', function () {
    console.log("Page fully loaded, starting script");
    setTimeout(() => {
        window.retryCount = 0; // Reset retry counter
        setNote();
    }, 2000);
});

// Also periodically check
console.log("Setting up interval checks");
setIntervalX(() => {
    if (window.retryCount === 999) {
        console.log("Already completed, not running setNote again.");
    } else {
        setNote();
    }
}, 7000, 3);
