/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageName) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const selectedPage =
        document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   BLOOKET
========================= */

function blooketCalculator() {

    const current =
        Number(document.getElementById("bCurrent").value);

    const goal =
        Number(document.getElementById("bGoal").value);

    const earn =
        Number(document.getElementById("bEarn").value);

    const result =
        document.getElementById("bResult");


    if (
        !Number.isFinite(current) ||
        !Number.isFinite(goal) ||
        !Number.isFinite(earn) ||
        earn <= 0 ||
        goal <= current
    ) {

        result.innerText =
            "⚠️ Enter valid numbers!";

        return;
    }


    const remaining = goal - current;

    const games =
        Math.ceil(remaining / earn);


    result.innerText =
        `🟦 You need ${remaining.toLocaleString()} more coins.
        That's about ${games.toLocaleString()} games!`;
}


/* =========================
   MINECRAFT RESOURCES
========================= */

function minecraftResources() {

    const needed =
        Number(document.getElementById("mNeed").value);

    const have =
        Number(document.getElementById("mHave").value);

    const result =
        document.getElementById("mResult");


    if (needed < 0 || have < 0) {

        result.innerText =
            "⚠️ Enter positive numbers!";

        return;
    }


    const missing =
        Math.max(0, needed - have);


    if (missing === 0) {

        result.innerText =
            "✅ You already have enough!";

    } else {

        result.innerText =
            `⛏️ You need ${missing.toLocaleString()} more items!`;
    }
}


/* =========================
   MINECRAFT COORDINATES
========================= */

function netherCoordinates() {

    const x =
        Number(document.getElementById("overworldX").value);

    const z =
        Number(document.getElementById("overworldZ").value);

    const result =
        document.getElementById("coordinateResult");


    if (!Number.isFinite(x) || !Number.isFinite(z)) {

        result.innerText =
            "⚠️ Enter both coordinates!";

        return;
    }


    const netherX =
        Math.floor(x / 8);

    const netherZ =
        Math.floor(z / 8);


    result.innerText =
        `🌋 Nether: X ${netherX}, Z ${netherZ}`;
}


/* =========================
   ROBLOX
========================= */

function robloxCalculator() {

    const current =
        Number(document.getElementById("rCurrent").value);

    const goal =
        Number(document.getElementById("rGoal").value);

    const earn =
        Number(document.getElementById("rEarn").value);

    const result =
        document.getElementById("rResult");


    if (
        earn <= 0 ||
        goal <= current
    ) {

        result.innerText =
            "⚠️ Enter valid numbers!";

        return;
    }


    const remaining =
        goal - current;

    const games =
        Math.ceil(remaining / earn);


    result.innerText =
        `🟩 ${remaining.toLocaleString()} remaining.
        You need about ${games.toLocaleString()} games!`;
}


/* =========================
   BRAWL STARS
========================= */

function brawlCalculator() {

    const current =
        Number(document.getElementById("bCurrent").value);

    const goal =
        Number(document.getElementById("bGoalTrophies").value);

    const perGame =
        Number(document.getElementById("bTrophiesGame").value);

    const result =
        document.getElementById("brawlResult");


    if (
        perGame <= 0 ||
        goal <= current
    ) {

        result.innerText =
            "⚠️ Enter valid numbers!";

        return;
    }


    const remaining =
        goal - current;

    const games =
        Math.ceil(remaining / perGame);


    result.innerText =
        `⭐ ${remaining.toLocaleString()} trophies remaining.
        About ${games.toLocaleString()} games needed!`;
}


/* =========================
   UNIVERSAL CALCULATOR
========================= */

function universalCalculator() {

    const a =
        Number(document.getElementById("number1").value);

    const b =
        Number(document.getElementById("number2").value);

    const operation =
        document.getElementById("operation").value;

    const resultBox =
        document.getElementById("universalResult");


    if (!Number.isFinite(a) || !Number.isFinite(b)) {

        resultBox.innerText =
            "⚠️ Enter both numbers!";

        return;
    }


    let result;


    if (operation === "+") {
        result = a + b;
    }

    else if (operation === "-") {
        result = a - b;
    }

    else if (operation === "*") {
        result = a * b;
    }

    else if (operation === "/") {

        if (b === 0) {

            resultBox.innerText =
                "❌ You cannot divide by zero!";

            return;
        }

        result = a / b;
    }

    else if (operation === "%") {

        result = (a / 100) * b;
    }


    resultBox.innerText =
        `🧮 Result: ${result.toLocaleString()}`;
}


/* =========================
   GAMECALC AI
========================= */

function askAI() {

    const input =
        document.getElementById("aiInput");

    const chat =
        document.getElementById("chat");


    const question =
        input.value.trim();


    if (question === "") {
        return;
    }


    /* Add user's message */

    chat.innerHTML += `
        <div class="userMessage">
            🧑 You: ${escapeHTML(question)}
        </div>
    `;


    const q =
        question.toLowerCase();


    let answer;


    /* AI RESPONSES */

    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
    ) {

        answer =
            "Hey! 👋 I'm GameCalc AI. Ask me about Blooket, Minecraft, Roblox, Brawl Stars or gaming math!";

    }

    else if (q.includes("blooket")) {

        answer =
            "🟦 For Blooket, I can help calculate how many games you need to reach a coin goal. Go to the Blooket calculator and enter your current coins, goal and coins per game.";

    }

    else if (q.includes("minecraft")) {

        answer =
            "⛏️ Minecraft has lots of useful calculations! I can help with resources and Nether coordinates. Remember: Overworld coordinates are approximately divided by 8 for the Nether.";

    }

    else if (q.includes("nether")) {

        answer =
            "🌋 To convert Overworld coordinates to Nether coordinates, divide X and Z by 8.";

    }

    else if (q.includes("roblox")) {

        answer =
            "🟩 For Roblox, you can calculate how many games you need to reach a currency or reward goal.";

    }

    else if (
        q.includes("brawl") ||
        q.includes("trophies")
    ) {

        answer =
            "⭐ For Brawl Stars, enter your current trophies, target trophies and average trophies gained per game to estimate how many games you need.";

    }

    else if (q.includes("fps")) {

        answer =
            "🚀 FPS tip: lower graphics settings, close unnecessary background apps, reduce render distance and use performance mods when they're compatible with your game.";

    }

    else if (q.includes("percentage")) {

        answer =
            "🧮 To calculate a percentage, use: number × percentage ÷ 100. Example: 200 × 25 ÷ 100 = 50.";

    }

    else if (
        q.includes("calculate") ||
        q.includes("math")
    ) {

        answer =
            "🧮 Use the Universal Calculator! It supports addition, subtraction, multiplication, division and percentages.";

    }

    else if (
        q.includes("game") ||
        q.includes("games")
    ) {

        answer =
            "🎮 GameCalc currently has calculators for Blooket, Minecraft, Roblox, Brawl Stars and universal math.";

    }

    else if (
        q.includes("who are you") ||
        q.includes("what are you")
    ) {

        answer =
            "🤖 I'm GameCalc AI! I'm the assistant built into this gaming calculator website.";

    }

    else {

        answer =
            "🤖 I'm still learning! Try asking about Blooket, Minecraft, Roblox, Brawl Stars, FPS, percentages or game calculations.";

    }


    /* AI typing delay */

    setTimeout(function() {

        chat.innerHTML += `
            <div class="aiMessage">
                🤖 AI: ${answer}
            </div>
        `;

        chat.scrollTop =
            chat.scrollHeight;

    }, 500);


    input.value = "";

    chat.scrollTop =
        chat.scrollHeight;
}


/* =========================
   SECURITY
   Prevent HTML injection
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}