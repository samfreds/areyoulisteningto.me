
document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
        apiKey: "AIzaSyA0oPR77UylTs-mVQa1mj465DJt5Rb8REE",
        authDomain: "chatroom-fe646.firebaseapp.com",
        databaseURL: "https://chatroom-fe646-default-rtdb.firebaseio.com",
        projectId: "chatroom-fe646",
        storageBucket: "chatroom-fe646.firebasestorage.app",
        messagingSenderId: "183738441952",
        appId: "1:183738441952:web:cbf453d0a105b60606f085",
        measurementId: "G-ML792T81NY"
    };

    firebase.initializeApp(firebaseConfig);

    const modal = document.createElement('div');
    modal.innerHTML = `
<div id="usernameModal" style="
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1000;
">
    <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #f2f0ef;
        padding: 20px;
        width: 300px;
        font-family: 'Lekton', monospace;
        color: black;
    ">
        <h2 style="margin-top: 0; text-align: center;">WELCOME</h2>
        <p>Please choose a username.</p>
        <form id="usernameForm" style="display: flex; flex-direction: column; gap: 10px;">
            <input 
                type="text" 
                id="username" 
                required 
                style="
                    padding: 8px;
                    font-size: 16px;
                    font-family: 'Lekton', monospace;
                    color: black;
                "
            >
            <button 
                type="submit" 
                style="
                    padding: 8px;
                    background-color: #1d2c64;
                    border: none;
                    cursor: pointer;
                    font-family: 'Lekton', monospace;
                    font-size: 16px;
                    color: #f2f0ef;
                "
            >
                Join
            </button>
        </form>
    </div>
</div>
`;
    document.body.appendChild(modal);
    let user = '';

    
    let messagesRef = firebase.database().ref('Collected Data');

    
    document.getElementById('usernameForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const username = usernameInput.value.trim();

        if (username) {
            user = username;
            document.getElementById('usernameModal').style.display = 'none';
            initializeChat();
        }
    });

    function initializeChat() {
        document.getElementById('messageForm').addEventListener('submit', submitForm);
        displayData();

        
        setInterval(displayData, 10000); 
    }


    function submitForm(e) {
        e.preventDefault();

        let text = getInputVal('text');

        if (text.trim() === '') {
            alert('Say something...');
        } else if (wordCount(text)) {
            saveMessage(text);
            document.getElementById('messageForm').reset();
        } else {
            alert('Keep messages under ten words or 60 characters!');
        }
    }

    
    function getInputVal(id) {
        return document.getElementById(id).value;
    }

    
    function saveMessage(text) {
        
        const words = text.trim().split(/\s+/);

        let newMessageRef = messagesRef.push();
        newMessageRef.set({
            sender: user,
            message: text,
            words: words,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            revealStartTime: Date.now(),
            fullyRevealed: false
        }).then(() => {
            
            markPreviousMessagesFullyRevealed();
            console.log('Message saved successfully');
        }).catch((error) => {
            console.error('Error saving message:', error);
        });
    }

    
    function displayData() {
        messagesRef.limitToLast(30).on('value', function (snapshot) {
            let dataDisplay = document.getElementById('dataDisplay');
            dataDisplay.innerHTML = '';

            
            console.log('Firebase snapshot:', snapshot.val());

            snapshot.forEach(function (childSnapshot) {
                let childData = childSnapshot.val();

                
                console.log('Child data:', childData);

                
                if (!childData || !childData.sender || !childData.message || !childData.words) {
                    console.error('Incomplete message data:', childData);
                    return;
                }

                let timestamp = childData.timestamp;
                let date = new Date(timestamp);
                let formattedDate = date.toLocaleString();

                
                let wordsToReveal = calculateRevealedWords(childData);

                
                let displayText = constructDisplayText(childData.words, wordsToReveal);

                dataDisplay.innerHTML +=
                    `<p class="note">
                <span class="title">Areyoulisteningto.me</span>
                <span style="display: inline-flex; align-items: center; flex-wrap: wrap;">${childData.sender}: ${displayText}</span></br>
                TIME: ${formattedDate}</p>`;
            });
        }, function (error) {
            console.error('Firebase error:', error);
        });
    }
    
    function calculateRevealedWords(messageData) {
        
        if (!messageData.revealStartTime) return 1;

        
        const secondsPassed = Math.floor((Date.now() - messageData.revealStartTime) / 1000);

       
        return Math.min(Math.floor(secondsPassed / 10) + 1, messageData.words.length);
    }

    function constructDisplayText(words, revealCount) {
       
        if (!Array.isArray(words)) {
            console.error('Words is not an array:', words);
            return 'Invalid message';
        }

        return words.map((word, index) =>
            index < revealCount
                ? word
                : `<span class="redact">${word.replace(/./g, '•')}</span>`
        ).join(' ');
    }

   
    function wordCount(input) {
        const words = input.trim().split(/\s+/);
        const wordCount = words.length;
        const charCount = input.length;

        return wordCount <= 10 && charCount <= 60;
    }

    
    displayData();
});