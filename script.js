// --- 1. GET ALL ELEMENTS ---
const loadingScreen = document.getElementById('loading-screen');
const startButton = document.getElementById('start-button');
const tosScreen = document.getElementById('tos-screen');
const acceptButton = document.getElementById('accept-button');
const startScreen = document.getElementById('start-screen');
const playButton = document.getElementById('play-button');
const gameScreen = document.getElementById('game-screen');
const catImage = document.getElementById('cat-image');
const achievementsButton = document.getElementById('achievements-button');
const aiBubble = document.getElementById('ai-bubble');
const aiResponseText = document.getElementById('ai-response-text');
const promptForm = document.getElementById('prompt-form');
const promptInput = document.getElementById('prompt-input');
const promptSubmit = document.getElementById('prompt-submit');
const gameBackButton = document.getElementById('game-back-button');
const achievementsScreen = document.getElementById('achievements-screen');
const achievementsBackButton = document.getElementById('achievements-back-button');
const achievementPopup = document.getElementById('achievement-popup');
const gifBubble = document.getElementById('gif-bubble');
const creditsButton = document.getElementById('credits-button');
const creditsScreen = document.getElementById('credits-screen');
const announcementGif = document.getElementById('announcement-gif');
const announcementModal = document.getElementById('announcement-modal');
const modalCloseButton = document.querySelector('.modal-close');
const communityButton = document.getElementById('community-button');
const communityScreen = document.getElementById('community-screen');
const communityBackButton = document.getElementById('community-back-button');

// Audio elements
const tosAudio = document.getElementById('tos-audio');
const menuAudio = document.getElementById('menu-audio');
const achievementsAudio = document.getElementById('achievements-audio');
const creditsAudio = document.getElementById('credits-audio');

// --- 2. STATE AND DATA ---
let interactionCount = 0;
let achievements = {
    firstWords: { unlocked: false, card: document.getElementById('ach-first-words'), title: document.getElementById('ach-first-words-title'), desc: document.getElementById('ach-first-words-desc'), status: document.querySelector('#ach-first-words .achievement-status') },
    interactions100: { unlocked: false, card: document.getElementById('ach-100-interactions'), title: document.getElementById('ach-100-interactions-title'), desc: document.getElementById('ach-100-interactions-desc'), status: document.querySelector('#ach-100-interactions .achievement-status') },
    petpet: { unlocked: false, card: document.getElementById('ach-petpet'), title: document.getElementById('ach-petpet-title'), desc: document.getElementById('ach-petpet-desc'), status: document.querySelector('#ach-petpet .achievement-status') }
};

const catResponses = { "hello": "Mrow!? 👋", "hi": "Mrow!? 👋", "hey": "Prrr?", "morning": "*stretches* Mrrrrow... ☀️", "night": "*curls up* Zzzz... 🌙", "sup": "Napping. What's up with you? 😴", "food": "Meow! 🐟", "treats": "Prrrr! 😻", "play": "*pounces* 😼", "cute": "*purrs softly* 🥰", "love": "*rubs against you* ❤️", "cat": "Meow. 🐾", "hungry": "The bowl is HALF empty! A tragedy! 😿", "sleepy": "Time for a cat nap... 😴", "pet": "*happy purring noises* 🥰", "good kitty": "Hehe, I know! 😇", "bad kitty": "Wasn't me. It was the dog. 😇", "pspsps": "*ear twitches*... You called? 😼", "purr": "*purrrrrrrrrrrrrrrrrrr* ❤️", "how are you": "Feelin' purrfect! ✨", "what are you doing": "Cat things. You wouldn't understand. 😼", "name": "I'm just a cat! 🐈", "who are you": "Your supreme overlord. 👑", "where are you": "In my secret hiding spot. 🤫", "why": "Because I'm a cat. That's why. 🤷", "what's new": "I took a nap. Then another one. 😴", "are you real": "As real as the next meal you're getting me. 🤨", "sad": "Come here, I'll purr for you. ❤️", "happy": "*tail wags happily* Mrow! 😄", "angry": "Hiss! 😠", "scared": "*hides under the sofa* 🫣", "bored": "Entertain me, human. 🧐", "lonely": "Then you should pet me more. 🙏", "ball": "Ball! *pounces*", "yarn": "Ooh, string! 🧶", "laser": "*eyes widen* The red dot! ✨", "mouse": "Squeak! *pounces*", "toy": "Is it for pouncing on? 😼", "catnip": "Whoa... the colors... 😵‍💫", "sunbeam": "Must... lie... in... sun... ☀️", "window": "*chitters at the birds* 🐦", "door": "Let me out. No, let me in. No, out. 🤔", "outside": "I see birds out there! Let me out! 🐦", "rain": "I do not approve of wet. 🌧️", "bed": "You mean *my* bed? 🛏️", "beautiful": "I know, thank you. 💅", "fluffy": "The fluffiest! ☁️", "smart": "Of course I am. I'm a cat. 🧠", "silly": "I know you are, but what am I? 😜", "lazy": "It's called conserving energy. 🔋", "come here": "Make me. 😼", "speak": "I am! You just don't listen. 🗣️", "jump": "*boing* ✨", "run": "*zoomies activated* 💨", "lol": "Hehe! 😹", "wow": "I know, I'm amazing. ✨", "sorry": "You should be. Now where are the treats? 🤨", "friend": "You are my favorite human. For now. 🥰", "computer": "A warm place to sit. 💻", "phone": "Something to knock off the table. 📱", "book": "Also a warm place to sit. 📚", "music": "Does it have purring in it? 🎶", "dance": "*wiggles butt* 💃", "sing": "Meow meow meooooow! 🎤", "i'm home": "Finally! My food bowl attendant has returned. 🧐", };
const defaultCatResponses = ["...?", "*stares blankly* 👀", "*tilts head*", "prrrr... ❤️", "mrow? 🥺"];

// --- 3. HELPER FUNCTIONS ---
function getCatResponse(userInput) { const lowerInput = userInput.toLowerCase(); for (const keyword in catResponses) { if (lowerInput.includes(keyword)) { return catResponses[keyword]; } } const randomIndex = Math.floor(Math.random() * defaultCatResponses.length); return defaultCatResponses[randomIndex]; }
function typeResponse(text) { let i = 0; aiResponseText.innerHTML = ''; const typingInterval = setInterval(() => { if (i < text.length) { aiResponseText.innerHTML += text.charAt(i); i++; } else { clearInterval(typingInterval); promptInput.disabled = false; promptSubmit.disabled = false; promptInput.focus(); } }, 50); }
function checkForPetpet(userInput) { const lowerInput = userInput.toLowerCase(); const petpetTriggers = ["petpet", "pet the cat", "good kitty", "good boy", "good girl", "head pats", "who's a good kitty"]; return petpetTriggers.some(trigger => lowerInput.includes(trigger)); }

// --- 4. INITIALIZATION ---
function initEventListeners() {
    startButton.addEventListener('click', (e) => { e.preventDefault(); loadingScreen.style.display = 'none'; tosScreen.style.display = 'flex'; tosAudio.play().catch(console.error); });
    acceptButton.addEventListener('click', (e) => { e.preventDefault(); tosAudio.pause(); tosAudio.currentTime = 0; tosScreen.style.display = 'none'; startScreen.style.display = 'flex'; menuAudio.play().catch(console.error); });
    playButton.addEventListener('click', (e) => { e.preventDefault(); menuAudio.pause(); menuAudio.currentTime = 0; startScreen.style.display = 'none'; gameScreen.style.display = 'flex'; });
    creditsButton.addEventListener('click', (e) => { e.preventDefault(); menuAudio.pause(); menuAudio.currentTime = 0; startScreen.style.display = 'none'; creditsScreen.style.display = 'flex'; creditsAudio.play().catch(console.error); });
    creditsScreen.addEventListener('click', () => { creditsAudio.pause(); creditsAudio.currentTime = 0; creditsScreen.style.display = 'none'; startScreen.style.display = 'flex'; menuAudio.play().catch(console.error); });
    communityButton.addEventListener('click', (e) => { e.preventDefault(); menuAudio.pause(); menuAudio.currentTime = 0; startScreen.style.display = 'none'; communityScreen.style.display = 'flex'; });
    communityBackButton.addEventListener('click', (e) => { e.preventDefault(); communityScreen.style.display = 'none'; startScreen.style.display = 'flex'; menuAudio.play().catch(console.error); });
    
    const achievementToggles = document.querySelectorAll('.category-header');
    achievementToggles.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const toggleButton = header.querySelector('.category-toggle');
            content.classList.toggle('collapsed');
            if (content.classList.contains('collapsed')) {
                toggleButton.textContent = '[+]';
            } else {
                toggleButton.textContent = '[-]';
            }
        });
    });

    achievementsButton.addEventListener('click', (e) => { e.preventDefault(); menuAudio.pause(); menuAudio.currentTime = 0; startScreen.style.display = 'none'; achievementsScreen.style.display = 'flex'; achievementsAudio.play().catch(console.error); });
    achievementsBackButton.addEventListener('click', (e) => { e.preventDefault(); achievementsAudio.pause(); achievementsAudio.currentTime = 0; achievementsScreen.style.display = 'none'; startScreen.style.display = 'flex'; menuAudio.play().catch(console.error); });
    catImage.addEventListener('click', () => { const isHidden = gifBubble.style.display === 'none' || gifBubble.style.display === ''; gifBubble.style.display = isHidden ? 'block' : 'none'; aiBubble.style.display = 'none'; });
    gameBackButton.addEventListener('click', (e) => { e.preventDefault(); gameScreen.style.display = 'none'; startScreen.style.display = 'flex'; aiBubble.style.display = 'none'; gifBubble.style.display = 'none'; aiResponseText.innerHTML = 'Ask me something...'; promptInput.value = ''; menuAudio.play().catch(console.error); });
    announcementGif.addEventListener('click', () => { announcementModal.style.display = 'flex'; });
    modalCloseButton.addEventListener('click', () => { announcementModal.style.display = 'none'; });

    promptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userPrompt = promptInput.value.trim();
        if (!userPrompt) return;
        gifBubble.style.display = 'none'; aiBubble.style.display = 'block';
        promptInput.disabled = true; promptSubmit.disabled = true;
        
        const catResponse = getCatResponse(userPrompt);
        typeResponse(catResponse);
        
        interactionCount++;

        if (!achievements.firstWords.unlocked) {
            achievements.firstWords.unlocked = true;
            achievements.firstWords.card.classList.remove('locked'); achievements.firstWords.card.classList.add('unlocked');
            achievements.firstWords.status.textContent = 'Unlocked';
            achievements.firstWords.title.textContent = 'First Words';
            achievements.firstWords.desc.textContent = 'Begin your journey by asking the cat your first question.';
            achievementPopup.textContent = "Achievement Unlocked: First Words!";
            achievementPopup.classList.add('show');
            setTimeout(() => { achievementPopup.classList.remove('show'); }, 4000);
        }

        if (interactionCount >= 100 && !achievements.interactions100.unlocked) {
            achievements.interactions100.unlocked = true;
            achievements.interactions100.card.classList.remove('locked'); achievements.interactions100.card.classList.add('unlocked');
            achievements.interactions100.status.textContent = 'Unlocked';
            achievements.interactions100.title.textContent = '100 Interactions!';
            achievements.interactions100.desc.textContent = 'Reached 100 interactions with the cat.';
            achievementPopup.textContent = "Achievement Unlocked: 100 Interactions!";
            achievementPopup.classList.add('show');
            setTimeout(() => { achievementPopup.classList.remove('show'); }, 4000);
        }

        if (checkForPetpet(userPrompt) && !achievements.petpet.unlocked) {
            achievements.petpet.unlocked = true;
            achievements.petpet.card.classList.remove('locked'); achievements.petpet.card.classList.add('unlocked');
            achievements.petpet.status.textContent = 'Unlocked';
            achievements.petpet.title.textContent = 'Petpet!';
            achievements.petpet.desc.textContent = "Who's a good kitty?";
            achievementPopup.textContent = "Achievement Unlocked: Petpet!";
            achievementPopup.classList.add('show');
            setTimeout(() => { achievementPopup.classList.remove('show'); }, 4000);

            const originalSrc = catImage.src;
            catImage.src = '2fb22c59-ff7f-4a27-b26d-c0946111c7b5.gif';
            setTimeout(() => { catImage.src = originalSrc; }, 10000);
        }

        promptInput.value = '';
    });
}

// --- 5. START THE APP ---
initEventListeners();
