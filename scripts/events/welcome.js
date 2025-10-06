module.exports = {
  config: {
    name: "welcome",
    version: "2.2",
    author: "Octavio Wina",
    role: 0,
    shortDescription: "Message de bienvenue DARK pour nouveaux membres ou ajout du bot",
    longDescription: "Message immersif et démoniaque pour accueillir les nouveaux membres ou quand le bot est ajouté dans un groupe Messenger.",
    category: "fun",
  },

  onStart: async function({ api, event }) {
    const BOT_NAME = "☠️ AI BOT SOMBRE ☠️";
    const LINE_TOP = "╔══════════════════════════════════════╗";
    const LINE_BOTTOM = "╚══════════════════════════════════════╝";
    const LINE_DIV = "╟──────────────────────────────────────╢";

    const currentUserID = api.getCurrentUserID();

    // Cas : le bot est ajouté au groupe
    if (event.logMessageType === "log:subscribe" &&
        event.logMessageData.addedParticipants.some(p => p.userFbId === currentUserID)) {
      const botMessage = `
${LINE_TOP}
║ ${BOT_NAME}
${LINE_DIV}
║ 💀 Le portail des ténèbres s'ouvre... Le BOT SOMBRE est invoqué !
║ ⚡ Chaque message que vous écrirez sera scruté par les abysses.
║ 🔥 Préparez-vous à un règne d'obscurité et de chaos dans ce groupe.
${LINE_BOTTOM}
`;
      return api.sendMessage(botMessage, event.threadID);
    }

    // Cas : ajout de nouveaux membres
    if (event.logMessageType === "log:subscribe" && event.logMessageData.addedParticipants.length > 0) {
      const addedUsers = event.logMessageData.addedParticipants.filter(u => u.userFbId !== currentUserID);

      for (const user of addedUsers) {
        const userName = user.fullName || "Âme perdue";

        const darkWelcomes = [
          `☠️ Les ombres s’étirent et frémissent à chaque pas de ${userName}... 💀🕷️`,
          `🔥 Oseras-tu marcher parmi les ténèbres, ${userName}? Le néant t’observe… 👁️⚡`,
          `🩸 Chaque souffle de ${userName} est désormais lié aux abysses… 🕸️☠️`,
          `💀 Les abysses frémissent à l’arrivée de ${userName}. Son destin est scellé dans le chaos… 🔥🕷️`,
          `🌑 Bienvenue, ${userName}, dans le cercle des ombres éternelles… 💀👁️🩸`
        ];

        const welcomeMessage = darkWelcomes[Math.floor(Math.random() * darkWelcomes.length)];

        const framedMessage = `
${LINE_TOP}
║ ${BOT_NAME}
${LINE_DIV}
║ 💀 Bienvenue, ${userName} 💀

${welcomeMessage}

⚡ Les murmures des ombres s’entrelacent à ton esprit,
🕷️ chaque mot résonne dans le néant,
🔥 les flammes abyssales dansent autour de ton âme,
👁️ le chaos observe,
🩸 et les ténèbres accueillent ton passage avec frissons et vertige...

☠️ Que ton voyage dans ce royaume sombre commence maintenant.
${LINE_BOTTOM}
`;

        await api.sendMessage(framedMessage, event.threadID);
      }
    }
  }
};
