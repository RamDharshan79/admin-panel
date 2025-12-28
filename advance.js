const API_BASE_URL = 'https://music-backend-ohu6.onrender.com';

const form = document.getElementById('addSongForm');
const statusMsg = document.getElementById('addSongStatus');
const songsList = document.getElementById('songsList');
const songsLoading = document.getElementById('songsLoading');
const historyList = document.getElementById('historyList');
const historyLoading = document.getElementById('historyLoading');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const songData = {
        title: document.getElementById('title').value,
        artist: document.getElementById('artist').value,
        album: document.getElementById('album').value,
        audioUrl: document.getElementById('audioUrl').value,
        artworkUrl: document.getElementById('artworkUrl').value,
        duration: parseInt(document.getElementById('duration').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(songData)
        });

        if (response.ok) {
            statusMsg.className = 'status-message success';
            statusMsg.textContent = 'Song added successfully!';
            form.reset();
            loadSongs();
        } else {
            throw new Error('Failed to add song');
        }
    } catch (error) {
        statusMsg.className = 'status-message error';
        statusMsg.textContent = `Error: ${error.message}`;
    }

    setTimeout(() => {
        statusMsg.style.display = 'none';
    }, 3000);
});

async function loadSongs() {
    try {
        const response = await fetch(`${API_BASE_URL}/songs`);
        const songs = await response.json();
        
        songsLoading.style.display = 'none';
        
        if (songs.length === 0) {
            songsList.innerHTML = '<div class="empty-state">No songs yet. Add your first song above.</div>';
            return;
        }

        songsList.innerHTML = songs.map(song => `
            <div class="song-item">
                <img src="${song.artworkUrl}" alt="${song.title}" class="song-artwork" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%233a3a3a%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'">
                <div class="song-info">
                    <div class="song-title">${escapeHtml(song.title)}</div>
                    <div class="song-meta">${escapeHtml(song.artist)} • ${escapeHtml(song.album)}</div>
                    <div class="song-meta">${formatDuration(song.duration)}</div>
                    <div class="song-id">ID: ${song.id}</div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        songsLoading.textContent = 'Failed to load songs';
    }
}

async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/history`);
        const history = await response.json();
        
        historyLoading.style.display = 'none';
        
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-state">No play history yet.</div>';
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-song">
                    <div class="song-title">${escapeHtml(item.title)}</div>
                    <div class="song-meta">${escapeHtml(item.artist)}</div>
                    <div class="song-id">Song ID: ${item.songId}</div>
                </div>
                <div class="history-time">${formatTimestamp(item.playedAt)}</div>
            </div>
        `).join('');
    } catch (error) {
        historyLoading.textContent = 'Failed to load history';
    }
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

loadSongs();
loadHistory();
