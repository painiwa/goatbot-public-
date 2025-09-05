module.exports = {
  config: {
    name: "cheflist",
    version: "1.0",
    author: "Messie Osango",
    role: 0,
    shortDescription: "Liste des groupes admin",
    longDescription: "Affiche les noms et ID des groupes où le bot est administrateur.",
    category: "admin",
    guide: "{prefix}cheflist"
  },

  onStart: async function ({ api, event }) {
    const botAdmins = global.GoatBot.config.adminBot;
    if (!botAdmins.includes(event.senderID)) {
      return api.sendMessage("❌ Accès réservé aux administrateurs du GoatBot", event.threadID, event.messageID);
    }

    const botID = api.getCurrentUserID();
    try {
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      const groupList = [];
      for (const thread of threads) {
        if (thread.isGroup) {
          try {
            const info = await api.getThreadInfo(thread.threadID);
            const adminIDs = info.adminIDs.map(a => a.id);
            if (adminIDs.includes(botID)) {
              const innerBox =
                `┃ ◦ Nom : ${info.threadName}\n` +
                `┃ ◦ ID  : ${thread.threadID}\n` +
                `┃━━━━━━━━━━━━━━━━╯`;
              groupList.push(innerBox);
            }
          } catch {}
        }
      }
      if (groupList.length === 0) {
        return api.sendMessage("╭━[ OCTOVIOBOT DEV ]━━╮\n┃\n┃ ◦ Aucun groupe trouvé\n┃\n╰━━━━━━━━━━━━━━━━╯", event.threadID, event.messageID);
      }
      const message =
        `╭━[ OCTAVIOBOT DEV ]━━╮\n` +
        `┃\n` +
        groupList.join("\n┃\n") +
        `\n╰━━━━━━━━━━━━━━━━╯`;
      return api.sendMessage(message, event.threadID, event.messageID);
    } catch {
      return api.sendMessage("╭━[ OCTAVIOBOT DEV]━━╮\n┃\n┃ ◦ Erreur de récupération\n┃\n╰━━━━━━━━━━━━━━━━╯", event.threadID, event.messageID);
    }
  }
};
