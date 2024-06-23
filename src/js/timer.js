document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-timer-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const timerName = document.getElementById('timer-name').value.trim();
        const timerLength = parseFloat(document.getElementById('timer-length').value.trim());
        const timerSites = document.getElementById('timer-sites').value.split('\n').map(site => site.trim()).filter(site => site);
        const toSave = document.getElementById('save-timer').checked;

        if (!timerName || isNaN(timerLength) || timerLength <= 0) {
            alert("Please enter a valid timer name and timer length.");
            return;
        }

        if (timerSites.length === 0) {
            alert("No sites were entered!");
            return;
        }

        if (toSave) {
            chrome.storage.sync.get('timers', function(result) {
                let timers = result.timers || [];

                timers.push({
                    name: timerName,
                    length: timerLength,
                    sites: timerSites
                });

                chrome.storage.sync.set({'timers': timers}, function() {
                    if (chrome.runtime.lastError) {
                        console.error('Error saving timer:', chrome.runtime.lastError);
                        alert('Error saving timer. Please try again.');
                    } else {
                        console.log('Timer saved successfully:', { name: timerName, length: timerLength, sites: timerSites});
                        alert('Timer saved successfully!');
                    }
                })
            })
        }

        chrome.runtime.sendMessage({
            action: 'startTimer',
            timerName: timerName,
            timerLength: timerLength,
            timerSites: timerSites
        }, function(response) {
            if (response && response.success) {
                console.log('Timer started successful.');
                alert('Timer created successfully!');
                form.reset();
            } else {
                console.error('Failed to create timer: ', response.error);
                alert('Failed to start timer. Please try again!');
            }
        });
        
    });
});
