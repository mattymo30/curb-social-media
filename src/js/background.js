let sites = [];
let timerActiveSites = [];
let onTimer = false;

chrome.storage.sync.get('sites', function(result) {
    sites = result.sites || [];
});

function updateSites(newSites) {
    sites = newSites;
    chrome.storage.sync.set({ 'sites': sites }, function() {
        if (chrome.runtime.lastError) {
            console.error('Error saving sites:', chrome.runtime.lastError);
        } else {
            console.log('Sites updated successfully:', sites);
        }
    });
}

function checkBlockedSite(url) {
    for (let site of sites) {
        if (url.includes(site.url)) {
            return true;
        }
    }

    return false;
}

// check for allowed sites when using a timer
function isAllowed(url) {
    for (let site of timerActiveSites) {
        if(url.includes(site)) {
            return true;
        }
    }

    return false;
}

chrome.tabs.onActivated.addListener( function(activeInfo){
    console.log(onTimer);
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        console.log('Is blocked', checkBlockedSite(tab.url));
        if (!onTimer && tab.url && checkBlockedSite(tab.url)) {
            console.log("Blocked Site Detected: ", tab.url);
            chrome.tabs.update(tab.id, { url: '../html/blocked-site.html' });
        } else if (onTimer && tab.url && !isAllowed(tab.url)) {
            console.log("Blocked Site Detected during timer: ", tab.url);
            chrome.tabs.update(tab.id, { url: '../html/blocked-site.html' });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    console.log(onTimer);
    if (!onTimer && change.url && checkBlockedSite(change.url)) {
        console.log("Blocked Site Detected: ", change.url);
        chrome.tabs.update(tabId, { url: '../html/blocked-site.html' });
    } else if (onTimer && change.url && !isAllowed(change.url)) {
        console.log("Blocked Site Detected during timer: ", change.url);
        chrome.tabs.update(tabId, { url: '../html/blocked-site.html' });
    }
    

});

function checkTimerSites() {

}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'startTimer') {
        const { timerName, timerLength, timerSites } = request;

        console.log('Received startTimer request:', request);

        // Validate inputs
        if (!timerName || isNaN(timerLength) || timerLength <= 0 || !Array.isArray(timerSites)) {
            console.error('Invalid startTimer request:', request);
            sendResponse({ success: false, error: 'Invalid timer parameters' });
            return;
        }

        // Create alarm
        chrome.alarms.create(timerName, { delayInMinutes: timerLength });
        console.log('Timer alarm created:', timerName, timerLength);

        // Set active timer sites
        timerActiveSites = timerSites;

        // Respond with success
        sendResponse({ success: true });

        return true;
    }

    if (request.action === 'hasSites') {
        if (sites.length !== 0) {
            sendResponse({success: true});
            return true;
        }

        sendResponse({success: false});
        return false;
    }

    if (request.action === 'addSite') {
        chrome.storage.sync.get('sites', function(result) {
            sites = result.sites || [];
        });
        sendResponse({success: true});
        return true;
    }
});


chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Timer alarm triggered:', alarm);

    // Set onTimer flag to true when alarm triggers
    onTimer = true;

    // Perform additional actions as needed when alarm triggers
    handleTimerAlarm(alarm);

    // Optionally, reset onTimer flag after handling the alarm
    // Example: onTimer = false; // Reset the flag if needed
});

function handleTimerAlarm(alarm) {
    // Example: Redirect all tabs to a blocked page when timer expires
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (isAllowed(tab.url)) {
                console.log("Blocked Site Detected during timer: ", tab.url);
                chrome.tabs.update(tab.id, { url: '../html/blocked-site.html' });
            }
        });
    });

    // Example: Log alarm details or perform additional actions
    console.log('Handling timer alarm:', alarm);
}

