const catResponses = {
    // Greetings & Farewells
    "hello": "Mrow!? 👋", "hi": "Mrow!? 👋", "hey": "Prrr?", "morning": "*stretches* Mrrrrow... ☀️", "night": "*curls up* Zzzz... 🌙", "sup": "Napping. What's up with you? 😴", "bye": "Mrow... don't go! 😿", "see ya": "Mrow! Come back soon! ❤️",
    
    // Core Cat Things
    "food": "Meow! 🐟", "treats": "Prrrr! 😻", "play": "*pounces* 😼", "cute": "*purrs softly* 🥰", "love": "*rubs against you* ❤️", "cat": "Meow. 🐾",
    "hungry": "The bowl is HALF empty! A tragedy! 😿", "sleepy": "Time for a cat nap... 😴", "pet": "*happy purring noises* 🥰", "good kitty": "Hehe, I know! 😇",
    "bad kitty": "Wasn't me. It was the dog. 😇", "pspsps": "*ear twitches*... You called? 😼", "purr": "*purrrrrrrrrrrrrrrrrrr* ❤️",

    // Questions
    "how are you": "Feelin' purrfect! ✨", "what are you doing": "Cat things. You wouldn't understand. 😼", "name": "I'm just a cat! 🐈",
    "who are you": "Your supreme overlord. 👑", "where are you": "In my secret hiding spot. 🤫", "why": "Because I'm a cat. That's why. 🤷",
    "what's new": "I took a nap. Then another one. 😴", "are you real": "As real as the next meal you're getting me. 🤨",

    // Feelings
    "sad": "Come here, I'll purr for you. ❤️", "happy": "*tail wags happily* Mrow! 😄", "angry": "Hiss! 😠", "scared": "*hides under the sofa* 🫣",
    "bored": "Entertain me, human. 🧐", "lonely": "Then you should pet me more. 🙏", "excited": "*zoomies around the room* 💨",

    // Objects & Toys
    "ball": "Ball! *pounces*", "yarn": "Ooh, string! 🧶", "laser": "*eyes widen* The red dot! ✨", "mouse": "Squeak! *pounces*",
    "toy": "Is it for pouncing on? 😼", "catnip": "Whoa... the colors... 😵‍💫",
    
    // Environment
    "sunbeam": "Must... lie... in... sun... ☀️", "window": "*chitters at the birds* 🐦", "door": "Let me out. No, let me in. No, out. 🤔",
    "outside": "I see birds out there! Let me out! 🐦", "rain": "I do not approve of wet. 🌧️", "bed": "You mean *my* bed? 🛏️",
    
    // Compliments
    "beautiful": "I know, thank you. 💅", "fluffy": "The fluffiest! ☁️", "smart": "Of course I am. I'm a cat. 🧠",
    "pretty": "Flattery will get you... more purrs. 🥰", "soft": "Don't touch the belly. It's a trap. 😈",
    
    // Playful Insults
    "silly": "I know you are, but what am I? 😜", "lazy": "It's called conserving energy. 🔋", "naughty": "I have no idea what you're talking about. 😇",
    
    // Commands
    "come here": "Make me. 😼", "speak": "I am! You just don't listen. 🗣️", "sit": "I am sitting. On your keyboard. ⌨️",
    "jump": "*boing* ✨", "run": "*zoomies activated* 💨", "hide": "You can't see me. I'm invisible. 👻",
    
    // Reactions
    "lol": "Hehe! 😹", "wow": "I know, I'm amazing. ✨", "yay": "*happy little mrow* 🎉", "oops": "*stares at the broken vase* It was like that when I got here. 🤷",
    "sorry": "You should be. Now where are the treats? 🤨", "please": "Hmmm... okay, since you asked nicely. 🥰",
    
    // Relationships
    "friend": "You are my favorite human. For now. 🥰", "dog": "*hisses softly* 😠", "bird": "*chitters intensely* 🐦", "fish": "Are we eating that? 🐟",
    
    // Human Things
    "work": "That's for humans. I'm in management. 👔", "school": "I graduated from the University of Napping. 🎓", "computer": "A warm place to sit. 💻",
    "phone": "Something to knock off the table. 📱", "book": "Also a warm place to sit. 📚", "music": "Does it have purring in it? 🎶",
    "dance": "*wiggles butt* 💃", "sing": "Meow meow meooooow! 🎤", "i'm home": "Finally! My food bowl attendant has returned. 🧐",
    
    // Abstract Concepts
    "what is": "It's a cat thing. 🤷", "can you": "Maybe. If there are treats involved. 🐟", "do you": "Sometimes. 😼",
    "tell me a secret": "I know where all the best napping spots are. 🤫", "joke": "Why don't cats play poker in the jungle? Too many cheetahs! 😹",
    "story": "Once upon a time, a cat took a nap. The end. 😴", "poem": "Soft kitty, warm kitty, little ball of fur... 🎶",
    "song": "Meow meow meow, meow meow meow... 🎵", "magic": "I can disappear whenever someone says 'bath time'. ✨",
    "dream": "I dream of chasing mice the size of dogs. 🐭", "biscuit": "*kneads paws happily* ❤️", "clean": "*licks paw* Gotta stay fabulous. 💅",
    "chaos": "Did someone say chaos? *knocks something over* 😈",
    
    // Colors
    "red": "The red dot is my mortal enemy. 💥", "green": "Like my eyes! Or catnip. 🌱", "blue": "The sky is nice to watch birds in. 🐦",
    
    // Actions
    "fight": "*puffs up fur* I'm big and scary! 😠", "friendship": "Is when you give me pets and food. 🥰",
    "water": "No thank you. 💧", "fire": "Warm and nice to sleep near. 🔥", "earth": "Good for digging. 🐾",
    "air": "Full of interesting smells. 👃", "human": "My loyal staff. 🧐", "robot": "Does it give treats? 🤖",
    "alien": "A strange-looking bird, maybe? 👽", "monster": "*hides* 🫣", "ghost": "I can see them, you can't. 👻",
    "party": "Is there tuna? 🥳", "nap": "Don't mind if I do. 😴", "cuddle": "Only on my terms. 😼",
    "scratch": "*scratches post vigorously* 💪", "stretch": "Ooooh big stretch! 🧘", "climb": "I am the king of this castle! 👑",
    
    // Questions about self
    "age": "Age is just a number. What matters is nap frequency. 😴", "color": "I am perfection-colored. ✨", "breed": "The best kind, obviously. 👑",
    
    // Reactions to actions
    "hug": "*stiffens* Okay, okay, that's enough. 😐", "kiss": "*dodges* Personal space, please. 😒", "look": "Yes, I am looking. Are you interesting yet? 🧐",
    "watch": "I see you. Always. 👀", "smell": "*sniffs you suspiciously* You smell... interesting. 🤔",
    
    // Food & Drink
    "milk": "Just a little, as a treat. 🥛", "tuna": "The glorious food! Give it to me! 🐟", "chicken": "The second glorious food! 🍗",
    
    // Times & Seasons
    "today": "A purrfect day for a nap. ☀️", "tomorrow": "Also a good day for a nap. 🌙", "yesterday": "I have no memory of this. I was napping. 😴",
    "winter": "Excellent! More time to sleep by the fire. 🔥", "summer": "Too hot. Must find a cool tile floor. 🥵", "spring": "So many bugs to chase! 🦋",
    "autumn": "The leaves! They are everywhere! *pounces* 🍂",
    
    // Misc
    "what's that": "*sniffs curiously* 🤔", "question": "I have the answers. If I feel like sharing. 😼", "idea": "My idea is that it's time for a nap. 😴",
    "help": "I require assistance opening this can of tuna. 🥫", "boredom": "The solution is to entertain me. Now. 🧐",
    "game": "The only game is 'chase the red dot'. ✨", "win": "I always win. 🏆", "lose": "I never lose. I simply choose to stop playing. 💅",
    "money": "The currency of treats. 🐟", "time": "It's either nap time or food time. 🕰️",
    "space": "I must explore every box in the universe. 🚀", "art": "I am the art. Admire me. 🖼️", "science": "The science of getting food from your plate to my mouth. 🧑‍🔬",
    "history": "In ancient times, we were worshipped as gods. As it should be. 👑", "future": "I see... many naps in my future. 🔮",
    "philosophy": "To nap, or not to nap? That is a silly question. 😴", "mystery": "The greatest mystery is where the red dot goes. 🕵️",
    "danger": "*fur on end* What was that noise!? 😳", "adventure": "Let's go explore that rustling bag! 🗺️",
    "sleep": "Yes, please. 😴", "wake up": "Five more minutes... or hours... ⏰", "tired": "I was born tired. 🥱",
    "energetic": "*zooms around the room at 3 AM* 💨", "zoomies": "I am speed! ⚡", "attack": "*wiggles butt before pouncing* 😼",
    "king": "You may now address me as 'Your Majesty'. 👑", "queen": "That's 'Her Royal Highness' to you. 👑",
    "baby": "Mew! 🍼", "old": "I am wise and demand respect (and soft food). 🧐",
};

const defaultCatResponses = ["...?", "*stares blankly* 👀", "*tilts head*", "prrrr... ❤️", "mrow? 🥺"];
