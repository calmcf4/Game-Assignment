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
	let positionLeft = player.offsetLeft;
	let positionTop = player.offsetTop;
	if (downPressed) {
		let newDown = positionTop + 1;

		let sky = document.elementFromPoint(player.offsetLeft, newDown + 32);
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
		let newTop = positionTop - 1;

		let sky = document.elementFromPoint(player.offsetLeft, newTop);
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
		let newLeft = positionLeft - 1;

		let sky = document.elementFromPoint(newLeft, player.offsetTop);
		if (sky.classList.contains('sky') == false) {
			player.style.left = newLeft + 'px';
		}


		player.className = 'character walk left';
	}
	if (rightPressed) {
		let newRight = positionLeft + 1;

		let sky = document.elementFromPoint(newRight + 32, player.offsetTop);
		if (sky.classList.contains('sky') == false) {
			player.style.left = newRight + 'px';
		}

		player.className = 'character walk right';
	}

}


const myLoadFunction = () => {
	timeout = setInterval(move, 10);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);
}


document.addEventListener('DOMContentLoaded', myLoadFunction);