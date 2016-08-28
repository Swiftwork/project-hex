webpackJsonp([0],[function(e,t,n){"use strict";var i=n(1),r=new i["default"](document.querySelector("canvas#game"));r.onStart(),window.onfocus=r.onResume.bind(r),window.onresize=r.onResize.bind(r),window.onblur=r.onPause.bind(r)},function(e,t,n){"use strict";var i=n(2),r=n(3),s=n(7),o=n(25),a=function(){function e(){}return e}();t.settings=a;var u=function(){function e(e){this.canvas=e,this.settings={seed:new o["default"](Math.random()),difficulty:1,paused:!1,graphics:{quality:5}},this.engine=new i.Engine(this.canvas,(!0)),this.world=new r["default"](this),this.renderer=new s["default"](this,this.world)}return e.prototype.onStart=function(){this.world.onCreate(),this.renderer.onCreate()},e.prototype.onResume=function(){this.settings.paused=!1,this.world.onResume(),this.renderer.onResume()},e.prototype.onResize=function(){this.engine.resize()},e.prototype.onPause=function(){this.settings.paused=!0,this.world.onPause(),this.renderer.onPause()},e.prototype.onQuit=function(){this.world.onDestroy(),this.renderer.onDestroy()},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u},,function(e,t,n){"use strict";var i=n(2),r=n(4),s=n(5),o=n(6),a=function(){function e(e){this.game=e,this.tiles=new Map,this.layout=new o.HexagonLayout(o.HexagonLayout.LAYOUT_HORIZONTAL,new i.Vector2(.5,.5),new i.Vector3(0,0,0));for(var t=4,n=2,a=-t;a<=t;a++)for(var u=Math.max(-t,-a-t),c=Math.min(t,-a+t),h=u;h<=c;h++){var p=new s["default"](new r["default"](a,h,-a-h));p.hexagon.distance(new r["default"](0,0,0))<=n&&(p.explored=!0),this.tiles.set(p.hexagon.toString(),p)}}return e.prototype.onCreate=function(){this.onUpdate()},e.prototype.onResume=function(){this.onUpdate()},e.prototype.onUpdate=function(){},e.prototype.onPause=function(){},e.prototype.onDestroy=function(){},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a},function(e,t){"use strict";var n=function(){function e(e,t,n){this.q=e,this.r=t,this.s=n,"undefined"==typeof n&&(this.s=n=-e-t),console.assert(e+t+n==0,"Coordinates (Q, R, S) must amount to 0")}return e.prototype.toString=function(){return this.q+"|"+this.r+"|"+this.s},e.prototype.equal=function(e){return this.q==e.q&&this.r==e.r&&this.s==e.s},e.prototype.add=function(t){return new e(this.q+t.q,this.r+t.r,this.s+t.s)},e.prototype.subtract=function(t){return new e(this.q-t.q,this.r-t.r,this.s-t.s)},e.prototype.multiply=function(t){return new e(this.q*t.q,this.r*t.r,this.s*t.s)},e.prototype.scale=function(t){return new e(this.q*t,this.r*t,this.s*t)},e.prototype.distance=function(e){var t=this.subtract(e);return(Math.abs(t.q)+Math.abs(t.r)+Math.abs(t.s))/2},e.prototype.neighbor=function(e){return t.hexagonDirections[(6+e%6)%6]},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n,t.hexagonDirections=[new n(1,0,(-1)),new n(1,(-1),0),new n(0,(-1),1),new n((-1),0,1),new n((-1),1,0),new n(0,1,(-1))]},function(e,t){"use strict";var n=function(){function e(t,n){if(this.hexagon=t,this.type=n,this.explored=!1,"undefined"==typeof n){var i=Object.keys(e.TYPES);this.type=e.TYPES[i[i.length*Math.random()<<0]]}}return e.TYPES={BARREN:"barren",PLAIN:"plain",DESERT:"desert",OCEAN:"ocean",MOUNTAIN:"mountain"},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n},function(e,t,n){"use strict";var i=n(2),r=n(4),s=function(){function e(e,t,n,i,r,s,o,a,u){this.f0=e,this.f1=t,this.f2=n,this.f3=i,this.b0=r,this.b1=s,this.b2=o,this.b3=a,this.startAngle=u}return e}();t.HexagonOrientation=s;var o=function(){function e(e,t,n){this.orientation=e,this.size=t,this.origin=n}return e.prototype.hexagonToPixel=function(e,t){var n=(this.orientation.f0*e.q+this.orientation.f1*e.r)*this.size.x,r=(this.orientation.f2*e.q+this.orientation.f3*e.r)*this.size.y;return new i.Vector3(n+this.origin.x,t,r+this.origin.y)},e.prototype.pixelToHexagon=function(e){var t=new i.Vector2((e.x-this.origin.x)/this.size.x,(e.y-this.origin.y)/this.size.y),n=this.orientation.b0*t.x+this.orientation.b1*t.y,s=this.orientation.b2*t.x+this.orientation.b3*t.y;return new r["default"](n,s,-n-s)},e.prototype.cornerOffset=function(e,t){var n=2*Math.PI*(this.orientation.startAngle+e)/6;return new i.Vector3(this.size.x*Math.cos(n),this.size.y*Math.sin(n),t)},e.prototype.polygonCorners=function(e){for(var t=[],n=this.hexagonToPixel(e,0),r=0;r<7;r++){var s=this.cornerOffset(r,0);t.push(new i.Vector3(n.x+s.x,n.y+s.y,0))}return t},e.LAYOUT_VERTICAL=new s(Math.sqrt(3),Math.sqrt(3)/2,0,1.5,Math.sqrt(3)/3,-1/3,0,2/3,.5),e.LAYOUT_HORIZONTAL=new s(1.5,0,Math.sqrt(3)/2,Math.sqrt(3),2/3,0,-1/3,Math.sqrt(3)/3,0),e}();t.HexagonLayout=o},function(e,t,n){"use strict";var i=n(2),r=n(8),s=n(9),o=n(10),a=function(){function e(e,t){var n=this;this.game=e,this.world=t,this.scene=new i.Scene(this.game.engine),this.scene.clearColor=new i.Color3(.9,.87,.85),this.scene.fogColor=new i.Color3(.9,.87,.85),this.scene.fogMode=i.Scene.FOGMODE_LINEAR,this.scene.fogStart=10,this.scene.fogEnd=15,this.cameraManager=new r["default"](this.scene),this.lightManager=new s["default"](this.scene),this.materialManager=new o["default"](this.scene),this.mainCamera=this.cameraManager.get("main"),this.mainCamera.setTarget(i.Vector3.Zero()),this.mainCamera.attachControl(this.game.canvas,!1,!1),this.meshes=[],this.scene.actionManager=new i.ActionManager(this.scene),this.scene.actionManager.registerAction(new i.ExecuteCodeAction(i.ActionManager.OnKeyDownTrigger,function(e){192===e.sourceEvent.keyCode&&(n.scene.debugLayer.isVisible()?n.scene.debugLayer.hide():n.scene.debugLayer.show())}))}return e.prototype.onCreate=function(){this.createGround(),this.createTiles();var e=this.lightManager.get("sunLight"),t=new i.ShadowGenerator(1024,e);t.useBlurVarianceShadowMap=!0,t.getShadowMap().renderList=t.getShadowMap().renderList.concat(this.meshes),this.game.engine.runRenderLoop(this.onUpdate.bind(this))},e.prototype.onResume=function(){this.game.engine.runRenderLoop(this.onUpdate.bind(this))},e.prototype.onUpdate=function(){this.scene.render(),this.mainCamera.panningSensibility=100*(this.mainCamera.upperRadiusLimit/this.mainCamera.radius)},e.prototype.onPause=function(){this.game.engine.stopRenderLoop()},e.prototype.onDestroy=function(){},e.prototype.createGround=function(){var e=i.Mesh.CreateGround("ground",100,100,2,this.scene);e.material=this.materialManager.get("paper"),e.receiveShadows=!0},e.prototype.createTiles=function(){var e=this,t=i.MeshBuilder.CreateCylinder("tile-unexplored",{height:.05,diameter:2*this.world.layout.size.x-.05,tessellation:6},this.scene);t.visibility=.4,this.world.tiles.forEach(function(n,r){var s;n.explored?(s=i.MeshBuilder.CreateCylinder("tile-"+r,{height:.05,diameter:2*e.world.layout.size.x-.05,tessellation:6,faceUV:[new i.Vector4(0,0,0,0),new i.Vector4(0,0,6,.1),new i.Vector4(0,0,1,1)]},e.scene),s.material=e.materialManager.get(n.type),s.edgesWidth=2,s.edgesColor=new i.Color4(.5,0,.5,1),s.actionManager=new i.ActionManager(e.scene),s.actionManager.registerAction(new i.ExecuteCodeAction(i.ActionManager.OnPickTrigger,function(){s.enableEdgesRendering(1)})),e.meshes.push(s)):s=t.createInstance("tile-"+r),s.position=e.world.layout.hexagonToPixel(n.hexagon,.025),s.rotation=new i.Vector3(0,Math.PI/3,0)},this)},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a},function(e,t,n){"use strict";var i=n(2),r=function(){function e(t){this.scene=t,this.cameras=new Map,this.add("main",e.CAMERA.ARC_ROTATE,{alpha:e.toRadians(360),beta:e.toRadians(40),radius:5,position:i.Vector3.Zero(),settings:{lowerRadiusLimit:3,upperRadiusLimit:10,lowerAlphaLimit:e.toRadians(360),upperAlphaLimit:e.toRadians(360),lowerBetaLimit:e.toRadians(30),upperBetaLimit:e.toRadians(65),panningAxis:new i.Vector3(1,0,1),inertia:.5}})}return e.prototype.add=function(t,n,r){var s;switch(n){case e.CAMERA.ARC_ROTATE:s=new i.ArcRotateCamera(t,r.alpha,r.beta,r.radius,r.position,this.scene);break;case e.CAMERA.UNIVERSAL:}for(var o in r.settings)r.settings.hasOwnProperty(o)&&(s[o]=r.settings[o]);return this.cameras.set(t,s),s},e.prototype.get=function(e){return this.cameras.get(e)},e.toRadians=function(e){return e*Math.PI/180},e.toDegrees=function(e){return 180*e/Math.PI},e.CAMERA={UNIVERSAL:1,ARC_ROTATE:2,FREE:3,FOLLOW:4,TOUCH:5,GAMEPAD:6,DEVICE_ORIENTATION:7,VIRTUAL_JOYSTICK:8,ANAGLYPH:9,VR_DEVICE_ORIENTATION:10,WEB_VR_FREE:11},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r},function(e,t,n){"use strict";var i=n(2),r=function(){function e(t){this.scene=t,this.lights=new Map,this.add("sunLight",e.LIGHT.DIRECTIONAL,new i.Vector3(2,(-4),2),new i.Vector3((-20),40,(-20)),{intensity:1}),this.add("ambientLight",e.LIGHT.HEMISPHERIC,new i.Vector3(0,1,0),new i.Vector3(0,0,0),{intensity:.5,diffuse:new i.Color3(1,1,1),specular:new i.Color3(1,1,1),groundColor:new i.Color3(0,0,0)})}return e.prototype.add=function(t,n,r,s,o){var a;switch(n){case e.LIGHT.DIRECTIONAL:a=new i.DirectionalLight(t,r,this.scene);break;case e.LIGHT.HEMISPHERIC:a=new i.HemisphericLight(t,r,this.scene);break;case e.LIGHT.POINT:}a.position=s;for(var u in o)o.hasOwnProperty(u)&&(a[u]=o[u]);return this.lights.set(t,a),a},e.prototype.get=function(e){return this.lights.get(e)},e.LIGHT={POINT:1,DIRECTIONAL:2,SPOT:3,HEMISPHERIC:4},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r},function(e,t,n){"use strict";var i=n(2),r=function(){function e(e){this.scene=e,this.materials=new Map,this.add("paper","paper",[30,30]),this.add("barren","dirt"),this.add("plain","grass"),this.add("desert","sand"),this.add("mountain","stone"),this.add("ocean","water")}return e.prototype.add=function(e,t,r){var s=new i.StandardMaterial(e,this.scene);try{s.diffuseTexture=new i.Texture(n(11)("./"+t+".jpg"),this.scene),"undefined"!=typeof r&&(s.diffuseTexture.uScale=r[0],s.diffuseTexture.vScale=r[1]),s.bumpTexture=new i.Texture(n(24)("./"+t+"-bump.jpg"),this.scene),"undefined"!=typeof r&&(s.bumpTexture.uScale=r[0],s.bumpTexture.vScale=r[1])}catch(o){}return s.specularTexture=s.diffuseTexture,s.specularPower=100,this.materials.set(e,s),s},e.prototype.get=function(e){return this.materials.get(e)},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=r},function(e,t,n){function i(e){return n(r(e))}function r(e){return s[e]||function(){throw new Error("Cannot find module '"+e+"'.")}()}var s={"./dirt-bump.jpg":12,"./dirt.jpg":13,"./grass-bump.jpg":14,"./grass.jpg":15,"./map.jpg":16,"./paper.jpg":17,"./sand-bump.jpg":18,"./sand.jpg":19,"./stone-bump.jpg":20,"./stone.jpg":21,"./water-bump.jpg":22,"./water.jpg":23};i.keys=function(){return Object.keys(s)},i.resolve=r,e.exports=i,i.id=11},function(e,t,n){e.exports=n.p+"assets/8f0ec2e5bbdff4495bd61b65069d22d6.jpg"},function(e,t,n){e.exports=n.p+"assets/e98b24a60a97417619038f7565ca4c11.jpg"},function(e,t,n){e.exports=n.p+"assets/49c89819377911c6ac5b7547c6d32b4e.jpg"},function(e,t,n){e.exports=n.p+"assets/143f1a1cb244054c2738b46002361689.jpg"},function(e,t,n){e.exports=n.p+"assets/9f1b2196d444176ac60168dc87ec6dfc.jpg"},function(e,t,n){e.exports=n.p+"assets/1adf283ac9ae19afe70f836f25be7469.jpg"},function(e,t,n){e.exports=n.p+"assets/d1f406107310717c69f9375a19b0e7b9.jpg"},function(e,t,n){e.exports=n.p+"assets/e5aa0948e1daf355b704ab92bff04260.jpg"},function(e,t,n){e.exports=n.p+"assets/2febf488ce022ab71acad755cd071a49.jpg"},function(e,t,n){e.exports=n.p+"assets/e7be81d52a60e369f441aa77be805a63.jpg"},function(e,t,n){e.exports=n.p+"assets/282b2f447c5ac6c01573e69d071b443a.jpg"},function(e,t,n){e.exports=n.p+"assets/b2a7ff19e806f6ac7b3a7a1c13331062.jpg"},function(e,t,n){function i(e){return n(r(e))}function r(e){return s[e]||function(){throw new Error("Cannot find module '"+e+"'.")}()}var s={"./dirt-bump.jpg":12,"./grass-bump.jpg":14,"./sand-bump.jpg":18,"./stone-bump.jpg":20,"./water-bump.jpg":22};i.keys=function(){return Object.keys(s)},i.resolve=r,e.exports=i,i.id=24},function(e,t){"use strict";var n=function(){function e(e){this.setSeed(e)}return e.prototype.random=function(){return(11*this.seed+17)%25/25},e.prototype.getSeed=function(){return this.seed},e.prototype.setSeed=function(e){this.seed=this.charsToInt(e)},e.prototype.charsToInt=function(e){Array.isArray(e)&&(e=e.join("")),"number"==typeof e&&(e=e.toString());for(var t=0,n=0;n<e.length;++n)t+=e.charCodeAt(n)||1;return t},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=n}]);