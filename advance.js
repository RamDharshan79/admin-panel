// 🔴 CHANGE THIS TO YOUR BACKEND URL
// Local:
// const API_BASE_URL = 'http://localhost:3000/api';

// Deployed:
const API_BASE_URL = 'https://music-backend-ohu6.onrender.com/api';

const form = document.getElementById('addSongForm');
const statusMsg = document.getElementById('addSongStatus');
const songsList = document.getElementById('songsList');
const songsLoading = document.getElementById('songsLoading');
const historyList = document.getElementById('historyList');
const historyLoading = document.getElementById('historyLoading');

// ----------------------
// ADD SONG
// ----------------------
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const songData = {
        title: document.getElementById('title').value.trim(),
        artist: document.getElementById('artist').value.trim(),
        album: document.getElementById('album').value.trim(),
        audio_url: document.getElementById('audioUrl').value.trim(),
        artwork_url: document.getElementById('artworkUrl').value.trim(),
        duration: parseInt(document.getElementById('duration').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/songs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(songData)
        });

        if (!response.ok) {
            throw new Error('Failed to add song');
        }

        statusMsg.className = 'status-message success';
        statusMsg.textContent = 'Song added successfully!';
        statusMsg.style.display = 'block';

        form.reset();
        loadSongs();

    } catch (error) {
        statusMsg.className = 'status-message error';
        statusMsg.textContent = error.message;
        statusMsg.style.display = 'block';
    }

    setTimeout(() => {
        statusMsg.style.display = 'none';
    }, 3000);
});

// ----------------------
// LOAD SONGS
// ----------------------
async function loadSongs() {
    try {
        const response = await fetch(`${API_BASE_URL}/songs`);
        const songs = await response.json();

        songsLoading.style.display = 'none';

        if (!songs.length) {
            songsList.innerHTML =
                '<div class="empty-state">No songs yet. Add your first song above.</div>';
            return;
        }

        songsList.innerHTML = songs.map(song => `
            <div class="song-item">
                <img
                    src="${song.artwork_url || ''}"
                    alt="${escapeHtml(song.title)}"
                    class="song-artwork"
                    onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%233a3a3a%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'"
                >
                <div class="song-info">
                    <div class="song-title">${escapeHtml(song.title)}</div>
                    <div class="song-meta">${escapeHtml(song.artist)} • ${escapeHtml(song.album || '')}</div>
                    <div class="song-meta">${formatDuration(song.duration)}</div>
                    <div class="song-id">ID: ${song.id}</div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        songsLoading.textContent = 'Failed to load songs';
    }
}

// ----------------------
// LOAD PLAY HISTORY
// ----------------------
async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/history`);
        const history = await response.json();

        historyLoading.style.display = 'none';

        if (!history.length) {
            historyList.innerHTML =
                '<div class="empty-state">No play history yet.</div>';
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-song">
                    <div class="song-title">${escapeHtml(item.title)}</div>
                    <div class="song-meta">${escapeHtml(item.artist)}</div>
                    <div class="song-id">Song ID: ${item.song_id}</div>
                </div>
                <div class="history-time">${formatTimestamp(item.played_at)}</div>
            </div>
        `).join('');

    } catch (error) {
        historyLoading.textContent = 'Failed to load history';
    }
}

// ----------------------
// HELPERS
// ----------------------
function formatDuration(seconds = 0) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function escapeHtml(text = '') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ----------------------
// INITIAL LOAD
// ----------------------
loadSongs();
loadHistory();