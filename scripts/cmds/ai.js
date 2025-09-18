                                                                                                             const axios = require("axios"
const GEMINI_KEY = 'AIzaSyAAwwFTS2ykb4B1FBGrk6L4GlqWbbN6SoQ';

// Fonction qui envoie une requête à Gemini
async func
  tion askGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
  const body = { contents: [{ parts: [{ text: prompt }] }] };

  try {
    const response = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" }
    });
    const answer = response.data?.candidates?.[0]?.content?.[0]?.text || "Les ténèbres restent silencieuses...";
    return answer;
  } catch (error) {
    console.error("Erreur Gemini :", error.response?.data || error.message);
    return "⚠️ Une ombre a perturbé ma connexion aux abysses...";
  }
}

module.exports = {
  config: {
    name: "ai",
    version: "2.3",
    author: "Octavio Wina",
    role: 0,
    shortDescription: "Parler avec l'AI BOT SOMBRE",
    longDescription: "Discute avec l'AI BOT SOMBRE via Gemini ou répond aux questions personnalisées",
    category: "system",
  },

  onStart: async function ({ message, args, event }) {
    const userName = event.senderName || "Ame perdue";
    const question = args.join(" ").toLowerCase();

    // Affiche d'abord "Kakashi réfléchit..."
    await message.reply("🤔 Kakashi réfléchit...");

    // 🕷️ Réponse fixe : Qui t'a créé ?
    if (question.includes("qui t'a créé") || question.includes("qui t a créé") || question.includes("qui t’a créé")) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 Mon créateur est **Octavio Wina**...  
Il est celui qui m’a fait naître dans les ombres.
— AI BOT SOMBRE
`);
    }

    // 🕷️ Réponse fixe : Qui es-tu ?
    if (question.includes("qui es tu") || question.includes("qui es-tu") || question.includes("t qui") || question.includes("t ki")) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 Je suis **Kakashi AI**,  
un bot forgé par Octavio et marqué du nom sombre : **Kakashi**.
— AI BOT SOMBRE
`);
    }

    // 🕷️ Si aucune question n’est posée
    if (!question) {
      return message.reply(`
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, tu n’as posé aucune question...  
⚡ Ose parler, et les ténèbres te répondront.
— AI BOT SOMBRE
`);
    }

    // 🕷️ Sinon → envoyer la question à Gemini
    const aiResponse = await askGemini(question);

    const response = `
☠️ [ AI BOT SOMBRE ] ☠️

💀 ${userName}, tu as murmuré dans l'abysse :  
"${question}"

⚡ Réponse des ténèbres :  
${aiResponse}

— AI BOT SOMBRE
`;
    return message.reply(response);
  }
};
