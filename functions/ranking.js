global.calcoloXpNecessario  = function (level) {
    var xpNecessarioFinoA10 = [0, 70, 250, 370, 550, 840, 1200, 1950, 2500, 3000, 3900]

    if (level < 10) {
        return xpNecessarioFinoA10[level]
    }
    else {
        return level * level * 50
    }
}

setInterval(function () {
    con.query("SELECT * FROM userstats", (err, result) => {
        var userstatsList = result;

        userstatsList.forEach(userstats => {
            if (userstats.cooldownXp > 0) {
                userstats.cooldownXp -= 5

                con.query(`UPDATE userstats SET cooldownXp = ${userstats.cooldownXp} WHERE id = ${userstats.id}`)
            }
        })
    })
}, 5000)