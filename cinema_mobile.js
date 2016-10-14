$.ajax({
  type: "GET",
  url: "js/three.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/Stats.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/Octree.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/MTLLoader.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/OBJMTLLoader.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/JSONLoader.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/Tween.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/StereoEffect.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/threex.videotexture.js",
  dataType: "script",
  async: false
});

$.ajax({
  type: "GET",
  url: "js/vreticle.js",
  dataType: "script",
  async: false
});

var isDrag = false;

// TEXTURES
var loader = new THREE.TextureLoader();

var texturaCadeira = loader.load('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_vermelho_small.jpg');

var texturaCadeiraSelect = loader.load('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_amarelo_small.jpg');

var texturaCadeiraHighlight = loader.load('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_amarelo_small.jpg');

var texturaCadeiraOcupada = loader.load('models/Cinema_Motta/Cadeira_Nova/cadeira_Tex_ocupada.jpg');

var texturaCadeiraDeficiente = loader.load('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_azul_small.jpg');

var texturaCadeiraNormalMap = loader.load('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Normals_small.jpg');

texturaCadeiraNormalMap.minFilter = THREE.LinearFilter;

var texturaBracoNormalMap = loader.load('models/Cinema_Motta/Braco_Novo/BracoCadeira_Normal_small.jpg');

var texturaBraco = loader.load('models/Cinema_Motta/Braco_Novo/BracoCadeira_Diffuse_small.jpg');

var eyeTexture = loader.load('models/Cinema_Motta/eye-icon.png');

var video = document.getElementById( 'video' );
textureVideo = new THREE.VideoTexture( video );
textureVideo.minFilter = THREE.LinearFilter;
textureVideo.magFilter = THREE.LinearFilter;
textureVideo.format = THREE.RGBFormat;

// BOOLEANS

var sittingDown = false; //if the user has clicked on a chair (e.g. is sitting down)

var insideHelp = true;

var isLoading = true; // if the scene is loading


var mouseIsOnMenu = false; // if the mouse is over the menu

var mouseIsOutOfDocument = false; // if the mouse is over the menu

var isPerspectiveOrtho = false; // if we are in 2D perspective

var isVR = false; // if we are in VR view

var sittingDownOrtho = false; //if the user has clicked on a chair and before was orthographic (e.g. is sitting down)

var lastCameraPositionBeforeTween;

var lastControlsLat;

var lastControlsLon;

// 3D SCENE

var controls;

var loaderJSON = new THREE.JSONLoader();

var clock = new THREE.Clock();

var container;

var camera, scene, renderer, renderVR, vr;

var spriteEyeModel = new THREE.Mesh();

// STATISTICS (FPS, MS, MB)
var statsFPS = new Stats();

var firstTimeRunning = true;
var firstTimeLoading = true;
var firstTimeInit = true;

var mapplay = new THREE.TextureLoader().load( "img/play.png" );
var materialplay = new THREE.SpriteMaterial( { map: mapplay, color: 0xffffff, fog: true } );
var spriteplay = new THREE.Sprite( materialplay );

// RAYCASTING

// we are using an octree for increasing the performance on raycasting
var octree = new THREE.Octree( {
  undeferred: true,
  depthMax: 310,
  objectsThreshold: 8,
  overlapPct: 0.15
} );

var intersected; // to know if an object was intersected by a ray

// 3D OBJECT ARRAYS

var chairGroup = new THREE.Object3D(); // the array where we add all the instances of chairs, to then raycast and select

var loaderMesh = new THREE.Mesh(); // the mesh that appears on loading

var selectedChairs = new Array(); // an array that keeps the selected chairs
var spriteEyeArray = new Array(); // an array that keeps the floating eye icons
var cadeirasJSON; // an array that keeps the info about the chairs that we retrieve from the DB

// MENU VARIABLES

var isLoadOcup = false;
var isLoadingInfo = true;
var num_sessao = "0";

var deviceOrientationSelectedObject;
var deviceOrientationSelectedPoint;

// RANDOM

var screenReferenceSphere; // the sphere (invisible) located in the middle of the screen, to lookAt

var video; // the video canvas
var plane; // the video screen


// create the material
var materialcadeiraMobileHighlight = new THREE.MeshBasicMaterial( {
  map: texturaCadeiraHighlight
});

// create the material
var materialcadeiraMobile = new THREE.MeshBasicMaterial( {
  map: texturaCadeira
});

// create the material
var materialcadeiraDeficienteMobile = new THREE.MeshBasicMaterial( {
  map: texturaCadeiraDeficiente,
});

// create the material
var materialcadeiraOcupadaMobile = new THREE.MeshBasicMaterial( {
  map: texturaCadeiraOcupada,
});

// Create a new audio context.
var sound = {};
var ctx = new AudioContext();

function loadWebAudio()
{
  // Detect if the audio context is supported.
  window.AudioContext = (
    window.AudioContext ||
    window.webkitAudioContext ||
    null
  );

  if (!AudioContext) {
    throw new Error("AudioContext not supported!");
  }

  // Create an object with a sound source and a volume control.
  sound.source = ctx.createBufferSource();
  sound.volume = ctx.createGain();

  // Load a sound file using an ArrayBuffer XMLHttpRequest.
  var request = new XMLHttpRequest();
  request.open("GET", "video/pushshowreel.mp3", true);
  request.responseType = "arraybuffer";
  request.onload = function(e) {

    // Create a buffer from the response ArrayBuffer.
    ctx.decodeAudioData(this.response, function onSuccess(buffer) {
      sound.buffer = buffer;

      // Make the sound source use the buffer and start playing it.
      sound.source.buffer = sound.buffer;
    }, function onFailure() {
      alert("Decoding the audio buffer failed");
    });
  };
  request.send();

  sound.panner = ctx.createPanner();

  sound.source.connect(sound.panner);
  sound.panner.connect(ctx.destination);

  sound.panner.panningModel = 'equalpower';
  sound.panner.refDistance = 0.1;
  sound.panner.maxDistance = 10000;
  sound.panner.rolloffFactor = 1;
  sound.panner.coneInnerAngle = 0;
  sound.panner.coneOuterAngle = 45;
  sound.panner.coneOuterGain = 1;

  var p = new THREE.Vector3();
  p.setFromMatrixPosition(screenReferenceSphere.matrixWorld);

  // And copy the position over to the sound of the object.
  sound.panner.setPosition(p.x, p.y, p.z);

  var vec = new THREE.Vector3(0,0,1);
  var m = screenReferenceSphere.matrixWorld;

  // Save the translation column and zero it.
  var mx = m.elements[12], my = m.elements[13], mz = m.elements[14];
  m.elements[12] = m.elements[13] = m.elements[14] = 0;

  // Multiply the 0,0,1 vector by the world matrix and normalize the result.
  vec.applyProjection(m);
  vec.normalize();

  sound.panner.setOrientation(vec.x, vec.y, vec.z);
}

// STRUCTURAL / DOM / RENDERER

renderer = new THREE.WebGLRenderer({ precision: "highp", antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );
element = renderer.domElement;
container = document.body;
container.appendChild(element);

// Load the initial scenes

if(firstTimeRunning){
  carregarJSONBDInitial(0);
  firstTimeRunning = false;
}

mainScene = new THREE.Scene();
startLoadingScene();

//
// LOADING MANAGERS
//
// check if all the models were loaded
THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
  if(loaded == total && firstTimeLoading)
  {
    firstTimeLoading = false;
    $('#loadingDiv').hide();
    init();
  }
};

// if all models were loaded successfully
THREE.DefaultLoadingManager.onLoad = function () {
  ('all items loaded');
};

// if there was an error loading the models
THREE.DefaultLoadingManager.onError = function () {
  ('there has been an error');
};

var rtParameters = {
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	format: THREE.RGBFormat,
	stencilBuffer: true
};

var rtWidth  = window.innerWidth / 2;
var rtHeight = window.innerHeight / 2;

//
// This method shows the loading scene, while the items are not loaded
//
function startLoadingScene() {
  loadingScene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10);
  camera.position.set(0, 0, 7);
  camera.lookAt(loadingScene.position);

  currentScene = loadingScene;

  var loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = " loading ... ";
  loadingDiv.style.position = "absolute";
  loadingDiv.style.width = "100%";
  loadingDiv.style.textAlign = "center";
  loadingDiv.id = "loadingDiv";
  loadingDiv.style.fontFamily = "osr";
  loadingDiv.style.color = "#FFF";
  loadingDiv.style.top = '65%';
  loadingDiv.style.fontSize = "24px";
  document.body.appendChild(loadingDiv);

  loadingDiv.style.animation = "coloranimLoading 1.5s infinite";
  loadingDiv.style.webkitAnimation = "coloranimLoading 1.5s infinite";

  loader = new THREE.JSONLoader();
  loader.load( "models/cadeiraloading.js", function( geometry,materials ) {

    material1 = new THREE.MeshPhongMaterial();
    material1.map = materials[0].map;
    material1.normalMap = texturaCadeiraNormalMap;
    materials[0] = material1;

    material2 = new THREE.MeshPhongMaterial();
    material2.map = materials[1].map;
    material2.normalMap = texturaBracoNormalMap;
    materials[1] = material2;

    material3 = new THREE.MeshPhongMaterial();
    material3.map = materials[2].map;
    material3.normalMap = texturaBracoNormalMap;
    materials[2] = material3;

    loaderMesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );

    loadingScene.add(loaderMesh);

  });

}

//
// Here we initialise all the needed variables, like the stats, camera, and controls
//

function fullscreen() {
  if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

THREE.DeviceOrientationControls = function ( object ) {

  var scope = this;

  var firstAlpha;
  var firstIn = false;
  var entrouOri = false;

  this.object = object;

  this.object.rotation.reorder( "YXZ" );

  this.freeze = true;

  this.deviceOrientation = {};

  this.screenOrientation = 0;
  var iDivOri = document.createElement('div');
  iDivOri.style.width = '100%';
  iDivOri.style.cursor = "pointer";
  iDivOri.style.textAlign = "center";
  iDivOri.style.height = '100%';
  iDivOri.style.position = "absolute";
  iDivOri.style.background = 'rgba(0,0,0,1)';
  iDivOri.id = 'loadedScreenOri';
  iDivOri.style.top = '0';
  iDivOri.style.display = "none";

  var textDivOri = document.createElement('div');
  textDivOri.style.color = "white";
  textDivOri.style.cursor = "pointer";
  textDivOri.innerHTML = " Rotate phone";
  textDivOri.style.width = '50%';
  textDivOri.style.textAlign = "center";
  textDivOri.style.fontFamily = "osb";
  textDivOri.style.height = '100%';
  textDivOri.style.position = "absolute";
  textDivOri.id = 'textScreenOri';
  textDivOri.style.left = '24%';
  textDivOri.style.top = '30%';

  iDivOri.appendChild(textDivOri);
  document.body.appendChild(iDivOri);
  var onDeviceOrientationChangeEvent = function ( event ) {
    scope.deviceOrientation = event;
    if(!firstIn)
    {
      firstAlpha = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) : 90;
      firstIn = true;
    }
    if(!sittingDown && isVR)
    {
      var mouse2 = new THREE.Vector2();
      mouse2.x = 2 * ((window.innerWidth/2) / window.innerWidth) - 1;
      mouse2.y = 1 - 2 * ((window.innerHeight/2) / window.innerHeight);
      // normal raycasting variables
      var intersectedOne = false;
      var intersectedObject = new THREE.Object3D();

      var raycaster = new THREE.Raycaster();

      var intersections;



      // search the raycasted objects in the octree
      octreeObjects = octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction );

      intersections = raycaster.intersectOctreeObjects( octreeObjects );

      var spriteFound = false;

      // for each of the intersected objects
      for(var i=0; i<intersections.length; i++)
      {
        var pointSpriteVR = intersections[0].point;
        var index = spriteEyeArray.indexOf(intersections[i].object);
        // if intersected object is a sprite
        if(intersections[i].object.name == "spriteEye")
        {
          spriteFound = true;
          //var index = spriteEyeArray.indexOf(intersections[i].object);
        }
      }
      // if there is an intersection
      if ( intersections.length > 0 ) {

        // Check if the objects are in front of each other
        var intersectionIndex = 0;

        for(var i = 0 ; i < intersections.length ; i++)
        {
          var lowerX = intersections[0].object.position.x;

          if( intersections[i].object.position.x < lowerX){
            lowerX = intersections[i].object.position.x;
            intersectionIndex = i;
          }
        }

        intersectionObject = intersections[intersectionIndex].object;

        var highLightChair;

        // if previously intersected object is not the current intersection and is not a sprite
        if ( intersected != intersectionObject && !spriteFound && !mouseIsOnMenu) {


          deviceOrientationSelectedObject = intersections[0].object;
          deviceOrientationSelectedPoint = intersections[0].point;

          // if there was a previously intersected object
          if ( intersected )
          {
            var selectedObject = mainScene.getObjectByName("highLightChair");
            mainScene.remove( selectedObject );
          }

          intersected = intersectionObject;

          highLightChair = new THREE.Mesh(intersected.geometry,materialcadeiraMobileHighlight);

          intersected.geometry.computeBoundingBox();

          var centroid = new THREE.Vector3();
          centroid.addVectors( intersected.geometry.boundingBox.min, intersected.geometry.boundingBox.max );

          centroid.applyMatrix4( intersected.matrixWorld );

          highLightChair.scale.set(1.15,1.00,1.05);

          highLightChair.rotation.set(intersected.rotation.x,intersected.rotation.y,intersected.rotation.z+0.035);

          highLightChair.position.set(centroid.x-0.005,centroid.y-0.006,centroid.z);

          mainScene.add(highLightChair);
          highLightChair.name = "highLightChair";

          // if intersection is new : change color to highlight

          switch(intersected.estado) {
            case "OCUPADA":
            var selectedObject = mainScene.getObjectByName("highLightChair");
            mainScene.remove( selectedObject );
            document.body.style.cursor = 'no-drop';
            break;
            default:
            document.body.style.cursor = 'pointer';
          }
        }
      }
      else // if there are no intersections
      {
        var selectedObject = mainScene.getObjectByName("highLightChair");
        mainScene.remove( selectedObject );
        intersected = null;
        uuidTexturaAntiga = "";
      }
    }
  };

  var onScreenOrientationChangeEvent = function () {
    if(window.orientation == 0 && isVR){
      $("#loadedScreenOri").fadeIn("fast");
    }else{
      $("#loadedScreenOri").fadeOut("fast");
      scope.screenOrientation = window.orientation || 0;
    }
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = function () {

    var zee = new THREE.Vector3( 0, 0, 1 );

    var euler = new THREE.Euler();

    var q0 = new THREE.Quaternion();

    var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

    return function ( quaternion, alpha, beta, gamma, orient ) {
      euler.set( beta, alpha, - gamma, 'YXZ' );                       // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler( euler );                               // orient the device

      quaternion.multiply( q1 );                                      // camera looks out the back of the device, not the top

      quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) );    // adjust for screen orientation
    }

  }();

  this.connect = function() {

    onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    scope.freeze = false;

  };

  this.disconnect = function() {

    scope.freeze = true;

    window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

  };

  this.update = function () {

    if ( scope.freeze ) return;

    var alpha  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) : 0; // Z
    var beta   = scope.deviceOrientation.beta  ? THREE.Math.degToRad( scope.deviceOrientation.beta  ) : 0; // X'
    var gamma  = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
    var orient = scope.screenOrientation       ? THREE.Math.degToRad( scope.screenOrientation       ) : 0; // O

    alpha = alpha-firstAlpha;
    setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
  };

};

THREE.OrbitControls = function ( object, domElement, localElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	this.localElement = ( localElement !== undefined ) ? localElement : document;

	// API

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the control orbits around
	// and where it pans with respect to.
	this.target = new THREE.Vector3();

	// center is old, deprecated; use "target" instead
	this.center = this.target;

	// This option actually enables dollying in and out; left as "zoom" for
	// backwards compatibility
	this.noZoom = false;
	this.zoomSpeed = 1.0;
	// Limits to how far you can dolly in and out
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// Set to true to disable this control
	this.noRotate = false;
	this.rotateSpeed = 0.1;

	// Set to true to disable this control
	this.noPan = true;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians


	// Set to true to disable use of the keys
	this.noKeys = true;
	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	////////////
	// internals

	var scope = this;
  var zoomIn = false;
  var zoomOut = false;
	var EPS = 0.000001;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;
	var pan = new THREE.Vector3();

	var lastPosition = new THREE.Vector3();

	var STATE = { NONE : -1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	// pass in distance in world space to move left
	this.panLeft = function ( distance ) {

		var panOffset = new THREE.Vector3();
		var te = this.object.matrix.elements;
		// get X column of matrix
		panOffset.set( te[0], te[1], te[2] );
		panOffset.multiplyScalar(-distance);

		pan.add( panOffset );

	};

	// pass in distance in world space to move up
	this.panUp = function ( distance ) {

		var panOffset = new THREE.Vector3();
		var te = this.object.matrix.elements;
		// get Y column of matrix
		panOffset.set( te[4], te[5], te[6] );
		panOffset.multiplyScalar(distance);

		pan.add( panOffset );
	};

	// main entry point; pass in Vector2 of change desired in pixel space,
	// right and down are positive
	this.pan = function ( delta ) {

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		if ( scope.object.fov !== undefined ) {

			// perspective
			var position = scope.object.position;
			var offset = position.clone().sub( scope.target );
			var targetDistance = offset.length();

			// half of the fov is center to top of screen
			targetDistance *= Math.tan( (scope.object.fov/2) * Math.PI / 180.0 );
			// we actually don't use screenWidth, since perspective camera is fixed to screen height
			scope.panLeft( 2 * delta.x * targetDistance / element.clientHeight );
			scope.panUp( 2 * delta.y * targetDistance / element.clientHeight );

		} else if ( scope.object.top !== undefined ) {

			// orthographic
			scope.panLeft( delta.x * (scope.object.right - scope.object.left) / element.clientWidth );
			scope.panUp( delta.y * (scope.object.top - scope.object.bottom) / element.clientHeight );

		} else {

			// camera neither orthographic or perspective - warn user
			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );

		}

	};

	this.dollyIn = function ( dollyScale ) {
    if (zoomOut == false){
      tweenFov = new TWEEN.Tween(camera).to({
        fov:30
      },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
        camera.updateProjectionMatrix();
      }).onComplete(function () {
        zoomOut = true;
      }).start();
    }else{
      tweenFov = new TWEEN.Tween(camera).to({
        fov:60
      },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
        camera.updateProjectionMatrix();
      }).onComplete(function () {
        zoomIn = false;
      }).start();
    }
	};

	this.dollyOut = function ( dollyScale ) {
    if (zoomIn == false){
      tweenFov = new TWEEN.Tween(camera).to({
        fov:30
      },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
        camera.updateProjectionMatrix();
      }).onComplete(function () {
        zoomIn = true;
      }).start();
    }else{
      tweenFov = new TWEEN.Tween(camera).to({
        fov:15
      },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
        camera.updateProjectionMatrix();
      }).onComplete(function () {
        zoomOut = false;
      }).start();
    }
	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.target );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		// move target to panned location
		this.target.add( pan );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		position.copy( this.target ).add( offset );

		this.object.lookAt( this.target );

		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;
		pan.set(0,0,0);

		if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

			this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );

		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) { return; }
		event.preventDefault();

		if ( event.button === 0 ) {
			if ( scope.noRotate === true ) { return; }

			state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( event.button === 1 ) {
			if ( scope.noZoom === true ) { return; }

			state = STATE.DOLLY;

			dollyStart.set( event.clientX, event.clientY );

		} else if ( event.button === 2 ) {
			if ( scope.noPan === true ) { return; }

			state = STATE.PAN;

			panStart.set( event.clientX, event.clientY );

		}

		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		if ( state === STATE.ROTATE ) {

			if ( scope.noRotate === true ) return;

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			// rotating across whole screen goes 360 degrees around
			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
			// rotating up and down along whole screen attempts to go 360, but limited to 180
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.DOLLY ) {
			if ( scope.noZoom === true ) return;

			dollyEnd.set( event.clientX, event.clientY );
			dollyDelta.subVectors( dollyEnd, dollyStart );

			if ( dollyDelta.y > 0 ) {
				scope.dollyIn();
			} else {

				scope.dollyOut();
			}

			dollyStart.copy( dollyEnd );

		} else if ( state === STATE.PAN ) {

			if ( scope.noPan === true ) return;

			panEnd.set( event.clientX, event.clientY );
			panDelta.subVectors( panEnd, panStart );

			scope.pan( panDelta );

			panStart.copy( panEnd );

		}

		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		scope.update();

	}

	function onMouseUp( /* event */ ) {

		if ( scope.enabled === false ) return;

		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		scope.domElement.removeEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.removeEventListener( 'mouseup', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.noZoom === true ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.dollyOut();

		} else {

			scope.dollyIn();

		}

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false ) { return; }
		if ( scope.noKeys === true ) { return; }
		if ( scope.noPan === true ) { return; }

		// pan a pixel - I guess for precise positioning?
		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		var needUpdate = false;

		switch ( event.keyCode ) {

			case scope.keys.UP:
				scope.pan( new THREE.Vector2( 0, scope.keyPanSpeed ) );
				needUpdate = true;
				break;
			case scope.keys.BOTTOM:
				scope.pan( new THREE.Vector2( 0, -scope.keyPanSpeed ) );
				needUpdate = true;
				break;
			case scope.keys.LEFT:
				scope.pan( new THREE.Vector2( scope.keyPanSpeed, 0 ) );
				needUpdate = true;
				break;
			case scope.keys.RIGHT:
				scope.pan( new THREE.Vector2( -scope.keyPanSpeed, 0 ) );
				needUpdate = true;
				break;
		}

		// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
		if ( needUpdate ) {

			scope.update();

		}

	}

  var lastTouchedMouseX = 0;
  var lastTouchedMouseY = 0;

	function touchstart( event ) {

    isDrag = false;

		if ( scope.enabled === false ) { return; }

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate
				if ( scope.noRotate === true ) { return; }

        lastTouchedMouseX = event.touches[0].clientX;
        lastTouchedMouseY = event.touches[0].clientY;

				state = STATE.TOUCH_ROTATE;
        rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

				break;

			case 2:	// two-fingered touch: dolly
				if ( scope.noZoom === true ) { return; }

				state = STATE.TOUCH_DOLLY;

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );
				dollyStart.set( 0, distance );
				break;

			case 3: // three-fingered touch: pan
				if ( scope.noPan === true ) { return; }

				state = STATE.TOUCH_PAN;

				panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			default:
				state = STATE.NONE;

		}
	}

	function touchmove( event ) {

    isDrag = true;

    if (zoomIn == true){
      scope.rotateSpeed = 0.07;
    }else{
      scope.rotateSpeed = 0.2;
    }
		if ( scope.enabled === false ) { return; }

		event.preventDefault();
		event.stopPropagation();

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate
				if ( scope.noRotate === true ) { return; }
				if ( state !== STATE.TOUCH_ROTATE ) { return; }

				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				rotateDelta.subVectors( rotateEnd, rotateStart );

				// rotating across whole screen goes 360 degrees around
				scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
				// rotating up and down along whole screen attempts to go 360, but limited to 180
				scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

				rotateStart.copy( rotateEnd );
				break;

			case 2: // two-fingered touch: dolly
				if ( scope.noZoom === true ) { return; }
				if ( state !== STATE.TOUCH_DOLLY ) { return; }

				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				var distance = Math.sqrt( dx * dx + dy * dy );

				dollyEnd.set( 0, distance );
				dollyDelta.subVectors( dollyEnd, dollyStart );

				if ( dollyDelta.y > 0 ) {

					scope.dollyOut();

				} else {

					scope.dollyIn();

				}

				dollyStart.copy( dollyEnd );
				break;

			case 3: // three-fingered touch: pan
				if ( scope.noPan === true ) { return; }
				if ( state !== STATE.TOUCH_PAN ) { return; }

				panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				panDelta.subVectors( panEnd, panStart );

				scope.pan( panDelta );

				panStart.copy( panEnd );
				break;

			default:
        isDrag = true;
				state = STATE.NONE;

		}

	}

	function touchend( event ) {

    if(!isDrag && (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ))
    {
      // if we are in the cinema overview
      if(!sittingDown) {

        // normal raycaster variables
        var intersectedOne = false;

        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();

        if (isVR == true){
          mouse.x = 2 * ((window.innerWidth/2) / window.innerWidth) - 1;
          mouse.y = 1 - 2 * ((window.innerHeight/2) / window.innerHeight);
          raycaster.setFromCamera( mouse, camera );
        }else{
          mouse.x = 2 * (lastTouchedMouseX / window.innerWidth) - 1;
          mouse.y = 1 - 2 * (lastTouchedMouseY / window.innerHeight);
          raycaster.setFromCamera( mouse, camera );
        }

        var intersectsSprite = raycaster.intersectObjects( spriteEyeArray );

        if(intersectsSprite.length > 0)
        {
          var pointSprite = intersectsSprite[0].point;
          // for each intersected object
          for(var i=0; i<intersectsSprite.length; i++)
          {
            // if intersected object is a sprite then call the change perspective function (which seats you down)
            if(intersectsSprite[i].object.name == "spriteEye" && !isVR)
            {
              spriteFound = true;
              var index = spriteEyeArray.indexOf(intersectsSprite[i].object);
              changePerspective(pointSprite.x,pointSprite.y,pointSprite.z,selectedChairs[index]);
            }
          }
        } else {

          octreeObjects = octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction );

          var intersects = raycaster.intersectOctreeObjects( octreeObjects );

          var textSelChairs = "";

          // for each intersected object
          for (var i = 0; i < intersects.length; i++) {

            // Check if the objects are in front of each other
            var intersectionIndex = 0;

            if(!isVR){
              for(var i = 0 ; i < intersects.length ; i++)
              {
                var lowerX = intersects[0].object.position.x;

                if( intersects[i].object.position.x < lowerX){
                  lowerX = intersects[i].object.position.x;
                  intersectionIndex = i;
                }
              }
            }

            var intersection = intersects[intersectionIndex];

            //var intersection = intersects[i];
            var obj = intersection.object;
            var point = intersection.point;

            var fila = "";
            var lugar = "";
            var estado = "";
            var spriteFound = false;


            if(isVR)
            {
              changePerspective(point.x,point.y,point.z,obj);
            }
            else
            {

            // retrieve information of chair occupation from array retrieved from DB
            for(var i=0; i<cadeirasJSON.length; i++)
            {
              if(cadeirasJSON[i].nome_procedural == obj.name)
              {
                fila = cadeirasJSON[i].fila;
                lugar = cadeirasJSON[i].lugar;
                estado = cadeirasJSON[i].estado;
              }

            }

          if(obj != undefined)
          {
            // if chair is not selected yet && chair is not occupied && intersected object is not a sprite
            if(($.inArray(obj, selectedChairs)=="-1") && (obj.estado != "OCUPADA") && !spriteFound && !mouseIsOnMenu && !mouseIsOutOfDocument && insideHelp == false)
            {
              // calculate intersected object centroid
              obj.geometry.computeBoundingBox();

              var centroid = new THREE.Vector3();
              centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );
              centroid.multiplyScalar( - 0.5 );

              centroid.applyMatrix4( obj.matrixWorld );

              // Add the EYE icon

              var eyeGeometry = new THREE.BoxGeometry( 0.1, 1, 1 );

              var spriteEyeMaterial = new THREE.MeshBasicMaterial( { map: eyeTexture } );

              var spriteEyeInstance = new THREE.Mesh(spriteEyeModel.geometry,spriteEyeMaterial);
              spriteEyeInstance.name = "spriteEye";
              spriteEyeInstance.position.set(centroid.x , centroid.y+0.2, centroid.z );
              mainScene.add( spriteEyeInstance );

              //octreeSprites.add(spriteEyeInstance);

              spriteEyeArray.push(spriteEyeInstance);

              // calculate rotation based on two vectors
              var matrix = new THREE.Matrix4();
              matrix.extractRotation( obj.matrix );

              // front vector
              var direction = new THREE.Vector3( -1, 0, 0 );
              matrix.multiplyVector3( direction );

              // vector pointing at the reference sphere
              dis1 = screenReferenceSphere.position.x - obj.position.x ;
              dis2 = screenReferenceSphere.position.y - obj.position.y ;
              dis3 = screenReferenceSphere.position.z - obj.position.z;

              var vector = new THREE.Vector3(dis1,dis2,dis3);

              vector.normalize ();

              // calculate angle between two vectors
              var angle = direction.angleTo( vector );

              if(obj.position.z == 0)
              spriteEyeInstance.rotation.y = 0;
              else if(obj.position.z > 0)
              spriteEyeInstance.rotation.y = -angle;
              else if(obj.position.z < 0)
              spriteEyeInstance.rotation.y = angle;

              // paint all the selected chairs (check the array) with the selected color
              if(detectmob())
              selectChair = new THREE.Mesh(obj.geometry,materialcadeiraMobileHighlight);
              else
              selectChair = new THREE.Mesh(obj.geometry,materialcadeiraHighLight);

              selectChair.geometry.computeBoundingBox();

              var centroid = new THREE.Vector3();
              centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );

              centroid.applyMatrix4( obj.matrixWorld );

              selectChair.scale.set(1.15,1.00,1.05);

              selectChair.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z+0.035);

              selectChair.position.set(centroid.x-0.005,centroid.y-0.006,centroid.z);

              selectChair.name = "selectChair_"+obj.name;
              selectChair.material.map = texturaCadeiraHighlight;

              mainScene.add(selectChair);

              // Add the Chair
              selectedChairs.push(obj);

              obj.material.map = texturaCadeiraSelect;
            } else {
              if(!mouseIsOnMenu && !mouseIsOutOfDocument && !spriteFound)
              removeCadeira(obj); // if chair was already selected, de-select it

            }

          }
        }
        }
              }
      }
      else if(!sittingDownOrtho && insideHelp == false) // if clicked when sitting down
      {

        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();

        if (isVR == true){
          mouse.x = 2 * ((window.innerWidth/2) / window.innerWidth) - 1;
          mouse.y = 1 - 2 * ((window.innerHeight/2) / window.innerHeight);
          raycaster.setFromCamera( mouse, camera );
        }else{
          mouse.x = 2 * (lastTouchedMouseX / window.innerWidth) - 1;
          mouse.y = 1 - 2 * (lastTouchedMouseY / window.innerHeight);
          raycaster.setFromCamera( mouse, camera );
        }

        var intersectsSpritePlay = raycaster.intersectObject( spriteplay );

        if(intersectsSpritePlay.length > 0)
        {
          video.play();
        }else{

          sittingDown = false;
          setupTweenOverview();

          video.pause();

          if(!isVR){
            for(var i=0; i<spriteEyeArray.length ; i++)
            {
              spriteEyeArray[i].visible = true;
            }
          }
        }
      }
      else if (insideHelp == false)
      {
        sittingDown = false;

        switchToOrtho();

        for(var i=0; i<spriteEyeArray.length ; i++)
        {
          spriteEyeArray[i].visible = true;
        }
      }
    }

		if ( scope.enabled === false ) { return; }

		state = STATE.NONE;
	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.localElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	this.domElement.addEventListener( 'keydown', onKeyDown, false );

	this.localElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );

function init() {

  // 0: fps, 1: ms, 2: mb
  statsFPS.setMode( 0 );

  statsFPS.domElement.style.position = 'absolute';
  statsFPS.domElement.style.left = '0px';
  statsFPS.domElement.style.top = '0px';

  //document.body.appendChild( statsFPS.domElement );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 15 );

  camera.position.x = -6.160114995658247;
  camera.position.y = 1.5;
  camera.position.z = 0.009249939938009306;
  var centro = new THREE.Vector3(0,2,0);
  camera.lookAt(centro);

  var check = {
    gyroscope: function (callback) {
      function handler(event) {
        var hasGyro = typeof event.alpha === 'number'
        && typeof event.beta  === 'number'
        && typeof event.gamma === 'number';
        window.removeEventListener('deviceorientation', handler, false);
        callback(hasGyro);
      }
      window.addEventListener('deviceorientation', handler, false);
    }
  };

  check.gyroscope(function (hasGyroscope) {
    if(hasGyroscope) {
      document.getElementById('legEsq').style.display = "block";
      controls = new THREE.OrbitControls(camera);
      controls.target = new THREE.Vector3(-5,1.55,0.009249939938009306);
      controls.center = controls.target;
    }

  });


  // lights
  var light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.0 );
  mainScene.add( light );

  // model
  group = new THREE.Object3D();

  //event listeners
  document.addEventListener('mousedown', onMouseDown, false);

  window.addEventListener( 'resize', onWindowResize, false );

  showMenuSelect(); // this method initialises the side div container

  if(window.innerHeight > window.innerWidth){
    // create the main selection menu
    var iDiv = document.createElement('div');
    iDiv.style.width = '100%';
    iDiv.style.cursor = "pointer";
    iDiv.style.textAlign = "center";
    iDiv.style.height = '100%';
    iDiv.style.backgroundColor= "rgba(0, 0, 0, 0.8)";
    iDiv.style.position = "absolute";
    iDiv.id = 'loadedScreen';
    iDiv.style.top = '0';
    iDiv.style.display = "block";

    var divMain = document.createElement('div');
    divMain.style.color = "white";
    divMain.style.cursor = "pointer";
    divMain.style.width = '100%';
    divMain.style.textAlign = "center";
    divMain.style.fontFamily = "osb";
    divMain.style.position = "absolute";
    divMain.id = 'textScreen';
    divMain.style.top = '50%';
    divMain.style.transform = "translateY(-50%)";

    var divtexto1 = document.createElement('div');
    divtexto1.style.borderBottom = "solid 1px #1bbc9b";
    divtexto1.style.width = "60%";
    divtexto1.style.height = "30px";
    divtexto1.style.margin = "auto";

    var textowelcome = document.createElement('p');
    textowelcome.innerHTML = "Bem Vindo ao <b>IBO</b>";
    textowelcome.style.fontFamily = "osr";
    textowelcome.style.fontSize = "18px";

    var textoespaco = document.createElement('p');
    textoespaco.innerHTML = "<br>";
    textoespaco.style.fontFamily = "osr";

    var textoapre = document.createElement('p');
    textoapre.innerHTML = "Uma experiência interactiva da PUSH Interactive";
    textoapre.style.fontFamily = "osr";
    textoapre.style.fontSize = "11px";

    var divleft = document.createElement('div');
    divleft.style.borderRight = "solid 1px #1bbc9b";
    divleft.style.width = "49%";
    divleft.style.float = "left";
    divleft.style.height = "110px";
    divleft.style.marginTop = "3%";

    var divlefttext = document.createElement('p');
    divlefttext.innerHTML = "Navegar";
    divlefttext.style.fontFamily = "osr";
    divlefttext.style.fontSize = "11px";
    divlefttext.style.color = "#1bbc9b";

    var divleftimg = document.createElement('img');
    divleftimg.id = "divleftimg";
    divleftimg.style.width = "60px";
    divleftimg.style.marginTop = "5px";

    var divmid = document.createElement('div');
    divmid.style.width = "49%";
    divmid.style.float = "left";
    divmid.style.height = "110px";
    divmid.style.marginTop = "3%";

    var divmidtext = document.createElement('p');
    divmidtext.innerHTML = "Zoom";
    divmidtext.style.fontFamily = "osr";
    divmidtext.style.fontSize = "11px";
    divmidtext.style.color = "#1bbc9b";

    var divmidimg = document.createElement('img');
    divmidimg.id = "divmidimg";
    divmidimg.style.width = "60px";
    divmidimg.style.marginTop = "10px";

    var divright = document.createElement('div');
    divright.style.borderRight = "solid 1px #1bbc9b";
    divright.style.width = "49%";
    divright.style.float = "left";
    divright.style.height = "110px";
    divright.style.marginTop = "3%";

    var divrighttext = document.createElement('p');
    divrighttext.innerHTML = "Selecione os seus lugares";
    divrighttext.style.fontFamily = "osr";
    divrighttext.style.fontSize = "11px";
    divrighttext.style.color = "#1bbc9b";

    var divrightimg = document.createElement('img');
    divrightimg.id = "divrightimg";
    divrightimg.style.width = "60px";
    divrightimg.style.marginTop = "10px";

    var diveye = document.createElement('div');
    diveye.style.width = "49%";
    diveye.style.float = "left";
    diveye.style.height = "110px";
    diveye.style.marginTop = "3%";

    var diveyetext = document.createElement('p');
    diveyetext.innerHTML = "Ver perspectiva do lugar";
    diveyetext.style.fontFamily = "osr";
    diveyetext.style.fontSize = "11px";
    diveyetext.style.color = "#1bbc9b";

    var diveyeimg = document.createElement('img');
    diveyeimg.id = "diveyeimg";
    diveyeimg.style.width = "60px";
    diveyeimg.style.marginTop = "10px";
  }else{
    // create the main selection menu
    var iDiv = document.createElement('div');
    iDiv.style.width = '100%';
    iDiv.style.cursor = "pointer";
    iDiv.style.textAlign = "center";
    iDiv.style.height = '100%';
    iDiv.style.position = "absolute";
    iDiv.id = 'loadedScreen';
    iDiv.style.top = '0';
    iDiv.style.display = "block";

    var divMain = document.createElement('div');
    divMain.style.color = "white";
    divMain.style.backgroundColor= "rgba(0, 0, 0, 0.8)";
    divMain.style.cursor = "pointer";
    divMain.style.width = '100%';
    divMain.style.textAlign = "center";
    divMain.style.fontFamily = "osb";
    divMain.style.height = '100%';
    divMain.style.position = "absolute";
    divMain.id = 'textScreen';
    divMain.style.top = '50%';
    divMain.style.transform = "translateY(-50%)";

    var divtexto1 = document.createElement('div');
    divtexto1.style.borderBottom = "solid 1px #1bbc9b";
    divtexto1.style.width = "40%";
    divtexto1.style.height = "30px";
    divtexto1.style.margin = "auto";

    var textowelcome = document.createElement('p');
    textowelcome.innerHTML = "Bem Vindo ao <b>IBO</b>";
    textowelcome.style.fontFamily = "osr";
    textowelcome.style.fontSize = "18px";

    var textoespaco = document.createElement('p');
    textoespaco.innerHTML = "<br>";
    textoespaco.style.fontFamily = "osr";

    var textoapre = document.createElement('p');
    textoapre.innerHTML = "Uma experiência interactiva da PUSH Interactive";
    textoapre.style.fontFamily = "osr";
    textoapre.style.fontSize = "11px";

    var divleft = document.createElement('div');
    divleft.style.borderRight = "solid 1px #1bbc9b";
    divleft.style.width = "24%";
    divleft.style.float = "left";
    divleft.style.height = "130px";
    divleft.style.marginTop = "3%";

    var divlefttext = document.createElement('p');
    divlefttext.innerHTML = "Navegar";
    divlefttext.style.fontFamily = "osr";
    divlefttext.style.fontSize = "11px";
    divlefttext.style.color = "#1bbc9b";

    var divleftimg = document.createElement('img');
    divleftimg.id = "divleftimg";
    divleftimg.style.width = "60px";
    divleftimg.style.marginTop = "5px";

    var divmid = document.createElement('div');
    divmid.style.borderRight = "solid 1px #1bbc9b";
    divmid.style.width = "25%";
    divmid.style.float = "left";
    divmid.style.height = "130px";
    divmid.style.marginTop = "3%";

    var divmidtext = document.createElement('p');
    divmidtext.innerHTML = "Zoom";
    divmidtext.style.fontFamily = "osr";
    divmidtext.style.fontSize = "11px";
    divmidtext.style.color = "#1bbc9b";

    var divmidimg = document.createElement('img');
    divmidimg.id = "divmidimg";
    divmidimg.style.width = "60px";
    divmidimg.style.marginTop = "10px";

    var divright = document.createElement('div');
    divright.style.borderRight = "solid 1px #1bbc9b";
    divright.style.width = "24%";
    divright.style.float = "left";
    divright.style.height = "130px";
    divright.style.marginTop = "3%";

    var divrighttext = document.createElement('p');
    divrighttext.innerHTML = "Selecione os seus lugares";
    divrighttext.style.fontFamily = "osr";
    divrighttext.style.fontSize = "11px";
    divrighttext.style.color = "#1bbc9b";

    var divrightimg = document.createElement('img');
    divrightimg.id = "divrightimg";
    divrightimg.style.width = "60px";
    divrightimg.style.marginTop = "10px";

    var diveye = document.createElement('div');
    diveye.style.width = "24%";
    diveye.style.float = "left";
    diveye.style.height = "130px";
    diveye.style.marginTop = "3%";

    var diveyetext = document.createElement('p');
    diveyetext.innerHTML = "Ver perspectiva do lugar";
    diveyetext.style.fontFamily = "osr";
    diveyetext.style.fontSize = "11px";
    diveyetext.style.color = "#1bbc9b";

    var diveyeimg = document.createElement('img');
    diveyeimg.id = "diveyeimg";
    diveyeimg.style.width = "60px";
    diveyeimg.style.marginTop = "10px";

  }

  divtexto1.appendChild(textowelcome);
  divtexto1.appendChild(textoespaco);
  divMain.appendChild(divtexto1);
  divMain.appendChild(textoapre);

  divMain.appendChild(divleft);
  divleft.appendChild(divlefttext);
  divleft.appendChild(divleftimg);

  divMain.appendChild(divmid);
  divmid.appendChild(divmidtext);
  divmid.appendChild(divmidimg);

  divMain.appendChild(divright);
  divright.appendChild(divrighttext);
  divright.appendChild(divrightimg);

  divMain.appendChild(diveye);
  diveye.appendChild(diveyetext);
  diveye.appendChild(diveyeimg);
  iDiv.appendChild(divMain);
  document.body.appendChild(iDiv);

  document.getElementById("divleftimg").src="img/mobile_navigate.png";
  document.getElementById("divmidimg").src="img/mobile_zoom.png";
  document.getElementById("divrightimg").src="img/mobile_click.png";
  document.getElementById("diveyeimg").src="img/mobile_eye.png";

  $("#loadedScreen" ).click(function() {
    isLoadingInfo = false;
    $("#loadedScreen").fadeOut("slow");

    video.play();
    video.pause();

    fullscreen();
    insideHelp = false;
    $("#LegDiv").animate({bottom: "+=80px"});
  });
  isLoading = false;
  firstTimeInit = false;
}

//
// create a show the selection menu
//
function showMenuSelect(){

  // create main legenda for cinema
  var legDiv = document.createElement('div');
  legDiv.style.width = '100%';
  legDiv.style.height = '80px';
  legDiv.style.position = "absolute";
  legDiv.id = 'LegDiv';
  legDiv.style.bottom = '-80px';
  // create sub main legenda for cinema

  var legEsq = document.createElement('div');
  legEsq.style.width = '40px';
  legEsq.style.float = "left";
  legEsq.style.textAlign = "center";
  legEsq.style.height = '40px';
  legEsq.style.marginTop = '40px';
  legEsq.style.background = '#1cbb9b';
  legEsq.style.borderRadius = "5px";
  legEsq.id = 'legEsq';
  legEsq.style.display = 'block';
  legEsq.onclick = function() {
    switchToVr();
  }
  legEsq.onmouseover = function() {
    legEsq.style.cursor = 'pointer';
  }

  var ptrocavr = document.createElement('p');
  ptrocavr.innerHTML = "VR";
  ptrocavr.style.color = "#FFF";
  ptrocavr.style.fontSize = "12px";
  ptrocavr.style.fontFamily = "osr";
  ptrocavr.id = "ptrocavr";
  ptrocavr.style.height = '5px';
  ptrocavr.style.marginTop = "3px";

  var ptrocavrImg = document.createElement('img');
  ptrocavrImg.id = "ptrocavrImg";
  ptrocavrImg.style.marginTop = "-30px";
  ptrocavrImg.style.width = "25px";

  legEsq.appendChild(ptrocavr);
  legEsq.appendChild(ptrocavrImg);
  legDiv.appendChild(legEsq);

  var legDir = document.createElement('div');
  legDir.style.width = '40px';
  legDir.style.float = "right";
  legDir.style.textAlign = "center";
  legDir.style.height = '40px';
  legDir.style.marginTop = '40px';
  legDir.style.background = '#1cbb9b';
  legDir.style.borderRadius = "5px";
  legDir.id = 'legDir';
  legDir.style.display = "block";
  legDir.onclick = function() {
    switchToOrtho();
  }
  legDir.onmouseover = function() {
    legDir.style.cursor = 'pointer';
  }

  var ptrocapresp = document.createElement('p');
  ptrocapresp.innerHTML = "Planta";
  ptrocapresp.style.color = "#FFF";
  ptrocapresp.style.fontSize = "12px";
  ptrocapresp.style.fontFamily = "osr";
  ptrocapresp.style.height = '4px';
  ptrocapresp.style.marginTop = "3px";
  ptrocapresp.id = "ptrocapresp";

  var ptrocaprespImg = document.createElement('img');
  ptrocaprespImg.id = "ptrocaprespImg";
  ptrocaprespImg.style.marginTop = "-45px";
  ptrocaprespImg.style.width = "37px";

  legDir.appendChild(ptrocapresp);
  legDir.appendChild(ptrocaprespImg);
  legDiv.appendChild(legDir);
  document.body.appendChild(legDiv);
  document.getElementById("ptrocavrImg").src="img/VR-icon.png";
  document.getElementById("ptrocaprespImg").src="img/icon cadeiras.png";

}

//
// Load the main Scene
//
function loadScene() {
  // load venue status from DB

  loadSala();
  loadCadeiras(populateCadeirasInstances);
  loadBracos(populateBracosInstances);

  // load the model for the EYE icon
  loader.load( "models/Cinema_Motta/olho_v03.js", function( geometry,materials ) {
    spriteEyeModel = new THREE.Mesh(geometry,materials);
  });

  // create the cinema screen
  var geometry = new THREE.PlaneGeometry( 7, 2.5, 10, 10);
  var material = new THREE.MeshBasicMaterial( {side:THREE.DoubleSide, map:textureVideo} );
  var plane = new THREE.Mesh( geometry, material );
  plane.position.x = -6.5;
  plane.position.y = 1.2;
  plane.rotation.y = Math.PI/2;
  mainScene.add( plane );
}

//
// Here we load the venue model
//
function loadSala() {



  var loaderJSON = new THREE.JSONLoader();


  loaderJSON.load( "models/Cinema_Motta/tela_final.js", function( geometry,material ) {
    telaFinal = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({map:textureVideo}));
    telaFinal.position.y += 0.5;
    mainScene.add(telaFinal);
  });

  // load JSON model
  loaderJSON.load( "models/Cinema_Motta/Sala_Baked_03.js", function( geometry, materials ) {

    var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );

    materials[0] = new THREE.MeshBasicMaterial(materials[0]);
    materials[1] = new THREE.MeshBasicMaterial(materials[1]);
    materials[2] = new THREE.MeshBasicMaterial(materials[2]);
    materials[3] = new THREE.MeshBasicMaterial(materials[3]);

    material1 = new THREE.MeshBasicMaterial();
    material1.map = materials[0].map;
    material1.map.magFilter = THREE.LinearFilter;
    material1.map.minFilter = THREE.LinearMipMapLinearFilter;
    material1.map.anisotropy = renderer.getMaxAnisotropy();
    material1.overdraw = 1.0;
    materials[0] = material1;

    material2 = new THREE.MeshBasicMaterial();
    material2.map = materials[1].map;
    material2.map.magFilter = THREE.LinearFilter;
    material2.map.minFilter = THREE.LinearMipMapLinearFilter;
    material2.map.anisotropy = renderer.getMaxAnisotropy();
    material2.overdraw = 1.0;
    materials[1] = material2;

    material3 = new THREE.MeshBasicMaterial();
    material3.map = materials[2].map;
    material3.map.magFilter = THREE.LinearFilter;
    material3.map.minFilter = THREE.LinearMipMapLinearFilter;
    material3.map.anisotropy = renderer.getMaxAnisotropy();
    material3.overdraw = 1.0;
    materials[2] = material3;

    material4 = new THREE.MeshBasicMaterial();
    material4.map = materials[3].map;
    material4.map.magFilter = THREE.LinearFilter;
    material4.map.minFilter = THREE.LinearMipMapLinearFilter;
    material4.map.anisotropy = renderer.getMaxAnisotropy();
    material4.overdraw = 1.0;
    materials[3] = material4;

    var mesh = new THREE.Mesh( bufferGeometry , new THREE.MeshFaceMaterial( materials ));

    mesh.position.x = mesh.position.x-0.2;
    mesh.position.y = mesh.position.y+0.3;

    mainScene.add(mesh);

    // here we compute the bounding box of the model, to find the centroid
    mesh.geometry.computeBoundingBox();

    var centroid = new THREE.Vector3();
    centroid.addVectors( mesh.geometry.boundingBox.min, mesh.geometry.boundingBox.max );
    centroid.multiplyScalar( - 0.5 );

    centroid.applyMatrix4( mesh.matrixWorld );


    // here we add the lookAt sphere to the screen
    var geometry = new THREE.SphereGeometry( 0.25, 12, 12 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    screenReferenceSphere = new THREE.Mesh( geometry, material );
    screenReferenceSphere.position.x = -6.160114995658247;
    screenReferenceSphere.position.y = 1.0;
    screenReferenceSphere.position.z = 0.009249939938009306;


    //screenReferenceSphere.position.set(screenReferenceSphere.position.x, screenReferenceSphere.position.y, screenReferenceSphere.position.z);
    screenReferenceSphere.updateMatrixWorld();

    loadWebAudio();

  } );

}

//
// here we load the chairs
//
function loadCadeiras(populateCadeirasInstances) {

  var loaderJSON = new THREE.JSONLoader();

  // 1. load the point cloud that contains the position referece and the rotation reference for each chair
  loaderJSON.load( "models/Cinema_Motta/Pcloud_oriented_Cadeiras.js", function( geometry, material, normals ) {

    mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );

    normalsArray = [];

    // the normals array contains the normal vector (mesh orientation) for each instance
    for(i=0 ; i<normals.length ; i+=3)
    {
      normalVector = new THREE.Vector3(normals[i], normals[i+1], normals[i+2]);
      normalsArray.push(normalVector);
    }

  });


  // 2. load the model itself (only once) to replicate and get the geometry to pass along
  var loaderOBJ = new THREE.OBJMTLLoader();
  loaderOBJ.load( 'models/Cinema_Motta/Cadeira_Nova/Cadeira_Nova.obj', 'models/Cinema_Motta/Cadeira_Nova/Cadeira_Nova.mtl', function ( object ) {
    var bufferGeometry;
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh && child.geometry != "undefined") {
        bufferGeometry = child.geometry;
      }
    });
    populateCadeirasInstances(mesh,normalsArray,bufferGeometry); // we carry on through a callback to load the models synchronously
  });
}

//
// 3. here we iterate on the point cloud to replicate the instances and position each instance in the correct place
//
function populateCadeirasInstances(mesh, normalsArray, bufferGeometry) {
  // get the origin (from) and vertical axis vectors
  var from = new THREE.Vector3( 0,0,0 );
  var vAxis = new THREE.Vector3( -1,0,0 );

  sphereGeo = new THREE.SphereGeometry( 0.1, 6, 6 );

  var genericObject = new THREE.Mesh(bufferGeometry,materialcadeira);

  singleGeometryNormal = new THREE.Geometry();
  singleGeometryOcupadas = new THREE.Geometry();
  singleGeometryDeficiente = new THREE.Geometry();

  var materials = [];

  materials.push(materialcadeiraMobile);
  materials.push(materialcadeiraDeficienteMobile);
  materials.push(materialcadeiraOcupadaMobile);


  // for each point in the point cloud
  for(i=0; i<mesh.geometry.vertices.length; i++){
    var vertex = mesh.geometry.vertices[i];

    var materialcadeira = materialcadeiraMobile.clone();

    // create the new instance
    newObject = genericObject.clone(genericObject);
    genericObject.material = materialcadeira;

    // if this instance has a normal vector
    if (normalsArray[i] != null){

      // calculate the orientation vector
      var to = new THREE.Vector3( normalsArray[i].x,normalsArray[i].y,normalsArray[i].z );
      var direction = to.clone().sub(from);
      var length = direction.length();

      // position the instance in the point
      newObject.position.x = vertex.x;
      newObject.position.y = vertex.y;
      newObject.position.z = vertex.z;

      // calculate the quaternion from the vertical axis and the computed normal vector
      var quaternion = new THREE.Quaternion().setFromUnitVectors( vAxis.normalize(),to.normalize()  );
      newObject.setRotationFromQuaternion(quaternion);

      // identify the instance
      newObject.name = "CADEIRA_" + i;
      newObject.updateMatrix();
      mesh.geometry.colorsNeedUpdate = true;

      var cadeiraCorrente = "";

      for(var k = 0 ; k < cadeirasJSON.length ; k++)
      {
        if(newObject.name == cadeirasJSON[k].nome_procedural)
        {
          cadeiraCorrente = cadeirasJSON[k];
        }
      }
      if(cadeiraCorrente.estado == "OCUPADA")
      {
        newObject.estado = "OCUPADA";
        singleGeometryOcupadas.merge(newObject.geometry, newObject.matrix, 2);
      }
      else if(cadeiraCorrente.estado == "DEFICIENTE")
      {
        newObject.estado = "DEFICIENTE";
        singleGeometryDeficiente.merge(newObject.geometry, newObject.matrix, 1);
      }
      else
      {
        newObject.estado = "LIVRE";
        singleGeometryNormal.merge(newObject.geometry, newObject.matrix, 0);
      }
      octree.add( newObject);

    }
  }
  //add to scene
  var meshSG = new THREE.Mesh(singleGeometryNormal, new THREE.MeshFaceMaterial(materials));
  meshSG.name = "singleGeometryNormal";
  mainScene.add(meshSG);

  var meshSGOcupadas = new THREE.Mesh(singleGeometryOcupadas, new THREE.MeshFaceMaterial(materials));
  meshSGOcupadas.name = "singleGeometryOcupadas";
  mainScene.add(meshSGOcupadas);

  var meshSGDeficiente = new THREE.Mesh(singleGeometryDeficiente, new THREE.MeshFaceMaterial(materials));
  meshSGDeficiente.name = "singleGeometryDeficiente";
  mainScene.add(meshSGDeficiente);
}

//
// Here we access the DB and load the chair occupation info
//

function carregarJSONBDInitial(num_sessao) {

  $.ajax({
    url: 'php/ler_BDCinema.php', //This is the current doc
    type: "POST",
    dataType:'json', // add json datatype to get json
    data: ({sessao: "cadeiras"+num_sessao}),
    success: function(data){
      cadeirasJSON = data;
      console.log("JSON Loaded Correctly from DB Initial cadeiras " + num_sessao);
      loadScene();
    },
    error:    function(textStatus,errorThrown){
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}

//
// here we load the chair arms
//
function loadBracos(populateBracosInstances){
  // single geometry for geometry merge
  var singleGeometry = new THREE.Geometry();

  // chair arm material
  var material = new THREE.MeshBasicMaterial({
    map: texturaBraco,
    specular : [0.1, 0.1, 0.1],
    shininess : 120.00
  });

  var meshBracos = [];
  var normalsArrayBracos = [];
  var normalVector = new THREE.Vector3(0,0,0);

  // 1. load the point cloud that contains the position referece and the rotation reference for each chair
  loaderJSON.load( "models/Cinema_Motta/Pcloud_oriented_Bracos.js", function( geometry, material, normals ) {

    meshBracos = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
    for(i=0 ; i<normals.length ; i+=3)
    {
      normalVector = new THREE.Vector3(normals[i], normals[i+1], normals[i+2]);
      normalsArrayBracos.push(normalVector);
    }

  } );

  // 2. load the model itself (only once) to replicate and get the geometry to pass along
  var loaderOBJ = new THREE.OBJMTLLoader();
  loaderOBJ.load( 'models/Cinema_Motta/Braco_Novo/Braco_Novo.obj', 'models/Cinema_Motta/Braco_Novo/Braco_Novo.mtl', function ( object ) {
    var preNewObject;
    object.traverse(function(child) {
      //(child.name);
      if (child instanceof THREE.Mesh && child.geometry != "undefined"){
        preNewObject = new THREE.Mesh( child.geometry, material );
      }
    });
    populateBracosInstances(singleGeometry,meshBracos,normalsArrayBracos,normalVector,preNewObject,material);
  });

}

//
// 3. here we iterate on the point cloud to replicate the instances and position each instance in the correct place
//
function populateBracosInstances(singleGeometry,meshBracos,normalsArrayBracos,normalVector,preNewObject,material) {
  var newBraco;

  // vertical axis and origin (from) vectors
  var vAxis = new THREE.Vector3( -1,0,0 );
  var from = new THREE.Vector3( 0,0,0 );

  // for each point in the point cloud
  for(i=0; i<meshBracos.geometry.vertices.length; i++){

    // get point from point cloud
    var vertex = meshBracos.geometry.vertices[i];

    newBraco = preNewObject.clone();

    // normal vector (orientation)
    var to = new THREE.Vector3( normalsArrayBracos[i].x,normalsArrayBracos[i].y,normalsArrayBracos[i].z );

    var direction = to.clone().sub(from);
    var length = direction.length();

    newBraco.position.x = vertex.x;
    newBraco.position.y = vertex.y;
    newBraco.position.z = vertex.z;

    // set rotation from quaternion
    var quaternion = new THREE.Quaternion().setFromUnitVectors( vAxis.normalize(),to.normalize()  );
    newBraco.setRotationFromQuaternion(quaternion);

    newBraco.updateMatrix();

    // merge each new instance into a single geometry to optimize
    singleGeometry.merge(newBraco.geometry, newBraco.matrix);

  }

  //add to scene
  var meshSG = new THREE.Mesh(singleGeometry, material);
  mainScene.add(meshSG);
}


function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

// memorize the last texture that was selected
var uuidTexturaAntiga ="";

//
// Mouse Click Event
//
function onMouseDown(e) {

  // if we are in the cinema overview
  if(!sittingDown && insideHelp == false) {
    // normal raycaster variables
    var intersectedOne = false;

    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    if (isVR == true){
      mouse.x = 2 * ((window.innerWidth/2) / window.innerWidth) - 1;
      mouse.y = 1 - 2 * ((window.innerHeight/2) / window.innerHeight);
      raycaster.setFromCamera( mouse, camera );
      }else{
      mouse.x = 2 * (event.clientX / window.innerWidth) - 1;
      mouse.y = 1 - 2 * (event.clientY / window.innerHeight);
      raycaster.setFromCamera( mouse, camera );
    }

    var intersectsSprite = raycaster.intersectObjects( spriteEyeArray );

    if(intersectsSprite.length > 0)
    {
      var pointSprite = intersectsSprite[0].point;
      // for each intersected object
      for(var i=0; i<intersectsSprite.length; i++)
      {
        // if intersected object is a sprite then call the change perspective function (which seats you down)
        if(intersectsSprite[i].object.name == "spriteEye" && !isVR)
        {
          spriteFound = true;
          var index = spriteEyeArray.indexOf(intersectsSprite[i].object);
          changePerspective(pointSprite.x,pointSprite.y,pointSprite.z,selectedChairs[index]);
        }
      }
      }else{
      octreeObjects = octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction );

      var intersects = raycaster.intersectOctreeObjects( octreeObjects );

      var textSelChairs = "";

      // for each intersected object
      for (var i = 0; i < intersects.length; i++) {

        // Check if the objects are in front of each other
        var intersectionIndex = 0;

        if(!isVR){
          for(var i = 0 ; i < intersects.length ; i++) {
            var lowerX = intersects[0].object.position.x;
            if( intersects[i].object.position.x < lowerX) {
              lowerX = intersects[i].object.position.x;
              intersectionIndex = i;
            }
          }
        }
        var intersection = intersects[intersectionIndex];
        //var intersection = intersects[i];
        var obj = intersection.object;
        var point = intersection.point;

        var fila = "";
        var lugar = "";
        var estado = "";
        var spriteFound = false;
        if(isVR)
        {
          changePerspective(point.x,point.y,point.z,obj);
        }
        else
        {
          // retrieve information of chair occupation from array retrieved from DB
          for(var i=0; i<cadeirasJSON.length; i++)
          {
            if(cadeirasJSON[i].nome_procedural == obj.name)
            {
              fila = cadeirasJSON[i].fila;
              lugar = cadeirasJSON[i].lugar;
              estado = cadeirasJSON[i].estado;
            }

          }

          if(obj != undefined)
          {
            // if chair is not selected yet && chair is not occupied && intersected object is not a sprite
            if(($.inArray(obj, selectedChairs)=="-1") && (obj.estado != "OCUPADA") && !spriteFound && !mouseIsOnMenu && !mouseIsOutOfDocument && insideHelp == false)
            {
              // calculate intersected object centroid
              obj.geometry.computeBoundingBox();

              var centroid = new THREE.Vector3();
              centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );
              centroid.multiplyScalar( - 0.5 );

              centroid.applyMatrix4( obj.matrixWorld );

              // Add the EYE icon

              var eyeGeometry = new THREE.BoxGeometry( 0.1, 1, 1 );



              var spriteEyeMaterial = new THREE.MeshBasicMaterial( { map: eyeTexture} );
              var spriteEyeInstance = new THREE.Mesh(spriteEyeModel.geometry,spriteEyeMaterial);
              spriteEyeInstance.name = "spriteEye";
              spriteEyeInstance.position.set(centroid.x , centroid.y+0.2, centroid.z );
              mainScene.add( spriteEyeInstance );

              //octreeSprites.add(spriteEyeInstance);

              spriteEyeArray.push(spriteEyeInstance);

              // calculate rotation based on two vectors
              var matrix = new THREE.Matrix4();
              matrix.extractRotation( obj.matrix );

              // front vector
              var direction = new THREE.Vector3( -1, 0, 0 );
              matrix.multiplyVector3( direction );

              // vector pointing at the reference sphere
              dis1 = screenReferenceSphere.position.x - obj.position.x ;
              dis2 = screenReferenceSphere.position.y - obj.position.y ;
              dis3 = screenReferenceSphere.position.z - obj.position.z;

              var vector = new THREE.Vector3(dis1,dis2,dis3);

              vector.normalize ();

              // calculate angle between two vectors
              var angle = direction.angleTo( vector );

              if(obj.position.z == 0)
              spriteEyeInstance.rotation.y = 0;
              else if(obj.position.z > 0)
              spriteEyeInstance.rotation.y = -angle;
              else if(obj.position.z < 0)
              spriteEyeInstance.rotation.y = angle;

              // paint all the selected chairs (check the array) with the selected color
              if(detectmob())
              selectChair = new THREE.Mesh(obj.geometry,materialcadeiraMobileHighlight);
              else
              selectChair = new THREE.Mesh(obj.geometry,materialcadeiraHighLight);

              selectChair.geometry.computeBoundingBox();

              var centroid = new THREE.Vector3();
              centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );

              centroid.applyMatrix4( obj.matrixWorld );

              selectChair.scale.set(1.15,1.00,1.05);

              selectChair.rotation.set(obj.rotation.x,obj.rotation.y,obj.rotation.z+0.035);

              selectChair.position.set(centroid.x-0.005,centroid.y-0.006,centroid.z);

              selectChair.name = "selectChair_"+obj.name;
              selectChair.material.map = texturaCadeiraHighlight;

              mainScene.add(selectChair);

              // Add the Chair
              selectedChairs.push(obj);

              obj.material.map = texturaCadeiraSelect;
            } else {
              if(!mouseIsOnMenu && !mouseIsOutOfDocument && !spriteFound)
              removeCadeira(obj); // if chair was already selected, de-select it

            }

          }
        }
      }
    }
  }
  else if(!sittingDownOrtho && insideHelp == false) // if clicked when sitting down
  {
    sittingDown = false;
    setupTweenOverview();

    sound.source.stop();
    video.pause();
    loadWebAudio();

    if(!isVR){
      for(var i=0; i<spriteEyeArray.length ; i++)
      {
        spriteEyeArray[i].visible = true;
      }
    }
  }
  else if (insideHelp == false)
  {
    sittingDown = false;

    switchToOrtho();

    for(var i=0; i<spriteEyeArray.length ; i++)
    {
      spriteEyeArray[i].visible = true;
    }
  }
}

//
// Here we remove a chair
//
function removeCadeira(obj) {

  var removalThing = "#"+obj.name;

  $(removalThing).remove();

  var index = selectedChairs.indexOf(obj);

  var eyeSpriteToRemove = spriteEyeArray[index];
  mainScene.remove(eyeSpriteToRemove);
  octree.remove(eyeSpriteToRemove);

  var selectedObject = mainScene.getObjectByName("selectChair_"+obj.name);
  mainScene.remove( selectedObject );

  if (index > -1)
  {
    selectedChairs.splice(index, 1);
    spriteEyeArray.splice(index, 1);
  }
}

// variables to check if we scrolled back or forth (zoom effect)
var alreadyScrolledFront = true;
var alreadyScrolledBack = false;

function render(dt) {
  renderVR.render(mainScene, camera);
}

function update(dt) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderVR.setSize(window.innerWidth, window.innerHeight);
}

//
// main render function (render cycle)
//
function animate() {

  if(!isVR)
  {
  // Get the camera position.
  //camera.position.set(newX, newY, newZ);
  camera.updateMatrixWorld();
  var p = new THREE.Vector3();
  p.setFromMatrixPosition(camera.matrixWorld);

  // And copy the position over to the listener.
  ctx.listener.setPosition(p.x, p.y, p.z);

  var vector = new THREE.Vector3(0, 0, -1);
  vector.applyEuler(camera.rotation, camera.rotation.order);
  ctx.listener.setOrientation(vector.x,vector.y,vector.z,0,1,0);

  }
  else
  {
    // Get the camera position.
    //camera.position.set(newX, newY, newZ);
    camera.updateMatrixWorld();
    var p = new THREE.Vector3();
    p.setFromMatrixPosition(camera.matrixWorld);

    // And copy the position over to the listener.
    ctx.listener.setPosition(p.x, p.y, p.z);

    var cameraRotation = new THREE.Euler(camera.getWorldDirection().x,camera.getWorldDirection().y,camera.getWorldDirection().z);

    ctx.listener.setOrientation(cameraRotation.x,cameraRotation.y,cameraRotation.z,0,1,0);
  }

  requestAnimationFrame(animate);
  // if we are rendering the loading scene
  if(isLoading)
  {
    renderer.render( loadingScene, camera );
    loaderMesh.rotation.y -= 0.03;
  }
  // if we are rendering the main scene
  else
  {

    for(var i=0; i<spriteEyeArray.length; i++)
    {
      spriteEyeArray[i].position.x += 0.002*Math.sin(clock.getElapsedTime() * 3);
      spriteEyeArray[i].position.z += 0.0005*Math.cos(clock.getElapsedTime() * 3);
    }

    renderer.render( mainScene, camera );

    statsFPS.begin();

    if(controls != undefined && !isLoadOcup && !isLoadingInfo)
      controls.update(clock.getDelta()); //for cameras

    octree.update();
    TWEEN.update();

    statsFPS.end();

    // clean all the sprites
    if(isPerspectiveOrtho || sittingDown)
    {
      for(var i=0; i<spriteEyeArray.length ; i++)
      {
        spriteEyeArray[i].visible = false;
      }
    }
    else // show all the sprites
    {
      for(var i=0; i<spriteEyeArray.length ; i++)
      {
        spriteEyeArray[i].visible = true;
      }
    }
  }

}

animate();

//
// if we click the view perspective button or EYE icon
//
function changePerspective(x, y, z,obj) {
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)){
    setTimeout(function(){ video.play(); }, 3000);
    setTimeout(function(){ sound.source.start(); }, 4300);
  }

  sittingDown = true;

  lastCameraPositionBeforeTween = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
  lastControlsLat = controls.lat;
  lastControlsLon = controls.lon;

  setupTweenFP(obj);

  for(var i=0; i<spriteEyeArray.length ; i++)
  {
    spriteEyeArray[i].visible = false;
  }

}

//
// if we click the view perspective button or EYE icon
//
function changePerspectiveOrtographic(x, y, z,obj) {

  sittingDown = true;
  isPerspectiveOrtho = false;
  sittingDownOrtho = true;


  // calculate centroid
  obj.geometry.computeBoundingBox();

  var centroid = new THREE.Vector3();
  centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );
  centroid.multiplyScalar( - 0.5 );

  centroid.applyMatrix4( obj.matrixWorld );
  //sittingDown = true;
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 15 );

  camera.position.x = centroid.x;
  camera.position.y = centroid.y+0.25; // head height
  camera.position.z = centroid.z;

  // calculate rotation based on two vectors
  var matrix = new THREE.Matrix4();
  matrix.extractRotation( obj.matrix );

  // front vector
  var direction = new THREE.Vector3( -1, 0, 0 );
  matrix.multiplyVector3( direction );

  // vector pointing at the reference sphere
  dis1 = screenReferenceSphere.position.x - obj.position.x ;
  dis2 = screenReferenceSphere.position.y - obj.position.y ;
  dis3 = screenReferenceSphere.position.z - obj.position.z;

  var vector = new THREE.Vector3(dis1,dis2,dis3);

  vector.normalize ();

  // calculate angle between two vectors
  var angle = direction.angleTo( vector );

  // calculate longitude angle - sideways rotation
  var longAngle;

  if(obj.position.z > 0)
  longAngle = -180+angle*180/Math.PI;
  else
  longAngle = 180-angle*180/Math.PI;



  controls = new THREE.FirstPersonControls(camera);

  controls.lookVertical = true;
  controls.constrainVertical = true;
  controls.verticalMin = Math.PI/3;
  controls.verticalMax = 2*Math.PI/3;
  controls.movementSpeed = 0;
  controls.autoForward = false;
  controls.lat = angle*180/Math.PI;
  controls.lon = longAngle;

  for(var i=0; i<spriteEyeArray.length ; i++)
  {
    spriteEyeArray[i].visible = false;
  }

}

//
// launch the Tween for changing perspective to seat perspective
//
function setupTweenFP(obj) {

  TWEEN.removeAll();
  // calculate centroid
  obj.geometry.computeBoundingBox();
  if( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
    spriteplay.position.x = -6.160114995658247;
    spriteplay.position.y = 1.0;
    spriteplay.position.z = 0.009249939938009306;
    spriteplay.onclick = function() {
      video.play();
    }
    mainScene.add( spriteplay );
  }

  var centroid = new THREE.Vector3();
  centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );
  centroid.multiplyScalar( - 0.5 );

  centroid.applyMatrix4( obj.matrixWorld );

  // calculate rotation based on two vectors
  var matrix = new THREE.Matrix4();
  matrix.extractRotation( obj.matrix );

  // front vector
  var direction = new THREE.Vector3( -1, 0, 0 );
  matrix.multiplyVector3( direction );

  // vector pointing at the reference sphere
  dis1 = screenReferenceSphere.position.x - obj.position.x ;
  dis2 = screenReferenceSphere.position.y - obj.position.y ;
  dis3 = screenReferenceSphere.position.z - obj.position.z;

  var vector = new THREE.Vector3(dis1,dis2,dis3);

  vector.normalize ();

  var vectorTemp = vector.divideScalar(5);
  var vectorTeste = new THREE.Vector3(centroid.x + vectorTemp.x, centroid.y + vectorTemp.y, centroid.z + vectorTemp.z);

  // calculate angle between two vectors
  var angle = direction.angleTo( vector );

  // tween the fov fowards
  tweenFov = new TWEEN.Tween(camera).to({
    fov:70
  },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
    camera.updateProjectionMatrix();
  }).onComplete(function () {
  }).start();

  // tween camera movement
  tweenFP = new TWEEN.Tween(camera.position).to({
    x: centroid.x-0.05,
    y: centroid.y+0.25, // head height
    z: centroid.z
  },2000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {

  }).onComplete(function () {
    controls.target = new THREE.Vector3(vectorTeste.x, vectorTeste.y + 0.22, vectorTeste.z);
    controls.center = controls.target;

    /*listener.setPosition(camera.position.x,camera.position.y,camera.position.z);
    listener.setOrientation(-1,0,0,0,1,0);*/
  }).start();

  if(!isVR)
  {
    // tween camera movement
    tweenFPTarget = new TWEEN.Tween(controls.target).to({
      x: vectorTeste.x,
      y: vectorTeste.y + 0.22, // head height
      z: vectorTeste.z
    },2000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {

    }).onComplete(function () {
      controls.center = controls.target;
    }).start();
  }
  // calculate longitude angle - sideways rotation
  var longAngle;

  if(obj.position.z > 0)
  longAngle = -180+angle*180/Math.PI
  else
  longAngle = 180-angle*180/Math.PI

  // tween the camera rotation sideways
  tweenCamRotationFP = new TWEEN.Tween(controls).to({
    lon:longAngle
  },2000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {
  }).onComplete(function () {
  }).start();


}
//
// launch the Tween for changing perspective to overview perspective
//
function setupTweenOverview() {

  // tween the fov fowards
  tweenFov = new TWEEN.Tween(camera).to({
    fov:60
  },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
    camera.updateProjectionMatrix();
  }).onComplete(function () {
  }).start();

  // tween camera position
  tweenOverview = new TWEEN.Tween(camera.position).to({
    x: lastCameraPositionBeforeTween.x,
    y: lastCameraPositionBeforeTween.y,
    z: lastCameraPositionBeforeTween.z
  },3000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {
  }).onComplete(function () {
  }).start();

  tweenCamRotToLastPlace = new TWEEN.Tween(camera.rotation).to({
    x: camera.rotation.x,
    y: camera.rotation.y,
    z: camera.rotation.z,
  },100).easing(TWEEN.Easing.Sinusoidal.InOut).onComplete(function () {
    // tween the camera rotation vertically
    tweenLatOver = new TWEEN.Tween(controls).to({
      lat:lastControlsLat
    },3000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {
    }).onComplete(function () {
      controls.lookVertical = true;
      controls.constrainVertical = true;
      controls.verticalMin = THREE.Math.degToRad(70);
      controls.verticalMax = THREE.Math.degToRad(130);
      controls.movementSpeed = 0;
      controls.autoForward = false;
      video.currentTime = 0;

      controls.target = new THREE.Vector3(-5,1.55,0.009249939938009306);
      controls.center = controls.target;
    }).start();
    // tween camera rotation horizontally
    tweenCamRotationOver = new TWEEN.Tween(controls).to({
      lon:lastControlsLon
    },2000).easing(TWEEN.Easing.Sinusoidal.InOut).start();
  }).start();

}

function animateVr() {
  vr = requestAnimationFrame(animateVr);
  update(clock.getDelta());
  render(clock.getDelta());
}

function switchToVr() {
  if (isVR==false) // if we're in cinema overview 3D change to VR view
  {
    controls = new THREE.DeviceOrientationControls(camera,true);
    controls.connect();
    renderVR = new THREE.StereoEffect(renderer);
    renderVR.eyeSeparation = 0.01;
    document.getElementById ('ptrocavr').innerHTML = "3D";
    document.getElementById("ptrocavrImg").src="img/icon - cadeiras 3D.png";
    isVR = true;
    animateVr();
    var reticle = vreticle.Reticle(camera);
    mainScene.add(camera);
    document.getElementById("legDir").style.display = "none";
  }
  else // change back to 3D view
  {
    document.getElementById ('ptrocavr').innerHTML = "VR";
    document.getElementById("ptrocavrImg").src="img/VR-icon.png";
    isVR = false;
    cancelAnimationFrame(vr);
    renderer.setSize( window.innerWidth, window.innerHeight );
    mainScene.remove(camera);
    document.getElementById("legDir").style.display = "block";
    controls = new THREE.OrbitControls(camera);
    controls.target = new THREE.Vector3(-5,1.55,0.009249939938009306);
    controls.center = controls.target;
  }
}

function switchToOrtho() {
  sittingDownOrtho = false;
  if (isPerspectiveOrtho==false) // if we're in cinema overview 3D change to 2D view
  {
    document.getElementById ('ptrocapresp').innerHTML = "3D";
    document.getElementById("ptrocaprespImg").src="img/icon - cadeiras 3D.png";
    document.getElementById("legEsq").style.display = "none";
    if(!sittingDown)
    {
      isPerspectiveOrtho = true;

      camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.001, 1000);
      camera.position.x = 0;
      camera.position.y = 2;
      camera.position.z = 0;
      camera.lookAt(mainScene.position);
      if(window.innerWidth > window.innerHeight)
      camera.zoom = window.innerWidth*0.037;
      else
      camera.zoom = window.innerHeight*0.063;
      camera.updateProjectionMatrix();
    }
  }
  else // change back to 3D view
  {
    document.getElementById ('ptrocapresp').innerHTML = "Planta";
    document.getElementById("ptrocaprespImg").src="img/icon cadeiras.png";
    document.getElementById("legEsq").style.display = "block";
    isPerspectiveOrtho = false;

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 15 );

    camera.position.x = -6.160114995658247;
    camera.position.y = 1.5;
    camera.position.z = 0.009249939938009306;

    controls = new THREE.OrbitControls(camera);
    controls.target = new THREE.Vector3(-5,1.55,0.009249939938009306);
    controls.center = controls.target;
  }
}
