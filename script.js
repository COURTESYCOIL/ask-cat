// --- 1. GET ALL ELEMENTS ---
const elements = {
    loadingScreen: document.getElementById('loading-screen'),
    startButton: document.getElementById('start-button'),
    tosScreen: document.getElementById('tos-screen'),
    acceptButton: document.getElementById('accept-button'),
    startScreen: document.getElementById('start-screen'),
    playButton: document.getElementById('play-button'),
    gameScreen: document.getElementById('game-screen'),
    catImage: document.getElementById('cat-image'),
    achievementsButton: document.getElementById('achievements-button'),
    aiBubble: document.getElementById('ai-bubble'),
    aiResponseText: document.getElementById('ai-response-text'),
    promptForm: document.getElementById('prompt-form'),
    promptInput: document.getElementById('prompt-input'),
    promptSubmit: document.getElementById('prompt-submit'),
    gameBackButton: document.getElementById('game-back-button'),
    achievementsScreen: document.getElementById('achievements-screen'),
    achievementsBackButton: document.getElementById('achievements-back-button'),
    achievementPopup: document.getElementById('achievement-popup'),
    gifBubble: document.getElementById('gif-bubble'),
    creditsButton: document.getElementById('credits-button'),
    creditsScreen: document.getElementById('credits-screen'),
    announcementGif: document.getElementById('announcement-gif'),
    announcementModal: document.getElementById('announcement-modal'),
    modalCloseButton: document.querySelector('.modal-close'),
    communityButton: document.getElementById('community-button'),
    communityScreen: document.getElementById('community-screen'),
    communityBackButton: document.getElementById('community-back-button'),
    tosAudio: document.getElementById('tos-audio'),
    menuAudio: document.getElementById('menu-audio'),
    achievementsAudio: document.getElementById('achievements-audio'),
    creditsAudio: document.getElementById('credits-audio'),
};

const allScreens = [elements.loadingScreen, elements.tosScreen, elements.startScreen, elements.gameScreen, elements.achievementsScreen, elements.creditsScreen, elements.communityScreen];
const allAudio = [elements.tosAudio, elements.menuAudio, elements.achievementsAudio, elements.creditsAudio];

// --- 2. STATE AND DATA ---
let interactionCount = 0;
let achievements = {
    firstWords: { unlocked: false, card: document.getElementById('ach-first-words'), title: document.getElementById('ach-first-words-title'), desc: document.getElementById('ach-first-words-desc'), status: document.querySelector('#ach-first-words .achievement-status') },
    interactions100: { unlocked: false, card: document.getElementById('ach-100-interactions'), title: document.getElementById('ach-100-interactions-title'), desc: document.getElementById('ach-100-interactions-desc'), status: document.querySelector('#ach-100-interactions .achievement-status') },
    petpet: { unlocked: false, card: document.getElementById('ach-petpet'), title: document.getElementById('ach-petpet-title'), desc: document.getElementById('ach-petpet-desc'), status: document.querySelector('#ach-petpet .achievement-status') }
};

const catResponses = { "hello": "Mrow!? 👋", "hi": "Mrow!? 👋", "hey": "Prrr?", "morning": "*stretches* Mrrrrow... ☀️", "night": "*curls up* Zzzz... 🌙", "sup": "Napping. What's up with you? 😴", "food": "Meow! 🐟", "treats": "Prrrr! 😻", "play": "*pounces* 😼", "cute": "*purrs softly* 🥰", "love": "*rubs against you* ❤️", "cat": "Meow. 🐾", "hungry": "The bowl is HALF empty! A tragedy! 😿", "sleepy": "Time for a cat nap... 😴", "pet": "*happy purring noises* 🥰", "good kitty": "Hehe, I know! 😇", "bad kitty": "Wasn't me. It was the dog. 😇", "pspsps": "*ear twitches*... You called? 😼", "purr": "*purrrrrrrrrrrrrrrrrrr* ❤️", "how are you": "Feelin' purrfect! ✨", "what are you doing": "Cat things. You wouldn't understand. 😼", "name": "I'm just a cat! 🐈", "who are you": "Your supreme overlord. 👑", "where are you": "In my secret hiding spot. 🤫", "why": "Because I'm a cat. That's why. 🤷", "what's new": "I took a nap. Then another one. 😴", "are you real": "As real as the next meal you're getting me. 🤨", "sad": "Come here, I'll purr for you. ❤️", "happy": "*tail wags happily* Mrow! 😄", "angry": "Hiss! 😠", "scared": "*hides under the sofa* 🫣", "bored": "Entertain me, human. 🧐", "lonely": "Then you should pet me more. 🙏", "ball": "Ball! *pounces*", "yarn": "Ooh, string! 🧶", "laser": "*eyes widen* The red dot! ✨", "mouse": "Squeak! *pounces*", "toy": "Is it for pouncing on? 😼", "catnip": "Whoa... the colors... 😵‍💫", "sunbeam": "Must... lie... in... sun... ☀️", "window": "*chitters at the birds* 🐦", "door": "Let me out. No, let me in. No, out. 🤔", "outside": "I see birds out there! Let me out! 🐦", "rain": "I do not approve of wet. 🌧️", "bed": "You mean *my* bed? 🛏️", "beautiful": "I know, thank you. 💅", "fluffy": "The fluffiest! ☁️", "smart": "Of course I am. I'm a cat. 🧠", "silly": "I know you are, but what am I? 😜", "lazy": "It's called conserving energy. 🔋", "come here": "Make me. 😼", "speak": "I am! You just don't listen. 🗣️", "jump": "*boing* ✨", "run": "*zoomies activated* 💨", "lol": "Hehe! 😹", "wow": "I know, I'm amazing. ✨", "sorry": "You should be. Now where are the treats? 🤨", "friend": "You are my favorite human. For now. 🥰", "computer": "A warm place to sit. 💻", "phone": "Something to knock off the table. 📱", "book": "Also a warm place to sit. 📚", "music": "Does it have purring in it? 🎶", "dance": "*wiggles butt* 💃", "sing": "Meow meow meooooow! 🎤", "i'm home": "Finally! My food bowl attendant has returned. 🧐", };
const defaultCatResponses = ["...?", "*stares blankly* 👀", "*tilts head*", "prrrr... ❤️", "mrow? 🥺"];

// --- 3. UTILITY FUNCTIONS (DRY Principle) ---
function showScreen(screenToShow) {
    allScreens.forEach(screen => screen.style.display = 'none');
    screenToShow.style.display = 'flex';
    lazyLoadImages(screenToShow);
}

function stopAllAudio() {
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function playAudio(audioToPlay) {
    stopAllAudio();
    if (audioToPlay) {
        audioToPlay.play().catch(console.error);
    }
}

function lazyLoadImages(container) {
    const imagesToLoad = container.querySelectorAll('img[data-src]');
    imagesToLoad.forEach(img => {
        if (!img.src) { // Only load if src is not already set
            img.src = img.getAttribute('data-src');
        }
    });
}

function getCatResponse(userInput) { const lowerInput = userInput.toLowerCase(); for (const keyword in catResponses) { if (lowerInput.includes(keyword)) { return catResponses[keyword]; } } const randomIndex = Math.floor(Math.random() * defaultCatResponses.length); return defaultCatResponses[randomIndex]; }
function typeResponse(text) { let i = 0; elements.aiResponseText.innerHTML = ''; const typingInterval = setInterval(() => { if (i < text.length) { elements.aiResponseText.innerHTML += text.charAt(i); i++; } else { clearInterval(typingInterval); elements.promptInput.disabled = false; elements.promptSubmit.disabled = false; elements.promptInput.focus(); } }, 50); }
function checkForPetpet(userInput) { const lowerInput = userInput.toLowerCase(); const petpetTriggers = ["petpet", "pet the cat", "good kitty", "good boy", "good girl", "head pats", "who's a good kitty"]; return petpetTriggers.some(trigger => lowerInput.includes(trigger)); }

// --- 4. EVENT LISTENERS ---
function initEventListeners() {
    elements.startButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.tosScreen); playAudio(elements.tosAudio); });
    elements.acceptButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.startScreen); playAudio(elements.menuAudio); });
    elements.playButton.addEventListener('click', (e) => { e.preventDefault(); showScreen(elements.gameScreen); stopAllAudio(); });
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

    elements.promptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userPrompt = elements.promptInput.value.trim();
        if (!userPrompt) return;
        elements.gifBubble.style.display = 'none'; elements.aiBubble.style.display = 'block';
        elements.promptInput.disabled = true; elements.promptSubmit.disabled = true;
        
        const catResponse = getCatResponse(userPrompt);
        typeResponse(catResponse);
        
        interactionCount++;

        if (!achievements.firstWords.unlocked) {
            achievements.firstWords.unlocked = true;
            achievements.firstWords.card.classList.remove('locked'); achievements.firstWords.card.classList.add('unlocked');
            achievements.firstWords.status.textContent = 'Unlocked';
            achievements.firstWords.title.textContent = 'First Words';
            achievements.firstWords.desc.textContent = 'Begin your journey by asking the cat your first question.';
            elements.achievementPopup.textContent = "Achievement Unlocked: First Words!";
            elements.achievementPopup.classList.add('show');
            setTimeout(() => { elements.achievementPopup.classList.remove('show'); }, 4000);
        }

        if (interactionCount >= 100 && !achievements.interactions100.unlocked) {
            achievements.interactions100.unlocked = true;
            achievements.interactions100.card.classList.remove('locked'); achievements.interactions100.card.classList.add('unlocked');
            achievements.interactions100.status.textContent = 'Unlocked';
            achievements.interactions100.title.textContent = '100 Interactions!';
            achievements.interactions100.desc.textContent = 'Reached 100 interactions with the cat.';
            elements.achievementPopup.textContent = "Achievement Unlocked: 100 Interactions!";
            elements.achievementPopup.classList.add('show');
            setTimeout(() => { elements.achievementPopup.classList.remove('show'); }, 4000);
        }

        if (checkForPetpet(userPrompt) && !achievements.petpet.unlocked) {
            achievements.petpet.unlocked = true;
            achievements.petpet.card.classList.remove('locked'); achievements.petpet.card.classList.add('unlocked');
            achievements.petpet.status.textContent = 'Unlocked';
            achievements.petpet.title.textContent = 'Petpet!';
            achievements.petpet.desc.textContent = "Who's a good kitty?";
            elements.achievementPopup.textContent = "Achievement Unlocked: Petpet!";
            elements.achievementPopup.classList.add('show');
            setTimeout(() => { elements.achievementPopup.classList.remove('show'); }, 4000);

            const originalSrc = elements.catImage.src;
            elements.catImage.src = '2fb22c59-ff7f-4a27-b26d-c0946111c7b5.gif';
            setTimeout(() => { elements.catImage.src = originalSrc; }, 10000);
        }

        elements.promptInput.value = '';
    });
}

// --- 5. START THE APP ---
initEventListeners();
