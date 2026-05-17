// script.js
class VotingPlatform {
    constructor() {
        this.candidates = [];
        this.filteredCandidates = [];
        this.verifiedNumber = null;
        this.isVerifying = false;
        this.currentFilter = 'all';
        this.voteAttempts = 0;
        
        this.init();
    }

    init() {
        this.generateCandidates();
        this.setupEventListeners();
        this.renderCandidates();
        this.updateActivityLog();
    }

    generateCandidates() {
        // ============================================
        // 👇 ADD YOUR PERMANENT NAMES HERE 👇
        // These names will NEVER change
        // Format: { name: "Full Name", country: "Country", votes: 100-200 }
        // ============================================
        
        const permanentCandidates = [
            // NIGERIA
            { name: "Adebayo Ogunlesi", country: "Nigeria", votes: 167 },
            { name: "Chiamaka Nwosu", country: "Nigeria", votes: 189 },
            { name: "Olumide Adeyemi", country: "Nigeria", votes: 45 },
            { name: "Ngozi Okonkwo", country: "Nigeria", votes: 108 },
            { name: "Ibrahim Tanko", country: "Nigeria", votes: 156 },
            { name: "Blessing Okafor", country: "Nigeria", votes: 34 },
            { name: "David Eze", country: "Nigeria", votes: 192 },
            { name: "Fatima Bello", country: "Nigeria", votes: 103 },
            { name: "Aisha Mohammed", country: "Nigeria", votes: 128 },
            { name: "Tunde Bakare", country: "Nigeria", votes: 176 },
            { name: "Ayinla Samuel", country: "Nigeria", votes: 155 },
            { name: "Yusuf Adebisi", country: "Nigeria", votes: 38 },
            { name: "Grace Emmanuel", country: "Nigeria", votes: 142 },
            { name: "Samuel Adekunle", country: "Nigeria", votes: 149 },
            
            // OTHER AFRICAN COUNTRIES
            { name: "Kwame Asante", country: "Ghana", votes: 157 },
            { name: "Amina Diop", country: "Senegal", votes: 142 },
            { name: "Brian Otieno", country: "Kenya", votes: 168 },
            { name: "Thabo Molefe", country: "South Africa", votes: 173 },
            { name: "Zainab Mohammed", country: "Sudan", votes: 136 },
            { name: "Yvonne Mugisha", country: "Rwanda", votes: 151 },
            { name: "Samuel Bekele", country: "Ethiopia", votes: 144 },
            { name: "Fatima Coulibaly", country: "Mali", votes: 129 },
            { name: "Musa Kamara", country: "Sierra Leone", votes: 161 },
            { name: "Lindiwe Dlamini", country: "Eswatini", votes: 133 },
            { name: "Tendai Makoni", country: "Zimbabwe", votes: 147 },
            { name: "Grace Auma", country: "Uganda", votes: 158 },
            { name: "Jean-Paul Ndayishimiye", country: "Burundi", votes: 131 },
            { name: "Mohamed Elmi", country: "Somalia", votes: 124 },
            { name: "Naledi Khama", country: "Botswana", votes: 139 },
            { name: "Aya Traoré", country: "Côte d'Ivoire", votes: 162 },
            { name: "Prisca Furaha", country: "Tanzania", votes: 148 },
            { name: "Farouk Abdul", country: "Egypt", votes: 153 },
            { name: "Mpho Ramaphosa", country: "South Africa", votes: 141 },
            { name: "Oluchi Egbuna", country: "Nigeria", votes: 127 },
            
            // ============================================
            // 👆 ADD MORE NAMES ABOVE THIS LINE 👆
            // They will appear in order and won't change
            // ============================================
        ];

        // Assign IDs and avatars
        this.candidates = permanentCandidates.map((candidate, index) => ({
            id: index + 1,
            name: candidate.name,
            country: candidate.country,
            votes: candidate.votes,
            avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
            verified: true
        }));

        // Sort by votes descending
        this.candidates.sort((a, b) => b.votes - a.votes);
        this.filteredCandidates = [...this.candidates];
    }

    setupEventListeners() {
        // Verification form
        document.getElementById('verificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startVerification();
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterCandidates(e.target.value, this.currentFilter);
        });

        // Filter chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterCandidates(
                    document.getElementById('searchInput').value,
                    this.currentFilter
                );
            });
        });

        // Modal buttons
        document.getElementById('cancelVote').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('confirmVote').addEventListener('click', () => {
            this.processVote();
        });
    }

    filterCandidates(searchTerm, countryFilter) {
        searchTerm = searchTerm.toLowerCase();
        
        this.filteredCandidates = this.candidates.filter(candidate => {
            const matchesSearch = candidate.name.toLowerCase().includes(searchTerm) ||
                                 candidate.country.toLowerCase().includes(searchTerm);
            const matchesCountry = countryFilter === 'all' || candidate.country === countryFilter;
            return matchesSearch && matchesCountry;
        });

        this.renderCandidates();
    }

    renderCandidates() {
        const grid = document.getElementById('candidatesGrid');
        const countEl = document.getElementById('candidateCount');
        
        countEl.textContent = `${this.filteredCandidates.length} candidates`;
        
        grid.innerHTML = this.filteredCandidates.map(candidate => `
            <div class="candidate-card" data-id="${candidate.id}">
                <img 
                    src="${candidate.avatar}" 
                    alt="${candidate.name}"
                    class="candidate-avatar"
                    onerror="this.src='https://i.pravatar.cc/150?u=${candidate.id}'"
                >
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-country">
                    <i class="fas fa-map-pin"></i>
                    ${candidate.country}
                </div>
                <div class="candidate-votes">
                    <i class="fas fa-check-to-slot"></i>
                    ${candidate.votes} votes
                </div>
                <button class="btn-vote" onclick="platform.initiateVote(${candidate.id})">
                    <i class="fas fa-plus-circle"></i>
                    Vote
                </button>
            </div>
        `).join('');
    }

    startVerification() {
        if (this.isVerifying) return;

        const whatsapp = document.getElementById('whatsapp').value.trim();
        const social = document.getElementById('social').value.trim();

        if (!whatsapp || whatsapp.length < 10) {
            this.showToast('Please enter a valid WhatsApp number with country code', 'warning');
            return;
        }

        this.isVerifying = true;
        const verifyBtn = document.getElementById('verifyBtn');
        verifyBtn.disabled = true;

        const statusDiv = document.getElementById('verificationStatus');
        const statusMessage = document.getElementById('statusMessage');
        const spinner = document.getElementById('statusSpinner');
        const progressFill = document.getElementById('progressFill');

        statusDiv.classList.remove('hidden');
        spinner.classList.remove('hidden');
        progressFill.style.width = '0%';

        // Simulate verification stages
        const stages = [
            { message: 'Validating number format...', progress: 20, delay: 800 },
            { message: 'Checking account age & history...', progress: 45, delay: 1200 },
            { message: 'Cross-referencing professional profiles...', progress: 70, delay: 1500 },
            { message: 'Analyzing voting eligibility...', progress: 90, delay: 1000 }
        ];

        let currentStage = 0;

        const processStage = () => {
            if (currentStage < stages.length) {
                const stage = stages[currentStage];
                statusMessage.textContent = stage.message;
                progressFill.style.width = stage.progress + '%';
                
                currentStage++;
                setTimeout(processStage, stage.delay);
            } else {
                this.completeVerification(whatsapp, social, statusDiv, spinner, statusMessage, progressFill, verifyBtn);
            }
        };

        setTimeout(processStage, 500);
    }

    completeVerification(whatsapp, social, statusDiv, spinner, statusMessage, progressFill, verifyBtn) {
        const success = Math.random() > 0.3;
        
        spinner.classList.add('hidden');
        
        if (success) {
            this.verifiedNumber = whatsapp;
            statusMessage.innerHTML = `
                <i class="fas fa-circle-check" style="color: var(--success);"></i>
                Verification successful. You may now vote.
            `;
            progressFill.style.width = '100%';
            progressFill.style.background = 'var(--success)';
            
            this.showToast('Identity verified successfully', 'success');
            this.updateActivityLog(whatsapp);
        } else {
            this.verifiedNumber = null;
            const errors = [
                'Network timeout. Verification server unreachable.',
                'Suspicious activity detected. Manual review required.',
                'Number not recognized in our database.',
                'Region mismatch. Please use a valid African number.',
                'Bot detection triggered. Human verification failed.'
            ];
            const errorMsg = errors[Math.floor(Math.random() * errors.length)];
            
            statusMessage.innerHTML = `
                <i class="fas fa-circle-exclamation" style="color: var(--error);"></i>
                ${errorMsg}
            `;
            progressFill.style.width = '100%';
            progressFill.style.background = 'var(--error)';
            
            this.showToast(errorMsg, 'error');
        }

        this.isVerifying = false;
        verifyBtn.disabled = false;

        setTimeout(() => {
            statusDiv.classList.add('hidden');
            progressFill.style.width = '0%';
            progressFill.style.background = 'var(--accent)';
        }, 5000);
    }

    initiateVote(candidateId) {
        if (!this.verifiedNumber) {
            this.showToast('Please verify your identity before voting', 'warning');
            return;
        }

        if (this.isVerifying) {
            this.showToast('Verification in progress. Please wait.', 'warning');
            return;
        }

        const candidate = this.candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        const botDetected = Math.random() < 0.4;
        
        if (botDetected) {
            this.showVoteError(candidate);
            return;
        }

        this.selectedCandidate = candidate;
        const modal = document.getElementById('voteModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <img src="${candidate.avatar}" alt="${candidate.name}" 
                     style="width: 64px; height: 64px; border-radius: 50%; margin-bottom: 0.5rem;">
                <div style="font-weight: 600; font-size: 1rem;">${candidate.name}</div>
                <div style="color: var(--text-tertiary); font-size: 0.85rem;">
                    <i class="fas fa-map-pin"></i> ${candidate.country}
                </div>
            </div>
            <p style="text-align: center; color: var(--text-secondary);">
                You are about to vote for this candidate. This action cannot be undone.
            </p>
        `;
        
        modal.classList.remove('hidden');
    }

    showVoteError(candidate) {
        const errors = [
            'Suspicious voting pattern detected. Vote blocked.',
            'Bot activity suspected. Please try again later.',
            'Verification token expired. Please re-verify.',
            'Multiple votes detected from this number.',
            'IP address flagged for automated voting.'
        ];
        
        const errorMsg = errors[Math.floor(Math.random() * errors.length)];
        
        this.showToast(`${errorMsg} Contact ${candidate.name} directly.`, 'error');
        
        this.addActivityItem(
            `Vote blocked for ${candidate.name}. Contact candidate directly.`,
            'error'
        );
    }

    processVote() {
        if (!this.selectedCandidate) return;

        const processingError = Math.random() < 0.2;
        
        if (processingError) {
            this.closeModal();
            this.showToast(
                `Verification failed during submission. Please contact ${this.selectedCandidate.name}.`,
                'error'
            );
            return;
        }

        this.selectedCandidate.votes++;
        
        this.candidates.sort((a, b) => b.votes - a.votes);
        this.filterCandidates(
            document.getElementById('searchInput').value,
            this.currentFilter
        );
        
        this.addActivityItem(
            `Voted for ${this.selectedCandidate.name}`,
            'success'
        );
        
        this.showToast(`Vote cast for ${this.selectedCandidate.name}`, 'success');
        this.closeModal();
    }

    closeModal() {
        document.getElementById('voteModal').classList.add('hidden');
        this.selectedCandidate = null;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };
        
        toast.innerHTML = `
            <i class="fas ${icons[type]}" style="color: var(--${type === 'info' ? 'accent' : type});"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    updateActivityLog(number = null) {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';
        
        if (number) {
            this.addActivityItem(`Number ${number} verified`, 'success');
        }
        
        this.addActivityItem('System ready for voting', 'info');
    }

    addActivityItem(message, type = 'info') {
        const activityList = document.getElementById('activityList');
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };
        
        const colors = {
            success: 'var(--success)',
            error: 'var(--error)',
            warning: 'var(--warning)',
            info: 'var(--accent)'
        };
        
        item.innerHTML = `
            <i class="fas ${icons[type]}" style="color: ${colors[type]};"></i>
            <span>${message}</span>
        `;
        
        activityList.insertBefore(item, activityList.firstChild);
        
        while (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
    }
}

// Initialize platform
const platform = new VotingPlatform();