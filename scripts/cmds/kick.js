const ADMIN_ID = "61579262818537"; // remplace par l'ID de l'admin
const PREFIX = "!"; // préfixe du bot

// Tableau en mémoire pour stocker les IDs expulsés temporairement
let kickedUsers = [];

module.exports = {
  config: {
    name: "kick",
    version: "1.0",
    author: "Octavio Wina",
    role: 1, // admin only
    shortDescription: "Expulse un utilisateur temporairement",
    longDescription: "Commande accessible uniquement à l'admin pour expulser un utilisateur avec style DARK",
    category: "admin",
  },
  onStart: async function ({ message, args, event }) {
    const userId = event.senderID;
    const userName = event.senderName || "Ame perdue";

    // Vérification de l'admin
    if (userId !== ADMIN_ID) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, seule l'entité suprême (admin) peut invoquer l'expulsion abyssale...
`);
    }

    const targetId = args[0]; // ID de l'utilisateur à expulser
    if (!targetId) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, tu dois spécifier l'utilisateur à expulser après '${PREFIX}kick'.
⚡ Exemple : ${PREFIX}kick 1234567890
`);
    }

    // Vérifier si l'utilisateur est déjà expulsé
    if (kickedUsers.includes(targetId)) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 L'utilisateur "${targetId}" a déjà été projeté dans les ténèbres temporaires...
`);
    }

    // Ajouter l'utilisateur au tableau des expulsés
    kickedUsers.push(targetId);

    // Supprimer l'utilisateur du tableau après 5 minutes (300 000 ms)
    setTimeout(() => {
      kickedUsers = kickedUsers.filter(id => id !== targetId);
    }, 300000);

    const response = `
☠️ [ AI BOT SOMBRE ] ☠️

💀 L'utilisateur "${targetId}" a été expulsé temporairement par l'admin.
⚡ Que les ombres l'engloutissent pendant 5 minutes...
🕷️ Le néant observe son absence avec satisfaction.
`;
    return message.reply(response);
  },

  // Fonction pour vérifier si un utilisateur est expulsé
  isKicked: function(userId) {
    return kickedUsers.includes(userId);
  }
};
