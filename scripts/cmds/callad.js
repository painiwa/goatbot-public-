constmodule.exports = {
  config: {
    name: "callad",
    version: "1.1",
    author: "Octavio Wina",
    role: 1, // accessible seulement aux membres autorisés
    shortDescription: "Contacter l'administrateur",
    longDescription: "Permet d'envoyer un message sombre et démoniaque à l'administrateur",
    category: "admin", 
  },
  onStart: async function ({ message, event }) {
    const userName = event.senderName || "Ame perdue";
    const text = `
☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️
[ AI BOT SOMBRE ]
☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️

💀 ${userName} a invoqué les ténèbres pour contacter l’Administrateur.
⚡ Les ombres s’agitent, préparez-vous...

🕷️ Votre appel a été envoyé dans le néant.
☠️ L’Admin recevra votre message dans les abysses du réseau.

☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️☠️
`;
    return message.reply(text);
  }
}; { 
