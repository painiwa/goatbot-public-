module.exports = {
  config: {
    name: "groupelist",
    version: "1.0",
    author: "Messie Osango",
    role: 0,
    shortDescription: "Voir les groupes du bot",
    longDescription: "Affiche la liste des groupes où le bot est membre",
    category: "system",
    guide: "{prefix}groupelist"
  },
  onStart: async function ({ api, event, args }) {
    if (event.senderID !== "61579262818537") {
      return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃🚫 Accès refusé !\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
    }

    if (args[0] === "join" && args[1]) {
      try {
        await api.addUserToGroup(event.senderID, args[1]);
        return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃✅ Ajout réussi !\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
      } catch (error) {
        return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃❌ Erreur d'ajout\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
      }
    }

    if (args[0] === "out" && args[1]) {
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), args[1]);
        return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃✅ Sortie réussie !\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
      } catch (error) {
        return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃❌ Erreur de sortie\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
      }
    }

    try {
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = threadList.filter(thread => thread.isGroup);

      if (groupThreads.length === 0) {
        return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃📌 Aucun groupe\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
      }

      let message = "╭━━━━━━━━━━━━━━━━╮\n┃ GROUPELIST\n├━━━━━━━━━━━━━━━━\n";
      message += `┃Total: ${groupThreads.length}\n├━━━━━━━━━━━━━━━━\n`;

      groupThreads.forEach((group, index) => {
        message += `┃${index + 1}. ${group.name || "Sans nom"}\n┃ID: ${group.threadID}\n├━━━━━━━━━━━━━━━━\n`;
      });

      message += "┃🔹 groupelist join [UID]\n┃🔹 groupelist out [UID]\n╰━━━━━━━━━━━━━━━━╯";
      
      api.sendMessage(message, event.threadID);
    } catch (error) {
      api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃❌ Erreur système\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
    }
  }
};
