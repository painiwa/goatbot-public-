const { getStreamsF}
module.exports = {
  config: {
    name: "notification",
    aliases: ["noti"],
    version: "2.1",
    author: "Messie Osango",
    role: 2,
    shortDescription: "Notification globale",
    longDescription: "Envoi de message à tous les groupes",
    category: "system",
    guide: {
      en: "{pn} [message]",
      fr: "{pn} [message]"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    const botAdmins = global.GoatBot.config.adminBot;
    if (!botAdmins.includes(event.senderID)) {
      return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃🚫 Accès refusé !\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
    }

    if (args.length === 0) {
      return message.reply(`╭━━━━━━━━━━━━━━━━╮
┃  GUIDE D'UTILISATION 
├────────────────
┃ Usage: 
┃ • notification [message]
┃ • noti [message]
╰━━━━━━━━━━━━━━━━╯`);
    }

    const userMessage = args.join(" ");

    try {
      const threadList = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = threadList.filter(thread => thread.isGroup);

      if (groupThreads.length === 0) {
        return api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃ Aucun groupe trouvé\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
      }

      let successCount = 0;
      let failCount = 0;

      for (const group of groupThreads) {
        try {
          await api.sendMessage(`╭━━━━━━━━━━━━━━━━╮
┃  NOTIFICATION  
├────────────────
┃ ${userMessage}
╰━━━━━━━━━━━━━━━━╯`, group.threadID);
          successCount++;
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          failCount++;
        }
      }

      await api.sendMessage(`╭━━━━━━━━━━━━━━━━╮
┃  RAPPORT D'ENVOI  
├────────────────
┃ ✅ ${successCount} groupes atteints
┃ ❌ ${failCount} échecs d'envoi
├────────────────
┃ Message diffusé:
┃ "${userMessage}"
╰━━━━━━━━━━━━━━━━╯`, event.threadID);

    } catch (error) {
      console.error(error);
      api.sendMessage("╭━━━━━━━━━━━━━━━━╮\n┃❌ Erreur du système\n╰━━━━━━━━━━━━━━━━╯", event.threadID);
    }
  }
};
