let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lastPressed = false;
let randomNumber = 0;
let randomLeft = 0;
let createBomb;
let dropBomb;
let explodeBomb;
let movement;
let playerDead = false;
let playerHealth = 3;
let counter = 0;

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

const checkIfDead = () => {
	if (playerHealth == 0) {
		playerDead = true;
		player.className = 'character dead';
		stop();
	}
}

const playerHit = () => {
	const player = document.getElementById('player');
	const positionLeft = player.offsetLeft;
	const positionTop = player.offsetTop;
	const explosion = document.elementFromPoint(positionLeft, positionTop);
	const life = document.querySelectorAll("ul > li");


	if (explosion.classList.contains('explosion')) {
		playerHealth -= 1;
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

const startGame = () => {
	counter = 0;
	playerHealth = 3;
	const start = document.querySelector('.start');
	const playAgain = document.querySelector('.playAgain');
	playAgain.style.opacity = 0;
	playAgain.style.pointerEvents = "none";
	start.style.opacity = 0;
	start.style.pointerEvents = "none";
	createBomb = setInterval(bombCreate, 1000);
	dropBomb = setInterval(bombDrop, 10);
	explodeBomb = setInterval(bombExplode, 200);
	playerDead = false;
	movement = setInterval(move, 10);
	death = setInterval(checkIfDead, 10);
	const life = document.querySelectorAll("ul > li");
	for (let i = 0; i < life.length; i++) {
		life[i].style.opacity = 1;
	}

}

const bombCreate = () => {
	const bomb = document.createElement("li");
	bomb.className = "bomb";
	document.body.appendChild(bomb);
	const bombLeft = bomb.offsetLeft;
	randomLeft = getRandomNumber(0, 1920);
	bomb.style.left = bombLeft + randomLeft + 'px';
}

const bombDrop = () => {
	const bombs = document.querySelectorAll('.bomb');
	for (let i = 0; i < bombs.length; i++) {
		const bombTop = bombs[i].offsetTop;
		bombs[i].style.top = bombTop + 1 + 'px';
	}
}

const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const bombExplode = () => {
	const bombs = document.querySelectorAll('.bomb');
	randomNumber = getRandomNumber(725, 900);
	for (let i = 0; i < bombs.length; i++) {
		const bombTop = bombs[i].offsetTop;
		const sky = document.elementFromPoint(bombTop, bombs[i].offsetLeft);
		if (bombTop >= randomNumber) {
			bombs[i].className = "explosion";
			setTimeout(playerHit, 250);
			setTimeout(cleanUp, 250);
		}
	}

}

const cleanUp = () => {
	const explosions = document.querySelectorAll('.explosion');
	explosions[0].remove();
}

const stop = () => {
	const start = document.querySelector('.start');
	start.style.opacity = 1;
	start.style.pointerEvents = "auto";
	clearInterval(movement);
	clearInterval(createBomb);
	clearInterval(dropBomb);
	clearInterval(explodeBomb);
	clearInterval(death);
	start.firstChild.nodeValue = 'Game Over';
	const playAgain = document.querySelector('.playAgain');
	playAgain.style.opacity = 1;
	start.style.pointerEvents = "none";
	playAgain.style.pointerEvents = "auto";
	playAgain.addEventListener('click', startGame);
}

const myLoadFunction = () => {
	const bomb = document.querySelectorAll('.bomb');
	for (let i = 0; i < bomb.length; i++) {
		const bombLeft = bomb[i].offsetLeft;							//Sets the bombs to a random position
		const randomLeft = Math.floor(Math.random() * 1920);
		bomb[i].style.left = bombLeft + randomLeft + 'px';
	}
	const start = document.querySelector('.start');
	start.addEventListener('click', startGame);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}


document.addEventListener('DOMContentLoaded', myLoadFunction);