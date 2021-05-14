const TelegramApi = require('node-telegram-bot-api');

const token = '1801870375:AAGzqxW_1Woq9Lx3J97ToG9GvbETKi88UEc';

const bot = new TelegramApi(token, { polling: true });

const {
    gameOptions,
    againOptions,
} = require('./options');

const chats = {};

bot.setMyCommands(
    [
        {
            command: '/start',
            description: 'Starting the bot.',
        },
        {
            command: '/info',
            description: "Your name if you're so dumb to forget it.",
        },
        {
            command: '/game',
            description: "Starting the game. If you are bored.",
        },
    ]
);

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Guess the number.');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'The game has begun.', gameOptions);
};

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/6c9/6d4/6c96d4ff-e4d1-3b87-a218-17ca4b5551a5/3.jpg');
            return bot.sendMessage(chatId, 'Bot has been started.');
        };
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name's - ${msg.from.last_name} ${msg.from.first_name}.`);
        };

        if (text === '/game') {
            return startGame(chatId);
        };

        // bot.sendMessage(chatId, `Message eas received - ${text}`);
        // console.log(msg);

        return bot.sendMessage(chatId, `Command - ${text} not found.`);
    });

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        };

        bot.sendMessage(chatId, `You're think it number - ${data}.`);

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Bingo! You're right.`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Sorry, you're loose.`, againOptions)
        };

        // console.log(msg);
    });
};

start();