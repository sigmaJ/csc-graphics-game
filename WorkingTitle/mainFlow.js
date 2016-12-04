/* GLOBAL CONSTANTS AND VARIABLES */
var GAME = {};
var BASE_URL = "https://raw.githubusercontent.com/ForgeDH/csc-graphics-game/master/WorkingTitle/";

GAME.allObjects = [];			// everything in the world
GAME.entities = [];				// things that need processing every tick (player, enemies, projectiles, etc.)
GAME.structures = [];			// things that are static (walls, floors, etc.)

GAME.player;



/* ARENA FILE STRUCTURE */
var Arena1 = ["floor1.json"];
var ARENAS = {"Arena1":Arena1};

/* ENTITY FILE STRUCTURE */
var OBJECTS = {};
var ENEMIES = {};

/* MAIN -- HERE is where execution begins after window load */

function main() {
  
	// create THREE scene, light and camera
	GAME.scene = new THREE.Scene();
	var light = new THREE.PointLight( 0xffffff, 1, 10000 );
	light.position.set( 50, 50, 50 );
	GAME.scene.add( light );
	GAME.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	// create THREE renderer and put it in the webpage
	GAME.renderer = new THREE.WebGLRenderer();
	GAME.renderer.setSize( window.innerWidth * 0.9, window.innerHeight * 0.9 );
	document.body.appendChild( GAME.renderer.domElement );

	// create CANNON world
	GAME.world = new CANNON.World();
	GAME.world.gravity.set(0,-1,0);
	GAME.world.broadphase = new CANNON.NaiveBroadphase();
	
	// add entities (all for now)
	for (var arena in ARENAS){
		for (var obj in ARENAS[arena]){
			// TODO SWITCH OFF OF ENTITIES
			GAME.entities.push(new Entity(BASE_URL + 'Arenas/' + arena + '/' + ARENAS[arena][obj]));
		}
	}
	for (var obj in OBJECTS){
		GAME.entities.push(new Entity(BASE_URL + 'Entities/Objects/' + obj + '/' + OBJECTS[obj]));
	}
	for (var enemy in ENEMIES){
		GAME.entities.push(new Entity(BASE_URL + 'Entities/Enemies/' + enemy + '/' + ENEMIES[enemy]));
	}
	console.log(GAME.entities);
	
	// load player
	GAME.player = new Entity(BASE_URL + 'Entities/Objects/object1/object1.json', true);
	GAME.entities.push(GAME.player);
	//Entity.initPlayer();
	
	function render() {
		requestAnimationFrame( render );
		
		//handle input
		while (INPUT.eventsToHandle() == true){
			//console.log(INPUT.getNextEvent());
			INPUT.getNextEvent();
		}
		
		for (var idx in GAME.entities){
			GAME.entities[idx].tick();
			GAME.entities[idx].updateMeshToBody();
		}
		
		GAME.world.step(0.1666);
		GAME.renderer.render( GAME.scene, GAME.camera );
	}
	
	INPUT.init();
	render();
	
} // end main