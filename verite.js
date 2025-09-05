const request = require('request');
const fs = require('fs');
const axios = require('axios');

module.exports = {
  config: {
    name: 'resend',
    version: '1.0',
    author: 'david',
    countDown: 5,
    role: 0,
    shortDescription: 'Goat Bot Command',
    longDescription: 'This command allows Goat Bot to log and resend messages or attachments when a user deletes them in a Discord chat.',
    category: 'test',
  },

  onChat: async function ({ event, api, threadsData, usersData }) {
    const { writeFileSync, createReadStream } = require('fs');
    let { messageID, senderID, threadID, body: content } = event;
    if (!global.logMessage) global.logMessage = new Map();
    if (!global.data) global.data = {};
    if (!global.data.botID) global.data.botID = api.getCurrentUserID();

    const thread = await threadsData.get(parseInt(threadID)) || {};

    if (typeof thread['resend'] !== 'undefined' && thread['resend'] === false) return;

    if (senderID === global.data.botID) return;

    if (event.type !== 'message_unsend') {
      global.logMessage.set(messageID, {
        msgBody: content,
        attachment: event.attachments,
        type: event.type,
      });
    }
    if (event.type === 'message_unsend') {
      var getMsg = global.logMessage.get(messageID);
      if (!getMsg) return;
      const data = await usersData.get(senderID);
      const name = await usersData.getName(senderID);
      if (getMsg.attachment[0] === undefined) {
        if (getMsg.type === 'message') {
          api.sendMessage(`🎯${name}🎯\nIl 𝑰𝒍 𝑎 𝑒𝒔𝒔𝑎𝒚é 𝑑𝑒 𝒏𝒐𝒖𝒔 𝑐𝑎𝑐𝒉𝑒🔕🛡 𝒖𝒏 𝒑𝒖𝒕𝑎𝒊𝒏 𝒕𝒓𝒖𝑐⭕ , 𝒎𝑒𝑐 𝒐𝒏 𝒏'𝑒𝒔𝒕 𝑐𝑎𝑐𝒉𝑒 𝒓𝒊𝑒𝒏 𝒊𝑐𝒊 📜🪤, 𝒔𝑎𝑐𝒉𝑒𝒛 𝒒𝒖𝑒 𝒍𝑒 𝑏𝒐𝒕 𝒏'𝒐𝒏𝒕 𝒑𝑎𝒔 𝑑𝑒 𝒔𝑒𝑐𝒓𝑒𝒕🔑🙎📿\n━━━━━━━━━━━━━━━━\n${getMsg.msgBody}`, threadID);
        } else if (getMsg.type === 'photo' || getMsg.type === 'video') {
          // Resend the image or video here
          api.sendMessage({ attachment: getMsg.attachment }, threadID);
        }
      } else {
        let num = 0;
        let msg = {
          body: `(๑•̀ㅁ•́๑)✧${name} n/𝚄𝚗𝚜𝚎𝚗𝚍]|I{---»${getMsg.attachment.length} attachment(s).${getMsg.msgBody !== '' ? `\ontent: ${getMsg.msgBody}` : ''}`,
          attachment: [],
          mentions: { tag: name, id: senderID },
        };
        for (var i of getMsg.attachment) {
          num += 1;
          var getURL = await request.get(i.url);
          var pathname = getURL.uri.pathname;
          var ext = pathname.substring(pathname.lastIndexOf('.') + 1);
          var path = `./cache/${num}.${ext}`;
          var dataStream = (await axios.get(i.url, { responseType: 'stream' })).data;
          dataStream.pipe(fs.createWriteStream(path));
          msg.attachment.push(createReadStream(path));
        }
        api.sendMessage(msg, threadID);
      }
    }
  },

  onStart: async function ({ api, event, threadsData, args }) {
    const { threadID, messageID } = event;

    if (args.length > 0 && (args[0] === 'on' || args[0] === 'off')) {
      const resendEnabled = args[0] === 'on';
      await threadsData.set(threadID, resendEnabled, 'resend');
      return api.sendMessage(`Successfully turned ${resendEnabled ? 'on' : 'off'} resend!`, threadID, messageID);
    }

    let data = {};
    try {
      data = JSON.parse(fs.readFileSync('./resend_data.json', 'utf-8'));
    } catch (error) {
      console.log(error);
    }
    const resendEnabled = data[threadID] ? data[threadID] : false;
    data[threadID] = !resendEnabled;

    fs.writeFileSync('./resend_data.json', JSON.stringify(data, null, 2));

    return api.sendMessage(`Successfully ${(data[threadID] === true) ? 'turned on' : 'turned off'} resend!`, threadID, messageID);
  },
};
