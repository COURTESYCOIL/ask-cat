// --- 1. GET ALL ELEMENTS ---
const elements = {
    loadingScreen: document.getElementById('loading-screen'), startButton: document.getElementById('start-button'),
    tosScreen: document.getElementById('tos-screen'), acceptButton: document.getElementById('accept-button'),
    startScreen: document.getElementById('start-screen'), playButton: document.getElementById('play-button'),
    gameScreen: document.getElementById('game-screen'), catImage: document.getElementById('cat-image'),
    achievementsButton: document.getElementById('achievements-button'), aiBubble: document.getElementById('ai-bubble'),
    aiResponseText: document.getElementById('ai-response-text'), promptForm: document.getElementById('prompt-form'),
    promptInput: document.getElementById('prompt-input'), promptSubmit: document.getElementById('prompt-submit'),
    gameBackButton: document.getElementById('game-back-button'), achievementsScreen: document.getElementById('achievements-screen'),
    achievementsBackButton: document.getElementById('achievements-back-button'), achievementPopup: document.getElementById('achievement-popup'),
    gifBubble: document.getElementById('gif-bubble'), creditsButton: document.getElementById('credits-button'),
    creditsScreen: document.getElementById('credits-screen'), announcementGif: document.getElementById('announcement-gif'),
    announcementModal: document.getElementById('announcement-modal'), modalCloseButton: document.querySelector('.modal-close'),
    communityButton: document.getElementById('community-button'), communityScreen: document.getElementById('community-screen'),
    communityBackButton: document.getElementById('community-back-button'), deleteProgressButton: document.getElementById('delete-progress-button'),
    tosAudio: document.getElementById('tos-audio'), menuAudio: document.getElementById('menu-audio'),
    achievementsAudio: document.getElementById('achievements-audio'), creditsAudio: document.getElementById('credits-audio'),
    jumpscareScreen: document.getElementById('jumpscare-screen'), runningCat: document.getElementById('running-cat'),
    jumpscareExplosion: document.getElementById('jumpscare-explosion'), blackOverlay: document.getElementById('black-overlay'),
    squeakAudio: document.getElementById('squeak-audio'), watchoutAudio: document.getElementById('watchout-audio'),
    explosionAudio: document.getElementById('explosion-audio'), boomAudio: document.getElementById('boom-audio'),
};

const allScreens = [elements.loadingScreen, elements.tosScreen, elements.startScreen, elements.gameScreen, elements.achievementsScreen, elements.creditsScreen, elements.communityScreen, elements.jumpscareScreen];
const allAudio = [elements.tosAudio, elements.menuAudio, elements.achievementsAudio, elements.creditsAudio, elements.squeakAudio, elements.watchoutAudio, elements.explosionAudio, elements.boomAudio];

// --- 2. STATE AND DATA ---
let interactionCount = 0;
let isNewPlayer = true;
let achievements = {
    firstWords: { unlocked: false, card: document.getElementById('ach-first-words'), title: document.getElementById('ach-first-words-title'), desc: document.getElementById('ach-first-words-desc'), status: document.querySelector('#ach-first-words .achievement-status') },
    interactions100: { unlocked: false, card: document.getElementById('ach-100-interactions'), title: document.getElementById('ach-100-interactions-title'), desc: document.getElementById('ach-100-interactions-desc'), status: document.querySelector('#ach-100-interactions .achievement-status') },
    petpet: { unlocked: false, card: document.getElementById('ach-petpet'), title: document.getElementById('ach-petpet-title'), desc: document.getElementById('ach-petpet-desc'), status: document.querySelector('#ach-petpet .achievement-status') },
    jumpscare: { unlocked: false, card: document.getElementById('ach-jumpscare'), title: document.getElementById('ach-jumpscare-title'), desc: document.getElementById('ach-jumpscare-desc'), status: document.querySelector('#ach-jumpscare .achievement-status') }
};

// --- FIXED: Cat's brain is now back inside the main script ---


// --- 3. UTILITY FUNCTIONS ---
function showScreen(screenToShow) { allScreens.forEach(screen => screen.style.display = 'none'); screenToShow.style.display = 'flex'; lazyLoadImages(screenToShow); }
function stopAllAudio(except = null) {
    allAudio.forEach(audio => {
        if (audio !== except) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}
function playAudio(audioToPlay) {
    stopAllAudio(audioToPlay);
    if (audioToPlay) {
        const playPromise = audioToPlay.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                if (error.name !== 'AbortError') {
                    console.error('Audio playback error:', error);
                }
            });
        }
    }
}
function lazyLoadImages(container) { const imagesToLoad = container.querySelectorAll('img[data-src]'); imagesToLoad.forEach(img => { if (!img.src) { img.src = img.getAttribute('data-src'); } }); }
function getCatResponse(userInput) { const lowerInput = userInput.toLowerCase(); for (const keyword in catResponses) { if (lowerInput.includes(keyword)) { return catResponses[keyword]; } } const randomIndex = Math.floor(Math.random() * defaultCatResponses.length); return defaultCatResponses[randomIndex]; }
function typeResponse(text) { let i = 0; elements.aiResponseText.innerHTML = ''; const typingInterval = setInterval(() => { if (i < text.length) { elements.aiResponseText.innerHTML += text.charAt(i); i++; } else { clearInterval(typingInterval); elements.promptInput.disabled = false; elements.promptSubmit.disabled = false; elements.promptInput.focus(); } }, 50); }
function checkForPetpet(userInput) { const lowerInput = userInput.toLowerCase(); const petpetTriggers = ["petpet", "pet the cat", "good kitty", "good boy", "good girl", "head pats", "who's a good kitty"]; return petpetTriggers.some(trigger => lowerInput.includes(trigger)); }

// Christmas Update - Holiday Season Check
function isHolidaySeason() {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();
    // November 28 - December 31 OR January 1-2
    return (month === 11 && day >= 28) || (month === 12) || (month === 1 && day <= 2);
}

// Toggle Christmas Lights
function toggleChristmasEvent() {
    const lightrope = document.querySelector('.lightrope');
    const christmasLabel = document.querySelector('.christmas-event-label');
    if (isHolidaySeason() && lightrope && christmasLabel) {
        lightrope.style.display = 'block';
        christmasLabel.style.display = 'block';
    } else if (lightrope && christmasLabel) {
        lightrope.style.display = 'none';
        christmasLabel.style.display = 'none';
    }
}

// --- Achievement & Progress Logic ---
function applyProgressData(progress) {
    interactionCount = progress.interactionCount || 0;
    if (progress.jumpscareHasOccurred) { localStorage.setItem('jumpscareHasOccurred', 'true'); }
    if (progress.unlockedAchievements.firstWords) unlockAchievement('firstWords', false);
    if (progress.unlockedAchievements.interactions100) unlockAchievement('interactions100', false);
    if (progress.unlockedAchievements.petpet) unlockAchievement('petpet', false);
    if (progress.unlockedAchievements.jumpscare) unlockAchievement('jumpscare', false);
}

async function saveProgress() {
    const progress = {
        interactionCount: interactionCount,
        jumpscareHasOccurred: localStorage.getItem('jumpscareHasOccurred') === 'true',
        unlockedAchievements: { firstWords: achievements.firstWords.unlocked, interactions100: achievements.interactions100.unlocked, petpet: achievements.petpet.unlocked, jumpscare: achievements.jumpscare.unlocked }
    };
    try {
        localStorage.setItem('askCatProgress', JSON.stringify(progress));
        await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(progress)
        });
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

async function loadProgress() {
    let progressLoaded = false;
    try {
        const response = await fetch('/api/progress');
        if (response.ok) {
            isNewPlayer = false;
            const progress = await response.json();
            applyProgressData(progress);
            localStorage.setItem('askCatProgress', JSON.stringify(progress)); // Sync backend progress to local storage
            progressLoaded = true;
        }
    } catch (error) {
        console.error('Failed to load progress from backend:', error);
    }

    if (!progressLoaded) {
        const localProgress = localStorage.getItem('askCatProgress');
        if (localProgress) {
            isNewPlayer = false;
            applyProgressData(JSON.parse(localProgress));
            console.log('Progress loaded from local storage.');
        } else {
            console.log('No local progress found. Starting new player.');
        }
    }
}

function unlockAchievement(key, showPopup = true) {
    if (!achievements[key] || achievements[key].unlocked) return;
    achievements[key].unlocked = true;
    const ach = achievements[key];
    
    ach.card.classList.remove('locked');
    ach.card.classList.add('unlocked');
    ach.status.textContent = 'Unlocked';

    const titles = { firstWords: 'First Words', interactions100: '100 Interactions!', petpet: 'Petpet!', jumpscare: 'Cat Jumpscare' };
    const descs = { firstWords: 'Begin your journey by asking the cat your first question.', interactions100: 'Reached 100 interactions with the cat.', petpet: "Who's a good kitty?", jumpscare: "You survived the surprise!" };

    ach.title.textContent = titles[key];
    ach.desc.textContent = descs[key];

    if (showPopup) {
        elements.achievementPopup.textContent = `Achievement Unlocked: ${titles[key]}`;
        elements.achievementPopup.classList.add('show');
        setTimeout(() => { elements.achievementPopup.classList.remove('show'); }, 4000);
    }

    saveProgress();
}

function resetProgress() {
    localStorage.removeItem('askCatProgress');
    localStorage.removeItem('jumpscareHasOccurred');
    interactionCount = 0;
    
    for (const key in achievements) {
        const ach = achievements[key];
        ach.unlocked = false;
        ach.card.classList.add('locked');
        ach.card.classList.remove('unlocked');
        ach.status.textContent = 'Locked';
        ach.title.textContent = '???';
        ach.desc.textContent = '???';
    }
    
    alert('Progress has been deleted.');
}

// Jumpscare Sequence
function startJumpscare() {
    stopAllAudio();
    showScreen(elements.jumpscareScreen);
    localStorage.setItem('jumpscareHasOccurred', 'true');
    saveProgress();
    elements.runningCat.src = 'Assets/Sprites/cat_run.gif';
    elements.squeakAudio.play();
    elements.watchoutAudio.play();
    setTimeout(climaxJumpscare, 3800);
}

function climaxJumpscare() {
    elements.squeakAudio.pause();
    elements.watchoutAudio.pause();
    elements.jumpscareExplosion.style.display = 'block';
    elements.jumpscareExplosion.src = 'Assets/Sprites/explosion.gif';
    elements.explosionAudio.play();
    setTimeout(endJumpscare, 1500);
}

function endJumpscare() {
    elements.jumpscareExplosion.style.display = 'none';
    elements.blackOverlay.style.display = 'block';
    showScreen(elements.startScreen);
    playAudio(elements.menuAudio);
    elements.blackOverlay.style.animation = 'fade-out 1s ease-out forwards';
    unlockAchievement('jumpscare');
    elements.boomAudio.play();
    setTimeout(() => {
        elements.blackOverlay.style.display = 'none';
        elements.blackOverlay.style.animation = '';
    }, 1000);
}

// --- 4. EVENT LISTENERS ---
function initEventListeners() {
    elements.startButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.tosScreen); playAudio(elements.tosAudio); });
    elements.acceptButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.startScreen); playAudio(elements.menuAudio); });
    
    elements.playButton.addEventListener('click', (e) => {
        e.preventDefault();
        const hasHappened = localStorage.getItem('jumpscareHasOccurred') === 'true';
        const loadCount = parseInt(localStorage.getItem('askCatLoadCount') || '1', 10);
        const chance = Math.floor(Math.random() * 10);
        
        if (loadCount >= 3 && !hasHappened && chance === 0) {
            startJumpscare();
        } else {
            showScreen(elements.gameScreen); 
            stopAllAudio();
        }
    });

    elements.creditsButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.creditsScreen); playAudio(elements.creditsAudio); });
    elements.creditsScreen.addEventListener('click', () => { showScreen(elements.startScreen); playAudio(elements.menuAudio); });
    elements.communityButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.communityScreen); stopAllAudio(); });
    elements.communityBackButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.startScreen); playAudio(elements.menuAudio); });
    
    const achievementToggles = document.querySelectorAll('.category-header');
    achievementToggles.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggleButton = header.querySelector('.category-toggle');
            content.classList.toggle('collapsed');
            toggleButton.textContent = content.classList.contains('collapsed') ? '[+]' : '[-]';
        });
    });

    elements.achievementsButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.achievementsScreen); playAudio(elements.achievementsAudio); });
    elements.achievementsBackButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.startScreen); playAudio(elements.menuAudio); });
    elements.catImage.addEventListener('click', () => { const isHidden = elements.gifBubble.style.display === 'none' || elements.gifBubble.style.display === ''; elements.gifBubble.style.display = isHidden ? 'block' : 'none'; elements.aiBubble.style.display = 'none'; });
    elements.gameBackButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.startScreen); playAudio(elements.menuAudio); elements.aiBubble.style.display = 'none'; elements.gifBubble.style.display = 'none'; elements.aiResponseText.innerHTML = 'Ask me something...'; elements.promptInput.value = ''; });
    elements.announcementGif.addEventListener('click', () => { elements.announcementModal.style.display = 'flex'; });
    elements.modalCloseButton.addEventListener('click', () => { elements.announcementModal.style.display = 'none'; });

    elements.deleteProgressButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete all your progress? This cannot be undone.')) {
            resetProgress();
        }
    });

    elements.promptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userPrompt = elements.promptInput.value.trim();
        if (!userPrompt) return;
        elements.gifBubble.style.display = 'none'; elements.aiBubble.style.display = 'block';
        elements.promptInput.disabled = true; elements.promptSubmit.disabled = true;
        
        const catResponse = getCatResponse(userPrompt);
        typeResponse(catResponse);
        
        interactionCount++;
        saveProgress();

        if (!achievements.firstWords.unlocked) { unlockAchievement('firstWords'); }
        if (interactionCount >= 100 && !achievements.interactions100.unlocked) { unlockAchievement('interactions100'); }
        if (checkForPetpet(userPrompt) && !achievements.petpet.unlocked) {
            unlockAchievement('petpet');
            const originalSrc = elements.catImage.src;
            elements.catImage.src = 'Assets/Sprites/petpet.gif';
            setTimeout(() => { elements.catImage.src = originalSrc; }, 10000);
        }

        elements.promptInput.value = '';
    });
}

// --- 5. START THE APP ---
loadProgress();
initEventListeners();
toggleChristmasEvent();
