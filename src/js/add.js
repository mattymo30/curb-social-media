document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-site-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const siteName = document.getElementById('site-name').value;
        const siteURL = document.getElementById('site-url').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if ((startTime && !endTime) || (!startTime && endTime)) {
            event.preventDefault();
            alert("Start/End Times must both be filled or left empty to continue.");
            return;
        }

        chrome.storage.sync.get('sites', function(result) {
            let sites = result.sites || [];

            

            sites.push({
                name: siteName,
                url: siteURL,
                startTime: startTime,
                endTime: endTime
            });

            chrome.storage.sync.set({ 'sites': sites }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error saving site:', chrome.runtime.lastError);
                } else {
                    console.log('Site added successfully:', { name: siteName, url: siteURL });
                    alert('Site added successfully!');
                    form.reset();
                }
            });

            chrome.runtime.sendMessage({
                action: 'updateSites'
            }, function(response) {
                console.log(response);
                if (response && response.success) {
                    console.log("sites updated");
                } else {
                    console.error("No saved sites");
                    alert('You have no saved sites to edit!');
                }
            });

        });


    }) 
});