document.addEventListener('DOMContentLoaded', function() {

    const timerStatus = document.getElementById('timer-on-off');
    const timeRemaining = document.getElementById('time-remaining');
    const activeSitesTitle = document.getElementById('active-sites-title');
    const siteList = document.getElementById('site-list');
    
    function formatTime(minutes) {
        let mins = Math.floor(minutes);
        let secs = Math.floor((minutes - mins) * 60);
        return `Time Remaining: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    chrome.storage.sync.get('sites', function(result) {
        let sites = result.sites || [];

        if (sites.length === 0) {
            let noneItem = document.createElement('li');
            noneItem.textContent = 'None';
            siteList.appendChild(noneItem);
        } else {
            sites.forEach(function(site) {
                let listItem = document.createElement('li');
                listItem.textContent = `${site.name}: ${site.url}`;
                siteList.appendChild(listItem);
            });
        }
    });

    chrome.alarms.getAll(function(alarms) {
        if (alarms.length > 0) {
            timerStatus.textContent = "ON";
            activeSitesTitle.style.display = "none";
            siteList.style.display = "none";
            let alarmName = alarms[0].name;
            chrome.alarms.get(alarmName, function(alarm) {
                if (alarm) {
                    let remainingTime = (alarm.scheduledTime - Date.now()) / (1000 * 60);
                    timeRemaining.textContent = formatTime(remainingTime);
                }
            });
        } else {
            timerStatus.textContent = "OFF";
            activeSitesTitle.style.display = "contents";
            siteList.style.display = "contents";
        }
    });
});