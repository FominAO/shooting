function roll(a = 0, b = 100) {
    return Math.round(a + Math.random()*(b-a));
}

function chanceProc(chance = 0.5) {
    return Math.random() <= chance;
}

function log(str) {
    const newLine = document.createElement('div');

    newLine.innerHTML = str;
    document.body.getElementsByClassName('game')[0].appendChild(newLine);
}

const targetsConfig = {
    head: {
        hp: 90,
        accuracy: 0.2,
        name: 'Голова'
    },
    body: {
        hp: 10,
        accuracy: 0.7,
        name: 'Тело'
    },
    limbs: {
        hp: 5,
        accuracy: 0.1,
        name: 'Руки/Ноги'
    },
}

class Body {
    targets = [];
    hp = 1;
    powerLimit = 1;
    name = 'NONE';
    constructor(parts, hp, power, name, conf = targetsConfig) {
        this.targets = parts.map((part, index) => ({...conf[part], id: index}));
        this.hp = hp;
        this.powerLimit = power;
        this.name = name;
    }

    shoot(id, power) {
       const target = this.targets.find(i => i.id === id);

       if (chanceProc(target.accuracy)) {
           this.hp -= target.hp*power;
            log(this.hp, target.name, power)
           
           return 'Попадание'
       }
       return 'Промах'
    }

    atack() {
        return roll(0,this.powerLimit) / this.powerLimit;
    }
}



function game() {
    const player = getSettingsFromInputs(0);
    const monster = getSettingsFromInputs(1);
    let turn = 'player';
    let turnsCount = 0;

    document.body.getElementsByClassName('game')[0].innerHTML = '';
    while (monster.hp > 0 && player.hp > 0) {
        const actor = turn === 'player' ? player : monster;
        const target = turn === 'player' ? monster : player;
        const targetPartsForChoose = target.targets;
        const targetPart = targetPartsForChoose[roll(0,targetPartsForChoose.length-1)];
        const power = actor.atack();

        log(`${actor.name} стреляет в ${target.name} (${targetPart.name}). Сила ${power}`);
        log(target.shoot(targetPart.id, power));
        switchTurn();
    }
    const winner = monster.hp > 0 ? monster : player;

    log(`Победил ${winner.name} (${winner.hp})! Кол-во ходов: ${turnsCount}`);

    function switchTurn() {
        turnsCount++;
        turn = turn === 'player' ? 'monster' : 'player';
    }
}

function setInputsDefault() {
    const player = getInputs(0);
    const monster = getInputs(1);

    player.hp.value = 10;
    player.dmg.value = 100;
    player.heads.value = 1;
    player.limbs.value = 4;
    player.name.value = 'Игрок';

    monster.hp.value = 25;
    monster.dmg.value = 30;
    monster.heads.value = 2;
    monster.limbs.value = 7;
    monster.name.value = 'Двухголовый';
}

function getSettingsFromInputs(i = 0) {
    const body = getInputs(i);

    const parts = [...new Array(+body.heads.value).fill('head'), 'body', ...new Array(+body.limbs.value).fill('limbs')];

    return new Body(parts, +body.hp.value, +body.dmg.value, body.name.value);
}

function getInputs(i = 0) {
    const body = document.getElementsByClassName('body')[i];
    return {
        hp: body.getElementsByClassName('hp')[0],
        dmg: body.getElementsByClassName('dmg')[0],
        heads: body.getElementsByClassName('heads')[0],
        limbs: body.getElementsByClassName('limbs')[0],
        name: body.getElementsByClassName('name')[0]
    }
}

setInputsDefault();
