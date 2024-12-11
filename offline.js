function checkOnlineStatus() {
    if (navigator.onLine) {
        document.getElementById('offline-world').style.display = 'none';
        document.getElementById('online-world').style.display = 'block';
        document.getElementById('usernameModal').style.display = 'block';
    } else {
        document.getElementById('offline-world').style.display = 'block';
        document.getElementById('usernameModal').style.display = 'none';
        document.getElementById('online-world').style.display = 'none';
    }
}

window.addEventListener('load', checkOnlineStatus);

window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);