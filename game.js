let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lastPressed = false;

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

	player.className = 'character stand ' + lastPressed;
}

const move = () => {
	const player = document.getElementById('player');
	const positionLeft = player.offsetLeft;
	const positionTop = player.offsetTop;
	if (downPressed) {
		const newDown = positionTop + 1;

		const sky = document.elementFromPoint(player.offsetLeft, newDown + 32);
		if (sky.classList.contains('sky') == false) {
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
		if (sky.classList.contains('sky') == false) {
			player.style.top = newTop + 'px';
		}

		if (!leftPressed) {
			if (!rightPressed) {
				player.className = 'character walk up';
			}
		}
	}
	if (leftPressed) {
		const newLeft = positionLeft - 1;

		const sky = document.elementFromPoint(newLeft, player.offsetTop);
		if (sky.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';
		}


		player.className = 'character walk left';
	}
	if (rightPressed) {
		const newRight = positionLeft + 1;

		const sky = document.elementFromPoint(newRight + 32, player.offsetTop);
		if (sky.classList.contains('sky') == false) {
			player.style.left = newRight + 'px';
		}

		player.className = 'character walk right';
	}

}

const startGame = () => {
	const start = document.querySelector('.start');
	start.style.opacity = 0;
	setInterval(bombCreate, 1000);
	setInterval(bombDrop, 50);
	setInterval(bombExplode, 50);
}

const bombCreate = () => {
	const bomb = document.createElement("li");
	bomb.className = "bomb";
	document.body.appendChild(bomb);
	const bombLeft = bomb.offsetLeft;
	const randomLeft = Math.floor(Math.random() * 1920);
	bomb.style.left = bombLeft + randomLeft + 'px';
}

const bombDrop = () => {
	const bombs = document.querySelectorAll('.bomb');
	for (let i = 0; i < bombs.length; i++) {
		const bombTop = bombs[i].offsetTop;
		bombs[i].style.top = bombTop + 5 + 'px';
	}
}

const bombExplode = () => {
	const bombs = document.querySelectorAll('.bomb');
	const sky = document.querySelector('.sky');
	for (let i = 0; i < bombs.length; i++) {
		const bombTop = bombs[i].offsetTop;
		const below = bombTop + 5;
		if (below.classList.contains('sky') == false) {
			bombs[i].className = "explosion";
		}
	}

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
	timeout = setInterval(move, 10);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}


document.addEventListener('DOMContentLoaded', myLoadFunction);