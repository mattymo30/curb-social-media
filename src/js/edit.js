document.addEventListener('DOMContentLoaded', function() {
    let sites = [];
    let num_sites = 0;
    let index = 0;

    let nextBtn = document.getElementById('next-btn');
    let prevBtn = document.getElementById('prev-btn');
    let deleteBtn = document.getElementById('delete-btn');
    
    if (nextBtn && prevBtn && deleteBtn) {
        nextBtn.addEventListener('click', next);
        prevBtn.addEventListener('click', prev);
        deleteBtn.addEventListener('click', deleteSite);
    } else {
        console.error('One or more buttons not found.');
    }

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
            window.location.href = 'main.html';
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
            alert('You have no saved sites!');
            console.log('No sites to delete.');
            window.location.href = 'main.html';
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
                alert('You have no saved sites!');
                window.location.href = 'main.html';
            } else if (index >= sites.length) {
                index = sites.length - 1; // Adjust index if out of bounds
            } else {
                prev();
            }
        });
    }

    getSites(function() {
        displaySite();
    });

});