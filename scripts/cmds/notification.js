constconst ADMIN_ID = "61579262818537"; /
const PREFIX = "!"; /

module.exports = {
  config: {
    name: "notification",
    version: "1.3",
    author: "Octavio Wina",
    role: 1, // rôle admin
    shortDescription: "Envoyer une notification sombre",
    longDescription: "Seul l’admin peut envoyer un message ou alerte sombre",
    category: "admin",
  },
  onStart: async function ({ message, args, event }) {
    const userId = event.senderID;
    const userName = event.senderName || "Ame perdue";

    // Vérification de l'admin
    if (userId !== ADMIN_ID) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, seule l'entité suprême (admin) peut utiliser cette commande abyssale...
`);
    }

    const notifContent = args.join(" "); // le message après !noti
    if (!notifContent) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, tu dois écrire le message après '${PREFIX}noti'.
⚡ Exemple : ${PREFIX}noti Attention aux ténèbres
`);
    }

    // Message DARK envoyé
    const response = `
☠️ [ AI BOT SOMBRE ] ☠️

💀 Notification abyssale envoyée par l'admin :
"${notifContent}"

⚡ Que les ombres se répandent et que l'avertissement soit entendu...
`;
    return message.reply(response);
  }
}; 
