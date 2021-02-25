const TILE_SIZE = 48;
const HELMET_OFFSET =12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
root.style.setProperty('--tile-size', `${TILE_SIZE}px`);
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`);
root.style.setProperty('--game-size', `${GAME_SIZE}px`);

function createBoard(){
	const boardElement = document.getElementById('board');

	function createElement(options){
		let { item, top, left } = options;

		const htmlElement = document.createElement('div');
		htmlElement.className = item;
		htmlElement.style.top = `${top}px`;
		htmlElement.style.left = `${left}px`;

		boardElement.appendChild(htmlElement);

		function getNewDirection(buttonPressed){
			switch (buttonPressed) {
				case 'ArrowUp':
					return { top: top - TILE_SIZE, left: left};

			case 'ArrowDown':
				return { top: top + TILE_SIZE, left: left};
			
			case 'ArrowLeft':
					return { top: top, left: left - TILE_SIZE};
					
			case 'ArrowRight':
					return { top: top, left: left + TILE_SIZE};

			default: return { top: top, left: left };
			}
		}

		function move(buttonPressed){
			console.log('move', buttonPressed);
			const newDirection = getNewDirection(buttonPressed);
			top = newDirection.top;
			left = newDirection.left;
			htmlElement.style.top = `${newDirection.top}px`;
			htmlElement.style.left = `${newDirection.left}px`;
		}

		return {
			move: move
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
		createEnemy
	}
}
const board = createBoard();
board.createEnemy({ top: TILE_SIZE*5, left: TILE_SIZE*5 });
board.createItem({ item: 'trap', top: TILE_SIZE*10, left: TILE_SIZE*10 });
board.createItem({ item: 'chest', top: TILE_SIZE*15, left: TILE_SIZE*15 });
board.createHero({ top: TILE_SIZE*16, left: TILE_SIZE*2 });
