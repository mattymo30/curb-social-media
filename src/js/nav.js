document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add-btn');
    const returnBtn = document.getElementById('return-btn');
    const editBtn = document.getElementById('edit-btn');
    const timerBtn = document.getElementById('timer-btn'); 
    const aboutBtn = document.getElementById('about-btn');


    if (addBtn) {
        addBtn.addEventListener('click', function() {
            window.location.href = 'add.html';
        });
    }

    if (returnBtn) {
        returnBtn.addEventListener('click', function() {
            window.location.href = 'main.html';
        });
    }

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            chrome.runtime.sendMessage({
                action: 'hasSites'
            }, function(response) {
                console.log(response);
                if (response && response.success) {
                    window.location.href = 'edit.html';
                } else {
                    console.error("No saved sites");
                    alert('You have no saved sites to edit!');
                }
            });
            
        });
    }

    if (timerBtn) {
        timerBtn.addEventListener('click', function() {
            hasTimer(function(hasTimer) {
                if (!hasTimer) {
                    window.location.href = 'timer.html';
                }
            });
        });
    }

    if (aboutBtn) {
        aboutBtn.addEventListener('click', function() {
            window.location.href='about.html';
        })
    }


    function hasTimer(callback) {
        chrome.alarms.getAll(function(alarms) {
            if (alarms.length > 0) {
                console.log("Timer already in Progress!")
                alert("Cannot create a new timer while one is in progress!")
                callback(true);
            } else {
                callback(false);
            }
        })
    }
});