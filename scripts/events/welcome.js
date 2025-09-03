const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "1.7",
        author: "Messie osango",
        category: "events"
    },

    langs: {
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
            multiple1: "bạn",
            multiple2: "các bạn",
            defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
        },
        en: {
            session1: "matin",
            session2: "midi",
            session3: "après-midi",
            session4: "soir",
            welcomeMessage: "╭━━━━━━━━━━━━━━━━━╮\n┃  BIENVENUE HUMAIN(E)  \n╰━━━━━━━━━━━━━━━━╯\n\nMerci de m'avoir invité dans le groupe!\nPréfixe du bot: %1\nPour voir la liste des commandes, entrez: %1help\n\n╰━━━━━━━━━━━━━━━━━╯",
            multiple1: "toi",
            multiple2: "vous",
            defaultWelcomeMessage: `╭━━━━━━━━━━━━━━━━╮
┃  BIENVENUE  HUMAINE
╰━━━━━━━━━━━━━━━━╯

Bonjour mortelle moi c'est kakashi {userName}
Bienvenue {multiple} dans le groupe: {boxName}
Passez un mauvais {session}

╰━━━━━━━━━━━━━━━━━╯`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe")
            return async function () {
                const hours = getTime("HH");
                const { threadID } = event;
                const { nickNameBot } = global.GoatBot.config;
                const prefix = global.utils.getPrefix(threadID);
                const dataAddedParticipants = event.logMessageData.addedParticipants;
                
                if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
                    if (nickNameBot)
                        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
                    return message.send(getLang("welcomeMessage", prefix));
                }

                if (!global.temp.welcomeEvent[threadID])
                    global.temp.welcomeEvent[threadID] = {
                        joinTimeout: null,
                        dataAddedParticipants: []
                    };

                global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
                clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

                global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                    const threadData = await threadsData.get(threadID);
                    if (threadData.settings.sendWelcomeMessage == false)
                        return;
                    const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                    const dataBanned = threadData.data.banned_ban || [];
                    const threadName = threadData.threadName;
                    const userName = [],
                        mentions = [];
                    let multiple = false;

                    if (dataAddedParticipants.length > 1)
                        multiple = true;

                    for (const user of dataAddedParticipants) {
                        if (dataBanned.some((item) => item.id == user.userFbId))
                            continue;
                        userName.push(user.fullName);
                        mentions.push({
                            tag: user.fullName,
                            id: user.userFbId
                        });
                    }

                    if (userName.length == 0) return;
                    let { welcomeMessage = getLang("defaultWelcomeMessage") } =
                        threadData.data;
                    const form = {
                        mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
                    };
                    welcomeMessage = welcomeMessage
                        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                        .replace(/\{boxName\}|\{threadName\}/g, threadName)
                        .replace(
                            /\{multiple\}/g,
                            multiple ? getLang("multiple2") : getLang("multiple1")
                        )
                        .replace(
                            /\{session\}/g,
                            hours <= 10
                                ? getLang("session1")
                                : hours <= 12
                                    ? getLang("session2")
                                    : hours <= 18
                                        ? getLang("session3")
                                        : getLang("session4")
                        );

                    form.body = welcomeMessage;

                    if (threadData.data.welcomeAttachment) {
                        const files = threadData.data.welcomeAttachment;
                        const attachments = files.reduce((acc, file) => {
                            acc.push(drive.getFile(file, "stream"));
                            return acc;
                        }, []);
                        form.attachment = (await Promise.allSettled(attachments))
                            .filter(({ status }) => status == "fulfilled")
                            .map(({ value }) => value);
                    }
                    message.send(form);
                    delete global.temp.welcomeEvent[threadID];
                }, 1500);
            };
    }
};
