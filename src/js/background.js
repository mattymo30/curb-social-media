let sites = [];
let timerActiveSites = [];
let onTimer = false;
let activeTabs = {}; // Map to track active tabs where blocked page has been updated
let now = new Date();

chrome.storage.sync.get('sites', function(result) {
    sites = result.sites || [];
});

chrome.storage.sync.get('active', function(result) {
    timerActiveSites = result.sites || [];
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

function withinTimeRange(currTime, start, end) {
    console.log(currTime, start, end);
    
    return (currTime >= start && currTime <= end);
}

function checkBlockedSite(url) {
    now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currTime = `${hours}:${minutes}`;

    for (let site of sites) {
        if (url.includes(site.url)) {
            if (site.startTime && site.endTime) {
                if (withinTimeRange(currTime, site.startTime, site.endTime)) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }

    return false;
}

function isAllowed(url) {

    console.log(timerActiveSites);
    for (let site of timerActiveSites) {
        console.log(site);
        console.log(url.includes(site));
        if (url.includes(site)) {
            return true;
        }
    }
    return false;
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        console.log(activeInfo.tabId, tab);
        if (!onTimer && tab.url && checkBlockedSite(tab.url)) {
            console.log("Blocked Site Detected: ", tab.url);
            chrome.tabs.update(tab.id, { url: '../html/blocked-site.html' });
        } else if (onTimer && tab.url && !isAllowed(tab.url)) {
            console.log("Blocked Site Detected during timer: ", tab.url);
            chrome.tabs.update(tab.id, { url: '../html/blocked-site.html' });
        }
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log(tabId, tab);
    if (tab.url && !onTimer && checkBlockedSite(tab.url)) {
        console.log("Blocked Site Detected: ", tab.url);
        chrome.tabs.update(tabId, { url: '../html/blocked-site.html' });
    } else if (tab.url && onTimer && !isAllowed(tab.url)) {
        console.log("Blocked Site Detected during timer: ", tab.url);
        chrome.tabs.update(tabId, { url: '../html/blocked-site.html' });
    }
});


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

        timerActiveSites.push('chrome://newtab/');
        timerActiveSites.push('blocked-site.html');
        onTimer = true;

        console.log(timerActiveSites);

        chrome.storage.sync.set({ 'active': timerActiveSites }, function() {
            if (chrome.runtime.lastError) {
                console.error('Error saving sites:', chrome.runtime.lastError);
            } else {
                console.log('Sites updated successfully:', timerActiveSites);
            }
        });

        // Respond with success
        sendResponse({ success: true });

        return true;
    }

    if (request.action === 'hasSites') {
        if (sites.length !== 0) {
            sendResponse({ success: true });
            return true;
        }

        sendResponse({ success: false });
        return false;
    }

    if (request.action === 'updateSites') {
        chrome.storage.sync.get('sites', function(result) {
            sites = result.sites || [];
        });
        sendResponse({ success: true });
        return true;
    }
});

chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Timer alarm triggered:', alarm);

    // Set onTimer flag to false when alarm triggers
    onTimer = false;

    // Clear active timer sites
    timerActiveSites = [];
});

