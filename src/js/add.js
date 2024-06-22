document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-site-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const siteName = document.getElementById('site-name').value;
        const siteURL = document.getElementById('site-url').value;

        chrome.storage.sync.get('sites', function(result) {
            let sites = result.sites || [];

            sites.push({
                name: siteName,
                url: siteURL
            });

            chrome.storage.sync.set({ 'sites': sites }, function() {
                if (chrome.runtime.lastError) {
                    console.error('Error saving sites:', chrome.runtime.lastError);
                } else {
                    console.log('Site added successfully:', { name: siteName, url: siteURL });
                    alert('Site added successfully!');
                    form.reset();
                }
            });

        });


    }) 
});