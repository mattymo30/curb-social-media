document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-timer-form');
    const startTimerBtn = document.getElementById('start-timer-btn');
    const timerInProgressMsg = document.getElementById('timer-in-progress-msg');

    // Check if any timer is currently running
    chrome.alarms.getAll(function(alarms) {
        if (alarms.length > 0) {
            console.log("Timer already in progress");
            disableForm();
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const timerName = document.getElementById('timer-name').value.trim();
        const timerLength = parseFloat(document.getElementById('timer-length').value.trim());
        const timerSites = document.getElementById('timer-sites').value.split('\n').map(site => site.trim()).filter(site => site);

        if (!timerName || isNaN(timerLength) || timerLength <= 0) {
            alert("Please enter a valid timer name and timer length.");
            return;
        }

        if (timerSites.length === 0) {
            alert("No sites were entered!");
            return;
        }

        // Send message to start timer if no active timers
        chrome.runtime.sendMessage({
            action: 'startTimer',
            timerName: timerName,
            timerLength: timerLength,
            timerSites: timerSites
        }, function(response) {
            if (response && response.success) {
                console.log('Timer started successfully.');
                alert('Timer created successfully!');
                form.reset();
                window.location.href = 'main.html';
            } else {
                console.error('Failed to create timer: ', response.error);
                alert('Failed to start timer. Please try again!');
            }
        });
    });

    function disableForm() {
        startTimerBtn.disabled = true;
        timerInProgressMsg.style.display = 'block';
    }
});
