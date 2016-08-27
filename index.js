webpackJsonp([0],[function(e,t,n){"use strict";var i=n(1),r=new i["default"](document.querySelector("canvas#game"));r.onStart(),window.onfocus=r.onResume.bind(r),window.onresize=r.onResize.bind(r),window.onblur=r.onPause.bind(r)},function(e,t,n){"use strict";var i=n(2),r=n(3),o=n(6),s=n(24),a=function(){function e(){}return e}();t.settings=a;var u=function(){function e(e){this.canvas=e,this.settings={seed:new s["default"](Math.random()),difficulty:1,paused:!1,graphics:{quality:5}},this.engine=new i.Engine(this.canvas,(!0)),this.world=new r["default"](this),this.renderer=new o["default"](this,this.world)}return e.prototype.onStart=function(){this.world.onCreate(),this.renderer.onCreate()},e.prototype.onResume=function(){this.settings.paused=!1,this.world.onResume(),this.renderer.onResume()},e.prototype.onResize=function(){this.engine.resize()},e.prototype.onPause=function(){this.settings.paused=!0,this.world.onPause(),this.renderer.onPause()},e.prototype.onQuit=function(){this.world.onDestroy(),this.renderer.onDestroy()},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u},,function(e,t,n){"use strict";var i=n(4),r=n(5),o=function(){function e(e){this.game=e,this.tiles=new Map;for(var t=2,n=-t;n<=t;n++)for(var o=Math.max(-t,-n-t),s=Math.min(t,-n+t),a=o;a<=s;a++){var u=new r["default"](new i["default"](n,a,-n-a));this.tiles.set(u.hexagon.toString(),u)}}return e.prototype.onLoaded=function(){this.onCreate()},e.prototype.onCreate=function(){this.onUpdate()},e.prototype.onResume=function(){this.onUpdate()},e.prototype.onUpdate=function(){},e.prototype.onPause=function(){},e.prototype.onDestroy=function(){},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=o},function(e,t){"use strict";var n=function(){function e(e,t,n){this.q=e,this.r=t,this.s=n,"undefined"==typeof n&&(this.s=n=-e-t),console.assert(e+t+n==0,"Coordinates (Q, R, S) must amount to 0")}return e.prototype.toString=function(){return this.q+"|"+this.r+"|"+this.s},e.prototype.equal=function(e,t){return e.q==t.q&&e.r==t.r&&e.s==t.s},e.prototype.add=function(t,n){return new e(t.q+n.q,t.r+n.r,t.s+n.s)},e.prototype.subtract=function(t,n){return new e(t.q-n.q,t.r-n.r,t.s-n.s)},e.prototype.multiply=function(t,n){return new e(t.q*n,t.r*n,t.s*n)},e.prototype.length=function(e){return(Math.abs(e.q)+Math.abs(e.r)+Math.abs(e.s))/2},e.prototype.distance=function(e,t){return this.length(this.subtract(e,t))},e.prototype.direction=function(e){return t.hexagonDirections[(6+e%6)%6]},e.prototype.neighbor=function(e,t){return this.add(e,this.direction(t))},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n,t.hexagonDirections=[new n(1,0,(-1)),new n(1,(-1),0),new n(0,(-1),1),new n((-1),0,1),new n((-1),1,0),new n(0,1,(-1))]},function(e,t){"use strict";var n=function(){function e(t,n){if(this.hexagon=t,this.type=n,"undefined"==typeof n){var i=Object.keys(e.TYPES);this.type=e.TYPES[i[i.length*Math.random()<<0]]}}return e.TYPES={BARREN:"barren",PLAIN:"plain",DESERT:"desert",OCEAN:"ocean",MOUNTAIN:"mountain"},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n},function(e,t,n){"use strict";var i=n(2),r=n(7),o=n(8),s=n(23),a=function(){function e(e,t){var n=this;this.game=e,this.world=t,this.scene=new i.Scene(this.game.engine),this.scene.clearColor=new i.Color3(.9,.87,.85),this.cameraManager=new r["default"](this.scene),this.materialManager=new o["default"](this.scene),this.mainCamera=this.cameraManager.get("main"),this.mainCamera.setTarget(i.Vector3.Zero()),this.mainCamera.attachControl(this.game.canvas,!1,!1);var a=new i.DirectionalLight("dir01",new i.Vector3((-1),(-2),(-1)),this.scene);a.position=new i.Vector3(20,40,20),a.intensity=.7;var u=new i.HemisphericLight("ambientLight",new i.Vector3(0,1,0),this.scene);u.diffuse=new i.Color3(1,1,1),u.specular=new i.Color3(1,1,1),u.groundColor=new i.Color3(0,0,0),u.intensity=.5,this.scene.fogMode=i.Scene.FOGMODE_LINEAR,this.scene.fogColor=new i.Color3(.9,.87,.85),this.scene.fogStart=10,this.scene.fogEnd=15;var c=i.Mesh.CreateGround("ground",100,100,2,this.scene);c.material=this.materialManager.get("paper"),c.receiveShadows=!0,this.layout=new s.HexagonLayout(s.HexagonLayout.LAYOUT_HORIZONTAL,new i.Vector2(.5,.5),new i.Vector3(0,0,0)),this.meshes=[];var p={};this.world.tiles.forEach(function(e,t){var r;e.type in p?r=p[e.type].createInstance("tile-"+t):(r=i.MeshBuilder.CreateCylinder("tile-"+t,{height:.05,diameter:.95,tessellation:6,faceUV:[new i.Vector4(0,0,0,0),new i.Vector4(0,0,6,.1),new i.Vector4(0,0,1,1)]},n.scene),r.rotation=new i.Vector3(0,Math.PI/3,0),r.material=n.materialManager.get(e.type),p[e.type]=r),r.position=n.layout.hexagonToPixel(e.hexagon,.025),r.elevated=!1,r.actionManager=new i.ActionManager(n.scene),r.actionManager.registerAction(new i.InterpolateValueAction(i.ActionManager.OnPickTrigger,r,"position.y",r.elevated?.025:.125,250)).then(new i.SwitchBooleanAction(i.ActionManager.NothingTrigger,r,"elevated")),n.meshes.push(r)},this);var h=new i.ShadowGenerator(1024,a);h.useBlurVarianceShadowMap=!0,h.getShadowMap().renderList=h.getShadowMap().renderList.concat(this.meshes)}return e.prototype.onLoaded=function(){this.onCreate()},e.prototype.onCreate=function(){this.game.engine.runRenderLoop(this.onUpdate.bind(this))},e.prototype.onResume=function(){this.game.engine.runRenderLoop(this.onUpdate.bind(this))},e.prototype.onUpdate=function(){this.scene.render(),this.mainCamera.panningSensibility=100*(this.mainCamera.upperRadiusLimit/this.mainCamera.radius)},e.prototype.onPause=function(){this.game.engine.stopRenderLoop()},e.prototype.onDestroy=function(){},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a},function(e,t,n){"use strict";var i=n(2),r=function(){function e(t){this.scene=t,this.cameras=new Map,this.add("main",e.CAMERA.ARC_ROTATE,{alpha:e.toRadians(360),beta:e.toRadians(40),radius:5,position:i.Vector3.Zero(),settings:{lowerRadiusLimit:3,upperRadiusLimit:10,lowerAlphaLimit:e.toRadians(360),upperAlphaLimit:e.toRadians(360),lowerBetaLimit:e.toRadians(30),upperBetaLimit:e.toRadians(65),panningAxis:new i.Vector3(1,0,1),inertia:.5}})}return e.prototype.add=function(t,n,r){var o;switch(n){case e.CAMERA.ARC_ROTATE:o=new i.ArcRotateCamera(t,r.alpha,r.beta,r.radius,r.position,this.scene);break;case e.CAMERA.UNIVERSAL:}for(var s in r.settings)r.settings.hasOwnProperty(s)&&(o[s]=r.settings[s]);return this.cameras.set(t,o),o},e.prototype.get=function(e){return this.cameras.get(e)},e.toRadians=function(e){return e*Math.PI/180},e.toDegrees=function(e){return 180*e/Math.PI},e.CAMERA={UNIVERSAL:1,ARC_ROTATE:2,FREE:3,FOLLOW:4,TOUCH:5,GAMEPAD:6,DEVICE_ORIENTATION:7,VIRTUAL_JOYSTICK:8,ANAGLYPH:9,VR_DEVICE_ORIENTATION:10,WEB_VR_FREE:11},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r},function(e,t,n){"use strict";var i=n(2),r=function(){function e(e){this.scene=e,this.materials=new Map;this.add("paper","paper",[30,30]);this.add("barren","dirt"),this.add("plain","grass"),this.add("desert","sand"),this.add("mountain","stone"),this.add("ocean","water")}return e.prototype.add=function(e,t,r){var o=new i.StandardMaterial(e,this.scene);try{o.diffuseTexture=new i.Texture(n(9)("./"+t+".jpg"),this.scene),"undefined"!=typeof r&&(o.diffuseTexture.uScale=r[0],o.diffuseTexture.vScale=r[1]),o.bumpTexture=new i.Texture(n(22)("./"+t+"-bump.jpg"),this.scene),"undefined"!=typeof r&&(o.bumpTexture.uScale=r[0],o.bumpTexture.vScale=r[1])}catch(s){}return o.specularTexture=o.diffuseTexture,o.specularPower=100,this.materials.set(e,o),o},e.prototype.get=function(e){return this.materials.get(e)},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r},function(e,t,n){function i(e){return n(r(e))}function r(e){return o[e]||function(){throw new Error("Cannot find module '"+e+"'.")}()}var o={"./dirt-bump.jpg":10,"./dirt.jpg":11,"./grass-bump.jpg":12,"./grass.jpg":13,"./map.jpg":14,"./paper.jpg":15,"./sand-bump.jpg":16,"./sand.jpg":17,"./stone-bump.jpg":18,"./stone.jpg":19,"./water-bump.jpg":20,"./water.jpg":21};i.keys=function(){return Object.keys(o)},i.resolve=r,e.exports=i,i.id=9},function(e,t,n){e.exports=n.p+"assets/8f0ec2e5bbdff4495bd61b65069d22d6.jpg"},function(e,t,n){e.exports=n.p+"assets/e98b24a60a97417619038f7565ca4c11.jpg"},function(e,t,n){e.exports=n.p+"assets/49c89819377911c6ac5b7547c6d32b4e.jpg"},function(e,t,n){e.exports=n.p+"assets/143f1a1cb244054c2738b46002361689.jpg"},function(e,t,n){e.exports=n.p+"assets/9f1b2196d444176ac60168dc87ec6dfc.jpg"},function(e,t,n){e.exports=n.p+"assets/1adf283ac9ae19afe70f836f25be7469.jpg"},function(e,t,n){e.exports=n.p+"assets/d1f406107310717c69f9375a19b0e7b9.jpg"},function(e,t,n){e.exports=n.p+"assets/e5aa0948e1daf355b704ab92bff04260.jpg"},function(e,t,n){e.exports=n.p+"assets/2febf488ce022ab71acad755cd071a49.jpg"},function(e,t,n){e.exports=n.p+"assets/e7be81d52a60e369f441aa77be805a63.jpg"},function(e,t,n){e.exports=n.p+"assets/282b2f447c5ac6c01573e69d071b443a.jpg"},function(e,t,n){e.exports=n.p+"assets/b2a7ff19e806f6ac7b3a7a1c13331062.jpg"},function(e,t,n){function i(e){return n(r(e))}function r(e){return o[e]||function(){throw new Error("Cannot find module '"+e+"'.")}()}var o={"./dirt-bump.jpg":10,"./grass-bump.jpg":12,"./sand-bump.jpg":16,"./stone-bump.jpg":18,"./water-bump.jpg":20};i.keys=function(){return Object.keys(o)},i.resolve=r,e.exports=i,i.id=22},function(e,t,n){"use strict";var i=n(2),r=n(4),o=function(){function e(e,t,n,i,r,o,s,a,u){this.f0=e,this.f1=t,this.f2=n,this.f3=i,this.b0=r,this.b1=o,this.b2=s,this.b3=a,this.startAngle=u}return e}();t.HexagonOrientation=o;var s=function(){function e(e,t,n){this.orientation=e,this.size=t,this.origin=n}return e.prototype.hexagonToPixel=function(e,t){var n=(this.orientation.f0*e.q+this.orientation.f1*e.r)*this.size.x,r=(this.orientation.f2*e.q+this.orientation.f3*e.r)*this.size.y;return new i.Vector3(n+this.origin.x,t,r+this.origin.y)},e.prototype.pixelToHexagon=function(e){var t=new i.Vector2((e.x-this.origin.x)/this.size.x,(e.y-this.origin.y)/this.size.y),n=this.orientation.b0*t.x+this.orientation.b1*t.y,o=this.orientation.b2*t.x+this.orientation.b3*t.y;return new r["default"](n,o,-n-o)},e.prototype.cornerOffset=function(e,t){var n=2*Math.PI*(this.orientation.startAngle+e)/6;return new i.Vector3(this.size.x*Math.cos(n),this.size.y*Math.sin(n),t)},e.prototype.polygonCorners=function(e){for(var t=[],n=this.hexagonToPixel(e,0),r=0;r<7;r++){var o=this.cornerOffset(r,0);t.push(new i.Vector3(n.x+o.x,n.y+o.y,0))}return t},e.LAYOUT_VERTICAL=new o(Math.sqrt(3),Math.sqrt(3)/2,0,1.5,Math.sqrt(3)/3,-1/3,0,2/3,.5),e.LAYOUT_HORIZONTAL=new o(1.5,0,Math.sqrt(3)/2,Math.sqrt(3),2/3,0,-1/3,Math.sqrt(3)/3,0),e}();t.HexagonLayout=s},function(e,t){"use strict";var n=function(){function e(e){this.setSeed(e)}return e.prototype.random=function(){return(11*this.seed+17)%25/25},e.prototype.getSeed=function(){return this.seed},e.prototype.setSeed=function(e){this.seed=this.charsToInt(e)},e.prototype.charsToInt=function(e){Array.isArray(e)&&(e=e.join("")),"number"==typeof e&&(e=e.toString());for(var t=0,n=0;n<e.length;++n)t+=e.charCodeAt(n)||1;return t},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n}]);