const ADMIN_ID = "61579262818537"; // remplace par l'ID de l'admin
const PREFIX = "!"; // préfixe du bot

// Tableau en mémoire pour stocker les IDs bannis
let bannedUsers = [];

module.exports = {
  config: {
    name: "ban",
    version: "1.1",
    author: "Octavio Wina",
    role: 1, // admin only
    shortDescription: "Bannit un utilisateur",
    longDescription: "Commande accessible uniquement à l'admin pour bannir un utilisateur avec style DARK",
    category: "admin",
  },
  onStart: async function ({ message, args, event }) {
    const userId = event.senderID;
    const userName = event.senderName || "Ame perdue";

    // Vérification de l'admin
    if (userId !== ADMIN_ID) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, seule l'entité suprême (admin) peut invoquer le bannissement abyssal...
`);
    }

    const targetId = args[0]; // ID de l'utilisateur à bannir
    if (!targetId) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, tu dois spécifier l'utilisateur à bannir après '${PREFIX}ban'.
⚡ Exemple : ${PREFIX}ban 1234567890
`);
    }

    // Vérifier si l'utilisateur est déjà banni
    if (bannedUsers.includes(targetId)) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 L'utilisateur "${targetId}" est déjà plongé dans les ténèbres...
`);
    }

    // Ajouter l'utilisateur au tableau des bannis
    bannedUsers.push(targetId);

    const response = `
☠️ [ AI BOT SOMBRE ] ☠️

💀 L'utilisateur "${targetId}" a été plongé dans les ténèbres et banni par l'admin.
⚡ Que son existence disparaisse dans le néant...
🕷️ Les ombres observent, les abysses s'élargissent.
`;
    return message.reply(response);
  },
  
  // Fonction pour vérifier si un utilisateur est banni
  isBanned: function(userId) {
    return bannedUsers.includes(userId);
  }
};
