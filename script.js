<script src="gamehub-bridge.js"></script>
<script>
"use strict";

/* =========================
   SETTINGS
========================= */

const VIP_CODE = "VIP2026";

/* Admin password is stored as a SHA-256 hash rather than plain text.
   The password itself is still "ADMIN2026" - only how it's checked changed. */
const ADMIN_PASSWORD_HASH =
    "64e48f3bf07307f751c02213b95e0b5e1e8351597dfbe12bce5cbf115591ce3f";

const OWNER_USERNAME = "gnomxpro";
const OWNER_DISPLAY = "gnomxpro";

const HELPER_USERNAME = "gamehubofficial";
const HELPER_DISPLAY = "GameHubOfficial";

const DB_KEY = "gameHubDatabase";
const SESSION_KEY = "gameHubSession";
const THEME_KEY = "gameHubTheme";

/* =========================
   DATABASE
========================= */

let db;

try{

    db =
        JSON.parse(
            localStorage.getItem(DB_KEY)
        ) ||
        {
            users:[],
            codes:[],
            shop:[]
        };

}catch{

    db={
        users:[],
        codes:[],
        shop:[]
    };

}

if(!Array.isArray(db.users))
    db.users=[];

if(!Array.isArray(db.codes))
    db.codes=[];

if(!Array.isArray(db.shop))
    db.shop=[];

if(db.announcement === undefined)
    db.announcement = null;

if(!db.ratings || typeof db.ratings !== "object")
    db.ratings = {};

if(!Array.isArray(db.hallOfFame))
    db.hallOfFame = [];

if(!Array.isArray(db.adminLog))
    db.adminLog = [];

db.users.forEach(u => {
    if(typeof u.twoFAEnabled !== "boolean") u.twoFAEnabled=false;
    if(typeof u.twoFASecret !== "string") u.twoFASecret="";
    if(typeof u.nickname !== "string") u.nickname=u.name;
    if(!u.scores || typeof u.scores !== "object") u.scores={};
    if(!u.wins || typeof u.wins !== "object") u.wins={};
    if(!u.playsByGame || typeof u.playsByGame !== "object") u.playsByGame={};
    if(typeof u.gamesPlayed !== "number") u.gamesPlayed=0;
    if(typeof u.giftsSent !== "number") u.giftsSent=0;
    if(typeof u.banned !== "boolean") u.banned=false;
    if(!Array.isArray(u.achievements)) u.achievements=[];
    if(typeof u.avatar !== "string" || !u.avatar) u.avatar="🎮";
    if(typeof u.refCode !== "string" || !u.refCode) u.refCode="REF-"+u.name.toUpperCase();
    if(typeof u.referredBy !== "string") u.referredBy="";
    if(!Array.isArray(u.referrals)) u.referrals=[];
    if(typeof u.loginStreak !== "number") u.loginStreak=0;
    if(typeof u.lastLogin !== "string") u.lastLogin="";
});


let session =
    localStorage.getItem(
        SESSION_KEY
    ) || "";

let admin = false;


/* =========================
   DEFAULT SHOP
========================= */

function createDefaultShop(){

    if(db.shop.length > 0)
        return;

    db.shop = [

        {
            id:"test-title",
            name:"TEST",
            icon:"🧪",
            price:500,
            category:"title",
            value:"TEST"
        },

        {
            id:"gamer-title",
            name:"GAMER",
            icon:"🎮",
            price:750,
            category:"title",
            value:"GAMER"
        },

        {
            id:"legend-title",
            name:"LEGEND",
            icon:"🔥",
            price:2500,
            category:"title",
            value:"LEGEND"
        },

        {
            id:"blue-theme",
            name:"Blue Theme",
            icon:"🔵",
            price:750,
            category:"theme",
            value:"blue"
        },

        {
            id:"purple-theme",
            name:"Purple Theme",
            icon:"🟣",
            price:750,
            category:"theme",
            value:"purple"
        },

        {
            id:"green-theme",
            name:"Green Theme",
            icon:"🟢",
            price:750,
            category:"theme",
            value:"green"
        },

        {
            id:"vip",
            name:"VIP",
            icon:"👑",
            price:5000,
            category:"vip",
            value:"vip"
        },

        {
            id:"super-vip",
            name:"SUPER VIP",
            icon:"💎",
            price:10000,
            category:"vip",
            value:"supervip"
        },

        {
            id:"rainbow",
            name:"Rainbow Effect",
            icon:"🌈",
            price:2500,
            category:"effect",
            value:"rainbow"
        },

        {
            id:"fire",
            name:"Fire Effect",
            icon:"🔥",
            price:3500,
            category:"effect",
            value:"fire"
        },

        {
            id:"noob-title",
            name:"NOOB",
            icon:"🤡",
            price:100,
            category:"title",
            value:"NOOB"
        },

        {
            id:"pro-title",
            name:"PRO",
            icon:"⭐",
            price:1500,
            category:"title",
            value:"PRO"
        },

        {
            id:"god-title",
            name:"GOD",
            icon:"⚡",
            price:6000,
            category:"title",
            value:"GOD"
        },

        {
            id:"red-theme",
            name:"Red Theme",
            icon:"🔴",
            price:800,
            category:"theme",
            value:"red"
        },

        {
            id:"gold-theme",
            name:"Gold Theme",
            icon:"🟡",
            price:1500,
            category:"theme",
            value:"gold"
        },

        {
            id:"ice",
            name:"Ice Effect",
            icon:"❄️",
            price:2000,
            category:"effect",
            value:"ice"
        },

        {
            id:"neon",
            name:"Neon Effect",
            icon:"💡",
            price:3200,
            category:"effect",
            value:"neon"
        },

        {
            id:"shadow",
            name:"Shadow Effect",
            icon:"🖤",
            price:1800,
            category:"effect",
            value:"shadow"
        }

    ];

    saveDB();
}

createDefaultShop();

/* Merge in any new default items for databases saved before
   this update, without touching items already owned/purchased. */
(function mergeNewShopItems(){

    const DEFAULTS = [
        ["test-title","TEST","🧪",500,"title","TEST"],
        ["gamer-title","GAMER","🎮",750,"title","GAMER"],
        ["legend-title","LEGEND","🔥",2500,"title","LEGEND"],
        ["blue-theme","Blue Theme","🔵",750,"theme","blue"],
        ["purple-theme","Purple Theme","🟣",750,"theme","purple"],
        ["green-theme","Green Theme","🟢",750,"theme","green"],
        ["vip","VIP","👑",5000,"vip","vip"],
        ["super-vip","SUPER VIP","💎",10000,"vip","supervip"],
        ["rainbow","Rainbow Effect","🌈",2500,"effect","rainbow"],
        ["fire","Fire Effect","🔥",3500,"effect","fire"],
        ["noob-title","NOOB","🤡",100,"title","NOOB"],
        ["pro-title","PRO","⭐",1500,"title","PRO"],
        ["god-title","GOD","⚡",6000,"title","GOD"],
        ["red-theme","Red Theme","🔴",800,"theme","red"],
        ["gold-theme","Gold Theme","🟡",1500,"theme","gold"],
        ["ice","Ice Effect","❄️",2000,"effect","ice"],
        ["neon","Neon Effect","💡",3200,"effect","neon"],
        ["shadow","Shadow Effect","🖤",1800,"effect","shadow"]
    ];

    let changed = false;

    DEFAULTS.forEach(d => {

        const exists =
            db.shop.some(
                x => x.id === d[0]
            );

        if(!exists){

            db.shop.push({
                id:d[0],
                name:d[1],
                icon:d[2],
                price:d[3],
                category:d[4],
                value:d[5]
            });

            changed = true;

        }

    });

    if(changed)
        saveDB();

})();


/* =========================
   SAVE
========================= */

function saveDB(){

    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );

}
saveDB();



/* =========================
   ELEMENT
========================= */

const $ =
    id =>
        document.getElementById(id);


/* =========================
   MESSAGE
========================= */

function msg(title,text){

    $("modalTitle").textContent =
        title;

    $("modalText").textContent =
        text;

    $("messageModal")
        .classList
        .add("open");

}

$("modalClose").onclick =
    () => {

        $("messageModal")
            .classList
            .remove("open");

    };


/* =========================
   USER
========================= */

function user(){

    return db.users.find(
        u =>
            u.name === session
    );

}


/* =========================
   NAME
========================= */

function normalizeName(name){

    return name
        .trim()
        .replace(/\s+/g,"");

}

function validUserName(name){

    return /^[A-Za-zА-Яа-я0-9_]{3,20}$/
        .test(name);

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value){

    return String(value)
        .replace(
            /[&<>"']/g,
            char =>
                ({
                    "&":"&amp;",
                    "<":"&lt;",
                    ">":"&gt;",
                    '"':"&quot;",
                    "'":"&#039;"
                }[char])
        );

}


/* =========================
   THEME
========================= */

function applyTheme(){

    document.body.classList.remove(
        "vip",
        "blue",
        "purple",
        "green",
        "red",
        "gold"
    );

    const theme =
        localStorage.getItem(
            THEME_KEY
        ) || "default";

    if(theme !== "default"){

        document.body.classList.add(
            theme
        );

    }

}

applyTheme();


/* =========================
   ACCOUNT
========================= */

function updateAccount(){

    const u =
        user();

    if(!u){

        $("loggedOut")
            .classList
            .remove("hidden");

        $("loggedIn")
            .classList
            .add("hidden");

        $("accountHint")
            .textContent =
            "Войди или создай аккаунт";

        updateShop();
        renderLeaderboard();
        renderAchievements();
        renderSiteStats();
        renderGameRatings();

        return;

    }

    $("loggedOut")
        .classList
        .add("hidden");

    $("loggedIn")
        .classList
        .remove("hidden");

    $("accountHint")
        .textContent =
        "Аккаунт сохранён локально";

    $("currentUser")
        .textContent =
        u.name;

    ["rainbow","fire","ice","neon","shadow"].forEach(
        fx => {

            $("currentUser")
                .classList
                .toggle(
                    "effect-" + fx,
                    !!(u.effects && u.effects.includes(fx))
                );

        }
    );

    $("balance")
        .textContent =
        u.balance;

    $("vipLabel")
        .textContent =
        u.superVip
            ? "💎 SUPER VIP"
            : u.vip
            ? "👑 VIP АКТИВЕН"
            : "Обычный аккаунт";

    $("titleLabel")
        .innerHTML =
        u.title
            ?
            `<span class="titleBadge">
                🏷️ ${escapeHTML(u.title)}
            </span>`
            :
            "";

    $("avatarCircle").textContent =
        u.avatar || "🎮";

    renderAvatarPicker(u);

    $("refCodeBox").textContent =
        u.refCode;

    $("refStats").textContent =
        `👥 Приглашено друзей: ${(u.referrals||[]).length}`;

    checkDailyBonus(u);

    updateSecurityLabel();
    updateShop();

    if(window.GameHub){

        const unlocked =
            GameHub.checkAchievements(u);

        if(unlocked.length > 0){

            saveDB();

            msg(
                "🎖️ Новое достижение!",
                unlocked
                    .map(
                        a =>
                            `${a.icon} ${a.name} (+${a.reward} GH)`
                    )
                    .join("  •  ")
            );

        }

    }

    renderAchievements();
    renderLeaderboard();
    renderSiteStats();
    renderGameRatings();

}


/* =========================
   ACHIEVEMENTS
========================= */

function renderAchievements(){

    const grid = $("achievementsGrid");

    if(!grid)
        return;

    if(!window.GameHub){

        grid.innerHTML =
            "<p class='muted'>Достижения недоступны.</p>";

        return;

    }

    const u = user();

    const owned =
        (u && Array.isArray(u.achievements))
            ? u.achievements
            : [];

    grid.innerHTML =
        GameHub.ACHIEVEMENTS
            .map(a => {

                const unlocked =
                    owned.includes(a.id);

                return `
                <div class="achCard ${unlocked ? "unlocked" : "locked"}">
                    <div class="achIcon">${a.icon}</div>
                    <div class="achName">${escapeHTML(a.name)}</div>
                    <div class="achDesc">${escapeHTML(a.desc)}</div>
                    <div class="achReward">
                        ${unlocked ? "✅ Получено" : `+${a.reward} GH`}
                    </div>
                </div>
                `;

            })
            .join("");

}


/* =========================
   LEADERBOARD
========================= */

const LEADERBOARD_GAMES = [
    { id:"balance", name:"💰 Баланс" },
    { id:"snake", name:"🐍 Snake" },
    { id:"memory-match", name:"🧠 Memory Match" },
    { id:"flappy-bird", name:"🐦 Flappy Bird" },
    { id:"traffic-dodge", name:"🚗 Traffic Dodge" },
    { id:"shooter", name:"🔫 Shooter" },
    { id:"glitch-arena", name:"🌀 Glitch Arena" },
    { id:"natural-disaster", name:"🌪️ Natural Disaster" },
    { id:"dogeball", name:"🏐 Dodgeball Wins" }
];

let currentLeaderboard = "balance";
let lbTabsBuilt = false;

function buildLeaderboardTabs(){

    const box = $("lbTabs");

    if(!box || lbTabsBuilt)
        return;

    box.innerHTML =
        LEADERBOARD_GAMES
            .map((g,i) => `
                <button
                    class="categoryBtn ${i===0 ? "active" : ""}"
                    data-lb="${g.id}"
                >
                    ${g.name}
                </button>
            `)
            .join("");

    box.querySelectorAll("[data-lb]").forEach(btn => {

        btn.onclick = () => {

            box.querySelectorAll(".categoryBtn").forEach(
                x => x.classList.remove("active")
            );

            btn.classList.add("active");

            currentLeaderboard =
                btn.getAttribute("data-lb");

            renderLeaderboard();

        };

    });

    lbTabsBuilt = true;

}

function renderLeaderboard(){

    buildLeaderboardTabs();


    const list = $("leaderboardList");

    if(!list)
        return;

    const rows =
        (db.users || [])
            .map(u => {

                let value = 0;

                if(currentLeaderboard === "balance"){

                    value = u.balance || 0;

                }else if(currentLeaderboard === "dogeball"){

                    value = (u.wins && u.wins.dogeball) || 0;

                }else{

                    value =
                        (u.scores && u.scores[currentLeaderboard]) || 0;

                }

                return { name:u.name, vip:u.vip, superVip:u.superVip, value:value };

            })
            .filter(r => r.value > 0)
            .sort((a,b) => b.value - a.value)
            .slice(0,10);

    if(rows.length === 0){

        list.innerHTML =
            "<p class='muted'>Пока никто не отметился в этой категории.</p>";

        return;

    }

    const medals = ["🥇","🥈","🥉"];

    list.innerHTML =
        rows
            .map((r,i) => `
                <div class="lbRow">
                    <span class="lbRank">${medals[i] || (i+1)}</span>
                    <span class="lbName">
                        ${escapeHTML(r.name)}
                        ${r.superVip ? " 💎" : r.vip ? " 👑" : ""}
                    </span>
                    <span class="lbValue">${r.value}</span>
                </div>
            `)
            .join("");

}


/* =========================
   AVATAR PICKER
========================= */

const AVATAR_OPTIONS =
    ["🎮","🕹️","👾","🐉","🔥","⚡","🌟","🦄","🐺","🎯","🏆","💀","🤖","🐸","🦊","😎"];

function renderAvatarPicker(u){

    const box = $("avatarPicker");

    if(!box)
        return;

    box.innerHTML =
        AVATAR_OPTIONS
            .map(a => `
                <div
                    class="avatarOption ${u.avatar === a ? "selected" : ""}"
                    data-avatar="${a}"
                >${a}</div>
            `)
            .join("");

    box.querySelectorAll("[data-avatar]").forEach(el => {

        el.onclick = () => {

            const cu = user();

            if(!cu)
                return;

            cu.avatar =
                el.getAttribute("data-avatar");

            saveDB();
            updateAccount();

        };

    });

}


/* =========================
   DAILY LOGIN BONUS
========================= */

let dailyBonusCheckedUsers = new Set();

function checkDailyBonus(u){

    const today =
        new Date().toISOString().slice(0,10);

    if(!dailyBonusCheckedUsers.has(u.name)){

        dailyBonusCheckedUsers.add(u.name);

        if(u.lastLogin !== today){

            const yesterday =
                new Date(Date.now() - 86400000)
                    .toISOString()
                    .slice(0,10);

            u.loginStreak =
                (u.lastLogin === yesterday)
                    ? (u.loginStreak||0) + 1
                    : 1;

            const bonus =
                Math.min(
                    20 + (u.loginStreak - 1) * 10,
                    200
                );

            u.balance = (u.balance||0) + bonus;
            u.lastLogin = today;

            saveDB();

            $("balance").textContent =
                u.balance;

            msg(
                "🎁 Ежедневный бонус",
                `День ${u.loginStreak} подряд! +${bonus} GH`
            );

        }

    }

    $("streakLabel").textContent =
        u.loginStreak > 0
            ? `🔥 Серия входов: ${u.loginStreak} дней`
            : "";

}


/* =========================
   ANNOUNCEMENT BANNER
========================= */

function renderAnnouncement(){

    const banner = $("announceBanner");

    if(!banner)
        return;

    if(!db.announcement || !db.announcement.text){

        banner.classList.add("hidden");
        return;

    }

    const dismissed =
        sessionStorage.getItem("announceDismiss");

    if(dismissed === String(db.announcement.ts)){

        banner.classList.add("hidden");
        return;

    }

    $("announceText").textContent =
        "📢 " + db.announcement.text;

    banner.classList.remove("hidden");

}


/* =========================
   HALL OF FAME
========================= */

function renderHallOfFame(){

    const box = $("hallOfFameBox");

    if(!box)
        return;

    if(!db.hallOfFame || db.hallOfFame.length === 0){

        box.innerHTML =
            "<p class='muted'>Зал славы пока пуст.</p>";

        return;

    }

    const medals = ["🥇","🥈","🥉"];

    box.innerHTML =
        `<h3 style="margin-bottom:10px">📸 Зал славы</h3>` +
        [...db.hallOfFame]
            .reverse()
            .map(entry => `
                <div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #ffffff14">
                    <div class="muted" style="font-size:11px;margin-bottom:6px">
                        ${new Date(entry.ts).toLocaleDateString("ru-RU")}
                    </div>
                    ${
                        entry.top
                            .map((r,i) => `
                                <div class="lbRow">
                                    <span class="lbRank">${medals[i] || (i+1)}</span>
                                    <span class="lbName">${escapeHTML(r.name)}</span>
                                    <span class="lbValue">${r.value} GH</span>
                                </div>
                            `)
                            .join("")
                    }
                </div>
            `)
            .join("");

}

$("snapshotHallBtn").onclick =
    () => {

        if(!admin)
            return;

        const top =
            [...db.users]
                .sort((a,b) => (b.balance||0) - (a.balance||0))
                .slice(0,3)
                .map(u => ({ name:u.name, value:u.balance||0 }));

        if(top.length === 0 || top[0].value === 0){

            return msg(
                "Зал славы",
                "Пока нет игроков с балансом для записи."
            );

        }

        db.hallOfFame.push({
            ts: Date.now(),
            top: top
        });

        logAdminAction(
            "Сохранён топ-3 в Зал славы",
            top.map(r => r.name + " (" + r.value + " GH)").join(", ")
        );

        saveDB();

        renderHallOfFame();

        msg(
            "Зал славы",
            "Топ-3 сохранён в Зале славы."
        );

    };



/* =========================
   SITE STATS
========================= */

function renderSiteStats(){

    const box = $("siteStatsBar");

    if(!box)
        return;

    if(!window.GameHub){
        box.innerHTML = "";
        return;
    }

    const stats =
        GameHub.getSiteStats(db);

    const topGameName =
        stats.topGame
            ? (GameHub.GAME_NAMES[stats.topGame] || stats.topGame)
            : "—";

    box.innerHTML = `
        <div class="statItem">
            <div class="statValue">${stats.totalPlayers}</div>
            <div class="statLabel">Игроков</div>
        </div>
        <div class="statItem">
            <div class="statValue">${stats.totalBalance}</div>
            <div class="statLabel">GH в экономике</div>
        </div>
        <div class="statItem">
            <div class="statValue">${stats.totalGamesPlayed}</div>
            <div class="statLabel">Игр сыграно</div>
        </div>
        <div class="statItem">
            <div class="statValue">${topGameName}</div>
            <div class="statLabel">Популярная игра</div>
        </div>
    `;

}


/* =========================
   GAME RATINGS
========================= */

function renderGameRatings(){

    document.querySelectorAll("[data-game]").forEach(box => {

        if(!box.classList.contains("gameRating"))
            return;

        const gameId =
            box.getAttribute("data-game");

        const votes =
            (db.ratings && db.ratings[gameId]) || {};

        const values =
            Object.values(votes);

        const count = values.length;

        const avg =
            count > 0
                ? values.reduce((a,b) => a+b, 0) / count
                : 0;

        const u = user();

        const myVote =
            (u && votes[u.name]) || 0;

        const displayValue =
            myVote || Math.round(avg);

        let stars = "";

        for(let i=1; i<=5; i++){

            stars += `<span class="star ${i <= displayValue ? "filled" : ""}" data-star="${i}">★</span>`;

        }

        box.innerHTML =
            stars +
            `<span class="ratingCount">${avg > 0 ? avg.toFixed(1) : "—"} (${count})</span>`;

        box.querySelectorAll("[data-star]").forEach(starEl => {

            starEl.onclick = e => {

                e.preventDefault();

                rateGame(
                    gameId,
                    Number(starEl.getAttribute("data-star"))
                );

            };

        });

    });

}

function rateGame(gameId, stars){

    const u = user();

    if(!u){

        return msg(
            "Оценка",
            "Войди в аккаунт, чтобы оценить игру."
        );

    }

    if(!db.ratings[gameId])
        db.ratings[gameId] = {};

    db.ratings[gameId][u.name] = stars;

    saveDB();

    renderGameRatings();

}


/* =========================
   BACKUP / RESTORE
========================= */

$("exportDataBtn").onclick =
    () => {

        const u = user();

        if(!u){

            return msg(
                "Экспорт",
                "Сначала войди в аккаунт."
            );

        }

        const blob =
            new Blob(
                [JSON.stringify(u, null, 2)],
                { type:"application/json" }
            );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download = `gamehub-${u.name}-backup.json`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);

        msg(
            "Экспорт",
            "Файл с резервной копией скачан."
        );

    };

$("importDataBtn").onclick =
    () => {

        $("importFileInput").click();

    };

$("importFileInput").onchange =
    e => {

        const file =
            e.target.files[0];

        if(!file)
            return;

        const reader =
            new FileReader();

        reader.onload = () => {

            let imported;

            try{

                imported =
                    JSON.parse(
                        reader.result
                    );

            }catch(err){

                return msg(
                    "Импорт",
                    "Файл повреждён или не в формате JSON."
                );

            }

            if(!imported || typeof imported.name !== "string" || !imported.name){

                return msg(
                    "Импорт",
                    "Это не похоже на файл резервной копии Game Hub."
                );

            }

            const existingIndex =
                db.users.findIndex(
                    x => x.name.toLowerCase() === imported.name.toLowerCase()
                );

            if(existingIndex !== -1){

                const ok =
                    confirm(
                        `Аккаунт "${imported.name}" уже существует на этом устройстве. Перезаписать его данными из файла?`
                    );

                if(!ok)
                    return;

                db.users[existingIndex] = imported;

            }else{

                db.users.push(imported);

            }

            saveDB();

            session = imported.name;

            localStorage.setItem(
                SESSION_KEY,
                session
            );

            e.target.value = "";

            updateAccount();
            updateVIP();
            renderAdmin();

            msg(
                "Импорт",
                `Данные аккаунта "${imported.name}" восстановлены.`
            );

        };

        reader.readAsText(file);

    };


/* =========================
   CHANGE PASSWORD
========================= */

$("changePassBtn").onclick =
    async () => {

        const u = user();

        if(!u){

            return msg(
                "Пароль",
                "Сначала войди в аккаунт."
            );

        }

        const cur =
            $("curPassInput").value;

        const next =
            $("newPassInput").value;

        const confirmNext =
            $("newPassConfirm").value;

        if(!(await verifyPassword(u, cur))){

            return msg(
                "Пароль",
                "Текущий пароль указан неверно."
            );

        }

        if(next.length < 6){

            return msg(
                "Пароль",
                "Новый пароль должен быть минимум 6 символов."
            );

        }

        if(next !== confirmNext){

            return msg(
                "Пароль",
                "Пароли не совпадают."
            );

        }

        await setPassword(u, next);

        saveDB();

        $("curPassInput").value = "";
        $("newPassInput").value = "";
        $("newPassConfirm").value = "";

        msg(
            "Пароль",
            "Пароль успешно изменён."
        );

    };


/* =========================
   GIFT GH
========================= */

$("sendGiftBtn").onclick =
    () => {

        const u = user();

        if(!u){

            return msg(
                "Подарок",
                "Сначала войди в аккаунт."
            );

        }

        const targetName =
            $("giftUserInput")
                .value
                .trim();

        const amount =
            Math.floor(
                Number($("giftAmountInput").value)
            );

        if(!targetName){

            return msg(
                "Подарок",
                "Укажи имя игрока."
            );

        }

        if(targetName.toLowerCase() === u.name.toLowerCase()){

            return msg(
                "Подарок",
                "Нельзя подарить GH самому себе."
            );

        }

        if(!amount || amount <= 0){

            return msg(
                "Подарок",
                "Укажи корректное количество GH."
            );

        }

        if(amount > (u.balance||0)){

            return msg(
                "Подарок",
                "У тебя недостаточно GH."
            );

        }

        const target =
            db.users.find(
                x => x.name.toLowerCase() === targetName.toLowerCase()
            );

        if(!target){

            return msg(
                "Подарок",
                "Игрок с таким именем не найден."
            );

        }

        u.balance -= amount;
        target.balance = (target.balance||0) + amount;

        if(typeof u.giftsSent !== "number")
            u.giftsSent = 0;

        u.giftsSent++;

        saveDB();

        $("giftUserInput").value = "";
        $("giftAmountInput").value = "";

        updateAccount();
        renderAdmin();

        msg(
            "Подарок",
            `Ты подарил ${amount} GH игроку ${target.name}.`
        );

    };


/* =========================
   DELETE ACCOUNT
========================= */

$("deleteAccountBtn").onclick =
    () => {

        const u = user();

        if(!u)
            return;

        const ok =
            confirm(
                `Точно удалить аккаунт "${u.name}"? Это действие необратимо — весь прогресс, GH и покупки будут потеряны.`
            );

        if(!ok)
            return;

        db.users =
            db.users.filter(
                x => x.name !== u.name
            );

        saveDB();

        session = "";

        localStorage.removeItem(SESSION_KEY);

        updateAccount();
        updateVIP();
        renderAdmin();

        msg(
            "Аккаунт удалён",
            "Твой аккаунт был полностью удалён."
        );

    };


/* =========================
   RANDOM GAME
========================= */

const RANDOM_GAMES = [
    "shooter.html",
    "flappy-bird.html",
    "traffic-dodge.html",
    "dogeball.html",
    "natural-disaster.html",
    "glitch-arena.html",
    "snake.html",
    "memory-match.html"
];

$("randomGameBtn").onclick =
    () => {

        const pick =
            RANDOM_GAMES[
                Math.floor(Math.random() * RANDOM_GAMES.length)
            ];

        location.href = pick;

    };


/* =========================
   VIP
========================= */

function updateVIP(){

    const u =
        user();

    const active =
        !!(u && (u.vip || u.superVip));

    $("vipStatus")
        .classList
        .toggle(
            "active",
            active
        );

    $("vipStatus")
        .innerHTML =
        active
        ?
        `
        👑 <b>${u.superVip ? "SUPER VIP" : "VIP"} АКТИВЕН</b><br>
        ✨ Премиум статус включён.<br>
        💾 Статус сохранён в аккаунте.
        `
        :
        "🔒 VIP пока не активирован.";

    $("vipActivation")
        .classList
        .toggle(
            "hidden",
            active
        );

    $("removeVip")
        .classList
        .toggle(
            "hidden",
            !active
        );

    if(active){

        document.body
            .classList
            .add("vip");

    }

    updateAccount();

}


/* =========================
   PASSWORD SECURITY
========================= */

async function sha256Hex(text){

    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);

    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2,"0"))
        .join("");

}

/* Verifies a password against a user record. Supports the old
   plain-text "pass" field from before hashing was added - the
   first successful login on a legacy account silently upgrades
   it to a hash and removes the plain-text copy. */
async function verifyPassword(u, plain){

    if(u.passHash)
        return (await sha256Hex(plain)) === u.passHash;

    if(typeof u.pass === "string" && u.pass === plain){

        u.passHash = await sha256Hex(plain);
        delete u.pass;
        saveDB();

        return true;

    }

    return false;

}

async function setPassword(u, plain){

    u.passHash = await sha256Hex(plain);
    delete u.pass;

}

/* Basic brute-force protection. Resets on page reload - this is a
   client-side site with no server, so it slows down casual guessing
   rather than providing real protection against a determined attacker. */
const loginAttempts = {};
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_MS = 60000;

function checkLoginLock(name){

    const rec = loginAttempts[name.toLowerCase()];

    if(rec && rec.lockUntil && Date.now() < rec.lockUntil){

        return Math.ceil((rec.lockUntil - Date.now()) / 1000);

    }

    return 0;

}

function registerFailedLogin(name){

    const key = name.toLowerCase();

    if(!loginAttempts[key])
        loginAttempts[key] = { count:0, lockUntil:0 };

    loginAttempts[key].count++;

    if(loginAttempts[key].count >= MAX_LOGIN_ATTEMPTS){

        loginAttempts[key].lockUntil = Date.now() + LOGIN_LOCK_MS;
        loginAttempts[key].count = 0;

    }

}

function clearLoginAttempts(name){

    delete loginAttempts[name.toLowerCase()];

}


/* =========================
   2FA / OWNER SECURITY
========================= */

function isOwner(u){
    return !!(u && String(u.name).toLowerCase() === OWNER_USERNAME);
}

function isHelper(u){
    return !!(u && String(u.name).toLowerCase() === HELPER_USERNAME);
}

const BASE32_ALPHABET="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function randomBase32(length=20){
    const bytes=new Uint8Array(length);
    crypto.getRandomValues(bytes);
    let out="";
    for(const b of bytes) out+=BASE32_ALPHABET[b % 32];
    return out;
}

function base32ToBytes(input){
    const clean=String(input).toUpperCase().replace(/[^A-Z2-7]/g,"");
    let bits="";
    for(const c of clean){
        const n=BASE32_ALPHABET.indexOf(c);
        if(n>=0) bits+=n.toString(2).padStart(5,"0");
    }
    const bytes=[];
    for(let i=0;i+8<=bits.length;i+=8) bytes.push(parseInt(bits.slice(i,i+8),2));
    return new Uint8Array(bytes);
}

async function totpCode(secret,drift=0){
    const counter=Math.floor(Date.now()/1000/30)+drift;
    const buffer=new ArrayBuffer(8);
    const view=new DataView(buffer);
    view.setUint32(0,Math.floor(counter/0x100000000));
    view.setUint32(4,counter>>>0);
    const key=await crypto.subtle.importKey("raw",base32ToBytes(secret),{name:"HMAC",hash:"SHA-1"},false,["sign"]);
    const sig=new Uint8Array(await crypto.subtle.sign("HMAC",key,buffer));
    const off=sig[sig.length-1]&15;
    const bin=((sig[off]&127)<<24)|((sig[off+1]&255)<<16)|((sig[off+2]&255)<<8)|(sig[off+3]&255);
    return String(bin%1000000).padStart(6,"0");
}

async function verifyTOTP(secret,code){
    const clean=String(code||"").replace(/\D/g,"");
    if(clean.length!==6) return false;
    for(const d of [-1,0,1]) if(await totpCode(secret,d)===clean) return true;
    return false;
}

function otpAuthURI(u,secret){
    return "otpauth://totp/GameHub:"+encodeURIComponent(u.name)+"?secret="+secret+"&issuer=GameHub&digits=6&period=30";
}

async function setup2FA(u){
    if(!u || isOwner(u)) return true;
    if(!u.twoFASecret) u.twoFASecret=randomBase32();
    saveDB();
    msg("🔐 Настройка 2FA","Секрет для Google Authenticator/Authy:\n\n"+u.twoFASecret+"\n\nМожно также использовать URI:\n"+otpAuthURI(u,u.twoFASecret));
    const code=prompt("Введи 6-значный код из приложения 2FA:");
    if(!(await verifyTOTP(u.twoFASecret,code))) return false;
    u.twoFAEnabled=true;
    saveDB();
    return true;
}

async function require2FA(u){
    if(isOwner(u)) return true;
    if(!u.twoFAEnabled || !u.twoFASecret) return await setup2FA(u);
    return await verifyTOTP(u.twoFASecret,prompt("🔐 Введи 6-значный код 2FA:"));
}

function updateSecurityLabel(){
    const u=user();
    if(!u){
        $("securityLabel").textContent="";
        $("setup2FABtn").classList.add("hidden");
        return;
    }
    if(isOwner(u)){
        $("securityLabel").textContent="👑 OWNER • "+OWNER_DISPLAY+" • вход по паролю";
        $("setup2FABtn").classList.add("hidden");
        return;
    }
    if(isHelper(u)){
        $("securityLabel").textContent=
            "🛟 HELP ACCOUNT • "+HELPER_DISPLAY+" • "+
            (u.twoFAEnabled?"🔐 2FA включена":"⚠️ 2FA ещё не настроена");
        $("setup2FABtn").classList.remove("hidden");
        return;
    }
    $("securityLabel").textContent=u.twoFAEnabled?"🔐 2FA включена":"⚠️ 2FA ещё не настроена";
    $("setup2FABtn").classList.remove("hidden");
}

$("setup2FABtn").onclick=async()=>{
    const u=user();
    if(!u || isOwner(u)) return;
    const ok=await setup2FA(u);
    updateSecurityLabel();
    msg("2FA",ok?"2FA успешно включена.":"Код неверный. 2FA не включена.");
};

/* =========================
   REGISTER
========================= */

$("registerBtn").onclick =
    async () => {

        const name =
            normalizeName(
                $("regName").value
            );

        const pass =
            $("regPass").value;

        if(!validUserName(name)){

            return msg(
                "Ошибка",
                "Имя должно содержать 3–20 букв, цифр или _."
            );

        }

        if(name.toLowerCase() === OWNER_USERNAME){
            return msg("Ошибка","Никнейм "+OWNER_DISPLAY+" зарезервирован владельцем Game Hub.");
        }

        if(name.toLowerCase() === HELPER_USERNAME){
            return msg("Ошибка","Никнейм "+HELPER_DISPLAY+" зарезервирован службой поддержки Game Hub.");
        }

        if(pass.length < 6){

            return msg(
                "Ошибка",
                "Пароль должен быть минимум 6 символов."
            );

        }

        if(
            db.users.some(
                u =>
                    u.name.toLowerCase() ===
                    name.toLowerCase()
            )
        ){

            return msg(
                "Ошибка",
                "Такой аккаунт уже существует."
            );

        }

        const refCodeInput =
            $("regRefCode")
                .value
                .trim()
                .toUpperCase();

        const referrer =
            refCodeInput
                ? db.users.find(
                    u => u.refCode === refCodeInput
                  )
                : null;

        const passHash =
            await sha256Hex(pass);

        db.users.push({

            name:name,
            nickname:name,
            passHash:passHash,
            balance: referrer ? 100 : 0,
            vip:false,
            twoFAEnabled:false,
            twoFASecret:"",
            superVip:false,
            title:"",
            owned:[],
            effects:[],
            scores:{},
            wins:{},
            gamesPlayed:0,
            achievements:[],
            avatar:"🎮",
            refCode:"REF-"+name.toUpperCase(),
            referredBy: referrer ? referrer.name : "",
            referrals:[],
            loginStreak:0,
            lastLogin:""

        });

        if(referrer){

            referrer.balance = (referrer.balance||0) + 150;

            if(!Array.isArray(referrer.referrals))
                referrer.referrals=[];

            referrer.referrals.push(name);

        }

        saveDB();

        session=name;

        localStorage.setItem(
            SESSION_KEY,
            session
        );

        $("regName").value="";
        $("regPass").value="";
        $("regRefCode").value="";

        updateAccount();
        updateVIP();
        renderAdmin();

        msg(
            "Готово",
            referrer
                ? "Аккаунт создан. Бонус за реферальный код: +100 GH!"
                : "Аккаунт создан."
        );

    };


/* =========================
   LOGIN
========================= */

$("loginBtn").onclick =
    async () => {

        const name =
            normalizeName(
                $("loginName").value
            );

        const pass =
            $("loginPass").value;

        const lockedFor =
            checkLoginLock(name);

        if(lockedFor > 0){

            return msg(
                "Вход заблокирован",
                `Слишком много неудачных попыток. Попробуй снова через ${lockedFor} сек.`
            );

        }

        const candidate =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        const ok =
            candidate
                ? await verifyPassword(candidate, pass)
                : false;

        if(!ok){

            registerFailedLogin(name);

            return msg(
                "Ошибка",
                "Неверное имя пользователя или пароль."
            );

        }

        clearLoginAttempts(name);

        const u = candidate;

        if(u.banned){

            return msg(
                "Доступ закрыт",
                "Этот аккаунт заблокирован администратором."
            );

        }

        session=u.name;

        localStorage.setItem(
            SESSION_KEY,
            session
        );

        updateAccount();
        updateVIP();
        renderAdmin();

        msg(
            "Вход",
            "Ты вошёл в аккаунт."
        );

    };


/* =========================
   LOGOUT
========================= */

$("logoutBtn").onclick =
    () => {

        session="";

        localStorage.removeItem(
            SESSION_KEY
        );

        updateAccount();
        updateVIP();

    };


/* =========================
   VIP CODE
========================= */

$("activateVip").onclick =
    () => {

        const code =
            $("vipCode")
                .value
                .trim()
                .toUpperCase();

        const generatedCode =
            db.codes.find(
                c =>
                    c.code === code &&
                    c.type === "vip" &&
                    !c.used
            );

        if(
            code !== VIP_CODE &&
            !generatedCode
        ){

            return msg(
                "VIP",
                "Неверный VIP-код."
            );

        }

        const u=user();

        if(!u){

            return msg(
                "VIP",
                "Сначала войди в аккаунт."
            );

        }

        u.vip=true;

        if(generatedCode)
            generatedCode.used=true;

        saveDB();

        $("vipCode").value="";

        updateVIP();
        renderAdmin();

        msg(
            "VIP",
            "VIP успешно активирован."
        );

    };


$("vipCode")
.addEventListener(
    "keydown",
    e => {

        if(e.key==="Enter")
            $("activateVip").click();

    }
);


/* =========================
   REMOVE VIP
========================= */

$("removeVip").onclick =
    () => {

        const u=user();

        if(u){

            u.vip=false;
            u.superVip=false;

            saveDB();

        }

        if(
            localStorage.getItem(
                THEME_KEY
            ) === "vip"
        ){

            localStorage.setItem(
                THEME_KEY,
                "default"
            );

        }

        applyTheme();
        updateVIP();
        renderAdmin();

    };


/* =========================
   SHOP
========================= */

let currentCategory="all";


function updateShop(){

    const u=user();

    $("shopBalance")
        .textContent =
        u ? u.balance : 0;

    $("shopUserStatus")
        .textContent =
        u
        ?
        "Выбирай товар и покупай его за GH."
        :
        "Войди в аккаунт, чтобы покупать.";

    renderShop();

}


function ownsItem(u,item){

    return !!(
        u &&
        Array.isArray(u.owned) &&
        u.owned.includes(item.id)
    );

}


function renderShop(){

    const u=user();

    const searchEl = $("shopSearch");
    const query = searchEl ? searchEl.value.trim().toLowerCase() : "";

    let items =
        db.shop.filter(
            item =>
                (currentCategory === "all" ||
                item.category === currentCategory) &&
                (query === "" ||
                item.name.toLowerCase().includes(query))
        );

    if(items.length === 0){

        $("shopGrid").innerHTML =
            "<p class='muted'>Ничего не найдено.</p>";

        return;

    }

    $("shopGrid").innerHTML =
        items.map(
            item => {

                const owned =
                    ownsItem(u,item);

                return `
                <div class="shopItem">

                    <div class="shopIcon">
                        ${escapeHTML(item.icon)}
                    </div>

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            item.category === "title"
                            ? "Особый титул для твоего аккаунта."
                            : item.category === "theme"
                            ? "Тема оформления Game Hub."
                            : item.category === "vip"
                            ? "Премиум улучшение аккаунта."
                            : "Косметический эффект."
                        )}
                    </p>

                    ${
                        owned
                        ?
                        `
                        <div class="shopOwned">
                            ✓ УЖЕ КУПЛЕНО
                        </div>
                        `
                        :
                        `
                        <div class="shopPrice">
                            💰 ${item.price} GH
                        </div>

                        <button
                            class="shopBtn"
                            onclick="buyItem('${escapeHTML(item.id)}')"
                            ${
                                !u
                                ? "disabled"
                                : ""
                            }
                        >
                            КУПИТЬ
                        </button>
                        `
                    }

                </div>
                `;

            }
        )
        .join("");

}


window.buyItem =
    id => {

        const u=user();

        if(!u){

            return msg(
                "Магазин",
                "Сначала войди в аккаунт."
            );

        }

        if(!Array.isArray(u.owned))
            u.owned=[];

        const item =
            db.shop.find(
                x =>
                    x.id === id
            );

        if(!item)
            return;

        if(
            u.owned.includes(item.id)
        ){

            return msg(
                "Магазин",
                "Ты уже купил этот товар."
            );

        }

        if(
            u.balance < item.price
        ){

            return msg(
                "Магазин",
                "Недостаточно GH."
            );

        }

        u.balance -= item.price;

        u.owned.push(item.id);


        /* ITEM EFFECT */

        if(item.category === "title"){

            u.title =
                item.value;

        }


        if(item.category === "theme"){

            localStorage.setItem(
                THEME_KEY,
                item.value
            );

            applyTheme();

        }


        if(item.category === "vip"){

            if(item.value === "vip")
                u.vip=true;

            if(item.value === "supervip"){

                u.vip=true;
                u.superVip=true;

            }

        }


        if(item.category === "effect"){

            if(!Array.isArray(u.effects))
                u.effects=[];

            if(
                !u.effects.includes(
                    item.value
                )
            ){

                u.effects.push(
                    item.value
                );

            }

        }


        saveDB();

        updateAccount();
        updateVIP();
        renderAdmin();

        msg(
            "Покупка",
            "Товар успешно куплен!"
        );

    };


document.querySelectorAll(
    ".categoryBtn"
)
.forEach(
    button => {

        button.onclick =
            () => {

                document.querySelectorAll(
                    ".categoryBtn"
                )
                .forEach(
                    x =>
                        x.classList
                        .remove("active")
                );

                button.classList
                    .add("active");

                currentCategory =
                    button.dataset.category;

                renderShop();

            };

    }
);


$("shopSearch").addEventListener(
    "input",
    () => renderShop()
);

$("adminUserSearch").addEventListener(
    "input",
    () => renderAdmin()
);


/* =========================
   ADMIN OPEN
========================= */

$("adminOpen").onclick =
    () => {

        $("adminSection")
            .scrollIntoView({
                behavior:"smooth"
            });

    };


/* =========================
   ADMIN LOGIN
========================= */

$("adminLoginBtn").onclick =
    async () => {

        const lockedFor =
            checkLoginLock("::admin::");

        if(lockedFor > 0){

            return msg(
                "Админка",
                `Слишком много неудачных попыток. Попробуй снова через ${lockedFor} сек.`
            );

        }

        const password =
            prompt(
                "Введите пароль админки:"
            );

        if(password === null)
            return;

        const hash =
            await sha256Hex(password);

        if(hash !== ADMIN_PASSWORD_HASH){

            registerFailedLogin("::admin::");

            return msg(
                "Админка",
                "Неверный пароль."
            );

        }

        clearLoginAttempts("::admin::");

        admin=true;

        $("adminPanel")
            .classList
            .add("open");

        renderAdmin();

    };


/* =========================
   ADMIN LOGOUT
========================= */

$("adminLogout").onclick =
    () => {

        admin=false;

        $("adminPanel")
            .classList
            .remove("open");

    };


/* =========================
   ADMIN RENDER
========================= */

/* =========================
   ADMIN AUDIT LOG
========================= */

function logAdminAction(action, detail){

    db.adminLog.unshift({
        ts: Date.now(),
        action: action,
        detail: detail
    });

    if(db.adminLog.length > 50)
        db.adminLog.length = 50;

}

function renderAdminLog(){

    const box = $("adminLogList");

    if(!box)
        return;

    if(!db.adminLog || db.adminLog.length === 0){

        box.innerHTML =
            "<p class='small'>Пока нет действий.</p>";

        return;

    }

    box.innerHTML =
        db.adminLog
            .map(entry => `
                <div style="padding:6px 0;border-bottom:1px solid #ffffff10">
                    <span class="muted">
                        ${new Date(entry.ts).toLocaleString("ru-RU")}
                    </span>
                    <br>
                    ${escapeHTML(entry.action)}${entry.detail ? ": " + escapeHTML(entry.detail) : ""}
                </div>
            `)
            .join("");

}


function renderAdmin(){

    const searchEl = $("adminUserSearch");
    const query = searchEl ? searchEl.value.trim().toLowerCase() : "";

    const filteredUsers =
        db.users.filter(
            u => query === "" || u.name.toLowerCase().includes(query)
        );

    $("usersList").innerHTML =
        filteredUsers.length
        ?
        filteredUsers
        .map(
            u =>
            `
            <div class="user-row" style="${u.banned ? "opacity:.55" : ""}">

                <span>

                    <b>
                        ${escapeHTML(u.name)} ${isOwner(u) ? " 👑 OWNER" : isHelper(u) ? " 🛟 HELPER" : ""} ${u.banned ? " 🚫 ЗАБЛОКИРОВАН" : ""}
                    </b>

                    <br>

                    <span class="small">

                        ${
                            u.superVip
                            ? "💎 SUPER VIP"
                            : u.vip
                            ? "👑 VIP"
                            : "👤 обычный"
                        }

                        •

                        ${
                            u.title
                            ? "🏷️ " +
                              escapeHTML(u.title)
                            : "без титула"
                        }

                        •

                        ${u.balance} GH

                    </span>

                </span>


                <span>

                    <button
                        class="adminBtn"
                        onclick="adminSetBalance('${escapeHTML(u.name)}')"
                    >
                        💰
                    </button>

                    <button
                        class="goldBtn"
                        onclick="adminToggleVip('${escapeHTML(u.name)}')"
                    >
                        👑
                    </button>

                    <button
                        class="adminBtn"
                        onclick="adminSetTitle('${escapeHTML(u.name)}')"
                    >
                        🏷️
                    </button>

                    <button
                        class="${u.banned ? "goldBtn" : "dangerBtn"}"
                        onclick="adminToggleBan('${escapeHTML(u.name)}')"
                    >
                        ${u.banned ? "✅" : "🚫"}
                    </button>

                    <button
                        class="dangerBtn"
                        onclick="adminDeleteUser('${escapeHTML(u.name)}')"
                    >
                        🗑️
                    </button>

                </span>

            </div>
            `
        )
        .join("")
        :
        `
        <p class="small">
            ${query ? "Ничего не найдено." : "Пользователей пока нет."}
        </p>
        `;


    $("codesList").innerHTML =
        db.codes.length
        ?
        db.codes
        .map(
            c =>
            `
            <div class="code-row">

                <span>

                    <b>
                        ${escapeHTML(c.code)}
                    </b>

                    <br>

                    <span class="small">

                        ${
                            c.type === "vip"
                            ? "👑 VIP-код"
                            : `+${c.amount} GH`
                        }

                        •

                        ${
                            c.used
                            ? "использован"
                            : "доступен"
                        }

                    </span>

                </span>

                <button
                    class="dangerBtn"
                    onclick="deleteCode('${escapeHTML(c.code)}')"
                >
                    🗑️
                </button>

            </div>
            `
        )
        .join("")
        :
        `
        <p class="small">
            Кодов пока нет.
        </p>
        `;


    $("adminShopList").innerHTML =
        db.shop.length
        ?
        db.shop
        .map(
            item =>
            `
            <div class="code-row">

                <span>

                    <b>
                        ${escapeHTML(item.icon)}
                        ${escapeHTML(item.name)}
                    </b>

                    <br>

                    <span class="small">

                        ${item.price} GH
                        •
                        ${escapeHTML(item.category)}

                    </span>

                </span>

                <button
                    class="dangerBtn"
                    onclick="deleteShopItem('${escapeHTML(item.id)}')"
                >
                    🗑️
                </button>

            </div>
            `
        )
        .join("")
        :
        `
        <p class="small">
            Товаров нет.
        </p>
        `;

    renderAdminLog();

}


/* =========================
   ADMIN BALANCE
========================= */

window.adminSetBalance =
    name => {

        if(!admin)
            return;

        const u =
            db.users.find(
                x =>
                    x.name === name
            );

        if(!u)
            return;

        const n =
            Number(
                prompt(
                    "Новый баланс:",
                    u.balance
                )
            );

        if(
            Number.isFinite(n) &&
            n >= 0
        ){

            u.balance =
                Math.floor(n);

            logAdminAction("Изменён баланс", name + " -> " + u.balance + " GH");

            saveDB();

            renderAdmin();
            updateAccount();

        }

    };


/* =========================
   ADMIN VIP
========================= */

window.adminToggleVip =
    name => {

        if(!admin)
            return;

        const u =
            db.users.find(
                x =>
                    x.name === name
            );

        if(!u)
            return;

        u.vip =
            !u.vip;

        logAdminAction(u.vip ? "Выдан VIP" : "Снят VIP", name);

        saveDB();

        renderAdmin();
        updateAccount();
        updateVIP();

    };


/* =========================
   ADMIN TITLE
========================= */

window.adminSetTitle =
    name => {

        if(!admin)
            return;

        const u =
            db.users.find(
                x =>
                    x.name === name
            );

        if(!u)
            return;

        const title =
            prompt(
                "Введите новый титул:",
                u.title || ""
            );

        if(title === null)
            return;

        u.title =
            title.trim();

        logAdminAction("Изменён титул", name + " -> " + (u.title || "(пусто)"));

        saveDB();

        renderAdmin();
        updateAccount();

        msg(
            "Титул",
            "Титул пользователя изменён."
        );

    };


/* =========================
   ADMIN DELETE USER
========================= */

window.adminDeleteUser =
    name => {

        if(!admin)
            return;

        const target =
            db.users.find(x => x.name === name);

        if(target && isOwner(target)){

            return msg(
                "Админка",
                "Аккаунт владельца нельзя удалить отсюда."
            );

        }

        if(
            !confirm(
                "Удалить аккаунт " +
                name +
                "?"
            )
        )
            return;

        db.users =
            db.users.filter(
                x =>
                    x.name !== name
            );

        logAdminAction("Удалён аккаунт", name);

        saveDB();

        if(
            session === name
        ){

            session="";

            localStorage.removeItem(
                SESSION_KEY
            );

        }

        renderAdmin();
        updateAccount();
        updateVIP();

    };


/* =========================
   ADMIN BAN / UNBAN
========================= */

window.adminToggleBan =
    name => {

        if(!admin)
            return;

        const u =
            db.users.find(
                x => x.name === name
            );

        if(!u)
            return;

        if(isOwner(u)){

            return msg(
                "Админка",
                "Владельца нельзя заблокировать."
            );

        }

        u.banned = !u.banned;

        logAdminAction(
            u.banned ? "Заблокирован пользователь" : "Разблокирован пользователь",
            name
        );

        saveDB();

        if(u.banned && session === u.name){

            session="";

            localStorage.removeItem(SESSION_KEY);

        }

        renderAdmin();
        updateAccount();

    };


/* =========================
   DELETE CODE
========================= */

window.deleteCode =
    code => {

        if(!admin)
            return;

        db.codes =
            db.codes.filter(
                c =>
                    c.code !== code
            );

        logAdminAction("Удалён код", code);

        saveDB();

        renderAdmin();

    };


/* =========================
   GIVE MONEY
========================= */

$("giveMoney").onclick =
    () => {

        if(!admin)
            return;

        const name =
            normalizeName(
                $("moneyUser").value
            );

        const amount =
            Math.floor(
                Number(
                    $("moneyAmount").value
                )
            );

        const u =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if(
            !u ||
            !Number.isFinite(amount)
        ){

            return msg(
                "Админка",
                "Пользователь или сумма неверны."
            );

        }

        if(
            Math.abs(amount) > 5000 &&
            !confirm(`Выдать ${amount} GH игроку ${u.name}?`)
        ){

            return;

        }

        u.balance =
            Math.max(
                0,
                u.balance + amount
            );

        logAdminAction("Выдача GH", `${u.name}: ${amount > 0 ? "+" : ""}${amount} GH (итого ${u.balance})`);

        saveDB();

        renderAdmin();
        updateAccount();

        $("moneyUser").value="";
        $("moneyAmount").value="";

        msg(
            "Валюта",
            "Баланс обновлён."
        );

    };


/* =========================
   ADMIN PASSWORD RESET
========================= */

$("resetPassBtn").onclick =
    async () => {

        if(!admin)
            return;

        const name =
            normalizeName(
                $("resetPassUser").value
            );

        const newPass =
            $("resetPassNew").value;

        if(newPass.length < 6){

            return msg(
                "Админка",
                "Новый пароль должен быть минимум 6 символов."
            );

        }

        let u =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if(!u && name.toLowerCase() === OWNER_USERNAME){

            u = {

                name: OWNER_DISPLAY,
                nickname: OWNER_DISPLAY,
                balance:0,
                vip:true,
                superVip:true,
                twoFAEnabled:false,
                twoFASecret:"",
                title:"OWNER",
                owned:[],
                effects:[],
                scores:{},
                wins:{},
                playsByGame:{},
                gamesPlayed:0,
                achievements:[],
                avatar:"👑",
                refCode:"REF-"+OWNER_DISPLAY.toUpperCase(),
                referredBy:"",
                referrals:[],
                loginStreak:0,
                lastLogin:"",
                giftsSent:0,
                banned:false

            };

            db.users.push(u);

        }

        if(!u && name.toLowerCase() === HELPER_USERNAME){

            u = {

                name: HELPER_DISPLAY,
                nickname: HELPER_DISPLAY,
                balance:0,
                vip:true,
                superVip:false,
                twoFAEnabled:false,
                twoFASecret:"",
                title:"HELPER",
                owned:[],
                effects:[],
                scores:{},
                wins:{},
                playsByGame:{},
                gamesPlayed:0,
                achievements:[],
                avatar:"🛟",
                refCode:"REF-"+HELPER_DISPLAY.toUpperCase(),
                referredBy:"",
                referrals:[],
                loginStreak:0,
                lastLogin:"",
                giftsSent:0,
                banned:false

            };

            db.users.push(u);

        }

        if(!u){

            return msg(
                "Админка",
                "Пользователь не найден."
            );

        }

        await setPassword(u, newPass);

        logAdminAction("Сброшен пароль", u.name);

        saveDB();

        clearLoginAttempts(u.name);

        $("resetPassUser").value = "";
        $("resetPassNew").value = "";

        renderAdmin();

        msg(
            "Пароль сброшен",
            `Новый пароль для "${u.name}" установлен.`
        );

    };


/* =========================
   CREATE GH CODE
========================= */

$("createCode").onclick =
    () => {

        if(!admin)
            return;

        const code =
            $("newCode")
                .value
                .trim()
                .toUpperCase();

        const amount =
            Math.floor(
                Number(
                    $("newCodeAmount")
                        .value
                )
            );

        if(
            code.length < 3 ||
            !Number.isFinite(amount) ||
            amount <= 0
        ){

            return msg(
                "Код",
                "Укажи код и положительную сумму."
            );

        }

        if(
            db.codes.some(
                c =>
                    c.code === code
            )
        ){

            return msg(
                "Код",
                "Такой код уже существует."
            );

        }

        db.codes.push({

            code:code,
            amount:amount,
            type:"money",
            used:false

        });

        logAdminAction("Создан GH-код", code + " (+" + amount + " GH)");

        saveDB();

        renderAdmin();

        $("newCode").value="";
        $("newCodeAmount").value="";

        msg(
            "Код",
            "Код создан."
        );

    };


/* =========================
   CREATE VIP CODE
========================= */

$("createVipCode").onclick =
    () => {

        if(!admin)
            return;

        const code =
            $("newVipCode")
                .value
                .trim()
                .toUpperCase();

        if(code.length < 3){

            return msg(
                "Код",
                "Укажи код (минимум 3 символа)."
            );

        }

        if(
            db.codes.some(
                c =>
                    c.code === code
            )
        ){

            return msg(
                "Код",
                "Такой код уже существует."
            );

        }

        db.codes.push({

            code:code,
            type:"vip",
            used:false

        });

        logAdminAction("Создан VIP-код", code);

        saveDB();

        renderAdmin();

        $("newVipCode").value="";

        msg(
            "Код",
            "VIP-код создан."
        );

    };


/* =========================
   REDEEM CODE (GH or VIP)
========================= */

$("redeemCodeBtn").onclick =
    () => {

        const u=user();

        if(!u){

            return msg(
                "Код",
                "Сначала войди в аккаунт."
            );

        }

        const code =
            $("redeemCodeInput")
                .value
                .trim()
                .toUpperCase();

        if(!code){

            return msg(
                "Код",
                "Введи код."
            );

        }

        if(code === VIP_CODE){

            u.vip=true;

            saveDB();

            $("redeemCodeInput").value="";

            updateAccount();
            updateVIP();
            renderAdmin();

            return msg(
                "Код",
                "VIP успешно активирован."
            );

        }

        const found =
            db.codes.find(
                c =>
                    c.code === code &&
                    !c.used
            );

        if(!found){

            return msg(
                "Код",
                "Неверный или уже использованный код."
            );

        }

        if(found.type === "vip"){

            u.vip=true;

        }else{

            u.balance =
                (u.balance || 0) +
                found.amount;

        }

        found.used=true;

        saveDB();

        $("redeemCodeInput").value="";

        updateAccount();
        updateVIP();
        renderAdmin();

        msg(
            "Код",
            found.type === "vip"
            ? "VIP успешно активирован."
            : `Код активирован: +${found.amount} GH`
        );

    };


$("redeemCodeInput")
.addEventListener(
    "keydown",
    e => {

        if(e.key==="Enter")
            $("redeemCodeBtn").click();

    }
);


/* =========================
   GIVE VIP
========================= */

$("giveVip").onclick =
    () => {

        if(!admin)
            return;

        const name =
            normalizeName(
                $("vipUser").value
            );

        const u =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if(!u){

            return msg(
                "VIP",
                "Пользователь не найден."
            );

        }

        u.vip=true;

        saveDB();

        renderAdmin();

        if(u.name===session)
            updateVIP();

        msg(
            "VIP",
            "VIP выдан."
        );

    };


/* =========================
   REMOVE VIP
========================= */

$("removeUserVip").onclick =
    () => {

        if(!admin)
            return;

        const name =
            normalizeName(
                $("vipUser").value
            );

        const u =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if(!u){

            return msg(
                "VIP",
                "Пользователь не найден."
            );

        }

        u.vip=false;
        u.superVip=false;

        saveDB();

        renderAdmin();

        if(u.name===session)
            updateVIP();

        msg(
            "VIP",
            "VIP снят."
        );

    };


/* =========================
   GIVE TITLE
========================= */

$("giveTitle").onclick =
    () => {

        if(!admin)
            return;

        const name =
            normalizeName(
                $("titleUser").value
            );

        const title =
            $("titleSelect").value;

        const u =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if(!u){

            return msg(
                "Титул",
                "Пользователь не найден."
            );

        }

        u.title=title;

        saveDB();

        renderAdmin();
        updateAccount();

        msg(
            "Титул",
            "Титул выдан."
        );

    };


/* =========================
   SUPER VIP
========================= */

$("giveSuperVip").onclick =
    () => {

        if(!admin)
            return;

        const name =
            normalizeName(
                $("superVipUser").value
            );

        const u =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if(!u){

            return msg(
                "SUPER VIP",
                "Пользователь не найден."
            );

        }

        u.vip=true;
        u.superVip=true;

        saveDB();

        renderAdmin();

        if(u.name===session)
            updateVIP();

        msg(
            "SUPER VIP",
            "SUPER VIP выдан."
        );

    };


/* =========================
   REMOVE SUPER VIP
========================= */

$("removeSuperVip").onclick =
    () => {

        if(!admin)
            return;

        const name =
            normalizeName(
                $("superVipUser").value
            );

        const u =
            db.users.find(
                x =>
                    x.name.toLowerCase() ===
                    name.toLowerCase()
            );

        if(!u){

            return msg(
                "SUPER VIP",
                "Пользователь не найден."
            );

        }

        u.superVip=false;

        saveDB();

        renderAdmin();

        if(u.name===session)
            updateVIP();

        msg(
            "SUPER VIP",
            "SUPER VIP снят."
        );

    };


/* =========================
   CREATE SHOP ITEM
========================= */

$("createShopItem").onclick =
    () => {

        if(!admin)
            return;

        const name =
            $("shopName")
                .value
                .trim();

        const icon =
            $("shopIcon")
                .value
                .trim() || "🎁";

        const price =
            Math.floor(
                Number(
                    $("shopPrice").value
                )
            );

        const category =
            $("shopCategory")
                .value;

        const value =
            $("shopValue")
                .value
                .trim();

        if(
            name.length < 2 ||
            !Number.isFinite(price) ||
            price <= 0 ||
            !value
        ){

            return msg(
                "Магазин",
                "Заполни название, цену и значение товара."
            );

        }

        const id =
            "item-" +
            Date.now();

        db.shop.push({

            id:id,
            name:name,
            icon:icon,
            price:price,
            category:category,
            value:value

        });

        saveDB();

        renderAdmin();
        renderShop();

        $("shopName").value="";
        $("shopIcon").value="";
        $("shopPrice").value="";
        $("shopValue").value="";

        msg(
            "Магазин",
            "Товар добавлен."
        );

    };


/* =========================
   DELETE SHOP ITEM
========================= */

window.deleteShopItem =
    id => {

        if(!admin)
            return;

        const item =
            db.shop.find(
                x =>
                    x.id === id
            );

        if(!item)
            return;

        if(
            !confirm(
                "Удалить товар " +
                item.name +
                "?"
            )
        )
            return;

        db.shop =
            db.shop.filter(
                x =>
                    x.id !== id
            );

        saveDB();

        renderAdmin();
        renderShop();

    };


/* =========================
   SAVE THEME
========================= */

$("saveTheme").onclick =
    () => {

        if(!admin)
            return;

        const theme =
            $("themeSelect")
                .value;

        localStorage.setItem(
            THEME_KEY,
            theme
        );

        applyTheme();

        msg(
            "Тема",
            "Тема сохранена."
        );

    };


/* =========================
   ESC
========================= */

document.addEventListener(
    "keydown",
    e => {

        if(e.key==="Escape"){

            e.preventDefault();

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        }

    }
);


/* =========================
   INITIAL
========================= */

updateAccount();
updateVIP();
updateSecurityLabel();
renderAdmin();
renderShop();
renderAnnouncement();
renderHallOfFame();


/* =========================
   REFERRAL COPY
========================= */

$("copyRefCode").onclick =
    () => {

        const u = user();

        if(!u)
            return;

        const code = u.refCode;

        if(navigator.clipboard && navigator.clipboard.writeText){

            navigator.clipboard
                .writeText(code)
                .then(() => {

                    msg(
                        "Скопировано",
                        `Код ${code} скопирован в буфер обмена.`
                    );

                })
                .catch(() => {

                    msg("Твой код", code);

                });

        }else{

            msg("Твой код", code);

        }

    };


/* =========================
   ANNOUNCEMENT ADMIN CONTROLS
========================= */

$("publishAnnounce").onclick =
    () => {

        if(!admin)
            return;

        const text =
            $("announceInput")
                .value
                .trim();

        if(!text){

            return msg(
                "Объявление",
                "Введи текст объявления."
            );

        }

        db.announcement = {
            text: text,
            ts: Date.now()
        };

        logAdminAction("Опубликовано объявление", text);

        saveDB();

        $("announceInput").value = "";

        renderAnnouncement();

        msg(
            "Объявление",
            "Объявление опубликовано для всех."
        );

    };

$("clearAnnounce").onclick =
    () => {

        if(!admin)
            return;

        db.announcement = null;

        logAdminAction("Убрано объявление", "");

        saveDB();

        renderAnnouncement();

        msg(
            "Объявление",
            "Объявление убрано."
        );

    };

$("announceClose").onclick =
    () => {

        if(db.announcement){

            sessionStorage.setItem(
                "announceDismiss",
                String(db.announcement.ts)
            );

        }

        $("announceBanner")
            .classList
            .add("hidden");

    };

</script>
