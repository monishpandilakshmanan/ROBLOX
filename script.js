const loginView = document.getElementById('login-view');
const hubView = document.getElementById('hub-view');
const adminView = document.getElementById('admin-view');
const securityView = document.getElementById('security-view');
const tileContainer = document.getElementById('tile-transition-container');
const SESSION_KEY = 'gamehub_demo_sessions_v1';
const ADMIN_CODE = 'HSINOM@2011'; // Client-side demo gate only; not secure for production.

function readSessions() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || '[]'); }
    catch { return []; }
}
function saveSession(displayName) {
    const sessions = readSessions();
    sessions.push({ time: new Date().toLocaleString(), username: displayName });
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    refreshAdminLogs();
}
function setView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}
function speakStatus(message) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(message);
    voice.rate = 0.82;
    voice.pitch = 0.55;
    voice.volume = 1;
    window.speechSynthesis.speak(voice);
}

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    if (!user) return;
    saveSession(user);
    document.getElementById('display-user').innerText = user;
    this.reset();
    setView('hub-view');
});

document.getElementById('admin-trigger').addEventListener('click', () => {
    document.getElementById('admin-passcode').value = '';
    document.getElementById('auth-status').textContent = '';
    setView('security-view');
    setTimeout(() => document.getElementById('admin-passcode').focus(), 100);
});
document.getElementById('back-to-login').addEventListener('click', () => setView('login-view'));
document.getElementById('admin-auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const entry = document.getElementById('admin-passcode').value;
    const status = document.getElementById('auth-status');
    if (entry === ADMIN_CODE) {
        status.textContent = '> ACCESS GRANTED';
        status.className = 'auth-success';
        speakStatus('Access granted');
        refreshAdminLogs();
        setTimeout(() => playTileAnimation('admin-view'), 500);
    } else {
        status.textContent = '> ACCESS DENIED';
        status.className = 'auth-denied';
        speakStatus('Access denied');
        document.getElementById('admin-passcode').value = '';
        document.getElementById('admin-passcode').focus();
    }
});

function openTasks(title, banner, text, prize) {
    document.getElementById('modal-game-title').innerText = title;
    document.getElementById('modal-game-img').style.backgroundImage = `url('${banner}')`;
    document.getElementById('modal-task-desc').innerText = text;
    document.getElementById('modal-reward-val').innerText = prize;
    const bar = document.getElementById('task-progress');
    const claim = document.getElementById('claim-btn');
    bar.style.width = '0%';
    claim.classList.add('disabled');
    claim.disabled = true;
    document.getElementById('task-modal').style.display = 'flex';
    setTimeout(() => { bar.style.width = '100%'; }, 100);
    setTimeout(() => { claim.classList.remove('disabled'); claim.disabled = false; }, 2100);
}
function closeTasks() { document.getElementById('task-modal').style.display = 'none'; }

function playTileAnimation(targetView) {
    const rCount = 8, cCount = 8;
    tileContainer.style.gridTemplateRows = `repeat(${rCount}, 1fr)`;
    tileContainer.style.gridTemplateColumns = `repeat(${cCount}, 1fr)`;
    tileContainer.innerHTML = '';
    const tilesList = [];
    for (let r = 0; r < rCount; r++) for (let c = 0; c < cCount; c++) {
        const tileNode = document.createElement('div');
        tileNode.classList.add('tile');
        tileContainer.appendChild(tileNode);
        tilesList.push({ el: tileNode, delay: r + c });
    }
    tilesList.sort((a, b) => a.delay - b.delay);
    tilesList.forEach(node => setTimeout(() => node.el.classList.add('reveal'), node.delay * 35));
    const syncTime = (rCount + cCount) * 35 + 150;
    setTimeout(() => {
        setView(targetView);
        document.querySelectorAll('.tile').forEach(t => t.style.background = '#010201');
    }, syncTime);
    setTimeout(() => { tileContainer.innerHTML = ''; }, syncTime + 500);
}
function exitAdmin() { setView('login-view'); }
function refreshAdminLogs() {
    const rootTable = document.getElementById('admin-log-table');
    const sessions = readSessions();
    rootTable.innerHTML = '';
    if (!sessions.length) {
        rootTable.innerHTML = '<tr class="empty-row"><td colspan="3">&gt; No demo sessions saved yet.</td></tr>';
        return;
    }
    sessions.slice().reverse().forEach(item => {
        const tr = document.createElement('tr');
        const time = document.createElement('td');
        const name = document.createElement('td');
        const note = document.createElement('td');
        time.textContent = `[${item.time}]`;
        name.textContent = item.username;
        note.textContent = 'Password not collected';
        tr.append(time, name, note);
        rootTable.appendChild(tr);
    });
}
refreshAdminLogs();
