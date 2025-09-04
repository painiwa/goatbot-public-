const { getStreamsFromAttachment } = global.utils;

const ADMIN_GROUP_ID = "30760229970228810";
const sentMessages = new Map();

function wrapText(text, maxLength = 42) {
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  for (let word of words) {
    if ((currentLine + word).length > maxLength) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }

  if (currentLine.trim()) lines.push(currentLine.trim());

  return lines.map(line => `┃ ${line}`).join("\n");
}

module.exports = {
  config: {
    name: "notification",
    aliases: ["notify", "noti"],
    version: "2.1",
    author: "Dan Jersey",
    countDown: 5,
    role: 2,
    description: {
      vi: "Gửi thông báo từ admin đến all box",
      en: "Send notification from admin to all box"
    },
    category: "owner",
    guide: {
      en: "{pn} <message>"
    },
    envConfig: {
      delayPerGroup: 250
    }
  },

  langs: {
    en: {
      missingMessage: "❌ Please enter the message you want to send to all groups",
      notification: "🕳 Vous avez une notification de mon Admin. Utilisez la commande callad pour le contacter.",
      sendingNotification: "⏳ Envoi de la notification à %1 groupes...",
      sentNotification: "✅ Notification envoyée à %1 groupes.",
      errorSendingNotification: "❌ Erreur d'envoi pour %1 groupes:\n%2",
      replyAlert: "✉️ Quelqu’un a répondu à la notification :\n👤 %1\n🗨️ %2\n📍 Groupe ID : %3"
    }
  },

  onStart: async function ({ message, api, event, args, commandName, envCommands, threadsData, getLang }) {
    const { delayPerGroup } = envCommands[commandName];
    if (!args[0]) return message.reply(getLang("missingMessage"));

    const userMessage = args.join(" ");
    const notiText = getLang("notification");

    const fullMessage = [
      "╭━━━━━━━━━━━━━━━━━╮",
      "┃ ⚠ KAKASHI - NOTIFICATION",
      "┃━━━━━━━━━━━━━━━━━━",
      ...wrapText(notiText).split("\n"),
      "┃──────────────────",
      ...wrapText(userMessage).split("\n"),
      "╰━━━━━━━━━━━━━━━━━━╯"
    ].join("\n");

    const formSend = {
      body: fullMessage,
      attachment: await getStreamsFromAttachment([
        ...event.attachments,
        ...(event.messageReply?.attachments || [])
      ].filter(item =>
        ["photo", "png", "animated_image", "video", "audio"].includes(item.type)
      ))
    };

    const allThreadID = (await threadsData.getAll()).filter(t =>
      t.isGroup && t.members.find(m => m.userID == api.getCurrentUserID())?.inGroup
    );

    message.reply(getLang("sendingNotification", allThreadID.length));

    let sendSuccess = 0;
    const sendError = [];

    for (const thread of allThreadID) {
      try {
        const tid = thread.threadID;
        await api.sendMessage(formSend, tid, (err, info) => {
          if (!err && info?.messageID) {
            sentMessages.set(info.messageID, { groupID: tid, fromAdmin: true });
          }
        });
        sendSuccess++;
        await new Promise(res => setTimeout(res, delayPerGroup));
      } catch (e) {
        sendError.push({ threadIDs: [thread.threadID], errorDescription: e.message });
      }
    }

    let msg = "";
    if (sendSuccess > 0) msg += getLang("sentNotification", sendSuccess) + "\n";
    if (sendError.length > 0) {
      msg += getLang(
        "errorSendingNotification",
        sendError.reduce((a, b) => a + b.threadIDs.length, 0),
        sendError.map(b => `\n - ${b.errorDescription}\n   + ${b.threadIDs.join("\n   + ")}`).join("")
      );
    }

    message.reply(msg);
  },

  onReply: async function ({ api, event, usersData }) {
    const repliedMessageID = event.messageReply?.messageID;
    if (!repliedMessageID) return;

    const messageInfo = sentMessages.get(repliedMessageID);
    if (!messageInfo) return;

    const name = await usersData.getName(event.senderID);
    const msg = event.body || "[Pièce jointe]";

    const alert = [
      "╭━━━━━━━━━━━━━━━━━━╮",
      "┃ ✉️ RÉPONSE À UNE NOTIFICATION",
      "┃━━━━━━━━━━━━━━━━━━",
      ...wrapText(`👤 ${name}`).split("\n"),
      ...wrapText(`🗨️ ${msg}`).split("\n"),
      ...wrapText(`📍 Groupe ID : ${event.threadID}`).split("\n"),
      "╰━━━━━━━━━━━━━━━━━━╯"
    ].join("\n");

    api.sendMessage(alert, ADMIN_GROUP_ID, (err, info) => {
      if (!err && info?.messageID) {
        sentMessages.set(info.messageID, {
          originalSender: event.senderID,
          threadID: event.threadID
        });
      }
    });
  },

  onChat: async function ({ api, event }) {
    const repliedID = event.messageReply?.messageID;
    if (!repliedID) return;

    const track = sentMessages.get(repliedID);
    if (!track?.originalSender) return;

    api.sendMessage(event.body, track.threadID, (err, info) => {
      if (!err && info?.messageID) {
        sentMessages.set(info.messageID, {
          originalSender: event.senderID,
          threadID: event.threadID
        });
      }
    });
  }
};
