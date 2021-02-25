const TILE_SIZE = 48;
const HELMET_OFFSET =12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
root.style.setProperty('--tile-size', `${TILE_SIZE}px`);
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`);
root.style.setProperty('--game-size', `${GAME_SIZE}px`);

function createBoard(){
	const boardElement = document.getElementById('board');
	const elements = [];

	function createElement(options){
		let { item, top, left } = options;

		const currentElement = { item, currentPosition: { top, left } };
		elements.push(currentElement);

		const htmlElement = document.createElement('div');
		htmlElement.className = item;
		htmlElement.style.top = `${top}px`;
		htmlElement.style.left = `${left}px`;

		boardElement.appendChild(htmlElement);

		function getNewDirection(buttonPressed, position){
			switch (buttonPressed) {
				case 'ArrowUp':
					return { top: position.top - TILE_SIZE, left: position.left};

			case 'ArrowDown':
				return { top: position.top + TILE_SIZE, left: position.left};
			
			case 'ArrowLeft':
				return { top: position.top, left: position.left - TILE_SIZE};
					
			case 'ArrowRight':
				return { top: position.top, left: position.left + TILE_SIZE};

			default: 
				return position;
			}
		}

		function validateMovement(position, conflictItem){
			return (
				position.left >= 48 &&
				position.left <= 864 &&
				position.top >= 96 &&
				position.top <= 816 &&
				conflictItem?.item !== "forniture"
			)
		}

		function getMovementConflict(position, els){
			const conflictItem = els.find((currentElement) => {
				return (
					currentElement.currentPosition.top === position.top &&
					currentElement.currentPosition.left === position.left
				)
			});
			return conflictItem;
		}

		function validateConflict(currentEl, conflictItem){
			function finishGame(message){
				setTimeout(() => {
					alert(message);
					location.reload();
				}, 100);
			}

			if(currentEl.item === 'hero'){
				if(
					conflictItem?.item === 'mini-demon' ||
					conflictItem?.item === 'trap'
				){
					finishGame('você morreu');
				}
				if(conflictItem?.item === 'chest'){
					finishGame("você venceu");
				}
			}
			if(currentEl.item === 'mini-demon' && conflictItem?.item === 'hero'){
				finishGame('vocề morreu');
			}
		}

		function move(buttonPressed){
			const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
			const conflictItem = getMovementConflict(newPosition, elements);
			const isValidMovement = validateMovement(newPosition, conflictItem);

			if(isValidMovement){
				currentElement.currentPosition = newPosition
				htmlElement.style.top = `${newPosition.top}px`;
				htmlElement.style.left = `${newPosition.left}px`;

				validateConflict(currentElement, conflictItem);
			}
		}

		return {
			move
		};
	}

	function createItem(options){
		createElement(options);
	}

	function createHero(options) {
		const hero = createElement({
			item: 'hero',
			top: options.top,
			left: options.left
		});

		document.addEventListener('keydown', (event) => {
			hero.move(event.key);
		});
	}

	function createEnemy(options){
		const enemy = createElement({
			item: 'mini-demon',
			top: options.top,
			left: options.left
		});

		setInterval(()=> {
			const direction = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
			const randomIndex = Math.floor(Math.random() * direction.length);
			const randomDirection = direction[randomIndex];

			enemy.move(randomDirection);
		}, 1000);

	}

	return {
		createItem,
		createHero,
		createEnemy,
	}
}
const board = createBoard();
board.createEnemy({ top: TILE_SIZE*5, left: TILE_SIZE*5 });
board.createItem({ item: 'trap', top: TILE_SIZE*10, left: TILE_SIZE*10 });
board.createItem({ item: 'chest', top: TILE_SIZE*15, left: TILE_SIZE*15 });
board.createHero({ top: TILE_SIZE*16, left: TILE_SIZE*2 });

board.createItem({ item: 'forniture', top: TILE_SIZE*17, left: TILE_SIZE*2 });
board.createItem({ item: 'forniture', top: TILE_SIZE*2, left: TILE_SIZE*3 });
board.createItem({ item: 'forniture', top: TILE_SIZE*2, left: TILE_SIZE*8 });
board.createItem({ item: 'forniture', top: TILE_SIZE*2, left: TILE_SIZE*16 });