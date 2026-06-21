document.addEventListener('DOMContentLoaded', () => {
    let currentMode = 'overall';

    const tabsContainer = document.getElementById('tabsContainer');
    const leaderboardBody = document.getElementById('leaderboardBody');
    const searchInput = document.getElementById('searchInput');

    // Calculate points for all players
    const pointsMap = {
        'HT1': 60, 'LT1': 55,
        'HT2': 50, 'LT2': 45,
        'HT3': 40, 'LT3': 35,
        'HT4': 30, 'LT4': 25,
        'HT5': 20, 'LT5': 15
    };

    playersData.forEach(player => {
        let totalPoints = 0;
        Object.values(player.tiers).forEach(tier => {
            if (pointsMap[tier]) {
                totalPoints += pointsMap[tier];
            }
        });
        player.points = totalPoints;

        // Automatically calculate subtitle based on points
        if (player.points >= 300) {
            player.subtitle = "Combat Master";
        } else if (player.points >= 270) {
            player.subtitle = "Ace";
        } else if (player.points >= 230) {
            player.subtitle = "Specialist";
        } else if (player.points >= 190) {
            player.subtitle = "Rookie";
        } else {
            player.subtitle = "Newbie";
        }
    });

    // Render Tabs
    function renderTabs() {
        tabsContainer.innerHTML = '';
        gamemodes.forEach(mode => {
            const tab = document.createElement('div');
            tab.className = `tab ${currentMode === mode.id ? 'active' : ''}`;
            let iconName = mode.id;
            if (mode.id === 'ltm') iconName = '2v2';
            
            tab.innerHTML = `
                <img src="https://mctiers.com/tier_icons/${iconName}.svg" width="30" height="30" alt="${mode.name}" onerror="this.style.display='none'">
                <span>${mode.name}</span>
            `;
            tab.addEventListener('click', () => {
                currentMode = mode.id;
                renderTabs();
                renderLeaderboard();
            });
            tabsContainer.appendChild(tab);
        });
    }

    // Sort and filter players for the current mode
    function getPlayersForMode(searchQuery = '') {
        const filtered = playersData.filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
            // If we only want to show players that have a rank in this mode:
            // const hasRank = !!player.tiers[currentMode];
            // But usually we might want to show them anyway or at least rank them
            return matchesSearch;
        });

        // Sort players by tier properly (HT1 > MT1 > LT1 > HT2 > etc.)
        filtered.sort((a, b) => {
            if (currentMode === 'overall') {
                return b.points - a.points; // Highest points first
            }

            const tierA = a.tiers[currentMode] || 'ZZZ';
            const tierB = b.tiers[currentMode] || 'ZZZ';
            
            if (tierA === tierB) return 0;
            if (tierA === 'ZZZ') return 1;
            if (tierB === 'ZZZ') return -1;
            
            // Expected format: HT1, LT2, etc.
            const numA = parseInt(tierA.charAt(2)) || 99;
            const numB = parseInt(tierB.charAt(2)) || 99;
            
            if (numA !== numB) {
                return numA - numB; // Lower number is better (1 comes before 2)
            }
            
            // If numbers are the same, sort by H, M, L
            const letterWeight = { 'H': 1, 'M': 2, 'L': 3 };
            const weightA = letterWeight[tierA.charAt(0)] || 4;
            const weightB = letterWeight[tierB.charAt(0)] || 4;
            
            return weightA - weightB;
        });

        return filtered;
    }

    function renderLeaderboard() {
        const query = searchInput.value;
        const players = getPlayersForMode(query);
        leaderboardBody.innerHTML = '';
        
        const defaultSkin = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiM1NTUiLz48cGF0aCBkPSJNMTAgMTBoMjB2MjBIMTB6IiBmaWxsPSIjYjg5MDc4Ii8+PHBhdGggZD0iTTEwIDEwaDIwdjEwSDEweiIgZmlsbD0iIzNhMjgxOCIvPjxyZWN0IHg9IjE0IiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIyIiB5PSIyMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjE2IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNCIgZmlsbD0iIzNhMjgxOCIvPjxyZWN0IHg9IjI0IiB5PSIyMCIgd2lkdGg9IjIiIGhlaWdodD0iNCIgZmlsbD0iIzNhMjgxOCIvPjxyZWN0IHg9IjE2IiB5PSIyNiIgd2lkdGg9IjgiIGhlaWdodD0iMiIgZmlsbD0iIzZiNGIzYSIvPjwvc3ZnPg==';

        if (currentMode !== 'overall') {
            document.getElementById('tableHeader').style.display = 'none';
            leaderboardBody.style.display = 'none';
            const tiersGrid = document.getElementById('tiersGrid');
            tiersGrid.style.display = 'grid';
            tiersGrid.innerHTML = '';

            const tierCols = { 1: [], 2: [], 3: [], 4: [], 5: [] };

            players.forEach(player => {
                const t = player.tiers[currentMode];
                if (t) {
                    const numMatch = t.match(/\d+/);
                    const tNum = numMatch ? parseInt(numMatch[0]) : null;
                    if (tNum && tNum >= 1 && tNum <= 5) {
                        tierCols[tNum].push({player, tierStr: t});
                    }
                }
            });

            for (let i = 1; i <= 5; i++) {
                tierCols[i].sort((a, b) => {
                    if (a.tierStr < b.tierStr) return -1;
                    if (a.tierStr > b.tierStr) return 1;
                    return 0;
                });

                const colDiv = document.createElement('div');
                colDiv.className = 'tier-col';
                colDiv.style.setProperty('--index', i);
                
                let iconStr = currentMode;
                if (currentMode === 'ltm') iconStr = '2v2';
                
                let playersHtml = '';
                tierCols[i].forEach((pData) => {
                    const p = pData.player;
                    const isHT = pData.tierStr.includes('HT');
                    const badgeClass = isHT ? 'badge-ht' : 'badge-lt';

                    playersHtml += `
                        <div class="tier-player-card" data-pname="${p.name}">
                            <div class="mc-3d-head skin-head-${p.name}" style="--skin-url: url('https://minotar.net/skin/Steve'); width: 28px; height: 28px; margin-right: 8px;">
                                <div class="mc-3d-face mc-front"></div>
                                <div class="mc-3d-face mc-right"></div>
                                <div class="mc-3d-face mc-top"></div>
                                <div class="mc-3d-face mc-front-hat" style="opacity: 0.9;"></div>
                                <div class="mc-3d-face mc-right-hat" style="opacity: 0.9;"></div>
                                <div class="mc-3d-face mc-top-hat" style="opacity: 0.9;"></div>
                            </div>
                            <span class="tier-player-name">${p.name}</span>
                            <span class="tier-player-badge ${badgeClass}">${pData.tierStr}</span>
                        </div>
                    `;
                });

                colDiv.innerHTML = `
                    <div class="tier-col-header t-header-${i}">
                        <img src="https://mctiers.com/tier_icons/${iconStr}.svg" width="20" height="20" style="filter: brightness(0) invert(1);" onerror="this.style.display='none'">
                        Tier ${i}
                    </div>
                    <div class="tier-col-body">
                        ${playersHtml}
                    </div>
                `;

                tiersGrid.appendChild(colDiv);
            }

            tiersGrid.querySelectorAll('.tier-player-card').forEach(card => {
                card.addEventListener('click', () => {
                    const pname = card.getAttribute('data-pname');
                    const p = players.find(x => x.name === pname);
                    if (p) {
                        const subtitle = p.subtitle || 'Combat Master';
                        let subtitleIcon = 'combat_master.webp';
                        if (subtitle.toLowerCase().includes('ace')) subtitleIcon = 'combat_ace.webp';
                        else if (subtitle.toLowerCase().includes('specialist')) subtitleIcon = 'combat_specialist.svg';
                        else if (subtitle.toLowerCase().includes('novice') || subtitle.toLowerCase().includes('newbie')) subtitleIcon = 'combat_novice.svg';
                        else if (subtitle.toLowerCase().includes('rookie')) subtitleIcon = 'rookie.svg';
                        openPlayerModal(p, "-", "rank-default", subtitleIcon, defaultSkin);
                    }
                });
            });

            return;
        }

        // 'overall' view
        document.getElementById('tableHeader').style.display = 'flex';
        leaderboardBody.style.display = 'flex';
        document.getElementById('tiersGrid').style.display = 'none';

        if (players.length === 0) {
            leaderboardBody.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 32px;">No players found</div>';
            return;
        }

        players.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'player-row';
            row.style.setProperty('--index', index);

            // Determine rank background
            const rank = index + 1;
            let rankClass = 'rank-default';
            if (rank === 1) rankClass = 'rank-gold';
            else if (rank === 2) rankClass = 'rank-silver';
            else if (rank === 3) rankClass = 'rank-bronze';

            let tiersHtml = '';
            gamemodes.forEach(mode => {
                if (mode.id === 'overall') return;
                
                const tier = player.tiers[mode.id];
                let iconName = mode.id;
                if (mode.id === 'ltm') iconName = '2v2';
                
                if (tier) {
                    const tierClass = `tier-${tier}`;
                    tiersHtml += `
                        <div class="tier-item">
                            <img src="https://mctiers.com/tier_icons/${iconName}.svg" width="20" height="20" onerror="this.style.display='none'">
                            <span class="tier-badge ${tierClass}">${tier}</span>
                        </div>
                    `;
                } else {
                    tiersHtml += `
                        <div class="tier-item">
                            <div class="empty-icon-circle"></div>
                            <span class="tier-badge tier-none">-</span>
                        </div>
                    `;
                }
            });

            // Get the correct rank icon
            const subtitle = player.subtitle || 'Combat Master';
            let subtitleIcon = 'combat_master.webp';
            if (subtitle.toLowerCase().includes('ace')) subtitleIcon = 'combat_ace.webp';
            else if (subtitle.toLowerCase().includes('specialist')) subtitleIcon = 'combat_specialist.svg';
            else if (subtitle.toLowerCase().includes('novice') || subtitle.toLowerCase().includes('newbie')) subtitleIcon = 'combat_novice.svg';
            else if (subtitle.toLowerCase().includes('rookie')) subtitleIcon = 'rookie.svg';

            row.innerHTML = `
                <div class="player-rank ${rankClass}"><span>${rank}.</span></div>
                <div class="player-info">
                    <div class="mc-3d-head skin-head-${player.name}" style="--skin-url: url('https://minotar.net/skin/Steve'); width: 32px; height: 32px; margin-right: 12px;">
                        <div class="mc-3d-face mc-front"></div>
                        <div class="mc-3d-face mc-right"></div>
                        <div class="mc-3d-face mc-top"></div>
                        <div class="mc-3d-face mc-front-hat" style="opacity: 0.9;"></div>
                        <div class="mc-3d-face mc-right-hat" style="opacity: 0.9;"></div>
                        <div class="mc-3d-face mc-top-hat" style="opacity: 0.9;"></div>
                    </div>
                    <div class="player-text">
                        <div class="player-name">${player.name}</div>
                        <div class="player-subtitle">
                            <img src="ranks/${subtitleIcon}" class="subtitle-icon" alt="${subtitle}">
                            ${subtitle} <span class="points">(${player.points || 0} points)</span>
                        </div>
                    </div>
                </div>
                <div class="player-region"><span class="region-badge region-${player.region.toLowerCase()}">${player.region}</span></div>
                <div class="player-tiers">
                    ${tiersHtml}
                </div>
            `;

            // Click listener for Player Modal
            row.addEventListener('click', () => {
                openPlayerModal(player, rank, rankClass, subtitleIcon, defaultSkin);
            });

            leaderboardBody.appendChild(row);
        });

        // Load custom skins
        players.forEach(p => {
            const img = new Image();
            img.src = `skins/${p.name}.png`;
            img.onload = () => {
                document.querySelectorAll(`.skin-head-${p.name}`).forEach(el => {
                    el.style.setProperty('--skin-url', `url('skins/${p.name}.png')`);
                });
            };
        });
    }

    // Modal Logic
    const modal = document.getElementById('playerModal');
    const closeModal = document.getElementById('closeModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }

    function openPlayerModal(player, rank, rankClass, subtitleIcon, defaultSkin) {
        if (!modal) return;
        
        const modalSkin = document.getElementById('modalSkin');
        if (modalSkin) modalSkin.style.setProperty('--skin-url', `url('https://minotar.net/skin/Steve')`);
        
        const img = new Image();
        img.src = `skins/${player.name}.png`;
        img.onload = () => {
            if (modalSkin) modalSkin.style.setProperty('--skin-url', `url('skins/${player.name}.png')`);
        };

        document.getElementById('modalName').textContent = player.name;
        document.getElementById('modalSubtitleIcon').src = `ranks/${subtitleIcon}`;
        document.getElementById('modalSubtitleText').innerHTML = `${player.subtitle || 'Combat Master'} <span class="points">(${player.points || 0} points)</span>`;
        document.getElementById('modalRegion').textContent = player.region;
        document.getElementById('modalRegion').className = `region-badge region-${player.region.toLowerCase()}`;
        
        // Tiers grid
        let tiersHtml = '';
        gamemodes.forEach(mode => {
            const tier = player.tiers[mode.id];
            let iconName = mode.id;
            if (mode.id === 'ltm') iconName = '2v2';
            
            if (tier) {
                tiersHtml += `
                    <div class="modal-tier-card">
                        <img src="https://mctiers.com/tier_icons/${iconName}.svg" width="32" height="32">
                        <div class="mt-info">
                            <div class="mt-name">${mode.name}</div>
                            <div class="tier-badge tier-${tier}">${tier}</div>
                        </div>
                    </div>
                `;
            } else {
                tiersHtml += `
                    <div class="modal-tier-card empty">
                        <div class="empty-icon-circle" style="width: 32px; height: 32px;"></div>
                        <div class="mt-info">
                            <div class="mt-name">${mode.name}</div>
                            <div class="tier-badge tier-none">-</div>
                        </div>
                    </div>
                `;
            }
        });
        document.getElementById('modalTiers').innerHTML = tiersHtml;

        // History
        const historyContainer = document.getElementById('modalHistory');
        // We check if victoryHistory exists (from history.js)
        if (typeof victoryHistory !== 'undefined') {
            const playerHistory = victoryHistory.filter(h => h.player === player.name);
            if (playerHistory.length > 0) {
                let hHtml = '';
                playerHistory.forEach(h => {
                    hHtml += `
                        <div class="m-history-item">
                            <div><strong>${h.tournament}</strong> <span style="color:var(--text-muted);font-size:12px;">(${h.date})</span></div>
                            <div style="color:#fbbf24;font-weight:bold;">${h.result}</div>
                        </div>
                    `;
                });
                historyContainer.innerHTML = hHtml;
            } else {
                historyContainer.innerHTML = '<div style="color:var(--text-muted);font-size:14px;">Нет записей о победах.</div>';
            }
        }

        modal.classList.add('show');
    }

    // Event listeners
    searchInput.addEventListener('input', () => {
        renderLeaderboard();
    });

    // Initial render
    renderTabs();
    renderLeaderboard();
});
