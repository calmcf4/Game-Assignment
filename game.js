let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lastPressed = false;				
let randomNumber = 0;
let randomLeft = 0;
let createBomb;						//Initialises all of the variables that need to be hoisted in order for them to
let dropBomb;						// be used in multiple functions
let explodeBomb;
let movement;
let playerDead = false;
let playerHealth = 3;
let counter = 0;
let bombsDodged = 0;
let level = 1;
let bombsDropped = 0;
let bombsExploded = 0;
let speed = 24;
let dropRate = 1000;

	//Creates the leaderboard on load by looping through local storage and adding them to the page
const initLeaderboard = () => {
	const scoreboard = document.querySelector('scoreboard');
	for (let i = 0; i < window.localStorage.length; i++) {
		const listing = document.createElement("li");
		let name = window.localStorage.key(i);
		const score = document.createTextNode(`${window.localStorage.key(i)} dodged ${window.localStorage.getItem(name)} bombs.`);		
		listing.appendChild(score);
		this.scoreboard.appendChild(listing);

	}

}

	/* When this function is called it creates an element containing the score and adds it to the leaderboard,
	while also adding it to the local storage, this allows the score to be logged when it is clicked, while also
	saving it so that it still appears on load */
const logScore = () => {
	const score = {
		name: document.getElementById('firstName').value,
		score: bombsDodged,
	};
	window.localStorage.setItem(score.name, score.score);
	let scoreboard = document.querySelector('#scoreboard');
	let listing = document.createElement("li");
	let newScore = document.createTextNode(`${score.name} dodged ${score.score} bombs.`);
	listing.appendChild(newScore);
	scoreboard.appendChild(listing);


}

//Is on a timer, if the player health reaches 0 the game will stop and the player will use the dead class
const checkIfDead = () => {
	if (playerHealth == 0) {
		playerDead = true;
		player.className = 'character dead';
		stop();
	}
}

//Removes all bombs currently in play so that a situation where there are bombs immediately above the player on restart does not occur
const removeAllBombs = () => {
	const bombs = document.querySelectorAll('.bomb');
	for (let i = 0; i < bombs.length; i++) {
		bombs[i].remove();
	}
}

//Used to create a random number, as the Math.random is not reliable for large numbers
const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Is used on a timer to remove bombs that have exploded, otherwise the screen would become filled with explosions
const cleanUp = () => {
	const explosions = document.querySelectorAll('.explosion');
	explosions[0].remove();
	bombsDodged++;
}


const keydown = (event) => {

	switch (event.key) {
		case "ArrowLeft":
			leftPressed = true;
			break;

		case "ArrowRight":
			rightPressed = true;
			break;

		case "ArrowUp":
			upPressed = true;
			break;

		case "ArrowDown":
			downPressed = true;
			break;
	}
}


const keyup = (event) => {

	const player = document.getElementById('player');

	switch (event.key) {
		case "ArrowLeft":
			leftPressed = false;
			lastPressed = 'left';
			break;

		case "ArrowRight":
			rightPressed = false;
			lastPressed = 'right';
			break;

		case "ArrowUp":
			upPressed = false;
			lastPressed = 'up';
			break;

		case "ArrowDown":
			downPressed = false;
			lastPressed = 'down';
			break;
	}
	if (!playerDead) {
		player.className = 'character stand ' + lastPressed;
	}
}


/* Every time a bomb explodes this function is called, it checks if the player is in the same area as an explosion
If the player is hit by an explosion, 1 life is removed. 
The counter is used to track the number of hits taken, so that the correct life on the screen is removed. */
const playerHit = () => {
	const player = document.getElementById('player');
	const positionLeft = player.offsetLeft;
	const positionTop = player.offsetTop;
	const explosion = document.elementFromPoint(positionLeft, positionTop);
	const life = document.querySelectorAll("ul > li");


	if (explosion.classList.contains('explosion')) {
		playerHealth -= 1;
		console.log(`Player has ${playerHealth} lives remaining`);
		life[counter].style.opacity = 0;
		counter++;


	}

}


const move = () => {
	const player = document.getElementById('player');
	const positionLeft = player.offsetLeft;
	const positionTop = player.offsetTop;
	const explosion = document.elementFromPoint(positionLeft, positionTop);

	if (explosion.classList.contains('explosion')) {
		player.className = 'character hit ' + lastPressed;

	}
	if (downPressed) {
		const newDown = positionTop + 1;

		const sky = document.elementFromPoint(player.offsetLeft, newDown + 32);

		if (!sky.classList.contains('sky')) {
			player.style.top = newDown + 'px';
		}

		if (!leftPressed) {
			if (!rightPressed) {
				player.className = 'character walk down';
			}
		}
	}
	if (upPressed) {
		const newTop = positionTop - 1;

		const sky = document.elementFromPoint(player.offsetLeft, newTop);


		if (!sky.classList.contains('sky')) {
			player.style.top = newTop + 'px';
		}

		if (!leftPressed) {
			if (!rightPressed) {
				player.className = 'character walk up';
			}
		}
	}
	if (leftPressed && !playerDead) {
		const newLeft = positionLeft - 1;

		const sky = document.elementFromPoint(newLeft, player.offsetTop);

		if (!sky.classList.contains('sky')) {
			player.style.left = newLeft + 'px';
		}


		player.className = 'character walk left';
	}
	if (rightPressed && !playerDead) {
		const newRight = positionLeft + 1;

		const sky = document.elementFromPoint(newRight + 32, player.offsetTop);

		if (!sky.classList.contains('sky')) {
			player.style.left = newRight + 'px';
		}

		player.className = 'character walk right';
	}

}

/* Starts the game, as this function will be called when the game is restarted without loading it is necessary for the variables to be assigned their default values again.
Once this has occurred, all of the functions related to the bombs and player are set on intervals */
const startGame = () => {
	removeAllBombs();
	dropRate = 1000;
	speed = 24;
	level = 1;
	counter = 0;
	playerHealth = 3;
	bombsDropped = 0;
	const start = document.querySelector('.start');
	const playAgain = document.querySelector('.playAgain');
	const scoreboard = document.querySelector('#scoreboard');
	scoreboard.style.opacity = 0;
	playAgain.style.opacity = 0;
	playAgain.style.pointerEvents = "none";
	start.style.opacity = 0;
	start.style.pointerEvents = "none";
	createBomb = setInterval(bombCreate, dropRate);
	dropBomb = setInterval(bombDrop, speed);
	explodeBomb = setInterval(bombExplode, 200);
	playerDead = false;
	movement = setInterval(move, 10);
	death = setInterval(checkIfDead, 10);
	const life = document.querySelectorAll("ul > li");
	for (let i = 0; i < life.length; i++) {
		life[i].style.opacity = 1;
	}
	bombsDodged = 0;
	const score = document.querySelector('.score');
	score.style.opacity = 0;
	const name = document.querySelector('.name');
	name.style.opacity = 0;
	name.style.pointerEvents = "none";
	const levelTag = document.querySelector('.level');
	levelTag.firstChild.nodeValue = `Level: ${level}`;

}

/* Stops the game, the leaderboard is displayed and all intervals are cleared */
const stop = () => {
	const scoreboard = document.querySelector('#scoreboard');
	scoreboard.style.opacity = 1;
	const start = document.querySelector('.start');
	start.style.opacity = 1;
	start.style.pointerEvents = "auto";
	clearInterval(movement);
	clearInterval(createBomb);
	clearInterval(dropBomb);
	clearInterval(explodeBomb);
	clearInterval(death);
	clearTimeout(increaseLevel);
	start.firstChild.nodeValue = 'Game Over';
	const playAgain = document.querySelector('.playAgain');
	playAgain.style.opacity = 1;
	start.style.pointerEvents = "none";
	playAgain.style.pointerEvents = "auto";
	playAgain.addEventListener('click', startGame);
	const score = document.querySelector('.score');
	score.style.opacity = 1;
	score.firstChild.nodeValue = `You dodged ${bombsDodged} bombs`;
	const name = document.querySelector('.name');
	name.style.opacity = 1;
	name.style.pointerEvents = "auto";
}

/* Controls the creation of the bombs. First a random number is generated between 0 and 2. This number will determine if the bomb will lean left, right or have no leaning.
	Once the direction of the bomb has been decided, the position is then generated using the random number function, this gives it a position between 0 and 1920 (the width of the screen).
	Lastly, the bombsDropped variable is used to track the number of bombs dropped that will be used for the levelling feature */
const bombCreate = () => {
	const random = Math.floor(Math.random() * 3);
	const bomb = document.createElement("li");
	bomb.className = "bomb";
	if (random == 0) {
		tiltLeft = bomb.style.transform = "rotate(135deg)";
		bomb.setAttribute("tiltedLeft", tiltLeft);
	}
	if (random == 1) {
		noTilt = bomb.style.transform = "rotate(360)";
		bomb.setAttribute("noTilt", noTilt);
	}
	if (random == 2) {
		tiltRight = bomb.style.transform = "rotate(45deg)";
		bomb.setAttribute("tiltedRight", tiltRight);
	}
	document.body.appendChild(bomb);
	const bombLeft = bomb.offsetLeft;
	randomLeft = getRandomNumber(0, 1920);
	bomb.style.left = bombLeft + randomLeft + 'px';
	bombsDropped++;
	if (bombsDropped == level * 10) {
		clearInterval(createBomb);
	}
}

/* Controls the dropping of the bombs by looping through them and dropping them all on an interval. If the bomb is tilted it will be given an additional move in the direction that it is facing. */
const bombDrop = () => {
	const bombs = document.querySelectorAll('.bomb');
	for (let i = 0; i < bombs.length; i++) {
		const bombTop = bombs[i].offsetTop;
		const bombLeft = bombs[i].offsetLeft;
		bombs[i].style.top = bombTop + 1 + 'px';
		if (bombs[i].hasAttribute("tiltedLeft")) {
			bombs[i].style.left = bombLeft - 1 + 'px';
		}
		if (bombs[i].hasAttribute("tiltedRight")) {
			bombs[i].style.left = bombLeft + 1 + 'px';
		}
	}
}

/* Runs constantly on an interval. Generates a number between 725 and 900 (the height of the grass area), if a bomb is within this area when the function is executed, it will explode.
	To ensure that all of the explosions look the same, if the bomb has been tilted the explosion is set to appear upright. Once the bomb is exploded a cleanup function is set on a timeout,
	to stop the explosions from never being removed. The number of bombs that have exploded is also tracked to control the levelling system */
const bombExplode = () => {
	const bombs = document.querySelectorAll('.bomb');
	randomNumber = getRandomNumber(725, 900);
	for (let i = 0; i < bombs.length; i++) {
		const bombTop = bombs[i].offsetTop;
		if (bombTop >= randomNumber) {
			if (bombs[i].hasAttribute("tiltedLeft") || bombs[i].hasAttribute("tiltedRight")) {
				noTilt = bombs[i].style.transform = "rotate(360deg)";
				bombs[i].setAttribute("noTilt", noTilt);
			}
			bombs[i].className = "explosion";
			setTimeout(playerHit, 250);
			setTimeout(cleanUp, 250);
			bombsExploded++;
			if (bombsExploded == level * 10) {
				clearInterval(explodeBomb);
				clearInterval(dropBomb);
				setTimeout(increaseLevel, 3000);
			}
		}
	}

}

/* Once this function has been called, the level variable is increased, meaning each level will have additional bombs dropped, for example level 1 will have 10 bombs, level 2 will have 20 and so on.
	The level tag is updated to reflect the new level and the trackers for the number of bombs dropped and exploded is reset. The variables used to control the speed and drop rate of the bombs are reduced
	to make each subsequent level harder, this creates a potentially infinite number of levels */
const increaseLevel = () => {
	level++
	const levelTag = document.querySelector('.level');
	levelTag.firstChild.nodeValue = `Level: ${level}`;
	bombsDropped = 0;
	bombsExploded = 0;
	speed -=2;
	dropRate -=50;
	createBomb = setInterval(bombCreate, dropRate);
	dropBomb = setInterval(bombDrop, speed);
	explodeBomb = setInterval(bombExplode, 200);
	console.log(`Now Starting level ${level}. Drop rate is ${dropRate} and bomb speed is ${speed}`);
	
}

//Loads on start and adds event listeners to the functions that require them
const myLoadFunction = () => {
	const start = document.querySelector('.start');
	start.addEventListener('click', startGame);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
	const submit = document.querySelector('.submit');
	submit.addEventListener('click', logScore);
	initLeaderboard();
}


document.addEventListener('DOMContentLoaded', myLoadFunction);
