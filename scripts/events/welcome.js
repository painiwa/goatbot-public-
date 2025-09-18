constmodule.exports = {
  config: {
    name: "welcome",
    version: "1.0",
    author: "Octavio Wina",
    role: 0, // accessible à tous
    shortDescription: "Souhaite la bienvenue avec style démoniaque",
    longDescription: "Message DARK pour accueillir les nouvelles âmes ou annoncer l’arrivée du bot.",
    category: "system"
  },

  onStart: async function ({ message, event }) {
    const BOT_NAME = "☠️ [ AI BOT SOMBRE ] ☠️";
    let response = `
═══════════════════════════════
☠️ ${BOT_NAME} ☠️
═══════════════════════════════
`;

    // Si le bot est ajouté au groupe
    if (event.addedParticipants && event.addedParticipants.includes(event.botID)) {
      response += `
💀 Je suis arrivé. Le Néant s’invite dans ce groupe...
🕷️ Observez et tremblez, mortels, car les ombres de ${BOT_NAME} rôdent désormais parmi vous.
⚡ Les secrets interdits et la puissance abyssale sont désormais à portée de main.
`;
    }

    // Si un ou plusieurs membres rejoignent le groupe
    if (event.joined && event.joined.length > 0) {
      event.joined.forEach(user => {
        const name = user.name || "Nouvelle âme perdue";
        response += `
💀 Les ténèbres t'accueillent, ${name}...
🕷️ Tu es désormais observé par le Néant et enveloppé de mystères sombres.
⚡ Marche prudemment, car chaque pas dans ce groupe laisse une empreinte éternelle.
`;
      });
    }

    // Si personne n’est ajouté, ne rien envoyer
    if ((!(event.addedParticipants && event.addedParticipants.includes(event.botID))) && (!event.joined || event.joined.length === 0)) return;

    return message.reply(response);
  }
}; 
