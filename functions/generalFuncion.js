const { readFileSync, promises: fsPromises } = require('fs');


global.sendTestEmoji = function (message) {
    message.reply("🍞")
}

function sendTestEmoji2(message) {
    message.reply("🍞")
};

global.yellow_bred = "#F9A62B";

global.grey_bread = "#2D2D2D"

global.red_bred = "#F04848"

global.NotSoBluple = "#5866Ef"

global.OnlineGreen = "#3DA560"

global.IdleYellow = "#F9A62B"

global.DndRed = "#ec4145"

global.BraveryPurple = "#9b84ec"

global.BrillanceColar = "#f37b68"

global.BalanceTurqoise = "#49ddc1"

global.NitroGrey = "#5f5d7e"

global.BoostPink = "#f373f6"

global.StreammerPurple = "#583694"

global.HyperlinkBlue = "#09b9f2"

global.DarkGrey = "#2f3136"

global.NotQuiteBlack = "#23272a"


global.asyncReadFile = async function (filename) {
    try {
        const contents = await fsPromises.readFile(filename, 'utf-8');

        const arr = contents.split(/\r?\n/);

        console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']

        return arr;
    } catch (err) {
        console.log(err);
    }
}

// asyncReadFile("../config/badWords/badWords.txt")