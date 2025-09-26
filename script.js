class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.score = { X: 0, O: 0 };
        this.soundEnabled = true;
        
        // Éléments DOM
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerSymbol = document.getElementById('current-player-symbol');
        this.gameStatus = document.getElementById('game-status');
        this.homeBtn = document.getElementById('home-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.soundBtn = document.getElementById('sound-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.scoreX = document.getElementById('score-x');
        this.scoreO = document.getElementById('score-o');
        
        this.initializeGame();
    }
    
    initializeGame() {
        // Ajouter les event listeners (souris et tactile)
        this.cells.forEach((cell, index) => {
            // Événements souris
            cell.addEventListener('click', () => this.handleCellClick(index));
            cell.addEventListener('mouseenter', () => this.handleCellHover(index, true));
            cell.addEventListener('mouseleave', () => this.handleCellHover(index, false));
            
            // Événements tactiles
            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleCellTouchStart(index);
            });
            cell.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleCellTouchEnd(index);
            });
            cell.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });
        });
        
        this.homeBtn.addEventListener('click', () => window.location.href = 'index.html');
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.soundBtn.addEventListener('click', () => this.toggleSound());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Support tactile pour les boutons
        this.homeBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.homeBtn.classList.add('touch-active');
        });
        this.homeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.homeBtn.classList.remove('touch-active');
            window.location.href = 'index.html';
        });
        
        this.restartBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.restartBtn.classList.add('touch-active');
        });
        this.restartBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.restartBtn.classList.remove('touch-active');
            this.restartGame();
        });
        
        this.soundBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.soundBtn.classList.add('touch-active');
        });
        this.soundBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.soundBtn.classList.remove('touch-active');
            this.toggleSound();
        });
        
        this.fullscreenBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.fullscreenBtn.classList.add('touch-active');
        });
        this.fullscreenBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.fullscreenBtn.classList.remove('touch-active');
            this.toggleFullscreen();
        });
        
        this.updateDisplay();
    }
    
    handleCellClick(index) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        // Placer le symbole
        this.board[index] = this.currentPlayer;
        this.cells[index].textContent = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());
        
        // Vibration tactile pour le placement
        this.vibrate([50]);
        
        // Jouer le son néon pour le placement
        if (this.soundEnabled) {
            neonAudio.playNeonMove();
        }
        
        // Vérifier les conditions de fin de jeu
        if (this.checkWinner()) {
            this.handleGameEnd('winner');
            return;
        }
        
        if (this.checkDraw()) {
            this.handleGameEnd('draw');
            return;
        }
        
        // Changer de joueur
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateDisplay();
    }
    
    handleCellHover(index, isEntering) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        if (isEntering) {
            this.cells[index].setAttribute('data-hover', this.currentPlayer);
            this.cells[index].style.opacity = '0.7';
        } else {
            this.cells[index].removeAttribute('data-hover');
            this.cells[index].style.opacity = '1';
        }
    }
    
    handleCellTouchStart(index) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        // Ajouter un effet visuel au touch
        this.cells[index].style.transform = 'scale(0.95)';
        this.cells[index].style.opacity = '0.8';
        this.cells[index].setAttribute('data-hover', this.currentPlayer);
    }
    
    handleCellTouchEnd(index) {
        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }
        
        // Restaurer l'apparence normale
        this.cells[index].style.transform = 'scale(1)';
        this.cells[index].style.opacity = '1';
        this.cells[index].removeAttribute('data-hover');
        
        // Placer le symbole
        this.handleCellClick(index);
    }
    
    checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes horizontales
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Lignes verticales
            [0, 4, 8], [2, 4, 6] // Diagonales
        ];
        
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                // Marquer les cellules gagnantes
                this.cells[a].classList.add('winning');
                this.cells[b].classList.add('winning');
                this.cells[c].classList.add('winning');
                return true;
            }
        }
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
    
    handleGameEnd(result) {
        this.gameActive = false;
        
        if (result === 'winner') {
            this.score[this.currentPlayer]++;
            this.gameStatus.textContent = `🎉 Joueur ${this.currentPlayer} a gagné !`;
            this.gameStatus.classList.add('winner');
            this.updateScore();
            // Vibration de victoire
            this.vibrate([100, 50, 100]);
            // Jouer le son de victoire intense
            if (this.soundEnabled) {
                neonAudio.playNeonWin();
            }
        } else if (result === 'draw') {
            this.gameStatus.textContent = '🤝 Match nul !';
            this.gameStatus.classList.add('draw');
            // Vibration pour match nul
            this.vibrate([200]);
            // Jouer le son glitch pour match nul
            if (this.soundEnabled) {
                neonAudio.playGlitchDraw();
            }
        }
        
        // Désactiver les cellules
        this.cells.forEach(cell => {
            cell.style.cursor = 'not-allowed';
        });
    }
    
    updateDisplay() {
        this.currentPlayerSymbol.textContent = this.currentPlayer;
        this.currentPlayerSymbol.style.color = this.currentPlayer === 'X' ? '#ff0040' : '#00ff40';
    }
    
    updateScore() {
        this.scoreX.textContent = this.score.X;
        this.scoreO.textContent = this.score.O;
    }
    
    restartGame() {
        // Réinitialiser le plateau
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Nettoyer les cellules
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.cursor = 'pointer';
            cell.style.opacity = '1';
            cell.removeAttribute('data-hover');
        });
        
        // Nettoyer le statut
        this.gameStatus.textContent = '';
        this.gameStatus.className = 'game-status';
        
        this.updateDisplay();
    }
    
    // Fonction de vibration pour mobile
    vibrate(pattern) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }
    
    // Fonction pour basculer le mode plein écran
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Entrer en mode plein écran
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
            this.fullscreenBtn.textContent = '📱 Sortir';
        } else {
            // Sortir du mode plein écran
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.fullscreenBtn.textContent = '📱 Plein écran';
        }
    }
    
    // Fonction pour basculer le son
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.soundBtn.textContent = '🔊 Son';
            this.soundBtn.classList.remove('muted');
        } else {
            this.soundBtn.textContent = '🔇 Muet';
            this.soundBtn.classList.add('muted');
        }
    }
}

// Initialiser le jeu quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

// Système audio néon futuriste
class NeonAudioSystem {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio non supporté');
        }
    }
    
    // Son néon futuriste pour placement de symbole
    playNeonMove() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configuration du filtre pour un son futuriste
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.Q.setValueAtTime(10, this.audioContext.currentTime);
        
        // Fréquence qui monte puis descend (effet néon)
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1800, this.audioContext.currentTime + 0.05);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.15);
        
        // Enveloppe de volume
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    // Son intense pour victoire
    playNeonWin() {
        if (!this.audioContext) return;
        
        // Créer plusieurs oscillateurs pour un effet riche
        const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
        const oscillators = [];
        const gainNodes = [];
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Configuration du filtre
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3000, this.audioContext.currentTime);
            filter.Q.setValueAtTime(5, this.audioContext.currentTime);
            
            // Fréquence avec vibrato
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(freq * 1.2, this.audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(freq * 0.8, this.audioContext.currentTime + 0.2);
            
            // Enveloppe de volume avec délai
            const delay = index * 0.05;
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + delay + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + 0.5);
            
            oscillator.start(this.audioContext.currentTime + delay);
            oscillator.stop(this.audioContext.currentTime + delay + 0.5);
            
            oscillators.push(oscillator);
            gainNodes.push(gainNode);
        });
    }
    
    // Son glitch pour match nul
    playGlitchDraw() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        const distortion = this.audioContext.createWaveShaper();
        
        oscillator.connect(filter);
        filter.connect(distortion);
        distortion.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configuration du filtre glitch
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.Q.setValueAtTime(20, this.audioContext.currentTime);
        
        // Distorsion pour effet glitch
        const samples = 44100;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = Math.tanh(x * 10) * 0.5;
        }
        distortion.curve = curve;
        distortion.oversample = '4x';
        
        // Fréquence qui glitch
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.4);
        
        // Enveloppe de volume avec coupures
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.06);
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.11);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
}

// Instance globale du système audio
const neonAudio = new NeonAudioSystem();

// Améliorer l'expérience utilisateur avec des raccourcis clavier
document.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        document.getElementById('restart-btn').click();
    } else if (event.key === 'f' || event.key === 'F') {
        document.getElementById('fullscreen-btn').click();
    } else if (event.key === 's' || event.key === 'S') {
        document.getElementById('sound-btn').click();
    }
});

// Gestion des événements de changement de plein écran
document.addEventListener('fullscreenchange', () => {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (document.fullscreenElement) {
        fullscreenBtn.textContent = '📱 Sortir';
    } else {
        fullscreenBtn.textContent = '📱 Plein écran';
    }
});

// Prévenir le zoom sur double-tap pour mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Ajouter un message d'aide
setTimeout(() => {
    if (document.querySelector('.game-status').textContent === '') {
        document.querySelector('.game-status').innerHTML = '💡 Raccourcis: R=Rejouer, F=Plein écran, S=Son';
    }
}, 2000);
