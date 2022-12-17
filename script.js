// Importing/Connecting with HTML elements
const xpText = document.querySelector("#xp");
const healthText = document.querySelector("#health");
const goldText = document.querySelector("#gold");
const monsterStats = document.querySelector("#monster-stats");
const monsterNameText = document.querySelector("#monster-name");
const monsterHealthText = document.querySelector("#monster-health");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const textArea = document.querySelector("#text-area");

// Ingame Values
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let inventory = ["stick"];
let monster;
let monsterName;
let monsterHealth;
let monsterLevel;

// Initializing Buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Defining In Elements
const locations = [
  {
    // Location 0
    name: "Town",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You see a sign that says store.",
  },
  {
    // Location 1
    name: "Store",
    "button text": [
      "Buy health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter into the store.",
  },
  {
    // Location 2
    name: "Cave",
    "button text": ["Fight Slime", "Fight Fanged Beast", "Go to town square"],
    "button functions": [fightSlime, fightFangedBeast, goTown],
    text: "You enter the cave and see two monsters.",
  },
  {
    // Location 3
    name: "Fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    // Location 4
    name: "Lost",
    "button text": ["RESTART?", "RESTART?", "RESTART?"],
    "button functions": [restart, restart, restart],
    text: "You lost...",
  },
  {
    // Location 5
    name: "Monster Defeated",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [townOrLottery, townOrLottery, townOrLottery],
    text: "You defeated the monster.\n\nYou gained experience (XP) and gold!",
  },
  {
    // Location 6
    name: "Won the Game",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "YOU WON THE GAME! Wanna play again?",
  },
  {
    // Location 7
    name: "Secret Game",
    "button text": ["2", "4", "No thanks"],
    "button functions": [pickTwo, pickFour, goTown],
    text: "You found a secret game. Pick a number above. Five numbers will be ranodmly chosen between 0 to 5. If the number you choose matches one of the random numbers, you win!",
  },
];

const weapons = [
  {
    name: "stick",
    power: 5,
  },
  {
    name: "dagger",
    power: 30,
  },
  {
    name: "claw hammer",
    power: 50,
  },
  {
    name: "sword",
    power: 100,
  },
];

const monsters = [
  {
    name: "Slime",
    level: 2,
    health: 15,
  },
  {
    name: "Fanged Beast",
    level: 8,
    health: 60,
  },
  {
    name: "Dragon",
    level: 20,
    health: 300,
  },
];

// Canvas Setup Based On Location
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  textArea.innerText = location.text;
}

// Functions
function goTown() {
  update(locations[0]);
  healthText.style.color = "var(--silver)";
  textArea.style.background = "var(--yellow)";
}

function goStore() {
  update(locations[1]);
}

function buyHealth() {
  if (gold >= 10) {
    health += 10;
    healthText.innerText = health;
    gold -= 10;
    goldText.innerText = gold;
    textArea.innerText = "You have received 10 health points.";
  } else {
    textArea.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < 3) {
    if (gold >= 30) {
      gold -= 30;
      goldText.innerText = gold;
      textArea.innerText =
        "You have bought a new weapon.\nYou had: " + inventory;
      currentWeapon++;
      let newWeapon = weapons[currentWeapon].name;
      inventory.push(newWeapon);
      textArea.innerText += "\n\nNow you have in your inventory: " + inventory;
    } else {
      textArea.innerText =
        "You do not have sufficient gold to buy a new weapon.";
    }
  } else {
    textArea.innerText = "You already have the most powerful weapon.";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    textArea.innerText =
      "You sold your " +
      inventory.shift() +
      ".\nYou now have: " +
      inventory +
      " in your inventory.";
    gold += 15;
    goldText.innerText = gold;
  } else {
    textArea.innerText = "Don't sell your only weapon!";
  }
}

function goCave() {
  update(locations[2]);
}

function fightSlime() {
  monster = 0;
  inFight();
}

function fightFangedBeast() {
  monster = 1;
  inFight();
}

function fightDragon() {
  monster = 2;
  inFight();
}

function inFight() {
  update(locations[3]);
  monsterStats.style.display = "flex";
  monsterName = monsters[monster].name;
  monsterHealth = monsters[monster].health;
  monsterLevel = monsters[monster].level;
  monsterNameText.innerText = monsterName;
  monsterHealthText.innerText = monsterHealth;
  if (monster === 2) {
    textArea.innerText =
      "You are fighting against the Dragon. Defeat him and you will win.";
  }
}

function attack() {
  textArea.innerText =
    "The monster " +
    monsters[monster].name +
    " attacks. \n You attack it with your " +
    weapons[currentWeapon].name +
    ".";

  if (monsterIsHit) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    monsterHealthText.innerText = monsterHealth;
  } else {
    textArea.innerText = "You miss.";
  }

  health -= getMonsterAttackValue(monsterLevel);
  healthText.innerText = health;

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    currentWeapon--;
    textArea.innerText =
      "Your weapon " + inventory.pop() + " broke. You now have: " + inventory;
  }

  if (health <= 0) {
    lose();
    health = 0;
    healthText.innerText = health;
    healthText.style.color = "red";
  } else if (monsterHealth <= 0) {
    monster === 2 ? wonGame() : defeatMonster();
  }
}

function monsterIsHit() {
  return Math.random > 0.2 || health <= 20;
}

function getMonsterAttackValue(level) {
  let hitPower = level * 5 - Math.floor(Math.random() * xp);
  return hitPower;
}

function dodge() {
  textArea.innerText = "You dodge the attack from the " + monsterName + ".";
}

function lose() {
  update(locations[4]);
  textArea.style.background = "var(--red)";
  button1.style.display = "none";
  button2.style.display = "none";
}

function defeatMonster() {
  textArea.style.background = "var(--green)";
  update(locations[5]);
  xp += monsterLevel;
  xpText.innerText = xp;
  gold += Math.floor(monsterLevel * 6.7);
  goldText.innerText = gold;
}

function wonGame() {
  textArea.style.background = "var(--green)";
  update(locations[6]);
}

function restart() {
  healthText.style.color = "var(--silver)";
  textArea.style.background = "var(--yellow)";
  button1.style.display = "block";
  button2.style.display = "block";

  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  goTown();
}

function townOrLottery() {
  let randomNumber = Math.random();
  console.log(randomNumber);
  if (randomNumber < 0.3) {
    secretGame();
  } else {
    goTown();
  }
}

function secretGame() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickFour() {
  pick(4);
}

function pick(guess) {
  let numbers = [];
  while (numbers.length < 5) {
    numbers.push(Math.floor(Math.random() * 10));
  }

  textArea.innerText =
    "You picked " + guess + ". Here are the random numbers:\n";

  for (i = 0; i < 5; i++) {
    textArea.innerText += numbers[i] + "\n";
  }

  if (numbers.indexOf(guess) !== -1) {
    textArea.innerText += "Right! You got 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    textArea.innerText += "Wrong! You lose 20 health!";
    health -= 20;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
      health = 0;
      healthText.innerText = health;
      healthText.style.color = "red";
    }
  }
}
