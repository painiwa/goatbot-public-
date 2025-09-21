               const axios = require('axios');

const API_KEY = "AIzaSyBQeZVi4QdrnGKPEfXXx1tdIqlMM8iqvZw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

async function getAIResponse(input) {
    try {
        const response = await axios.post(API_URL, {
            contents: [{ parts: [{ text: input }] }]
        }, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
               || "⚠️ Les abysses refusent de répondre...";
    } catch (error) {
        console.error("Erreur API:", error);
        return "🌑 Le pacte avec les ombres a échoué...";
    }
}

function formatResponse(content) {
    return `\n
☠️─────────『 𝐀𝐈 𝐁𝐎𝐓 𝐒𝐎𝐌𝐁𝐑𝐄 』─────────☠️

█▓▒­░⡷⠂ 𝑳𝒆𝒔 𝒕𝒆́𝒏𝒆̀𝒃𝒓𝒆𝒔 𝒔'𝒂𝒏𝒊𝒎𝒆𝒏𝒕 ⠐⢾░▒▓█

「 ${content} 」

⚡ Mots maudits : 
› Abysse | Chaos | Néant | Damnation | Sang | Invocation | Démon | Crâne | Ombre

🌑 𝑳𝒂 𝒇𝒐𝒓𝒄𝒆 𝒅𝒖 𝒗𝒊𝒅𝒆 𝒂 𝒔𝒖𝒇𝒇𝒍𝒆́ 𝒄𝒆𝒕𝒕𝒆 𝒗𝒆́𝒓𝒊𝒕𝒆́...
`;
}

module.exports = { 
    config: { 
        name: 'ai',
        author: 'octavio wina',
        role: 0,
        category: 'ai',
        shortDescription: 'Invocation obscure IA BOT SOMBRE',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) {
            return api.sendMessage(
                formatResponse("🌒 Invoque-moi... Tes mots ouvriront le portail du néant."),
                event.threadID
            );
        }

        try {
            const aiResponse = await getAIResponse(input);
            api.sendMessage(
                formatResponse(aiResponse),
                event.threadID,
                event.messageID
            );
        } catch (error) {
            api.sendMessage(
                formatResponse("🔥 Le rituel a échoué, les démons se sont dissipés..."),
                event.threadID
            );
        }
    },
    onChat: async function ({ event, message }) {
        if (!event.body.toLowerCase().startsWith("ai")) return;
        
        const input = event.body.slice(2).trim();
        if (!input) {
            return message.reply(
                formatResponse("💀 Je suis 𝐀𝐈 𝐁𝐎𝐓 𝐒𝐎𝐌𝐁𝐑𝐄... forgé dans le CHAOS par Octavio Wina. Que cherches-tu dans les abîmes ?")
            );
        }

        try {
            const aiResponse = await getAIResponse(input);
            message.reply(formatResponse(aiResponse));
        } catch (error) {
            message.reply(formatResponse("⚔️ Une erreur obscure a corrompu ta demande..."));
        }
    }
};                            
  
