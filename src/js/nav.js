document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('add-btn');
    const returnBtn = document.getElementById('return-btn');
    const editBtn = document.getElementById('edit-btn');

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
            window.location.href = 'edit.html';
        });
    }
});