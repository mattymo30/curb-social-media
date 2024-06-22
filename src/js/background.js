let sites = [];

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

chrome.tabs.onActivated.addListener( function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        console.log(tab.url);

        if (tab.url && checkBlockedSite(tab.url)) {
            console.log("Blocked Site Detected: ", tab.url);
            chrome.tabs.update(tab.id, {url: '../html/blocked-site.html'});
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (tab.active && change.url) {
        console.log(change.url);           
    }

    if (change.url && checkBlockedSite(change.url)) {
        console.log("Blocked Site Detected: ", change.url);
        chrome.tabs.update(change.id, {url: '../html/blocked-site.html'});
    }
});
