const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    aliases: ["🌚"],
    version: "1.3",
    author: "messie osango",
    countDown: 5,
    role: 0,
    shortDescription: "Changer le préfixe du bot",
    longDescription: "Change le symbole de commande du bot dans votre boîte de discussion ou dans tout le système du bot (admin uniquement)",
    category: "box chat",
    guide: {
      fr:
        "   {pn} <nouveau préfixe>: changer le préfixe dans votre boîte de discussion" +
        "\n   Exemple:" +
        "\n    {pn} #" +
        "\n\n   {pn} <nouveau préfixe> -g: changer le préfixe dans le système du bot (admin bot uniquement)" +
        "\n   Exemple:" +
        "\n    {pn} # -g" +
        "\n\n   {pn} reset: réinitialiser le préfixe dans votre boîte de discussion"
    }
  },

  langs: {
    fr: {
      reset: "✨ Votre préfixe a été réinitialisé par défaut: %1",
      onlyAdmin: "⚠️ Seuls les administrateurs peuvent changer le préfixe du système",
      confirmGlobal: "🔔 Veuillez réagir à ce message pour confirmer le changement de préfixe du système",
      confirmThisThread: "💬 Veuillez réagir à ce message pour confirmer le changement de préfixe dans votre discussion",
      successGlobal: "✅ Préfixe du système changé avec succès: %1",
      successThisThread: "✅ Préfixe changé avec succès dans votre discussion: %1"
    }
  },

  onStart: async function ({ message, role, args, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();
    const newPrefix = args[0];
    const isGlobal = args.includes("-g");

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    if (isGlobal) {
      if (role < 2) return message.reply(getLang("onlyAdmin"));
      return message.reply({
        body: getLang("confirmGlobal"),
        reaction: {
          author: event.userID,
          newPrefix,
          setGlobal: true
        }
      });
    } else {
      return message.reply({
        body: getLang("confirmThisThread"),
        reaction: {
          author: event.userID,
          newPrefix,
          setGlobal: false
        }
      });
    }
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message }) {
    if (event.body && (event.body.toLowerCase() === "prefix" || event.body.toLowerCase() === "🌚")) {
      const sysPrefix = global.GoatBot.config.prefix;
      const boxPrefix = await utils.getPrefix(event.threadID);
      return message.reply(
        "╭━[𝑶𝑪𝑻𝑨𝑩𝑶𝑻]━━╮\n" +
        `┃ 𝙿𝚛𝚎́𝚏𝚒𝚡𝚎 𝚜𝚢𝚜𝚝𝚎̀𝚖𝚎 : ${sysPrefix}\n` +
        "┃\n" +
        `┃ 𝙿𝚛𝚎́𝚏𝚒𝚡𝚎 𝚍𝚎 𝚕𝚊 𝚋𝚘𝚡 : ${boxPrefix}\n` +
        "┃\n" +
        `┃ 𝚄𝚝𝚒𝚕𝚒𝚜𝚎𝚣 ${boxPrefix}help 𝚙𝚘𝚞𝚛 𝚟𝚘𝚒𝚛 𝚝𝚘𝚞𝚝𝚎𝚜 𝚕𝚎𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚎𝚜\n` +
        "╰━━━━━━━━━━━━━━━━╯"
      );
    }
  }
};
