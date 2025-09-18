comodule.exports = {
  config: {
    name: "daily",
    aliases: ["bonus", "recompense", "jour"],
    version: "1.0",
    author: "Octavio Wina",
    countDown: 86400, // 24h en secondes pour limiter le daily
    role: 0, // accessible à tous
    shortDescription: "Reçoit ton bonus quotidien démoniaque",
    longDescription: "Permet de réclamer chaque jour un bonus de pièces ou d'énergie abyssale",
    category: "system",
    guide: "{pn} pour réclamer ton bonus quotidien"
  },

  onStart: async function ({ message }) {
    const BOT_NAME = "☠️ [ AI BOT SOMBRE ] ☠️";
    const LINE_TOP = "╔═══════════════════════════╗";
    const LINE_BOTTOM = "╚═══════════════════════════╝";
    const LINE_DIV = "╟───────────────────────────╢";

    // Génération aléatoire du bonus quotidien
    const min = 100;
    const max = 1000;
    const dailyBonus = Math.floor(Math.random() * (max - min + 1)) + min;

    // Liste de phrases DARK aléatoires
    const darkMessages = [
      "Les ténèbres t'offrent un cadeau...",
      "Le maître des ombres a versé ton bonus...",
      "Ton énergie abyssale s'accroît...",
      "Le néant t'accorde ses pièces sombres...",
      "Les flammes infernales brûlent pour te donner ce trésor...",
      "Ton destin démoniaque se renforce...",
      "Les âmes perdues chantent ton bonus...",
      "Le grimoire sombre a révélé ton gain..."
    ];

    const darkText = darkMessages[Math.floor(Math.random() * darkMessages.length)];

    return message.reply(`${LINE_TOP}
║ ${BOT_NAME}
${LINE_DIV}
║ 💀 ${darkText}
║ 🕷️ Bonus quotidien : ${dailyBonus} pièces démoniaques
${LINE_BOTTOM}`);
  }
};
