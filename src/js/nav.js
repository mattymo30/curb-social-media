document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add-btn');
    const returnBtn = document.getElementById('return-btn');
    const editBtn = document.getElementById('edit-btn');
    const timerBtn = document.getElementById('timer-btn');

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
            window.location.href='timer.html';
        });
    }
});