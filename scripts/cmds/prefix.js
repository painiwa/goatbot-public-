constconst { prefix } = require("./prefix"); // importe le préfixe défini

module.exports = {
  config: {
    name: "prefixinfo",
    version: "1.1",
    author: "Octavio Wina",
    role: 0,
    shortDescription: "Affiche le préfixe du bot",
    longDescription: "Explique quel préfixe le bot utilise et comment accéder aux commandes",
    category: "system",
  },
  onStart: async function ({ message, event }) {
    const userName = event.senderName || "Ami des abysses";
    const text = `
⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓
[ AI BOT SOMBRE ]
⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓

👋 Salut ${userName} !

💀 Je suis ton bot sombre et abyssal.
⚡ Mon préfixe actuel est : '${prefix}'

👁️ Pour voir toutes mes commandes, tape '${prefix}help'.

⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓⛓
`;
    return message.reply(text);
  }
}; 
