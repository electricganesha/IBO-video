$.ajax({
  type: "GET",
  url: "js/three.js",
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
  url: "js/FirstPersonControls.js",
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
  url: "js/threex.videotexture.js",
  dataType: "script",
  async: false
});

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

var isSelected = false; // if at least one chair is selected

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


var firstTimeRunning = true;
var firstTimeLoading = true;
var firstTimeInit = true;

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

var cinemaSelecionado = "";
var nCinemaSelecionado;
var slidedown = false;
var slidedownpreco = false;
var slidedowndata = false;
var slidedownsessao = false;
var mudousessao = false;
var clickfull = false;
var isLoadOcup = false;
var anterior = "";
var icon_anterior = "";
var capacidade = 0;
var lugaresLivres = 0;
var cinemasJSON;
var dias;
var sessoesJSON;
var num_sessao = "0";
var n_sessao_select;
var carregouFreeSeats = false;
var clickhelpbt = false;

var deviceOrientationSelectedObject;
var deviceOrientationSelectedPoint;

// RANDOM

var screenReferenceSphere; // the sphere (invisible) located in the middle of the screen, to lookAt

var updateFcts = []; // the array with the video frames
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

// create the material
var materialcadeiraHighLight = new THREE.MeshPhongMaterial( {
  map: texturaCadeiraHighlight,
  normalMap: texturaCadeiraNormalMap
});

// create the material
var materialcadeiraNormal = new THREE.MeshPhongMaterial( {
  map: texturaCadeira,
  normalMap: texturaCadeiraNormalMap
});

// create the material
var materialcadeiraDeficiente = new THREE.MeshPhongMaterial( {
  map: texturaCadeiraDeficiente,
  normalMap: texturaCadeiraNormalMap
});

// create the material
var materialcadeiraOcupada = new THREE.MeshPhongMaterial( {
  map: texturaCadeiraOcupada,
  normalMap: texturaCadeiraNormalMap
});

//WEB AUDIO
// Detect if the audio context is supported.
window.AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  null
);

var AudioContext = window.AudioContext || window.webkitAudioContext;

if (!AudioContext) {
  throw new Error("AudioContext not supported!");
}

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

  // Create a new audio context.
  var audioCtx = new AudioContext();

  var panner = audioCtx.createPanner();

  var listener = audioCtx.listener;
  listener.setPosition(0,0,-5);
  listener.setOrientation(-1,0,0,0,1,0);

  var gainNode = audioCtx.createGain();

  var source;


// WEB AUDIO
function setupAudioProcessing()
{

  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 0.1;
  panner.coneInnerAngle = 0;
  panner.coneOuterAngle = 45;
  panner.coneOuterGain = 1;
  panner.setPosition(-6,1.5,0);
  panner.setOrientation(1,0,0);

  source = audioCtx.createMediaElementSource(video);
  source.connect(panner);

  panner.connect(audioCtx.destination);
}

// STRUCTURAL / DOM / RENDERER

renderer = new THREE.WebGLRenderer({ precision: "lowp", antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );
element = renderer.domElement;
container = document.body;
container.appendChild(element);

// create the main selection menu
var waterMarkDiv = document.createElement('div');
waterMarkDiv.style.width = '100px';
waterMarkDiv.style.position = "absolute";
waterMarkDiv.id = 'watermarkDiv';
waterMarkDiv.style.bottom = "5%";
waterMarkDiv.style.left = "3%";
waterMarkDiv.innerHTML = "<img src='img/Push_Logo_transparente.png' style = 'width:120px;''></img>";
document.body.appendChild(waterMarkDiv);

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
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);

  var light = new THREE.AmbientLight( 0xffffff ); // soft white light
  loadingScene.add( light );

  camera.position.set(0, 0, 2);
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
    document.getElementById("ptrocafsImg").src="img/exit-full-screen.png";
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
    document.getElementById("ptrocafsImg").src="img/full-screen-button.png";
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


function init() {

  setupAudioProcessing();

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 15 );

  camera.position.x = -6.160114995658247;
  camera.position.y = 1.5;
  camera.position.z = 0.009249939938009306;

  controls = new THREE.FirstPersonControls(camera);
  controls.lon = 0;
  controls.lat = -15;

  controls.lookVertical = true;
  controls.constrainVertical = true;
  controls.verticalMin = THREE.Math.degToRad(70);
  controls.verticalMax = THREE.Math.degToRad(130);

  controls.minPolarAngle = 0; // radians
  controls.maxPolarAngle = Math.PI; // radians

  controls.movementSpeed = 0;
  controls.autoForward = false;


  // lights
  var light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.0 );
  mainScene.add( light );

  // model
  group = new THREE.Object3D();

  //event listeners
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousewheel', onMouseWheel, false);

  $(window).mouseleave(function() {
    // cursor has left the building
    mouseIsOutOfDocument = true;
    controls.lookSpeed = 0;
  })
  $(window).mouseenter(function() {
    // cursor has entered the building
    mouseIsOutOfDocument = false;
  })

  window.addEventListener( 'resize', onWindowResize, false );


  showMenuSelect(); // this method initialises the side div container

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
  divMain.style.borderRadius = "15px";
  divMain.style.backgroundColor= "rgba(0, 0, 0, 0.7)";
  divMain.style.cursor = "pointer";
  divMain.style.width = '50%';
  divMain.style.textAlign = "center";
  divMain.style.fontFamily = "osb";
  divMain.style.height = '530px';
  divMain.style.position = "absolute";
  divMain.id = 'textScreen';
  divMain.style.left = '25%';
  divMain.style.top = '50%';
	divMain.style.transform = "translateY(-50%)";

  var divtexto1 = document.createElement('div');
  divtexto1.style.borderBottom = "solid 1px #1bbc9b";
  divtexto1.style.width = "35%";
  divtexto1.style.paddingTop = "15px";
  divtexto1.style.height = "65px";
  divtexto1.style.margin = "auto";

  var textowelcome = document.createElement('p');
  textowelcome.innerHTML = "Bem Vindo ao <b>IBO</b>";
  textowelcome.style.fontFamily = "osr";
  textowelcome.style.fontSize = "23px";

  var textoespaco = document.createElement('p');
  textoespaco.innerHTML = "<br>";
  textoespaco.style.fontFamily = "osr";

  var textoapre = document.createElement('p');
  textoapre.innerHTML = "Uma experiência interactiva da PUSH Interactive";
  textoapre.style.fontFamily = "osr";
  textoapre.style.fontSize = "14px";

  var divleft = document.createElement('div');
  divleft.style.borderRight = "solid 1px #1bbc9b";
  divleft.style.width = "33.2%";
  divleft.style.marginTop = "50px";
  divleft.style.float = "left";
  divleft.style.height = "150px";

  var divlefttext = document.createElement('p');
  divlefttext.innerHTML = "Para navegar mova o cursor";
  divlefttext.style.fontFamily = "osr";
  divlefttext.style.fontSize = "14px";
  divlefttext.style.color = "#1bbc9b";

  var divleftimg = document.createElement('img');
  divleftimg.id = "divleftimg";
  divleftimg.style.marginTop = "5px";


  var divmid = document.createElement('div');
  divmid.style.borderRight = "solid 1px #1bbc9b";
  divmid.style.width = "33.2%";
  divmid.style.marginTop = "50px";
  divmid.style.float = "left";
  divmid.style.height = "150px";

  var divmidtext = document.createElement('p');
  divmidtext.innerHTML = "Faça zoom com a roda";
  divmidtext.style.fontFamily = "osr";
  divmidtext.style.fontSize = "14px";
  divmidtext.style.color = "#1bbc9b";

  var divmidimg = document.createElement('img');
  divmidimg.id = "divmidimg";
  divmidimg.style.marginTop = "20px";

  var divright = document.createElement('div');
  divright.style.width = "33.2%";
  divright.style.marginTop = "50px";
  divright.style.float = "left";
  divright.style.height = "150px";

  var divrighttext = document.createElement('p');
  divrighttext.innerHTML = "Selecione os seus lugares";
  divrighttext.style.fontFamily = "osr";
  divrighttext.style.fontSize = "14px";
  divrighttext.style.color = "#1bbc9b";

  var divrightimg = document.createElement('img');
  divrightimg.id = "divrightimg";
  divrightimg.style.marginTop = "20px";

  var diveye = document.createElement('div');
  diveye.style.width = "33.2%";
  diveye.style.margin = "0 auto";
  diveye.style.height = "150px";
  diveye.style.paddingTop = "30px";
  diveye.style.clear = "both";

  var diveyetext = document.createElement('p');
  diveyetext.innerHTML = "Ver perspectiva do lugar";
  diveyetext.style.fontFamily = "osr";
  diveyetext.style.fontSize = "14px";
  diveyetext.style.color = "#1bbc9b";

  var diveyeimg = document.createElement('img');
  diveyeimg.id = "diveyeimg";
  diveyeimg.style.marginTop = "20px";


  var splashMain = document.createElement('div');
  splashMain.style.width = '400px';
  splashMain.style.fontFamily = "osb";
  splashMain.style.height = '350px';
  splashMain.style.position = "absolute";
  splashMain.id = 'splashelp';
  splashMain.style.top = '10%';
  splashMain.style.left = '-400px';


  var splashelp = document.createElement('div');
  splashelp.style.color = "white";
  splashelp.style.backgroundColor= "rgba(0, 0, 0, 0.7)";
  splashelp.style.width = '350px';
  splashelp.style.textAlign = "center";
  splashelp.style.fontFamily = "osb";
  splashelp.style.height = '100%';
  splashelp.id = 'splashelp';
  splashelp.style.float = "left";

  var splashelpbt = document.createElement('div');
  splashelpbt.style.color = "white";
  splashelpbt.style.backgroundColor= "rgba(0, 0, 0, 0.7)";
  splashelpbt.style.cursor = "pointer";
  splashelpbt.style.width = '50px';
  splashelpbt.style.textAlign = "center";
  splashelpbt.style.fontFamily = "osb";
  splashelpbt.style.height = '50px';
  splashelpbt.style.float = "right";
  splashelpbt.id = 'splashelpbt';
  splashelpbt.onclick = function() {
    if (!clickhelpbt){
      $("#splashelp").animate({"left": '+=350px'});
      clickhelpbt = true;
    }else{
      $("#splashelp").animate({"left": '-=350px'});
      clickhelpbt = false;
    }
  }

  var splashelpbttext = document.createElement('p');
  splashelpbttext.innerHTML = "?";
  splashelpbttext.style.fontFamily = "osb";
  splashelpbttext.style.fontSize = "32px";
  splashelpbttext.style.color = "#1bbc9b";
  splashelpbttext.style.marginTop = "0px";

  var divlefth = document.createElement('div');
  divlefth.style.borderRight = "solid 1px #1bbc9b";
  divlefth.style.width = "33%";
  divlefth.style.marginTop = "30px";
  divlefth.style.float = "left";
  divlefth.style.height = "130px";

  var divlefttexth = document.createElement('p');
  divlefttexth.innerHTML = "Para navegar mova o cursor";
  divlefttexth.style.fontFamily = "osr";
  divlefttexth.style.fontSize = "13px";
  divlefttexth.style.width = "90%";
  divlefttexth.style.color = "#1bbc9b";
  divlefttexth.style.margin = "auto";
  divlefttexth.style.marginTop = "5px";

  var divleftimgh = document.createElement('img');
  divleftimgh.id = "divleftimgh";
  divleftimgh.style.marginTop = "10px";
  divleftimgh.style.width = "50px";

  var divmidh = document.createElement('div');
  divmidh.style.borderRight = "solid 1px #1bbc9b";
  divmidh.style.width = "33%";
  divmidh.style.marginTop = "30px";
  divmidh.style.float = "left";
  divmidh.style.height = "130px";

  var divmidtexth = document.createElement('p');
  divmidtexth.innerHTML = "Faça zoom com a roda";
  divmidtexth.style.fontFamily = "osr";
  divmidtexth.style.fontSize = "13px";
  divmidtexth.style.width = "90%";
  divmidtexth.style.color = "#1bbc9b";
  divmidtexth.style.margin = "auto";
  divmidtexth.style.marginTop = "5px";

  var divmidimgh = document.createElement('img');
  divmidimgh.id = "divmidimgh";
  divmidimgh.style.marginTop = "20px";
  divmidimgh.style.width = "28px";

  var divrighth = document.createElement('div');
  divrighth.style.width = "33%";
  divrighth.style.marginTop = "30px";
  divrighth.style.float = "left";
  divrighth.style.height = "150px";

  var divrighttexth = document.createElement('p');
  divrighttexth.innerHTML = "Selecione os seus lugares";
  divrighttexth.style.fontFamily = "osr";
  divrighttexth.style.fontSize = "13px";
  divrighttexth.style.width = "90%";
  divrighttexth.style.color = "#1bbc9b";
  divrighttexth.style.margin = "auto";
  divrighttexth.style.marginTop = "5px";

  var divrightimgh = document.createElement('img');
  divrightimgh.id = "divrightimgh";
  divrightimgh.style.marginTop = "20px";
  divrightimgh.style.width = "28px";

  var diveyeh = document.createElement('div');
  diveyeh.style.width = "33.2%";
  diveyeh.style.margin = "0 auto";
  diveyeh.style.height = "120px";
  diveyeh.style.paddingTop = "10px";
  diveyeh.style.clear = "both";

  var diveyetexth = document.createElement('p');
  diveyetexth.innerHTML = "Ver perspectiva do lugar";
  diveyetexth.style.fontFamily = "osr";
  diveyetexth.style.fontSize = "13px";
  diveyetexth.style.width = "90%";
  diveyetexth.style.color = "#1bbc9b";
  diveyetexth.style.margin = "auto";

  var diveyeimgh = document.createElement('img');
  diveyeimgh.id = "diveyeimgh";
  diveyeimgh.style.marginTop = "20px";
  diveyeimgh.style.width = "40px";


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

  splashMain.appendChild(splashelp);
  splashMain.appendChild(splashelpbt);

  splashelpbt.appendChild(splashelpbttext);

  splashelp.appendChild(divlefth);
  divlefth.appendChild(divlefttexth);
  divlefth.appendChild(divleftimgh);

  splashelp.appendChild(divmidh);
  divmidh.appendChild(divmidtexth);
  divmidh.appendChild(divmidimgh);

  splashelp.appendChild(divrighth);
  divrighth.appendChild(divrighttexth);
  divrighth.appendChild(divrightimgh);

  splashelp.appendChild(diveyeh);
  diveyeh.appendChild(diveyetexth);
  diveyeh.appendChild(diveyeimgh);

  iDiv.appendChild(divMain);
  document.body.appendChild(iDiv);
  document.body.appendChild(splashMain);
  document.getElementById("divleftimg").src="img/move_mouse.png";
  document.getElementById("divmidimg").src="img/mouse.png";
  document.getElementById("divrightimg").src="img/mouse_click.png";
  document.getElementById("diveyeimg").src="img/eye.png";

  document.getElementById("divleftimgh").src="img/move_mouse.png";
  document.getElementById("divmidimgh").src="img/mouse.png";
  document.getElementById("divrightimgh").src="img/mouse_click.png";
  document.getElementById("diveyeimgh").src="img/eye.png";

  $("#loadedScreen").fadeIn("slow");
  $("#loadedScreen" ).click(function() {
    $("#loadedScreen").fadeOut("slow");
    video.play();
    video.pause();
    insideHelp = false;
    $("#legenda").animate({"marginTop": '-=100px'});
    $("#splashelp").animate({"left": '+=50px'});
    setTimeout(function(){
      legEsq.style.animation = "coloranim 1.5s 2";
  	  legEsq.style.webkitAnimation = "coloranim 1.5s 2";
    }, 2000);
    setTimeout(function(){
      legDir.style.animation = "coloranim 1.5s 2";
  	  legDir.style.webkitAnimation = "coloranim 1.5s 2";
    }, 4500);
    setTimeout(function(){
      splashelpbt.style.animation = "coloranimbt 1.5s 2";
  	  splashelpbt.style.webkitAnimation = "coloranimbt 1.5s 2";
    }, 7000);

  });
  isLoading = false;
  firstTimeInit = false;
  $('#splashelp').bind('mouseenter' ,"*", function(e){
    mouseIsOnMenu = true;
    controls.lookSpeed = 0;
  },false);

  $('#splashelp').bind('mouseleave', "*", function(e){
    mouseIsOnMenu = false;
  },false);
}

//
// create a show the selection menu
//
function showMenuSelect(){

  var loading_seats = document.createElement('div');
  loading_seats.style.width = '100%';
  loading_seats.style.cursor = "pointer";
  loading_seats.style.textAlign = "center";
  loading_seats.style.height = '100%';
  loading_seats.style.position = "absolute";
  loading_seats.id = 'loading_seats';
  loading_seats.style.top = '0';
  loading_seats.style.backgroundImage = "url('img/print.png')";
  loading_seats.style.display = "none";
  loading_seats.style.filter = "blur(30px)";
  loading_seats.style.webkitFilter = "blur(15px)";
  loading_seats.style.mozFilter = "blur(15px)";
  loading_seats.style.oFilter = "blur(15px)";
  loading_seats.style.msFilter = "blur(15px)";

  /*var textDivLoading = document.createElement('div');
  textDivLoading.style.color = "white";
  textDivLoading.style.cursor = "pointer";
  textDivLoading.innerHTML = "Loading Occupation";
  textDivLoading.style.width = '50%';
  textDivLoading.style.textAlign = "center";
  textDivLoading.style.fontFamily = "osb";
  textDivLoading.style.fontSize= "50px";
  textDivLoading.style.position = "absolute";
  textDivLoading.id = 'textDivLoading';
  textDivLoading.style.left = '24%';
  textDivLoading.style.top = '40%';
  loading_seats.appendChild(textDivLoading);*/
  document.body.appendChild(loading_seats);
  function carregarCinemas() {
    $.ajax({
      url:        'php/ler_BDCc.php',
      dataType:   "json", // <== JSON-P request
      success:    function(data){
        cinemasJSON = data;
        loadCinemas();
      },
      error:    function(textStatus,errorThrown){
        console.log(textStatus);
        console.log(errorThrown);
      }

    });
  }

  function carregarData() {
      $.ajax({
        url: 'php/ler_BDData.php', //This is the current doc
        type: "POST",
        dataType:'json', // add json datatype to get json
        data: ({cinema: nCinemaSelecionado}),
        success: function(data){
          dias = data - 1;
          showData.style.pointerEvents = "all";
          showData.style.cursor = "auto";
          showData.style.color = "#1bbc9b";
        },
        error:    function(textStatus,errorThrown){
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
    }

  function carregarSessao() {
    $.ajax({
      url:        'php/ler_BDSessao.php',
      dataType:   "json", // <== JSON-P request
      success:    function(data){
        sessoesJSON = data;
        $("#showSessaoDiv").html("");
        loadSessoes();
        showSessao.style.pointerEvents = "all";
        showSessao.style.cursor = "auto";
        showSessao.style.color = "#1bbc9b";
      },
      error:    function(textStatus,errorThrown){
        console.log(textStatus);
        console.log(errorThrown);
      }

    });
  }

  function loadCinemas (){
    for( var p=0 ; p<cinemasJSON.length ; p++){
      var nome_cinema = cinemasJSON[p].nome_variavel;
      var nome_cinema = document.createElement("a");
      nome_cinema.href = "#";
      nome_cinema.text = cinemasJSON[p].nome_cinema;
      nome_cinema.style.fontFamily = "osl";
      nome_cinema.style.textDecoration = "none";
      nome_cinema.style.color = "#FFF";
      nome_cinema.className = cinemasJSON[p].id_cinema;
      nome_cinema.style.display = "block";
      nome_cinema.style.width = "90%";
      nome_cinema.style.paddingLeft = "10%";
      nome_cinema.onmouseover = function() {
        this.style.backgroundColor = "#344b5d";
      }
      nome_cinema.onmouseout = function() {
        this.style.backgroundColor = "#263343";
      }
      nome_cinema.onclick = function() {
        cinemaSelecionado = this.text;
        nCinemaSelecionado = this.className;
        showData.text = "Data";
        showData.appendChild(iconData);
        $('#iconData').className = 'fa fa-angle-down';
        showSessao.text = "Sessão";
        showSessao.appendChild(iconSessao);
        $('#iconSessao').className = 'fa fa-angle-down';
        showData.style.pointerEvents = "none";
        showData.style.cursor = "default";
        showData.style.color = "#446368";
        showSessao.style.pointerEvents = "none";
        showSessao.style.cursor = "default";
        showSessao.style.color = "#446368";
        carregarData();
        showDivCinemas.text = cinemaSelecionado;
        showDivCinemas.appendChild(icon);
        $(showDivCinemas).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
        $('#showCinemas').slideUp();
        slidedown = false;
      }
      showCinemas.appendChild(nome_cinema);
    }
  }

  function loadSessoes (){
    var intervalo_ecra;
    for( var p=0 ; p<sessoesJSON.length ; p++){
      var n_sessao = sessoesJSON[p].id_sessao;
      var n_sessao = document.createElement("a");
      n_sessao.href = "#";
      n_sessao.text = sessoesJSON[p].hora_sessao;
      n_sessao.style.fontFamily = "osr";
      n_sessao.style.textDecoration = "none";
      n_sessao.style.color = "#FFF";
      n_sessao.style.display = "inline-block";
      n_sessao.style.marginLeft = "4%";
      n_sessao.style.marginTop = "10px";
      n_sessao.id = sessoesJSON[p].id_sessao;
      n_sessao.onmouseover = function() {
        this.style.color = "#1bbc9b";
      }
      n_sessao.onmouseout = function() {
        this.style.color = "#FFF";
      }
      n_sessao.onclick = function() {
          $("#menuSelect").animate({"right": '-=300px'});
          $("#loading_seats").fadeIn("slow");
          //document.getElementById("loading_seats").style.display = "block";
          isLoadOcup = true;
          btnComprar.style.display = "inline-block";
          showSessao.text = this.text;
          showSessao.className = this.text;
          showSessao.appendChild(iconSessao);
          n_sessao_select = this.id;
          $('#iconSessao').toggleClass('fa fa-angle-down fa fa-angle-up');
          $('#showSessaoDiv').slideUp();
          slidedownsessao = false;
          isSelected = false;
          primeiravez = true;
          mouseIsOnMenu = true;
          mudousessao = true
          setTimeout(function(){

              carregarJSONBDInitial(n_sessao_select);

              for(var j= 0; j< selectedChairs.length ; j++)
              {
                var selectedObject = mainScene.getObjectByName("selectChair_"+selectedChairs[j].name);
                mainScene.remove( selectedObject );
                var removalThing = "#"+selectedChairs[j].name;
                $(removalThing).remove();
              }

              selectedChairs = [];

              for(var j= 0; j< spriteEyeArray.length ; j++)
              {
                var selectedObject = mainScene.getObjectByName(spriteEyeArray[j].name);
                mainScene.remove( selectedObject );
              }

              spriteEyeArray = [];

              var selectedObject = mainScene.getObjectByName("singleGeometryNormal");
              mainScene.remove( selectedObject );

              var selectedObject = mainScene.getObjectByName("singleGeometryOcupadas");
              mainScene.remove( selectedObject );

              var selectedObject = mainScene.getObjectByName("singleGeometryDeficiente");
              mainScene.remove( selectedObject );

              // we are using an octree for increasing the performance on raycasting
              octree = new THREE.Octree( {
                undeferred: true,
                depthMax: Infinity,
                objectsThreshold: 8,
                overlapPct: 0.15
              } );

              lugaresLivres = 0;
              capacidade = 0;
              intervalo_ecra = setInterval(function() {
                $("#loading_seats").fadeOut("slow");
                isLoadOcup = false;
                clearInterval(intervalo_ecra);
              }, 1500);
          }, 1000);
      }
      showSessaoDiv.appendChild(n_sessao);
    }
  }

  // create main legenda for cinema
  var legDiv = document.createElement('div');
  legDiv.style.width = '100%';
  legDiv.style.height = '80px';
  legDiv.style.position = "absolute";
  legDiv.id = 'LegDiv';
  legDiv.style.bottom = "0px";


  // create sub main legenda for cinema
  var legenda = document.createElement('div');
  legenda.style.width = '900px';
  legenda.style.margin = "auto";
  legenda.style.textAlign = "center";
  legenda.style.borderRadius = "10px";
  legenda.id = 'legenda';
  legenda.style.marginTop = "100px";

  var legEsq = document.createElement('div');
  legEsq.style.width = '90px';
  legEsq.style.float = "left";
  legEsq.style.textAlign = "center";
  legEsq.style.height = '100px';
  legEsq.style.background = '#1cbb9b';
  legEsq.style.borderRadius = "10px";
  legEsq.id = 'legEsq';
  legEsq.className = 'legEsq';
  legEsq.onclick = function() {
    if (!clickfull){
      fullscreen();
      clickfull = true;
    }else{
      fullscreen();
      clickfull = false;
    }
  }
  legEsq.onmouseover = function() {
    legEsq.style.cursor = 'pointer';
  }

  // create legend for cinema
  var legMid = document.createElement('div');
  legMid.style.width = '670px';
  legMid.style.float = "left";
  legMid.style.textAlign = "center";
  legMid.style.height = '200px';
  legMid.style.marginLeft = '25px';
  legMid.style.background = '#243141';
  legMid.style.borderRadius = "10px";
  legMid.id = 'legMid';
  // create legend for cinema
  var legDir = document.createElement('div');
  legDir.style.width = '90px';
  legDir.style.float = "right";
  legDir.style.textAlign = "center";
  legDir.style.height = '200px';
  legDir.style.background = '#1cbb9b';
  legDir.style.borderRadius = "10px";
  legDir.id = 'legDir';
  legDir.onclick = function() {
    switchToOrtho();
  }
  legDir.onmouseover = function() {
    legDir.style.cursor = 'pointer';
  }

  //Topic see prespective
  var topicDiv1 = document.createElement('div');
  topicDiv1.style.textAlign = "center";
  topicDiv1.style.float = "left";
  topicDiv1.style.width = "120px";
  topicDiv1.style.marginTop = "15px";
  //topicDiv1.style.border = "solid 2px red";
  topicDiv1.style.marginLeft = "23px";
  topicDiv1.style.height = "28px";
  topicDiv1.id = 'topicDiv1';

  var pverPresp = document.createElement('p');
  pverPresp.innerHTML = "Ver Perspectiva";
  pverPresp.style.color = "#FFF";
  pverPresp.style.fontSize = "12px";
  pverPresp.style.fontFamily = "osr";
  pverPresp.style.float = "right";
  pverPresp.style.marginTop = "4px";

  var pverPrespImg = document.createElement('img');
  pverPrespImg.id = "pverPrespImg";
  pverPrespImg.style.float = "left";

  topicDiv1.appendChild(pverPrespImg);
  topicDiv1.appendChild(pverPresp);
  legMid.appendChild(topicDiv1);

  //Topic available
  var topicDiv2 = document.createElement('div');
  topicDiv2.style.textAlign = "center";
  topicDiv2.style.float = "left";
  topicDiv2.style.width = "77px";
  //topicDiv2.style.border = "solid 2px red";
  topicDiv2.style.marginTop = "15px";
  topicDiv2.style.marginLeft = "23px";
  topicDiv2.style.height = "20px";
  topicDiv2.id = 'topicDiv2';
  topicDiv2.style.marginTop = '20px';

  var pavailable = document.createElement('p');
  pavailable.innerHTML = "Disponível";
  pavailable.style.color = "#FFF";
  pavailable.style.fontSize = "12px";
  pavailable.style.fontFamily = "osr";
  pavailable.style.float = "right";
  pavailable.style.marginTop = "0px";

  var pavailableImg = document.createElement('img');
  pavailableImg.id = "pavailableImg";
  pavailableImg.style.float = "left";
  pavailableImg.style.marginTop = "2px";

  topicDiv2.appendChild(pavailableImg);
  topicDiv2.appendChild(pavailable);
  legMid.appendChild(topicDiv2);

  //Topic selected
  var topicDiv3 = document.createElement('div');
  topicDiv3.style.textAlign = "center";
  topicDiv3.style.float = "left";
  topicDiv3.style.width = "85px";
  //topicDiv3.style.border = "solid 2px red";
  topicDiv3.style.marginTop = "15px";
  topicDiv3.style.marginLeft = "23px";
  topicDiv3.style.height = "20px";
  topicDiv3.id = 'topicDiv3';
  topicDiv3.style.marginTop = '20px';

  var pselected = document.createElement('p');
  pselected.innerHTML = "Selecionado";
  pselected.style.color = "#FFF";
  pselected.style.fontSize = "12px";
  pselected.style.fontFamily = "osr";
  pselected.style.float = "right";
  pselected.style.marginTop = "0px";

  var pselectedImg = document.createElement('img');
  pselectedImg.id = "pselectedImg";
  pselectedImg.style.float = "left";
  pselectedImg.style.marginTop = "2px";

  topicDiv3.appendChild(pselectedImg);
  topicDiv3.appendChild(pselected);
  legMid.appendChild(topicDiv3);

  //Topic defecient
  var topicDiv4 = document.createElement('div');
  topicDiv4.style.textAlign = "center";
  topicDiv4.style.float = "left";
  topicDiv4.style.width = "162px";
  //topicDiv4.style.border = "solid 2px red";
  topicDiv4.style.marginTop = "15px";
  topicDiv4.style.marginLeft = "23px";
  topicDiv4.style.height = "20px";
  topicDiv4.id = 'topicDiv3';
  topicDiv4.style.marginTop = '20px';

  var pdefecient = document.createElement('p');
  pdefecient.innerHTML = "Mobilidade Condicionada";
  pdefecient.style.color = "#FFF";
  pdefecient.style.fontSize = "12px";
  pdefecient.style.fontFamily = "osr";
  pdefecient.style.float = "right";
  pdefecient.style.marginTop = "0px";

  var pdefecientImg = document.createElement('img');
  pdefecientImg.id = "pdefecientImg";
  pdefecientImg.style.float = "left";
  pdefecientImg.style.marginTop = "2px";

  topicDiv4.appendChild(pdefecientImg);
  topicDiv4.appendChild(pdefecient);
  legMid.appendChild(topicDiv4);

  //Topic not available
  var topicDiv5 = document.createElement('div');
  topicDiv5.style.textAlign = "center";
  topicDiv5.style.float = "left";
  topicDiv5.style.width = "85px";
  //topicDiv5.style.border = "solid 2px red";
  topicDiv5.style.marginTop = "15px";
  topicDiv5.style.marginLeft = "23px";
  topicDiv5.style.height = "20px";
  topicDiv5.id = 'topicDiv5';
  topicDiv5.style.marginTop = '20px';

  var pnotava = document.createElement('p');
  pnotava.innerHTML = "Indisponível";
  pnotava.style.color = "#FFF";
  pnotava.style.fontSize = "12px";
  pnotava.style.fontFamily = "osr";
  pnotava.style.float = "right";
  pnotava.style.marginTop = "0px";

  var pnotavaImg = document.createElement('img');
  pnotavaImg.id = "pnotavaImg";
  pnotavaImg.style.float = "left";
  pnotavaImg.style.marginTop = "2px";

  topicDiv5.appendChild(pnotavaImg);
  topicDiv5.appendChild(pnotava);
  legMid.appendChild(topicDiv5);

  //Topic Capacity
  var capacityDiv = document.createElement('div');
  capacityDiv.style.textAlign = "center";
  capacityDiv.style.float = "left";
  capacityDiv.style.width = "135px";
  //topicDiv5.style.border = "solid 2px red";
  capacityDiv.style.marginLeft = "23px";
  capacityDiv.style.height = "20px";
  capacityDiv.id = 'capacityDiv';
  capacityDiv.style.marginTop = '10px';

  var pcapacity = document.createElement('p');
  pcapacity.innerHTML = "Capacidade:";
  pcapacity.style.color = "#1cbb9b";
  pcapacity.style.fontSize = "17px";
  pcapacity.style.fontFamily = "osb";
  pcapacity.style.float = "left";
  pcapacity.style.marginTop = "0px";

  var pcapacityNumber = document.createElement('p');
  pcapacityNumber.innerHTML = capacidade;
  pcapacityNumber.id = "pcapacityNumber";
  pcapacityNumber.style.color = "#FFF";
  pcapacityNumber.style.fontSize = "17px";
  pcapacityNumber.style.fontFamily = "osb";
  pcapacityNumber.style.float = "right";
  pcapacityNumber.style.marginTop = "0px";

  capacityDiv.appendChild(pcapacity);
  capacityDiv.appendChild(pcapacityNumber);
  legMid.appendChild(capacityDiv);

  //Topic Free seats
  var freeseatsDiv = document.createElement('div');
  freeseatsDiv.style.textAlign = "center";
  freeseatsDiv.style.float = "left";
  freeseatsDiv.style.width = "155px";
  //topicDiv5.style.border = "solid 2px red";
  freeseatsDiv.style.marginLeft = "23px";
  freeseatsDiv.style.height = "20px";
  freeseatsDiv.id = 'freeseatsDiv';
  freeseatsDiv.style.marginTop = '10px';

  var pfreeseats = document.createElement('p');
  pfreeseats.innerHTML = "Lugares livres:";
  pfreeseats.style.color = "#1cbb9b";
  pfreeseats.style.fontSize = "17px";
  pfreeseats.style.fontFamily = "osb";
  pfreeseats.style.float = "left";
  pfreeseats.style.marginTop = "0px";

  var pfreeseatsNumber = document.createElement('p');
  pfreeseatsNumber.innerHTML = lugaresLivres;
  pfreeseatsNumber.id = "pfreeseatsNumber";
  pfreeseatsNumber.style.color = "#FFF";
  carregouFreeSeats = true;
  pfreeseatsNumber.style.fontSize = "17px";
  pfreeseatsNumber.style.fontFamily = "osb";
  pfreeseatsNumber.style.float = "right";
  pfreeseatsNumber.style.marginTop = "0px";

  freeseatsDiv.appendChild(pfreeseats);
  freeseatsDiv.appendChild(pfreeseatsNumber);
  legMid.appendChild(freeseatsDiv);

  var ptrocapresp = document.createElement('p');
  ptrocapresp.innerHTML = "Ver Planta";
  ptrocapresp.style.color = "#FFF";
  ptrocapresp.style.fontSize = "13px";
  ptrocapresp.style.fontFamily = "osr";
  ptrocapresp.style.marginTop = "15px";
  ptrocapresp.id = "ptrocapresp";

  var ptrocaprespImg = document.createElement('img');
  ptrocaprespImg.id = "ptrocaprespImg";
  ptrocaprespImg.style.marginTop = "2px";

  var ptrocafs = document.createElement('p');
  ptrocafs.innerHTML = "FullScreen";
  ptrocafs.style.color = "#FFF";
  ptrocafs.style.fontSize = "13px";
  ptrocafs.style.fontFamily = "osr";
  ptrocafs.style.marginTop = "15px";
  ptrocafs.id = "ptrocafs";

  var ptrocafsImg = document.createElement('img');
  ptrocafsImg.id = "ptrocafsImg";
  ptrocafsImg.style.marginTop = "-4px";

  legEsq.appendChild(ptrocafs);
  legEsq.appendChild(ptrocafsImg);

  legDir.appendChild(ptrocapresp);
  legDir.appendChild(ptrocaprespImg);

  legenda.appendChild(legEsq);
  legenda.appendChild(legMid);
  legenda.appendChild(legDir);
  legDiv.appendChild(legenda);
  document.body.appendChild(legDiv);
  document.getElementById("pverPrespImg").src="img/ver.png";
  document.getElementById("pavailableImg").src="img/Bola_0001_vermelho.png";
  document.getElementById("pselectedImg").src="img/Bola_0003_verde.png";
  document.getElementById("pdefecientImg").src="img/Bola_0002_azul.png";
  document.getElementById("pnotavaImg").src="img/Bola_0000_cinza.png";
  document.getElementById("ptrocaprespImg").src="img/icon cadeiras.png";
  document.getElementById("ptrocafsImg").src="img/full-screen-button.png";


  // create the main selection menu
  var iDiv = document.createElement('div');
  //iDiv.innerHTML = " Cadeiras seleccionadas : ";
  iDiv.style.width = '300px';
  iDiv.style.textAlign = "center";
  iDiv.style.height = '100vh';
  iDiv.style.position = "absolute";
  iDiv.style.background = '#fff';
  iDiv.id = 'menuSelect';
  iDiv.style.right = '-300px';
  iDiv.style.top = '0';

  // create div for collect information about movie
  var divInfoMovie = document.createElement('div');
  divInfoMovie.style.width = '100%';
  divInfoMovie.style.height = '150px';
  divInfoMovie.style.padding = '0';
  divInfoMovie.style.position = "absolute";
  divInfoMovie.style.background = '#FFF';
  divInfoMovie.id = 'divInfoMovie';
  divInfoMovie.style.right = '0';
  divInfoMovie.style.top = '0';

  // create element for logo
  var logoCinema = document.createElement("img");
  logoCinema.id = "logoCinema";
  logoCinema.style.marginTop = "3%";

  // create element for name of movie
  var movieName = document.createElement("p");
  movieName.id = "movieName";
  movieName.innerHTML = "Deadpool | 3D";
  movieName.style.fontFamily = "osb";
  movieName.style.lineHeight ="80%";
  movieName.style.color = "#243141";
  movieName.style.fontSize = "18px";

  // create element for info of movie
  var movieInfo = document.createElement("p");
  movieInfo.id = "movieInfo";
  movieInfo.innerHTML = "Acção, Aventura, Comedia | M/14";
  movieInfo.style.fontFamily = "osr";
  movieInfo.style.lineHeight ="80%";
  movieInfo.style.color = "#243141";
  movieInfo.style.fontSize = "14px";

  // create div for collect information
  var divInfo = document.createElement('div');
  divInfo.style.width = '100%';
  divInfo.style.height = '100%';
  divInfo.style.padding = '0';
  divInfo.style.position = "absolute";
  divInfo.style.background = '#2d3e50';
  divInfo.id = 'menuInfo';
  divInfo.setAttribute('class', 'menuInfo');
  divInfo.style.right = '0';
  divInfo.style.top = '150px';

  // create link to show the cinemas
  var showDivCinemas = document.createElement("a");
  showDivCinemas.href = "#";
  showDivCinemas.style.display = "block";
  showDivCinemas.style.height = '25px';
  showDivCinemas.style.width = "100%";
  showDivCinemas.style.marginTop = "5px";
  showDivCinemas.style.borderBottom = "solid 2px #344b5d";
  showDivCinemas.id = "showDivCinemas";
  showDivCinemas.style.color = "#1bbc9b";
  showDivCinemas.text = "Escolha o Cinema";
  showDivCinemas.style.fontFamily = "ossb";
  showDivCinemas.style.textDecoration = "none";
  showDivCinemas.onclick = function() {
    $(this).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
    if (slidedown == false){
      if (slidedowndata == true) {
        $('#iconData').toggleClass('fa fa-angle-down fa fa-angle-up');
        $('#showDataDiv').slideUp();
        slidedowndata = false;
      }
      if (slidedownsessao == true) {
        $('#iconSessao').toggleClass('fa fa-angle-down fa fa-angle-up');
        $('#showSessaoDiv').slideUp();
        slidedownsessao = false;
      }
      $('#showCinemas').slideDown();
      slidedown = true;
    }else{
      $('#showCinemas').slideUp();
      slidedown = false;
    }
  }

  // create icon for link show cinemas
  var icon = document.createElement("i");
  icon.className = "fa fa-angle-down";
  icon.style.float = "right";
  icon.id = "icon";
  icon.style.marginRight = "10px";
  icon.style.marginTop = "4px";

  // create div that contain the list of cinemas
  var showCinemas = document.createElement("div");
  showCinemas.style.display = "none";
  showCinemas.style.height = '115px';
  showCinemas.style.width = "100%";
  showCinemas.id = "showCinemas";
  showCinemas.style.textAlign = "left";
  showCinemas.style.backgroundColor = "#263343";
  showCinemas.text = "Escolha o Cinema";
  showCinemas.style.fontFamily = "ossb";
  showCinemas.style.overflowY = "auto";

  carregarCinemas();

  // create link to show the calendar
  var showData = document.createElement("a");
  showData.href = "#";
  showData.style.pointerEvents = "none";
  showData.style.cursor = "default";
  showData.style.float = "left";
  showData.style.height = '30px';
  showData.style.width = "33.2%";
  showData.style.borderRight = "solid 2px #344b5d";
  showData.id = "showData";
  showData.style.color = "#446368";
  showData.innerHTML = "Data";
  showData.style.fontFamily = "ossb";
  showData.style.textDecoration = "none";
  showData.onclick = function() {
    $(this).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
    if (slidedowndata == false){
      $('#showDataDiv').datepicker('destroy');
      if (slidedown == true) {
        $('#icon').toggleClass('fa fa-angle-down fa fa-angle-up');
        $('#showCinemas').slideUp();
        slidedown = false;
      }
      if (slidedownsessao == false){
        $('#showDataDiv').slideDown();
        slidedowndata = true;
        $('#showDataDiv').datepicker({
          inline: true,
          minDate: 0,
          maxDate: "+" + dias + "D",
          dateFormat: 'd M',
          onSelect: function(dateText, inst) {
            carregarSessao();
            showData.text = $(this).val();
            showData.appendChild(iconData);
            $('#iconData').toggleClass('fa fa-angle-down fa fa-angle-up');
            $('#showDataDiv').slideUp();
            slidedowndata = false;
            showSessao.style.pointerEvents = "all";
            showSessao.style.cursor = "auto";
            showSessao.style.color = "#1bbc9b";
          }
        });
      }else{
        $('#iconSessao').toggleClass('fa fa-angle-down fa fa-angle-up');
        $('#showSessaoDiv').slideUp();
        slidedownsessao = false;
        $('#showDataDiv').slideDown();
        slidedowndata = true;
        $('#showDataDiv').datepicker({
          inline: true,
          minDate: 0,
          maxDate: "+" + dias + "D",
          dateFormat: 'd M',
          onSelect: function(dateText, inst) {
            carregarSessao();
            showData.text = $(this).val();
            showData.appendChild(iconData);
            $('#iconData').toggleClass('fa fa-angle-down fa fa-angle-up');
            $('#showDataDiv').slideUp();
            slidedowndata = false;
            showSessao.style.pointerEvents = "all";
            showSessao.style.cursor = "auto";
            showSessao.style.color = "#1bbc9b";
          }
        });
      }
    }else{
      $('#showDataDiv').slideUp();
      slidedowndata = false;
    }
  }

  // create icon for link show calendar
  var iconData = document.createElement("i");
  iconData.className = "fa fa-angle-down";
  iconData.style.float = "right";
  iconData.id ="iconData";
  iconData.style.marginRight = "10px";
  iconData.style.marginTop = "4px";

  // create div that contain the calendar
  var showDataDiv = document.createElement("div");
  showDataDiv.style.display = "none";
  showDataDiv.style.height = '190px';
  showDataDiv.style.width = "100%";
  showDataDiv.id = "showDataDiv";
  showDataDiv.style.textAlign = "left";
  showDataDiv.style.backgroundColor = "#263343";
  showDataDiv.style.marginTop = "-30px";
  showDataDiv.style.fontFamily = "ossb";
  showDataDiv.style.textAlign = "center";
  showDataDiv.style.overflowY = "hidden";

  // create link to show the session
  var showSessao = document.createElement("a");
  showSessao.href = "#";
  showSessao.style.pointerEvents = "none";
  showSessao.style.cursor = "default";
  showSessao.style.display = "inline-block";
  showSessao.style.height = '30px';
  showSessao.style.width = "32%";
  showSessao.style.borderRight = "solid 2px #344b5d";
  showSessao.id = "showSessao";
  showSessao.style.color = "#446368";
  showSessao.text = "Sessão";
  showSessao.style.fontFamily = "ossb";
  showSessao.style.textDecoration = "none";
  showSessao.onclick = function() {
    $(this).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
    if (slidedownsessao == false){
      if (slidedown == true) {
        $('#icon').toggleClass('fa fa-angle-down fa fa-angle-up');
        $('#showCinemas').slideUp();
        slidedown = false;
      }
      if (slidedowndata == false){
        $('#showSessaoDiv').slideDown();
        slidedownsessao = true;
      }else{
        $('#iconData').toggleClass('fa fa-angle-down fa fa-angle-up');
        $('#showDataDiv').slideUp();
        slidedowndata = false;
        $('#showSessaoDiv').slideDown();
        slidedownsessao = true;
      }
    }else{
      $('#showSessaoDiv').slideUp();
      slidedownsessao = false;
    }
  }

  // create icon for link show sessao
  var iconSessao = document.createElement("i");
  iconSessao.className = "fa fa-angle-down";
  iconSessao.style.float = "right";
  iconSessao.id ="iconSessao";
  iconSessao.style.marginRight = "10px";
  iconSessao.style.marginTop = "4px";

  // create div that contain the hour
  var showSessaoDiv = document.createElement("div");
  showSessaoDiv.style.display = "none";
  showSessaoDiv.style.height = '50px';
  showSessaoDiv.style.width = "100%";
  showSessaoDiv.id = "showSessaoDiv";
  showSessaoDiv.style.backgroundColor = "#263343";
  showSessaoDiv.style.fontFamily = "ossb";
  showSessaoDiv.style.overflowY = "hidden";

  // create element for Room Number
  var showRoomNumber = document.createElement("a");
  showRoomNumber.href = "#";
  showRoomNumber.style.pointerEvents = "none";
  showRoomNumber.style.cursor = "default";
  showRoomNumber.style.float = "right";
  showRoomNumber.style.display = "inline-block";
  showRoomNumber.style.height = '30px';
  showRoomNumber.style.width = "33.2%";
  showRoomNumber.id = "showRoomNumber";
  showRoomNumber.style.color = "#1bbc9b";
  showRoomNumber.text = "Sala 2";
  showRoomNumber.style.fontFamily = "ossb";
  showRoomNumber.style.textDecoration = "none";

  // create red element for display seats
  var bannerSeats = document.createElement("p");
  bannerSeats.id = "movieInfo";
  bannerSeats.innerHTML = "Lugares";
  bannerSeats.style.width = "100%";
  bannerSeats.style.height = "20px";
  bannerSeats.style.backgroundColor = "#e54b65";
  bannerSeats.style.display = "inline-block";
  bannerSeats.style.fontFamily = "ossb";
  bannerSeats.style.lineHeight ="80%";
  bannerSeats.style.color = "#FFF";
  bannerSeats.style.fontSize = "14px";
  bannerSeats.style.paddingTop = "7px";
  bannerSeats.style.marginTop = "-30px";

  // create div that contain the list of selected seats
  var selectLugares = document.createElement("div");
  selectLugares.style.height = 'auto';
  selectLugares.style.maxHeight = '30%'
  selectLugares.style.width = "100%";
  selectLugares.id = "selectLugares";
  selectLugares.style.marginTop = "-14px";
  selectLugares.style.backgroundColor = "#263343";
  selectLugares.style.overflowY = "auto";

  var total = document.createElement("p");
  total.style.fontFamily = "osb";
  total.style.color = "#FFF";
  total.id = "total";
  total.style.fontSize = "17px";
  total.style.display = "block";
  total.style.width = "145px";
  total.style.textAlign = "left";
  total.style.marginLeft = "8%";
  total.style.float = "left";

  var btnComprar = document.createElement("a");
  btnComprar.href = "#";
  btnComprar.style.backgroundImage = "url('img/btncomprar.png')";
  btnComprar.style.backgroundRepeat = "no-repeat";
  btnComprar.style.float = "right";
  btnComprar.style.marginTop = "17px";
  btnComprar.style.display = "none";
  btnComprar.style.height = '30px';
  btnComprar.style.width = "104px";
  btnComprar.id = "btnComprar";
  btnComprar.style.marginRight = "7%";
  btnComprar.style.textDecoration = "none";

  btnComprar.addEventListener('click', function(e) {
    var jsonArray = [];
    var cabecalho =
    {
      nome_filme: document.getElementById("movieName").innerHTML,
      info_filme: document.getElementById("movieInfo").innerHTML,
      cinema: document.getElementById("showDivCinemas").text,
      data: document.getElementById("showData").text,
      sala: document.getElementById("showRoomNumber").text,
      sessao: document.getElementById("showSessao").className
    }
    jsonArray.push(cabecalho);
    for(var i=0 ; i<selectedChairs.length ; i++){
      for( var j=0 ; j<cadeirasJSON.length ; j++){
        if(selectedChairs[i].name == cadeirasJSON[j].nome_procedural){
          var item =
          {
            sessao: "cadeiras"+ n_sessao_select,
            fila: cadeirasJSON[j].fila,
            lugar:cadeirasJSON[j].lugar,
            tipoBilhete:selectedChairs[i].class
          }
          jsonArray.push(item);
        }
      }
    }
    jsonChairs = JSON.stringify(jsonArray);
    $.ajax({
      url: 'php/ler_BDUpdateCadeiras.php', //This is the current doc
      type: "POST",
      dataType:'json', // add json datatype to get json
      data: ({dados: jsonChairs}),
      success: function(data){
      },
      error:    function(textStatus,errorThrown){
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
    document.cookie="dados=" + jsonChairs;
    document.location.href = "resultados.php";
  },false);

  // create div that contain the advertise
  var pub = document.createElement("div");
  pub.style.height = '250px';
  pub.style.width = "100%";
  pub.id = "divImagem";
  pub.style.bottom = "150px";
  pub.style.right = "0";
  pub.style.position = "absolute";

  var imgPub = document.createElement("img");
  imgPub.id = "imagem";
  imgPub.style.height = '100%';
  imgPub.style.width = "90%";

  divInfoMovie.appendChild(logoCinema);
  divInfoMovie.appendChild(movieName);
  divInfoMovie.appendChild(movieInfo);
  iDiv.appendChild(divInfoMovie);
  iDiv.appendChild(divInfo);
  divInfo.appendChild(showDivCinemas);
  showDivCinemas.appendChild(icon);
  divInfo.appendChild(showCinemas);

  showData.appendChild(iconData);
  showSessao.appendChild(iconSessao);

  divInfo.appendChild(showData);
  divInfo.appendChild(showRoomNumber);
  divInfo.appendChild(showSessao);

  divInfo.appendChild(showDataDiv);
  divInfo.appendChild(showSessaoDiv);

  divInfo.appendChild(bannerSeats);
  divInfo.appendChild(selectLugares);
  divInfo.appendChild(total);
  divInfo.appendChild(btnComprar);
  pub.appendChild(imgPub);
  divInfo.appendChild(pub);
  document.body.appendChild(iDiv);
  document.getElementById("logoCinema").src="img/logo.png";
  document.getElementById("imagem").src="img/imagem.png";

  $('#menuSelect').bind('mouseenter' ,"*", function(e){
    mouseIsOnMenu = true;
    controls.lookSpeed = 0;
  },false);

  $('#menuSelect').bind('mouseleave', "*", function(e){
    mouseIsOnMenu = false;
  },false);

  $('#legenda').bind('mouseenter' ,"*", function(e){
    mouseIsOnMenu = true;
    controls.lookSpeed = 0;
  },false);

  $('#legenda').bind('mouseleave', "*", function(e){
    mouseIsOnMenu = false;
  },false);
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

    //var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );

    materials[0] = new THREE.MeshBasicMaterial(materials[0]);
    materials[1] = new THREE.MeshBasicMaterial(materials[1]);
    materials[2] = new THREE.MeshBasicMaterial(materials[2]);
    materials[3] = new THREE.MeshBasicMaterial(materials[3]);

    material1 = new THREE.MeshBasicMaterial();
    material1.map = materials[0].map;
    material1.map.magFilter = THREE.NearestFilter;
    material1.map.minFilter = THREE.LinearMipMapNearestFilter;
    material1.map.anisotropy = 16;
    material1.overdraw = 1.0;
    materials[0] = material1;

    material2 = new THREE.MeshBasicMaterial();
    material2.map = materials[1].map;
    material2.map.magFilter = THREE.NearestFilter;
    material2.map.minFilter = THREE.LinearMipMapNearestFilter;
    material2.map.anisotropy = 16;
    material2.overdraw = 1.0;
    materials[1] = material2;

    material3 = new THREE.MeshBasicMaterial();
    material3.map = materials[2].map;
    material3.map.magFilter = THREE.NearestFilter;
    material3.map.minFilter = THREE.LinearMipMapNearestFilter;
    material3.map.anisotropy = 16;
    material3.overdraw = 1.0;
    materials[2] = material3;

    material4 = new THREE.MeshBasicMaterial();
    material4.map = materials[3].map;
    material4.map.magFilter = THREE.NearestFilter;
    material4.map.minFilter = THREE.LinearMipMapNearestFilter;
    material4.map.anisotropy = 16;
    material4.overdraw = 1.0;
    materials[3] = material4;


    var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ));

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
      capacidade += 1;
    }
    capacidade -= 1;
    if (carregouFreeSeats==true){
      document.getElementById("pcapacityNumber").innerHTML = capacidade;
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
  lugaresLivres = capacidade;
  // get the origin (from) and vertical axis vectors
  var from = new THREE.Vector3( 0,0,0 );
  var vAxis = new THREE.Vector3( -1,0,0 );

  sphereGeo = new THREE.SphereGeometry( 0.1, 6, 6 );

  var genericObject = new THREE.Mesh(bufferGeometry,materialcadeira);

  singleGeometryNormal = new THREE.Geometry();
  singleGeometryOcupadas = new THREE.Geometry();
  singleGeometryDeficiente = new THREE.Geometry();

  var materials = [];

  materials.push(materialcadeiraNormal);
  materials.push(materialcadeiraDeficiente);
  materials.push(materialcadeiraOcupada);

  // for each point in the point cloud
  for(i=0; i<mesh.geometry.vertices.length; i++){
    var vertex = mesh.geometry.vertices[i];

    var materialcadeira = materialcadeiraNormal.clone();

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
        lugaresLivres  = lugaresLivres - 1 ;
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
    if (carregouFreeSeats==true){
      document.getElementById("pfreeseatsNumber").innerHTML = lugaresLivres;
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
  var material = new THREE.MeshPhongMaterial({
    map: texturaBraco,
    specular : [0.1, 0.1, 0.1],
    shininess : 120.00,
    normalMap: texturaBracoNormalMap
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

  });

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
// Mouse Move Event
//
// retrieve mouse coordinates
var mouse = new THREE.Vector2();
function onMouseMove(e) {

  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);

  // define the look speed through the mouse position
  // if mouse is moving to the edges of the screen, speed increases
  if(!isSelected && !sittingDown && !mouseIsOnMenu && !mouseIsOutOfDocument)
  controls.lookSpeed = (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.05;
  else if (isSelected && !sittingDown && !mouseIsOnMenu && !mouseIsOutOfDocument)
  controls.lookSpeed = 0.10;
  else if (sittingDown)
  controls.lookSpeed = (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.2;

  // if we are in the cinema overview
  if(!sittingDown)
  {
    // normal raycasting variables
    var intersectedOne = false;
    var intersectedObject = new THREE.Object3D();

    var raycaster = new THREE.Raycaster();

    var intersections;

    raycaster.setFromCamera( mouse, camera );

    // search the raycasted objects in the octree
    octreeObjects = octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction );

    intersections = raycaster.intersectOctreeObjects( octreeObjects );

    var spriteFound = false;

    // for each of the intersected objects
    for(var i=0; i<intersections.length; i++)
    {
      // if intersected object is a sprite
      if(intersections[i].object.name == "spriteEye")
      {
        spriteFound = true;
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
      if ( intersected != intersectionObject && !spriteFound && !mouseIsOnMenu && !mouseIsOutOfDocument) {

        // if there was a previously intersected object
        if ( intersected )
        {
          var selectedObject = mainScene.getObjectByName("highLightChair");
          mainScene.remove( selectedObject );
        }

        intersected = intersectionObject;

        highLightChair = new THREE.Mesh(intersected.geometry,materialcadeiraHighLight);

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

      // if there was a previous intersection
      if ( intersected ) {
        document.body.style.cursor = 'auto';
      }
      var selectedObject = mainScene.getObjectByName("highLightChair");
      mainScene.remove( selectedObject );
      intersected = null;
      uuidTexturaAntiga = "";
    }
  }

}

var primeiravez = true;

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
    var raycasterSprite = new THREE.Raycaster();

    mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
    mouse.y = 1 - 2 * (e.clientY / window.innerHeight);

    raycaster.setFromCamera( mouse, camera );

    var intersectsSprite = raycaster.intersectObjects( spriteEyeArray );

    if(intersectsSprite.length > 0)
    {
      var pointSprite = intersectsSprite[0].point;
      // for each intersected object
      for(var i=0; i<intersectsSprite.length; i++)
      {
        // if intersected object is a sprite then call the change perspective function (which seats you down)
        if(intersectsSprite[i].object.name == "spriteEye")
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

        for(var i = 0 ; i < intersects.length ; i++)
        {
          var lowerX = intersects[0].object.position.x;

          if( intersects[i].object.position.x < lowerX){
            lowerX = intersects[i].object.position.x;
            intersectionIndex = i;
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

      }

      if(obj != undefined)
      {
        // if chair is not selected yet && chair is not occupied && intersected object is not a sprite
        if(($.inArray(obj, selectedChairs)=="-1") && (obj.estado != "OCUPADA") && !spriteFound && !mouseIsOnMenu && !mouseIsOutOfDocument && insideHelp == false)
        {

          if (primeiravez == true){
            if (document.getElementById("splashelp").style.left == "0px"){
              $("#splashelp").animate({"left": '-=350px'});
              clickhelpbt = false;
            }

            if (document.getElementById("menuSelect").style.right == "-300px")
              $("#menuSelect").animate({"right": '+=300px'});
            primeiravez = false;
          }
          // calculate intersected object centroid
          obj.geometry.computeBoundingBox();

          var centroid = new THREE.Vector3();
          centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );
          centroid.multiplyScalar( - 0.5 );

          centroid.applyMatrix4( obj.matrixWorld );

          // Add the EYE icon

          var eyeGeometry = new THREE.BoxGeometry( 0.1, 1, 1 );

          var spriteEyeMaterial = new THREE.MeshBasicMaterial( { map: eyeTexture, opacity:0.0, transparent:false} );

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

          // Add the dynamic text to the div
          var containerDiv = document.createElement( "div" );
          containerDiv.style.borderBottom = "solid 2px #344b5d";
          containerDiv.style.height = "auto";
          containerDiv.id = obj.name;


          // text Fila + Lugar
          var textContainer = document.createElement("p");
          textContainer.style.width = "150px";
          textContainer.style.margin = "auto";
          textContainer.style.paddingTop = "10px";
          textContainer.style.fontFamily = "osl";
          textContainer.style.color = "#FFF";
          textContainer.innerHTML = "Fila " + fila + " Lugar " + lugar ;

          // link for "remove chair"
          var removeLink = document.createElement("a");
          removeLink.href = "#";
          removeLink.class = "removeLinkClass";
          removeLink.style.float = "right";
          removeLink.style.paddingRight = "20px";
          removeLink.style.marginTop = "-20px";
          //removeLink.id = obj.name + "removeLink";

          // Icon for link for "remove chair"
          var imgapagarLink = document.createElement("img");
          imgapagarLink.src = "img/apagar.png";
          imgapagarLink.class = "removeLinkClass";
          imgapagarLink.id = obj.name+"imgapagarLink";
          removeLink.appendChild(imgapagarLink);


          // link event
          removeLink.addEventListener('click', function(e){

            for(var i=0; i<selectedChairs.length; i++)
            {
              if(selectedChairs[i].name+"imgapagarLink" == e.target.id)
              object = selectedChairs[i];
            }
            removeCadeira(object);

          },false);


          // link for "see perspective"
          var perspectiveLink = document.createElement("a");
          perspectiveLink.href = "#";
          perspectiveLink.style.float = "left";
          perspectiveLink.style.paddingLeft = "20px";
          perspectiveLink.style.marginTop = "-20px";
          perspectiveLink.class = "perspectiveLinkClass";
          //perspectiveLink.id = obj.name;

          // Icon for link for "see perspective"
          var imgprespectiveLink = document.createElement("img");
          imgprespectiveLink.src = "img/ver.png";
          imgprespectiveLink.class = "perspectiveLinkClass";
          imgprespectiveLink.id = obj.name+"perspectiveLink";
          perspectiveLink.appendChild(imgprespectiveLink);
          // link event
          perspectiveLink.addEventListener('click', function(e){

            for(var i=0; i<selectedChairs.length; i++)
            {
              if(selectedChairs[i].name+"perspectiveLink" == e.target.id)
              object = selectedChairs[i];
            }
            if(!isPerspectiveOrtho)
            changePerspective(point.x,point.y,point.z,object);
            else
            changePerspectiveOrtographic(point.x,point.y,point.z,object);
          },false);

          // create icon for link show prices
          var iconDivPreco = document.createElement("i");
          iconDivPreco.className = "fa fa-angle-down";
          iconDivPreco.style.float = "right";
          iconDivPreco.id = 'icon_'+obj.name;
          iconDivPreco.style.marginRight = "10px";
          iconDivPreco.style.marginTop = "4px";

          // create link to show the prices
          var showDivPreco = document.createElement("a");
          showDivPreco.href = "#";
          showDivPreco.style.margin = "auto";
          showDivPreco.style.textAlign = "left";
          showDivPreco.style.display = "block";
          showDivPreco.style.height = '25px';
          showDivPreco.style.width = "80%";
          showDivPreco.style.marginTop = "15px";
          showDivPreco.style.marginBottom = "5px";
          showDivPreco.id = "showDivPreco";
          showDivPreco.style.color = "#FFF";
          showDivPreco.style.backgroundColor = "#243141";
          showDivPreco.innerHTML = "Normal: <b>6,95 EUR</b>";
          containerDiv.className = "normal";
          showDivPreco.style.fontFamily = "osl";
          showDivPreco.style.textDecoration = "none";
          showDivPreco.onclick = function() {
            var actual = '#showPreco_'+obj.name;
            var icon_actual = '#icon_'+obj.name;
            if (slidedownpreco == false && anterior == ""){
              if (slidedowndata == true) {
                $('#iconData').toggleClass('fa fa-angle-down fa fa-angle-up');
                $('#showDataDiv').slideUp();
                slidedowndata = false;
              }
              if (slidedownsessao == true) {
                $('#iconSessao').toggleClass('fa fa-angle-down fa fa-angle-up');
                $('#showSessaoDiv').slideUp();
                slidedownsessao = false;
              }
              $(icon_actual).toggleClass('fa fa-angle-down fa fa-angle-up');
              $(actual).slideDown();
              slidedownpreco = true;
              anterior = '#showPreco_'+obj.name;
              icon_anterior = '#icon_'+obj.name;
            }else{
              if (actual == anterior)
              {
                if (slidedownpreco == false){
                  $(icon_actual).toggleClass('fa fa-angle-down fa fa-angle-up');
                  $(actual).slideDown();
                  slidedownpreco = true;
                }else{
                  $(icon_actual).toggleClass('fa fa-angle-down fa fa-angle-up');
                  $(actual).slideUp();
                  slidedownpreco = false;
                }
              }else{
                $(icon_anterior).toggleClass('fa fa-angle-down fa fa-angle-up');
                $(anterior).slideUp();
                $(icon_actual).toggleClass('fa fa-angle-down fa fa-angle-up');
                $(actual).slideDown();
                slidedownpreco = true;
                anterior = '#showPreco_'+obj.name;
                icon_anterior = '#icon_'+obj.name;
              }
            }
          }

          // create div that contain the list of prices
          var showPreco = document.createElement("div");
          showPreco.style.display = "none";
          showPreco.style.height = '100px';
          showPreco.style.width = "100%";
          showPreco.id = "showPreco_"+obj.name;
          showPreco.style.textAlign = "left";
          showPreco.style.backgroundColor = "#243141";
          showPreco.style.fontFamily = "ossb";
          showPreco.style.overflowY = "auto";

          var normal = document.createElement("a");
          normal.href = "#";
          normal.innerHTML = "Normal: <b>6,95 EUR</b>";
          normal.style.fontFamily = "osl";
          normal.style.textDecoration = "none";
          normal.style.color = "#FFF";
          normal.className = "normal";
          normal.style.display = "block";
          normal.style.width = "90%";
          normal.style.paddingLeft = "10%";
          normal.onmouseover = function() {
            this.style.backgroundColor = "#344b5d";
          }
          normal.onmouseout = function() {
            this.style.backgroundColor = "#263343";
          }
          normal.onclick = function() {
            precotxtSelecionado = this.innerHTML;
            showDivPreco.innerHTML = precotxtSelecionado;
            containerDiv.className = normal.className;
            showDivPreco.appendChild(iconDivPreco);
            $(showDivPreco).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
            $('#showPreco_'+obj.name).slideUp();
            slidedownpreco = false;
            calculaTotal(0);
          }

          var estudante = document.createElement("a");
          estudante.href = "#";
          estudante.innerHTML = "Estudante: <b>6,05 EUR</b>";
          estudante.style.fontFamily = "osl";
          estudante.style.textDecoration = "none";
          estudante.style.color = "#FFF";
          estudante.className = "estudante";
          estudante.style.display = "block";
          estudante.style.width = "90%";
          estudante.style.paddingLeft = "10%";
          estudante.onmouseover = function() {
            this.style.backgroundColor = "#344b5d";
          }
          estudante.onmouseout = function() {
            this.style.backgroundColor = "#263343";
          }
          estudante.onclick = function() {
            precotxtSelecionado = this.innerHTML;
            showDivPreco.innerHTML = precotxtSelecionado;
            containerDiv.className = estudante.className;
            showDivPreco.appendChild(iconDivPreco);
            $(showDivPreco).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
            $('#showPreco_'+obj.name).slideUp();
            slidedownreco = false;
            calculaTotal(0);
          }

          var senior = document.createElement("a");
          senior.href = "#";
          senior.innerHTML = "Senior: <b>6,05 EUR</b>";
          senior.style.fontFamily = "osl";
          senior.style.textDecoration = "none";
          senior.style.color = "#FFF";
          senior.className = "senior";
          senior.style.display = "block";
          senior.style.width = "90%";
          senior.style.paddingLeft = "10%";
          senior.onmouseover = function() {
            this.style.backgroundColor = "#344b5d";
          }
          senior.onmouseout = function() {
            this.style.backgroundColor = "#263343";
          }
          senior.onclick = function() {
            precotxtSelecionado = this.innerHTML;
            showDivPreco.innerHTML = precotxtSelecionado;
            containerDiv.className = senior.className;
            showDivPreco.appendChild(iconDivPreco);
            $(showDivPreco).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
            $('#showPreco_'+obj.name).slideUp();
            slidedownpreco = false;
            calculaTotal(0);
          }

          var crianca10 = document.createElement("a");
          crianca10.href = "#";
          crianca10.innerHTML = "Criança até 10 anos: <b>6,05 EUR</b>";
          crianca10.style.fontFamily = "osl";
          crianca10.style.textDecoration = "none";
          crianca10.style.color = "#FFF";
          crianca10.className = "crianca";
          crianca10.style.display = "block";
          crianca10.style.width = "90%";
          crianca10.style.paddingLeft = "10%";
          crianca10.onmouseover = function() {
            this.style.backgroundColor = "#344b5d";
          }
          crianca10.onmouseout = function() {
            this.style.backgroundColor = "#263343";
          }
          crianca10.onclick = function() {
            precotxtSelecionado = this.innerHTML;
            showDivPreco.innerHTML = precotxtSelecionado;
            containerDiv.className = crianca10.className;
            showDivPreco.appendChild(iconDivPreco);
            $(showDivPreco).find('i').toggleClass('fa fa-angle-down fa fa-angle-up');
            $('#showPreco_'+obj.name).slideUp();
            slidedownpreco = false;
            calculaTotal(0);
          }

          showPreco.appendChild(normal);
          showPreco.appendChild(estudante);
          showPreco.appendChild(senior);
          showPreco.appendChild(crianca10);

          containerDiv.appendChild(textContainer);
          containerDiv.appendChild(perspectiveLink);
          containerDiv.appendChild(removeLink);
          showDivPreco.appendChild(iconDivPreco);
          containerDiv.appendChild(showDivPreco);
          containerDiv.appendChild(showPreco);
          $( "#selectLugares" ).append(containerDiv);

          isSelected = true;

          obj.material.map = texturaCadeiraSelect;
        } else {
          if(!mouseIsOnMenu && !mouseIsOutOfDocument && !spriteFound)
          removeCadeira(obj); // if chair was already selected, de-select it

        }

      }
    }
    calculaTotal(0); // considers with the initial value
  }
  else if(!sittingDownOrtho && insideHelp == false) // if clicked when sitting down
  {
    if (document.getElementById("splashelp").style.left == "0px"){
      $("#splashelp").animate({"left": '-=350px'});
      clickhelpbt = false;
    }
    $("#menuSelect").animate({"right": '+=300px'});

    sittingDown = false;
    setupTweenOverview();

    video.pause();
    video.currentTime = 0;

    for(var i=0; i<spriteEyeArray.length ; i++)
    {
      spriteEyeArray[i].visible = true;
    }

  }
  else if (insideHelp == false)
  {
    if (document.getElementById("splashelp").style.left == "0px"){
      $("#splashelp").animate({"left": '-=350px'});
      clickhelpbt = false;
    }

    $("#menuSelect").animate({"right": '+=300px'});

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
  calculaTotal(0);

  var selectedObject = mainScene.getObjectByName("selectChair_"+obj.name);
  mainScene.remove( selectedObject );

  if (index > -1)
  {
    selectedChairs.splice(index, 1);
    spriteEyeArray.splice(index, 1);
  }

  // if the selected chair array is empty (e.g. no chair is selected)
  if(selectedChairs.length < 1)
  {
    isSelected = false;
    if (document.getElementById("splashelp").style.left == "0px"){
      $("#splashelp").animate({"left": '-=350px'});
      clickhelpbt = false;
    }

    $("#menuSelect").animate({"right": '-=300px'});
    primeiravez = true;
    mouseIsOnMenu = false;
  }
}

// variables to check if we scrolled back or forth (zoom effect)
var alreadyScrolledFront = true;
var alreadyScrolledBack = false;

//
// mouse wheel event
//
function onMouseWheel(e) {

  // cross-browser wheel delta
  var e = window.event || e; // old IE support
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

  // check if mouse wheel went back or forth
  if (!mouseIsOnMenu && !mouseIsOutOfDocument){
    switch(delta)
    {
      case(1):
      if(alreadyScrolledFront){
        // tween the fov fowards
        tweenFov = new TWEEN.Tween(camera).to({
          fov:20
        },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
          camera.updateProjectionMatrix();
        }).onComplete(function () {
        }).start();
        alreadyScrolledFront=false;
        alreadyScrolledBack=true;
      }
      break;
      case(-1):
      if(alreadyScrolledBack){
        //tween the fov backwards
        tweenFov = new TWEEN.Tween(camera).to({
          fov:60
        },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
          camera.updateProjectionMatrix();
        }).onComplete(function () {
        }).start();
        alreadyScrolledFront=true;
        alreadyScrolledBack=false;
      }
      break;
    }
  }
  return false;
}

var up = new THREE.Vector3(0,1,0);

//
// main render function (render cycle)
//
function animate() {

  var vector = new THREE.Vector3(0, 0, -1);
  vector.applyEuler(camera.rotation, camera.rotation.order);
  listener.setOrientation(vector.x,vector.y,vector.z,0,1,0);

  requestAnimationFrame(animate);
  // if we are rendering the loading scene
  if(isLoading)
  {
    renderer.render( loadingScene, camera );
    loaderMesh.rotation.y -= 0.04;
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

    if(controls != undefined && !isLoadOcup)
      controls.update(clock.getDelta()); //for cameras

    octree.update();
    TWEEN.update();


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

    // if we are in the cinema overview
    if(!sittingDown && controls != undefined)
    {
      // if we reach the edges of the screen with the mouse, the camera stops
      if(controls.lon <= 0){
        if(alreadyScrolledFront){
          if(controls.lon < -15)
          {
            //controls.lookSpeed = 0.001;
            controls.lon = -15;
          }
        }else{
          if(controls.lon < -45)
          {
            controls.lon = -45;
          }
        }
      }
      else
      {
        if(alreadyScrolledFront){
          if(controls.lon > 15)
          {
            controls.lon = 15;
          }
        }else{
          if(controls.lon > 45)
          {
            controls.lon = 45;
          }
        }
      }
    }
  }

}

animate();

//
// if we click the view perspective button or EYE icon
//
function changePerspective(x, y, z,obj) {
  if (document.getElementById("splashelp").style.left == "0px"){
    $("#splashelp").animate({"left": '-=350px'});
    clickhelpbt = false;
  }
  $("#menuSelect").animate({"right": '-=300px'});
  setTimeout(function(){ video.play(); }, 2000);
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

  $("#menuSelect").animate({"right": '-=300px'});

  $("#ecraDiv").hide();

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

var iDiv = document.createElement('div');
iDiv.innerHTML = " ECRÃ ";
iDiv.style.position = "absolute";
iDiv.style.width = "100%";
iDiv.style.textAlign = "center";
iDiv.id = "ecraDiv";
iDiv.style.fontFamily = "osb";
iDiv.style.color = "#FFF";
iDiv.style.top = '30px';
iDiv.style.fontSize = "38px";
document.body.appendChild(iDiv);
$("#ecraDiv").hide();

//
// launch the Tween for changing perspective to seat perspective
//
function setupTweenFP(obj) {

  TWEEN.removeAll();
  // calculate centroid
  obj.geometry.computeBoundingBox();

  var centroid = new THREE.Vector3();
  centroid.addVectors( obj.geometry.boundingBox.min, obj.geometry.boundingBox.max );
  centroid.multiplyScalar( - 0.5 );

  centroid.applyMatrix4( obj.matrixWorld );

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
    listener.setPosition(camera.position.x,camera.position.y,camera.position.z);
  }).start();

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

  // tween the camera rotation vertically
  tweenLatFP = new TWEEN.Tween(controls).to({
    lat:THREE.Math.radToDeg(angle) + 40,
  },2000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {
  }).onComplete(function () {
  }).start();

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
      video.pause();
    }).start();
    // tween camera rotation horizontally
    tweenCamRotationOver = new TWEEN.Tween(controls).to({
      lon:lastControlsLon
    },2000).easing(TWEEN.Easing.Sinusoidal.InOut).start();
  }).start();
}

// calculate the total amount of tickets
function calculaTotal(valorInicial) {
  var total = valorInicial;

  for(var i=0 ; i < selectedChairs.length ; i++)
  {
    var retrievedSelector = $("#"+selectedChairs[i].name);
    var retrievedClass = retrievedSelector.attr('class');

    switch(retrievedClass)
    {
      case("normal"):
      total += 6.95;
      selectedChairs[i].class = "normal";
      break;
      case("estudante"):
      total += 6.05;
      selectedChairs[i].class = "estudante";
      break;
      case("senior"):
      total += 6.05;
      selectedChairs[i].class = "senior";
      break;
      case("crianca"):
      total += 6.05;
      selectedChairs[i].class = "crianca";
      break;
    }
  }
  document.getElementById('total').innerHTML = "Total: <u>"+ Math.round(total * 100) / 100 + "€</u>";

}

function switchToOrtho() {
  sittingDownOrtho = false;
  if (isPerspectiveOrtho==false) // if we're in cinema overview 3D change to 2D view
  {
    document.getElementById ('ptrocapresp').innerHTML = "Ver 3D";
    document.getElementById("ptrocaprespImg").src="img/icon - cadeiras 3D.png";
    if(!sittingDown)
    {
      isPerspectiveOrtho = true;

      $("#ecraDiv").show();

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
    document.getElementById ('ptrocapresp').innerHTML = "Ver Planta";
    document.getElementById("ptrocaprespImg").src="img/icon cadeiras.png";
    isPerspectiveOrtho = false;

    $("#ecraDiv").hide();

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 15 );

    camera.position.x = -6.160114995658247;
    camera.position.y = 1.5;
    camera.position.z = 0.009249939938009306;

    controls = new THREE.FirstPersonControls(camera);

    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = Math.PI/3;
    controls.verticalMax = 2*Math.PI/3;
    controls.movementSpeed = 0;
    controls.autoForward = false;
    controls.lat = -45;
    controls.lookSpeed = 0;
  }
}
