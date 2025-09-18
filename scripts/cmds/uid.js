constmodule.exports = {
  config: {
    name: "uid",
    version: "1.0",
    author: "Octavio Wina",
    role: 0, // accessible à tous
    shortDescription: "Révèle l’UID sombre",
    longDescription: "Invoque les ténèbres pour dévoiler l’UID caché d’une âme mentionnée ou du demandeur lui-même.",
    category: "system"
  },

  onStart: async function ({ message, event }) {
    const BOT_NAME = "☠️ [ AI BOT SOMBRE ] ☠️";

    let targetUID;
    let targetName;

    if (Object.keys(event.mentions).length > 0) {
      targetUID = Object.keys(event.mentions)[0];
      targetName = event.mentions[targetUID];
    } else {
      targetUID = event.senderID;
      targetName = "toi, voyageur des ombres";
    }

    const response = `
═══════════════════════
☠️ ${BOT_NAME} ☠️
═══════════════════════

💀 Les abysses ont parlé...
🕷️ UID de ${targetName} : ${targetUID}

⚡ N'oublie pas... chaque UID est une marque éternelle gravée dans les ténèbres.
`;

    return message.reply(response);
  }
};
