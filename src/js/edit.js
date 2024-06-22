document.addEventListener('DOMContentLoaded', function() {
    let sites = [];
    let num_sites = 0;
    let index = 0;

    function getSites(callback) {
        chrome.storage.sync.get('sites', function(result) {
            sites = result.sites || [];
            console.log(sites);
            num_sites = sites.length;
            displaySite();
        });

    }

    function update(callback) {
        chrome.storage.sync.get('sites', function(result) {
            sites = result.sites || [];
            num_sites = sites.length;
        });
    }

    function displaySite() {
        if (num_sites === 0) {
            console.log('No sites saved!');
            return;
        }

        let currSite = sites[index];
        document.getElementById('site-name').textContent = currSite.name;
        document.getElementById('site-url').textContent = currSite.url;
    }

    function next() {
        index++;
        if (index >= num_sites) {
            index = 0;
        }
        displaySite();
    }

    function prev() {
        index--;
        if (index < 0) {
            index = num_sites - 1;
        }
        displaySite();
    }

    function deleteSite() {

        if (num_sites === 0) {
            console.log('No sites to delete.');
            return;
        }

        sites.splice(index, 1);
        chrome.storage.sync.set({ 'sites': sites }, function() {
            if (chrome.runtime.lastError) {
                console.error('Error deleting site:', chrome.runtime.lastError);
            } 

            console.log('Site deleted successfully');
            alert('Site deleted successfully!');  
            getSites();
            if (num_sites === 0) {
                index = 0; // Reset index if no sites left
            } else if (index >= sites.length) {
                index = sites.length - 1; // Adjust index if out of bounds
            } else {
                prev();
            }
        });
    }

    document.getElementById('next-btn').addEventListener('click', next);
    document.getElementById('prev-btn').addEventListener('click', prev);
    document.getElementById('delete-btn').addEventListener('click', deleteSite);

    getSites(function() {
        displaySite();
    });

});