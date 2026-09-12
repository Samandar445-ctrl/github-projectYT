/* =====================================================
   GAMEHUB BRIDGE
   Shared by index.html and every game file.
   Lets games report scores/wins back to the main
   account system (GH rewards, best scores, achievements).
===================================================== */

(function(){

    const DB_KEY = "gameHubDatabase";
    const SESSION_KEY = "gameHubSession";

    const GAME_NAMES = {
        "flappy-bird":"Flappy Bird",
        "traffic-dodge":"Traffic Dodge",
        "shooter":"Shooter",
        "glitch-arena":"Glitch Arena",
        "natural-disaster":"Natural Disaster Survival",
        "dogeball":"Dodgeball Chaos",
        "snake":"Snake",
        "memory-match":"Memory Match"
    };

    const ACHIEVEMENTS = [

        { id:"first-game", icon:"🎮", name:"Первая игра", desc:"Сыграй в любую игру хотя бы 1 раз", reward:50,
            check:u => (u.gamesPlayed||0) >= 1 },

        { id:"games-10", icon:"🕹️", name:"Заядлый игрок", desc:"Сыграй 10 игр", reward:150,
            check:u => (u.gamesPlayed||0) >= 10 },

        { id:"games-50", icon:"🏅", name:"Игровой марафон", desc:"Сыграй 50 игр", reward:500,
            check:u => (u.gamesPlayed||0) >= 50 },

        { id:"flappy-10", icon:"🐦", name:"Пилот", desc:"Набери 10+ очков в Flappy Bird", reward:75,
            check:u => ((u.scores||{})["flappy-bird"]||0) >= 10 },

        { id:"flappy-30", icon:"🦅", name:"Ас неба", desc:"Набери 30+ очков в Flappy Bird", reward:200,
            check:u => ((u.scores||{})["flappy-bird"]||0) >= 30 },

        { id:"traffic-20", icon:"🚗", name:"Гонщик", desc:"Набери 20+ очков в Traffic Dodge", reward:75,
            check:u => ((u.scores||{})["traffic-dodge"]||0) >= 20 },

        { id:"traffic-50", icon:"🏎️", name:"Уклонист", desc:"Набери 50+ очков в Traffic Dodge", reward:200,
            check:u => ((u.scores||{})["traffic-dodge"]||0) >= 50 },

        { id:"shooter-30", icon:"🔫", name:"Стрелок", desc:"Набери 30+ очков в Shooter", reward:75,
            check:u => ((u.scores||{})["shooter"]||0) >= 30 },

        { id:"shooter-100", icon:"🎯", name:"Снайпер", desc:"Набери 100+ очков в Shooter", reward:250,
            check:u => ((u.scores||{})["shooter"]||0) >= 100 },

        { id:"glitch-30", icon:"🌀", name:"Исследователь глитчей", desc:"Набери 30+ очков в Glitch Arena", reward:75,
            check:u => ((u.scores||{})["glitch-arena"]||0) >= 30 },

        { id:"glitch-100", icon:"💫", name:"Повелитель глитчей", desc:"Набери 100+ очков в Glitch Arena", reward:250,
            check:u => ((u.scores||{})["glitch-arena"]||0) >= 100 },

        { id:"disaster-10", icon:"🌪️", name:"Выживший", desc:"Пережить 10+ раундов в Natural Disaster", reward:100,
            check:u => ((u.scores||{})["natural-disaster"]||0) >= 10 },

        { id:"disaster-25", icon:"🌊", name:"Легенда выживания", desc:"Пережить 25+ раундов в Natural Disaster", reward:300,
            check:u => ((u.scores||{})["natural-disaster"]||0) >= 25 },

        { id:"dogeball-win", icon:"🏐", name:"Победитель", desc:"Выиграй матч в Dodgeball Chaos", reward:100,
            check:u => ((u.wins||{})["dogeball"]||0) >= 1 },

        { id:"dogeball-5wins", icon:"🏆", name:"Чемпион додболла", desc:"Выиграй 5 матчей в Dodgeball Chaos", reward:350,
            check:u => ((u.wins||{})["dogeball"]||0) >= 5 },

        { id:"first-purchase", icon:"🛍️", name:"Первая покупка", desc:"Купи любой товар в магазине", reward:50,
            check:u => (u.owned||[]).length >= 1 },

        { id:"collector", icon:"🎨", name:"Коллекционер", desc:"Владей 5 предметами из магазина", reward:250,
            check:u => (u.owned||[]).length >= 5 },

        { id:"vip-status", icon:"👑", name:"VIP статус", desc:"Получи VIP", reward:100,
            check:u => !!u.vip },

        { id:"super-vip", icon:"💎", name:"Супер VIP", desc:"Получи SUPER VIP", reward:200,
            check:u => !!u.superVip },

        { id:"rich", icon:"💰", name:"Богач", desc:"Скопи 10000+ GH на балансе", reward:300,
            check:u => (u.balance||0) >= 10000 },

        { id:"stylish", icon:"🌈", name:"Стиль", desc:"Приобрети любой визуальный эффект", reward:100,
            check:u => (u.effects||[]).length >= 1 },

        { id:"referral-1", icon:"🤝", name:"Пригласи друга", desc:"Пригласи 1 друга по реферальному коду", reward:100,
            check:u => (u.referrals||[]).length >= 1 },

        { id:"referral-5", icon:"🌐", name:"Строитель сообщества", desc:"Пригласи 5 друзей по реферальному коду", reward:400,
            check:u => (u.referrals||[]).length >= 5 },

        { id:"streak-3", icon:"🔥", name:"Постоянство", desc:"Заходи 3 дня подряд", reward:100,
            check:u => (u.loginStreak||0) >= 3 },

        { id:"streak-7", icon:"📅", name:"Неделя с нами", desc:"Заходи 7 дней подряд", reward:350,
            check:u => (u.loginStreak||0) >= 7 },

        { id:"snake-10", icon:"🐍", name:"Юный питон", desc:"Набери 10+ очков в Snake", reward:75,
            check:u => ((u.scores||{})["snake"]||0) >= 10 },

        { id:"snake-30", icon:"🐲", name:"Гигантский змей", desc:"Набери 30+ очков в Snake", reward:250,
            check:u => ((u.scores||{})["snake"]||0) >= 30 },

        { id:"memory-700", icon:"🧠", name:"Хорошая память", desc:"Набери 700+ очков в Memory Match", reward:100,
            check:u => ((u.scores||{})["memory-match"]||0) >= 700 },

        { id:"memory-900", icon:"💡", name:"Фотографическая память", desc:"Набери 900+ очков в Memory Match", reward:300,
            check:u => ((u.scores||{})["memory-match"]||0) >= 900 },

        { id:"gift-1", icon:"🎁", name:"Щедрая душа", desc:"Подари GH другому игроку", reward:75,
            check:u => (u.giftsSent||0) >= 1 },

        { id:"gift-5", icon:"💝", name:"Меценат", desc:"Подари GH 5 раз", reward:300,
            check:u => (u.giftsSent||0) >= 5 }

    ];


    function loadDB(){

        try{

            const parsed =
                JSON.parse(
                    localStorage.getItem(DB_KEY)
                );

            if(parsed && Array.isArray(parsed.users))
                return parsed;

        }catch(e){}

        return { users:[], codes:[], shop:[] };

    }

    function saveDB(db){

        localStorage.setItem(
            DB_KEY,
            JSON.stringify(db)
        );

    }

    function ensureUserFields(u){

        if(!u.scores || typeof u.scores !== "object")
            u.scores = {};

        if(!u.wins || typeof u.wins !== "object")
            u.wins = {};

        if(!u.playsByGame || typeof u.playsByGame !== "object")
            u.playsByGame = {};

        if(typeof u.gamesPlayed !== "number")
            u.gamesPlayed = 0;

        if(typeof u.giftsSent !== "number")
            u.giftsSent = 0;

        if(!Array.isArray(u.achievements))
            u.achievements = [];

        if(!Array.isArray(u.owned))
            u.owned = [];

        if(!Array.isArray(u.effects))
            u.effects = [];

        if(typeof u.balance !== "number")
            u.balance = 0;

    }

    function getSessionUser(db){

        const name =
            localStorage.getItem(SESSION_KEY);

        if(!name)
            return null;

        const u =
            db.users.find(
                x => x.name === name
            );

        if(!u)
            return null;

        ensureUserFields(u);

        return u;

    }

    function checkAchievements(u){

        ensureUserFields(u);

        const unlocked = [];

        ACHIEVEMENTS.forEach(a => {

            if(u.achievements.includes(a.id))
                return;

            let earned = false;

            try{
                earned = !!a.check(u);
            }catch(e){
                earned = false;
            }

            if(earned){

                u.achievements.push(a.id);
                u.balance = (u.balance||0) + a.reward;
                unlocked.push(a);

            }

        });

        return unlocked;

    }


    /* TOAST (for use inside the standalone game pages) */

    let toastBox = null;

    function ensureToastBox(){

        if(toastBox)
            return toastBox;

        toastBox = document.createElement("div");

        toastBox.id = "ghToastBox";

        toastBox.style.cssText =
            "position:fixed;top:16px;right:16px;z-index:99999;" +
            "display:flex;flex-direction:column;gap:8px;" +
            "font-family:system-ui,sans-serif;pointer-events:none;";

        document.body.appendChild(toastBox);

        return toastBox;

    }

    function showToast(title, text, color){

        try{

            const box = ensureToastBox();

            const el = document.createElement("div");

            el.style.cssText =
                "background:#0d0d14ee;border:1px solid " +
                (color || "#42eaff") +
                ";color:#fff;padding:10px 14px;border-radius:10px;" +
                "min-width:220px;max-width:300px;box-shadow:0 8px 24px #000a;" +
                "font-size:13px;line-height:1.4;opacity:0;" +
                "transform:translateX(20px);transition:all .25s ease;";

            el.innerHTML =
                "<b style='color:" +
                (color || "#42eaff") +
                "'>" + title + "</b><br>" + text;

            box.appendChild(el);

            requestAnimationFrame(() => {
                el.style.opacity = "1";
                el.style.transform = "translateX(0)";
            });

            setTimeout(() => {

                el.style.opacity = "0";
                el.style.transform = "translateX(20px)";

                setTimeout(() => el.remove(), 300);

            }, 3200);

        }catch(e){}

    }

    function announceUnlocks(unlocked){

        unlocked.forEach(a => {

            showToast(
                "🎖️ Достижение получено!",
                a.icon + " " + a.name + " (+" + a.reward + " GH)",
                "#ffd43b"
            );

        });

    }


    function getSiteStats(db){

        const users = db.users || [];

        let totalBalance = 0;
        let totalGamesPlayed = 0;
        const playsByGame = {};

        users.forEach(u => {

            totalBalance += (u.balance || 0);
            totalGamesPlayed += (u.gamesPlayed || 0);

            const pbg = u.playsByGame || {};

            Object.keys(pbg).forEach(g => {
                playsByGame[g] = (playsByGame[g]||0) + pbg[g];
            });

        });

        let topGame = null;
        let topGamePlays = 0;

        Object.keys(playsByGame).forEach(g => {

            if(playsByGame[g] > topGamePlays){
                topGame = g;
                topGamePlays = playsByGame[g];
            }

        });

        return {
            totalPlayers: users.length,
            totalBalance: totalBalance,
            totalGamesPlayed: totalGamesPlayed,
            playsByGame: playsByGame,
            topGame: topGame,
            topGamePlays: topGamePlays
        };

    }


    /* PUBLIC API */

    window.GameHub = {

        ACHIEVEMENTS: ACHIEVEMENTS,
        GAME_NAMES: GAME_NAMES,

        loadDB: loadDB,
        saveDB: saveDB,
        getSiteStats: getSiteStats,
        getSessionUser: getSessionUser,
        checkAchievements: checkAchievements,
        showToast: showToast,

        currentUser(){

            const db = loadDB();
            return getSessionUser(db);

        },

        /* Call from a game when a run ends with a numeric score. */
        reportScore(gameId, score){

            score = Math.max(0, Math.floor(Number(score) || 0));

            const db = loadDB();
            const u = getSessionUser(db);

            if(!u)
                return null;

            u.gamesPlayed++;
            u.playsByGame[gameId] = (u.playsByGame[gameId]||0) + 1;

            const prevBest = u.scores[gameId] || 0;
            const isNewBest = score > prevBest;

            if(isNewBest)
                u.scores[gameId] = score;

            u.balance = (u.balance||0) + 5;

            const unlocked = checkAchievements(u);

            saveDB(db);

            const gameName = GAME_NAMES[gameId] || gameId;

            if(isNewBest && score > 0){

                showToast(
                    "🏆 Новый рекорд!",
                    gameName + ": " + score + " (+5 GH)",
                    "#47e0a7"
                );

            }else{

                showToast(
                    "✅ Игра засчитана",
                    gameName + " (+5 GH)",
                    "#42eaff"
                );

            }

            announceUnlocks(unlocked);

            return {
                isNewBest: isNewBest,
                best: u.scores[gameId],
                unlocked: unlocked
            };

        },

        /* Call from a game when a match ends with a win/loss (e.g. Dodgeball). */
        reportWin(gameId, won){

            const db = loadDB();
            const u = getSessionUser(db);

            if(!u)
                return null;

            u.gamesPlayed++;
            u.playsByGame[gameId] = (u.playsByGame[gameId]||0) + 1;

            if(won){

                u.wins[gameId] = (u.wins[gameId]||0) + 1;
                u.balance = (u.balance||0) + 15;

            }else{

                u.balance = (u.balance||0) + 5;

            }

            const unlocked = checkAchievements(u);

            saveDB(db);

            const gameName = GAME_NAMES[gameId] || gameId;

            showToast(
                won ? "🏆 Победа!" : "Матч окончен",
                gameName + (won ? " (+15 GH)" : " (+5 GH)"),
                won ? "#ffd43b" : "#42eaff"
            );

            announceUnlocks(unlocked);

            return {
                wins: u.wins[gameId] || 0,
                unlocked: unlocked
            };

        }

    };

})();
