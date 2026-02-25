const recordsList = document.getElementById('recordsList');
const noRecords = document.getElementById('noRecords');
const clearBtn = document.getElementById('clearRecords');

function displayRecords() {
    const records = JSON.parse(localStorage.getItem('ticTacToeRecords')) || [];

    if (records.length === 0) {
        noRecords.classList.remove('d-none');
        recordsList.innerHTML = '';
        return;
    }

    noRecords.classList.add('d-none');
    recordsList.innerHTML = records.map(record => {
        const isDraw = record.winner === 'Draw';
        const badgeClass = isDraw ? 'bg-secondary' : (record.winnerSymbol === 'X' ? 'bg-danger' : 'bg-success');

        return `
            <div class="record-card d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                    <div class="matchup mb-1">
                        ${record.p1 || 'Player 1'} <span class="text-white-50 mx-2">vs</span> ${record.p2 || 'Player 2'}
                    </div>
                    <div class="match-date">
                        ${record.date}
                    </div>
                </div>
                <div class="mt-3 mt-md-0">
                    <span class="badge rounded-pill winner-badge ${badgeClass}">
                        ${isDraw ? 'Result: Draw' : `Winner: ${record.winner}`}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function clearRecords() {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem('ticTacToeRecords');
        displayRecords();
    }
}

clearBtn.addEventListener('click', clearRecords);

// Initial display
displayRecords();
