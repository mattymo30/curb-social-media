document.addEventListener('DOMContentLoaded', function() {
    // Retrieve stored sites from chrome.storage.local
    chrome.storage.sync.get('sites', function(result) {
        let sites = result.sites || [];

        // Display sites on the page
        let siteList = document.getElementById('site-list');
        sites.forEach(function(site) {
            let listItem = document.createElement('li');
            listItem.textContent = `${site.name}: ${site.url}`;
            siteList.appendChild(listItem);
        });
    });
});