modulmodule.exports = {
  config: {
    name: "tid",
    version: "1.0",
    author: "Octavio Wina",
    role: 0, // accessible à tous
    shortDescription: "Révèle l’ID sombre du thread",
    longDescription: "Invoque les ténèbres pour dévoiler l’ID caché du thread où tu te trouves.",
    category: "system"
  },

  onStart: async function ({ message, event }) {
    const BOT_NAME = "☠️ [ AI BOT SOMBRE ] ☠️";

    const threadID = event.threadID;

    const response = `
═══════════════════════
☠️ ${BOT_NAME} ☠️
═══════════════════════

💀 Les abysses ont parlé...
🕷️ Thread ID de cette conversation : ${threadID}

⚡ Méfie-toi... chaque thread est un portail vers le néant.
`;

    return message.reply(response);
  }
};
