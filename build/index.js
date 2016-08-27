webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Game_1 = __webpack_require__(1);
	var game = new Game_1.default(document.querySelector('canvas#game'));
	game.onStart();
	/* EVENTS */
	window.onfocus = game.onResume.bind(game);
	window.onresize = game.onResize.bind(game);
	window.onblur = game.onPause.bind(game);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var babylonjs_1 = __webpack_require__(2);
	var GameWorld_1 = __webpack_require__(3);
	var GameRenderer_1 = __webpack_require__(6);
	/* Utils */
	var Seed_1 = __webpack_require__(24);
	var settings = (function () {
	    function settings() {
	    }
	    return settings;
	}());
	exports.settings = settings;
	var Game = (function () {
	    function Game(canvas) {
	        this.canvas = canvas;
	        this.settings = {
	            seed: new Seed_1.default(Math.random()),
	            difficulty: 1,
	            paused: false,
	            graphics: {
	                quality: 5,
	            }
	        };
	        this.engine = new babylonjs_1.Engine(this.canvas, true);
	        this.world = new GameWorld_1.default(this);
	        this.renderer = new GameRenderer_1.default(this, this.world);
	    }
	    Game.prototype.onStart = function () {
	        this.world.onCreate();
	        this.renderer.onCreate();
	    };
	    Game.prototype.onResume = function () {
	        this.settings.paused = false;
	        this.world.onResume();
	        this.renderer.onResume();
	    };
	    Game.prototype.onResize = function () {
	        this.engine.resize();
	    };
	    Game.prototype.onPause = function () {
	        this.settings.paused = true;
	        this.world.onPause();
	        this.renderer.onPause();
	    };
	    Game.prototype.onQuit = function () {
	        this.world.onDestroy();
	        this.renderer.onDestroy();
	    };
	    return Game;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Game;


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Hexagon_1 = __webpack_require__(4);
	var Tile_1 = __webpack_require__(5);
	var GameWorld = (function () {
	    function GameWorld(game) {
	        this.game = game;
	        this.tiles = new Map();
	        //const mapRadius = 64;
	        var mapRadius = 1;
	        for (var q = -mapRadius; q <= mapRadius; q++) {
	            var r1 = Math.max(-mapRadius, -q - mapRadius);
	            var r2 = Math.min(mapRadius, -q + mapRadius);
	            for (var r = r1; r <= r2; r++) {
	                var tile = new Tile_1.default(new Hexagon_1.default(q, r, -q - r));
	                this.tiles.set(tile.hexagon.toString(), tile);
	            }
	        }
	    }
	    GameWorld.prototype.onLoaded = function () {
	        this.onCreate();
	    };
	    GameWorld.prototype.onCreate = function () {
	        this.onUpdate();
	    };
	    GameWorld.prototype.onResume = function () {
	        this.onUpdate();
	    };
	    GameWorld.prototype.onUpdate = function () {
	    };
	    GameWorld.prototype.onPause = function () {
	    };
	    GameWorld.prototype.onDestroy = function () {
	    };
	    return GameWorld;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = GameWorld;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var Hexagon = (function () {
	    function Hexagon(q, r, s) {
	        this.q = q;
	        this.r = r;
	        this.s = s;
	        if (typeof s === 'undefined')
	            this.s = s = -q - r;
	        console.assert(q + r + s == 0, 'Coordinates (Q, R, S) must amount to 0');
	    }
	    Hexagon.prototype.toString = function () {
	        return this.q + "|" + this.r + "|" + this.s;
	    };
	    /* EQUALS */
	    Hexagon.prototype.equal = function (a, b) {
	        return a.q == b.q && a.r == b.r && a.s == b.s;
	    };
	    /* ADD */
	    Hexagon.prototype.add = function (a, b) {
	        return new Hexagon(a.q + b.q, a.r + b.r, a.s + b.s);
	    };
	    /* SUBTRACT */
	    Hexagon.prototype.subtract = function (a, b) {
	        return new Hexagon(a.q - b.q, a.r - b.r, a.s - b.s);
	    };
	    /* MULTIPLY */
	    Hexagon.prototype.multiply = function (a, k) {
	        return new Hexagon(a.q * k, a.r * k, a.s * k);
	    };
	    /* LENGTH */
	    Hexagon.prototype.length = function (hex) {
	        return (Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2;
	    };
	    /* DISTANCE */
	    Hexagon.prototype.distance = function (a, b) {
	        return this.length(this.subtract(a, b));
	    };
	    /* DIRECTION */
	    Hexagon.prototype.direction = function (direction) {
	        return exports.hexagonDirections[(6 + (direction % 6)) % 6];
	    };
	    /* NEIGHBOR */
	    Hexagon.prototype.neighbor = function (hex, direction) {
	        return this.add(hex, this.direction(direction));
	    };
	    return Hexagon;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Hexagon;
	exports.hexagonDirections = [
	    new Hexagon(1, 0, -1), new Hexagon(1, -1, 0), new Hexagon(0, -1, 1),
	    new Hexagon(-1, 0, 1), new Hexagon(-1, 1, 0), new Hexagon(0, 1, -1),
	];


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var Tile = (function () {
	    function Tile(hexagon, type) {
	        this.hexagon = hexagon;
	        this.type = type;
	        if (typeof type === 'undefined') {
	            var types = Object.keys(Tile.TYPES);
	            this.type = Tile.TYPES[types[types.length * Math.random() << 0]];
	        }
	    }
	    Tile.TYPES = {
	        BARREN: 'barren',
	        PLAIN: 'plain',
	        DESERT: 'desert',
	        OCEAN: 'ocean',
	        MOUNTAIN: 'mountain'
	    };
	    return Tile;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Tile;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var babylonjs_1 = __webpack_require__(2);
	var CameraManager_1 = __webpack_require__(7);
	var MaterialManager_1 = __webpack_require__(8);
	var HexagonLayout_1 = __webpack_require__(23);
	var GameRenderer = (function () {
	    function GameRenderer(game, world) {
	        var _this = this;
	        this.game = game;
	        this.world = world;
	        this.scene = new babylonjs_1.Scene(this.game.engine);
	        this.cameraManager = new CameraManager_1.default(this.scene);
	        this.materialManager = new MaterialManager_1.default(this.scene);
	        this.mainCamera = this.cameraManager.get('main');
	        this.mainCamera.setTarget(babylonjs_1.Vector3.Zero());
	        this.mainCamera.attachControl(this.game.canvas, false, false);
	        //let sunLight = new DirectionalLight("sunLight", new Vector3(-3, -3, -1), this.scene);
	        var sunLight = new babylonjs_1.DirectionalLight("dir01", new babylonjs_1.Vector3(-1, -2, -1), this.scene);
	        sunLight.position = new babylonjs_1.Vector3(20, 40, 20);
	        sunLight.intensity = 0.7;
	        var ambientLight = new babylonjs_1.HemisphericLight("ambientLight", new babylonjs_1.Vector3(0, 1, 0), this.scene);
	        ambientLight.diffuse = new babylonjs_1.Color3(1, 1, 1);
	        ambientLight.specular = new babylonjs_1.Color3(1, 1, 1);
	        ambientLight.groundColor = new babylonjs_1.Color3(0, 0, 0);
	        ambientLight.intensity = 0.5;
	        /*
	        let skybox = Mesh.CreateBox("skyBox", 100.0, this.scene);
	        skybox.material = this.materialManager.get('tropicalSky');
	        skybox.infiniteDistance = true;
	        */
	        this.scene.fogMode = babylonjs_1.Scene.FOGMODE_LINEAR;
	        this.scene.fogColor = new babylonjs_1.Color3(0.9, 0.87, 0.85);
	        this.scene.fogStart = 10;
	        this.scene.fogEnd = 15;
	        var ground = babylonjs_1.Mesh.CreateGround("ground", 100, 100, 2, this.scene);
	        ground.material = this.materialManager.get('paper');
	        ground.material.diffuseTexture.uScale = 30;
	        ground.material.diffuseTexture.vScale = 30;
	        ground.material.specularColor = new babylonjs_1.Color3(0, 0, 0);
	        ground.receiveShadows = true;
	        this.layout = new HexagonLayout_1.HexagonLayout(HexagonLayout_1.HexagonLayout.LAYOUT_HORIZONTAL, new babylonjs_1.Vector2(0.5, 0.5), new babylonjs_1.Vector3(0, 0, 0));
	        this.meshes = [];
	        var firstInstance = {};
	        this.world.tiles.forEach(function (tile, coords) {
	            var mesh;
	            if (tile.type in firstInstance) {
	                mesh = firstInstance[tile.type].createInstance("tile-" + coords);
	            }
	            else {
	                mesh = babylonjs_1.MeshBuilder.CreateCylinder("tile-" + coords, {
	                    height: 0.05,
	                    diameter: 0.95,
	                    tessellation: 6,
	                    faceUV: [new babylonjs_1.Vector4(0, 0, 0, 0), new babylonjs_1.Vector4(0, 0, 6, 0.1), new babylonjs_1.Vector4(0, 0, 1, 1)],
	                }, _this.scene);
	                mesh.rotation = new babylonjs_1.Vector3(0, Math.PI / 3, 0);
	                mesh.material = _this.materialManager.get(tile.type);
	                firstInstance[tile.type] = mesh;
	            }
	            mesh.position = _this.layout.hexagonToPixel(tile.hexagon, 0.025);
	            mesh.elevated = false;
	            mesh.actionManager = new babylonjs_1.ActionManager(_this.scene);
	            mesh.actionManager.registerAction(new babylonjs_1.InterpolateValueAction(babylonjs_1.ActionManager.OnPickTrigger, mesh, "position.y", mesh.elevated ? 0.025 : 0.125, 250)).then(new babylonjs_1.SwitchBooleanAction(babylonjs_1.ActionManager.NothingTrigger, mesh, "elevated"));
	            _this.meshes.push(mesh);
	        }, this);
	        var shadowGenerator = new babylonjs_1.ShadowGenerator(1024, sunLight);
	        shadowGenerator.useBlurVarianceShadowMap = true;
	        shadowGenerator.getShadowMap().renderList =
	            shadowGenerator.getShadowMap().renderList.concat(this.meshes);
	    }
	    GameRenderer.prototype.onLoaded = function () {
	        this.onCreate();
	    };
	    GameRenderer.prototype.onCreate = function () {
	        this.game.engine.runRenderLoop(this.onUpdate.bind(this));
	    };
	    GameRenderer.prototype.onResume = function () {
	        this.game.engine.runRenderLoop(this.onUpdate.bind(this));
	    };
	    GameRenderer.prototype.onUpdate = function () {
	        this.scene.render();
	        this.mainCamera.panningSensibility = 100 * (this.mainCamera.upperRadiusLimit / this.mainCamera.radius);
	    };
	    GameRenderer.prototype.onPause = function () {
	        this.game.engine.stopRenderLoop();
	    };
	    GameRenderer.prototype.onDestroy = function () {
	    };
	    return GameRenderer;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = GameRenderer;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var babylonjs_1 = __webpack_require__(2);
	var CameraManager = (function () {
	    function CameraManager(scene) {
	        this.scene = scene;
	        this.cameras = new Map();
	        /* MAIN CAMERA */
	        this.add('main', CameraManager.CAMERA.ARC_ROTATE, {
	            alpha: CameraManager.toRadians(360),
	            beta: CameraManager.toRadians(40),
	            radius: 5,
	            position: babylonjs_1.Vector3.Zero(),
	            settings: {
	                lowerRadiusLimit: 3,
	                upperRadiusLimit: 10,
	                lowerAlphaLimit: CameraManager.toRadians(360),
	                upperAlphaLimit: CameraManager.toRadians(360),
	                lowerBetaLimit: CameraManager.toRadians(30),
	                upperBetaLimit: CameraManager.toRadians(65),
	                panningAxis: new babylonjs_1.Vector3(1, 0, 1),
	                inertia: 0.5,
	            }
	        });
	    }
	    CameraManager.prototype.add = function (id, type, options) {
	        var camera;
	        switch (type) {
	            case CameraManager.CAMERA.ARC_ROTATE:
	                camera = new babylonjs_1.ArcRotateCamera(id, options.alpha, options.beta, options.radius, options.position, this.scene);
	                break;
	            case CameraManager.CAMERA.UNIVERSAL:
	            default:
	                break;
	        }
	        for (var setting in options.settings) {
	            if (options.settings.hasOwnProperty(setting)) {
	                camera[setting] = options.settings[setting];
	            }
	        }
	        this.cameras.set(id, camera);
	        return camera;
	    };
	    CameraManager.prototype.get = function (id) {
	        return this.cameras.get(id);
	    };
	    CameraManager.toRadians = function (degrees) {
	        return degrees * Math.PI / 180;
	    };
	    CameraManager.toDegrees = function (radians) {
	        return radians * 180 / Math.PI;
	    };
	    CameraManager.CAMERA = {
	        UNIVERSAL: 1,
	        ARC_ROTATE: 2,
	        FREE: 3,
	        FOLLOW: 4,
	        TOUCH: 5,
	        GAMEPAD: 6,
	        DEVICE_ORIENTATION: 7,
	        VIRTUAL_JOYSTICK: 8,
	        ANAGLYPH: 9,
	        VR_DEVICE_ORIENTATION: 10,
	        WEB_VR_FREE: 11,
	    };
	    return CameraManager;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CameraManager;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var babylonjs_1 = __webpack_require__(2);
	var MaterialManager = (function () {
	    function MaterialManager(scene) {
	        this.scene = scene;
	        this.materials = new Map();
	        /* SKY */
	        //this.addSky('tropicalSky', 'TropicalSunnyDay');
	        /* GROUND */
	        this.add('paper', 'paper');
	        /* TERRAIN TYPES */
	        this.add('barren', 'dirt');
	        this.add('plain', 'grass');
	        this.add('desert', 'sand');
	        this.add('mountain', 'stone');
	        this.add('ocean', 'water');
	    }
	    MaterialManager.prototype.add = function (id, filename) {
	        var material = new babylonjs_1.StandardMaterial(id, this.scene);
	        material.diffuseTexture = new babylonjs_1.Texture(__webpack_require__(9)("./" + filename + ".jpg"), this.scene);
	        try {
	            material.bumpTexture = new babylonjs_1.Texture(__webpack_require__(22)("./" + filename + "-bump.jpg"), this.scene);
	        }
	        catch (e) { }
	        material.specularTexture = material.diffuseTexture;
	        material.specularPower = 100;
	        this.materials.set(id, material);
	        return material;
	    };
	    /*
	    public addSky(id: string, filename: string): StandardMaterial {
	        const material = new StandardMaterial(id, this.scene);
	        material.backFaceCulling = false;
	        material.disableLighting = true;
	        material.diffuseColor = new Color3(0, 0, 0);
	        material.specularColor = new Color3(0, 0, 0);
	    material.reflectionTexture = new Texture(require(`../Assets/${filename}`), this.scene);
	    material.reflectionTexture.coordinatesMode = Texture.FIXED_EQUIRECTANGULAR_MODE;
	        material.reflectionTexture = new CubeTexture('', this.scene, null, false, [
	            require(`../Assets/${filename}/${filename}Left.png`),
	            require(`../Assets/${filename}/${filename}Up.png`),
	            require(`../Assets/${filename}/${filename}Front.png`),
	            require(`../Assets/${filename}/${filename}Right.png`),
	            require(`../Assets/${filename}/${filename}Down.png`),
	            require(`../Assets/${filename}/${filename}Back.png`),
	        ]);
	        material.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	        this.materials.set(id, material);
	        return material;
	    }
	    */
	    MaterialManager.prototype.get = function (id) {
	        return this.materials.get(id);
	    };
	    return MaterialManager;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = MaterialManager;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./dirt-bump.jpg": 10,
		"./dirt.jpg": 11,
		"./grass-bump.jpg": 12,
		"./grass.jpg": 13,
		"./map.jpg": 14,
		"./paper.jpg": 15,
		"./sand-bump.jpg": 16,
		"./sand.jpg": 17,
		"./stone-bump.jpg": 18,
		"./stone.jpg": 19,
		"./water-bump.jpg": 20,
		"./water.jpg": 21
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 9;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/dirt-bump.jpg";

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/dirt.jpg";

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/grass-bump.jpg";

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/grass.jpg";

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/map.jpg";

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/paper.jpg";

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/sand-bump.jpg";

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/sand.jpg";

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/stone-bump.jpg";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/stone.jpg";

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/water-bump.jpg";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "assets/water.jpg";

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./dirt-bump.jpg": 10,
		"./grass-bump.jpg": 12,
		"./sand-bump.jpg": 16,
		"./stone-bump.jpg": 18,
		"./water-bump.jpg": 20
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 22;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var babylonjs_1 = __webpack_require__(2);
	var Hexagon_1 = __webpack_require__(4);
	//------------------------------------------------------------------------------------
	// ORIENTATION
	//------------------------------------------------------------------------------------
	var HexagonOrientation = (function () {
	    function HexagonOrientation(f0, f1, f2, f3, b0, b1, b2, b3, startAngle) {
	        this.f0 = f0;
	        this.f1 = f1;
	        this.f2 = f2;
	        this.f3 = f3;
	        this.b0 = b0;
	        this.b1 = b1;
	        this.b2 = b2;
	        this.b3 = b3;
	        this.startAngle = startAngle;
	    }
	    return HexagonOrientation;
	}());
	exports.HexagonOrientation = HexagonOrientation;
	;
	//------------------------------------------------------------------------------------
	// LAYOUT
	//------------------------------------------------------------------------------------
	var HexagonLayout = (function () {
	    function HexagonLayout(orientation, size, origin) {
	        this.orientation = orientation;
	        this.size = size;
	        this.origin = origin;
	    }
	    HexagonLayout.prototype.hexagonToPixel = function (hex, z) {
	        var x = (this.orientation.f0 * hex.q + this.orientation.f1 * hex.r) * this.size.x;
	        var y = (this.orientation.f2 * hex.q + this.orientation.f3 * hex.r) * this.size.y;
	        return new babylonjs_1.Vector3(x + this.origin.x, z, y + this.origin.y);
	    };
	    HexagonLayout.prototype.pixelToHexagon = function (p) {
	        var pt = new babylonjs_1.Vector2((p.x - this.origin.x) / this.size.x, (p.y - this.origin.y) / this.size.y);
	        var q = this.orientation.b0 * pt.x + this.orientation.b1 * pt.y;
	        var r = this.orientation.b2 * pt.x + this.orientation.b3 * pt.y;
	        return new Hexagon_1.default(q, r, -q - r);
	    };
	    HexagonLayout.prototype.cornerOffset = function (corner, z) {
	        var angle = 2.0 * Math.PI * (this.orientation.startAngle + corner) / 6;
	        return new babylonjs_1.Vector3(this.size.x * Math.cos(angle), this.size.y * Math.sin(angle), z);
	    };
	    HexagonLayout.prototype.polygonCorners = function (hex) {
	        var corners = [];
	        var center = this.hexagonToPixel(hex, 0);
	        for (var i = 0; i < 7; i++) {
	            var offset = this.cornerOffset(i, 0);
	            corners.push(new babylonjs_1.Vector3(center.x + offset.x, center.y + offset.y, 0));
	        }
	        return corners;
	    };
	    HexagonLayout.LAYOUT_VERTICAL = new HexagonOrientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
	    HexagonLayout.LAYOUT_HORIZONTAL = new HexagonOrientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);
	    return HexagonLayout;
	}());
	exports.HexagonLayout = HexagonLayout;


/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	var Seed = (function () {
	    function Seed(seed) {
	        this.setSeed(seed);
	    }
	    Seed.prototype.random = function () {
	        return (11 * this.seed + 17) % 25 / 25;
	    };
	    Seed.prototype.getSeed = function () {
	        return this.seed;
	    };
	    Seed.prototype.setSeed = function (seed) {
	        this.seed = this.charsToInt(seed);
	    };
	    Seed.prototype.charsToInt = function (chars) {
	        if (Array.isArray(chars))
	            chars = chars.join('');
	        if (typeof chars === 'number')
	            chars = chars.toString();
	        var int = 0;
	        for (var i = 0; i < chars.length; ++i) {
	            int += chars.charCodeAt(i) || 1;
	        }
	        return int;
	    };
	    return Seed;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Seed;


/***/ }
]);
//# sourceMappingURL=index.js.map