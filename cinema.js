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
  url: "js/StereoEffect.js",
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
  url: "js/DeviceOrientationControls.js",
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
  url: "js/jquery-ui.js",
  dataType: "script",
  async: false
});

// TEXTURES

var texturaCadeira = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_vermelho_small.jpg');

var texturaCadeiraSelect = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_amarelo_small.jpg');

var texturaCadeiraHighlight = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_amarelo_small.jpg');

var texturaCadeiraOcupada = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Cadeira_Nova/cadeira_Tex_ocupada.jpg');

var texturaCadeiraDeficiente = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Diffuse_azul_small.jpg');

var texturaCadeiraNormalMap = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Cadeira_Nova/BaseCadeira_Normals_small.jpg');

var texturaBracoNormalMap = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Braco_Novo/BracoCadeira_Normal_small.jpg');

var texturaBraco = THREE.ImageUtils.loadTexture('models/Cinema_Motta/Braco_Novo/BracoCadeira_Diffuse_small.jpg');

var eyeTexture = THREE.ImageUtils.loadTexture('models/Cinema_Motta/eye-icon.png');

var textureEcra = THREE.ImageUtils.loadTexture('models/Cinema_Motta/ecra.jpg');
textureEcra.wrapS = THREE.RepeatWrapping;
textureEcra.wrapT = THREE.RepeatWrapping;

/*video = document.getElementById( 'video' );
textureVideo = new THREE.VideoTexture( video );
				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;
				texture.format = THREE.RGBFormat;*/

// BOOLEANS

var sittingDown = false; //if the user has clicked on a chair (e.g. is sitting down)

var isLoading = true; // if the scene is loading

var isSelected = false; // if at least one chair is selected

var mouseIsOnMenu = false; // if the mouse is over the menu

var mouseIsOutOfDocument = false; // if the mouse is over the menu

var isPerspectiveOrtho = false; // if we are in 2D perspective

var sittingDownOrtho = false; //if the user has clicked on a chair and before was orthographic (e.g. is sitting down)

var lastCameraPositionBeforeTween;

var lastControlsLat;

var lastControlsLon;

// 3D SCENE

var controls;

var loaderJSON = new THREE.JSONLoader();

var clock = new THREE.Clock();

var container;

var camera, scene, renderer;

var spriteEyeModel = new THREE.Mesh();

// STATISTICS (FPS, MS, MB)

var statsFPS = new Stats();
var statsMS = new Stats();
var statsMB = new Stats();

// RAYCASTING

// we are using an octree for increasing the performance on raycasting
var octree = new THREE.Octree( {
  //scene: scene,
  undeferred: false,
  depthMax: Infinity,
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
var anterior = "";
var icon_anterior = "";
var capacidade = 0;
var lugaresLivres = 0;
var cinemasJSON;
var dias;
var sessoesJSON;
var num_sessao = "0";

// RANDOM

var screenReferenceSphere; // the sphere (invisible) located in the middle of the screen, to lookAt

var updateFcts = []; // the array with the video frames
var video; // the video canvas
var plane; // the video screen

// STRUCTURAL / DOM / RENDERER
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

renderer = new THREE.WebGLRenderer({ precision: "lowp", antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// create the main selection menu
var waterMarkDiv = document.createElement('div');
waterMarkDiv.style.width = '200px';
waterMarkDiv.style.height = '82px';
waterMarkDiv.style.position = "absolute";
waterMarkDiv.id = 'watermarkDiv';
//waterMarkDiv.style.top = '0';
waterMarkDiv.style.bottom = "5%";
waterMarkDiv.style.left = "5%";
waterMarkDiv.innerHTML = "<img src='img/Push_Logo_transparente.png'> </img>";
document.body.appendChild(waterMarkDiv);

// Load the initial scenes

loadingScene = new THREE.Scene();
mainScene = new THREE.Scene();

startLoadingScene();
loadScene();


//
// LOADING MANAGERS
//
// check if all the models were loaded
THREE.DefaultLoadingManager.onProgress = function ( item, loaded, total ) {
  if(loaded == total)
  {
    // create the main selection menu
    var iDiv = document.createElement('div');
    //iDiv.innerHTML = " Cadeiras seleccionadas : ";
    iDiv.style.width = '100%';
    iDiv.style.cursor = "pointer";
    iDiv.style.textAlign = "center";
    iDiv.style.height = '100%';
    iDiv.style.position = "absolute";
    iDiv.style.background = 'rgba(0,0,0,0.8)';
    iDiv.id = 'loadedScreen';
    iDiv.style.top = '0';
    iDiv.style.display = "none";

    var textDiv = document.createElement('div');
    textDiv.style.color = "white";
    textDiv.style.cursor = "pointer";
    textDiv.innerHTML = " Welcome to 'BOI (Box Office Immersion)', a PUSH Interactive experiment. <br> <br> <br> BOI is a novel product by PUSH Interactive, that brings the best out of interactive three-dimensional environments to the ticket sale experience. We propose a visually appealing, easy-to-use and intuitive, improvement on the online ticket offices. By using WebGL (the 3D web standard) we are able to have a seamless experience across the most popular web-browsers, providing a solid product that is non-platform specific, so that clients are able to access it through desktops, laptops, mobile devices, and other platforms."
    +"<br><br>Our system is flexible enough to be applied to almost every single ticket selling experience, be it movie theatres, concert halls, sports stadiums, or even public transports. <br>"
    +"<br>We offer tailor-made integration into your own ticket sales system, as our product is sold as a module that can be inserted in a traditional ticket sales pipeline, receiving input in all the popular web data interchange formats like XML or JSON, and outputting the selected information in your favourite format as well. <br>"
    +"<br><br><br><br> Click anywhere to continue";
    textDiv.style.width = '50%';
    textDiv.style.textAlign = "center";
    textDiv.style.fontFamily = "osb";
    textDiv.style.height = '100%';
    textDiv.style.position = "absolute";

    textDiv.id = 'textScreen';
    textDiv.style.left = '24%';
    textDiv.style.top = '30%';

    iDiv.appendChild(textDiv);
    document.body.appendChild(iDiv);

    $("#loadedScreen").fadeIn("slow");
    $( "#loadedScreen" ).click(function() {
      init();
    });


    //init();

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


//
// This method shows the loading scene, while the items are not loaded
//
function startLoadingScene() {
  loadingScene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10);
  camera.position.set(0, 0, 7);
  camera.lookAt(loadingScene.position);

  currentScene = loadingScene;

  loader = new THREE.JSONLoader();
  loader.load( "models/loading3.js", function( geometry,materials ) {

    loaderMesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );

    loadingScene.add(loaderMesh);

  });

}

//
// Here we initialise all the needed variables, like the stats, camera, and controls
//
function init() {



  $("#textScreen").fadeOut( "slow", function() {
  // STATS

  // 0: fps, 1: ms, 2: mb
  statsFPS.setMode( 0 );
  statsMS.setMode( 1 );
  statsMB.setMode( 2 );

  statsFPS.domElement.style.position = 'absolute';
  statsFPS.domElement.style.left = '0px';
  statsFPS.domElement.style.top = '0px';

  statsMS.domElement.style.position = 'absolute';
  statsMS.domElement.style.left = '80px';
  statsMS.domElement.style.top = '0px';

  statsMB.domElement.style.position = 'absolute';
  statsMB.domElement.style.left = '160px';
  statsMB.domElement.style.top = '0px';

  document.body.appendChild( statsFPS.domElement );
  document.body.appendChild( statsMS.domElement );
  document.body.appendChild( statsMB.domElement );


  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );

  camera.position.x = -6.160114995658247;
  camera.position.y = 1.5;
  camera.position.z = 0.009249939938009306;
  camera.lookAt(mainScene.position);
  camera.target = mainScene.position.clone();

  if(detectmob())
  {
    controls = new THREE.DeviceOrientationControls( camera );
    controls.connect();
  }
  else
  {
    controls = new THREE.FirstPersonControls(camera);

    controls.lon = 0;
    controls.lat = -45;

    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = Math.PI/3;
    controls.verticalMax = 2*Math.PI/3;

    controls.movementSpeed = 0;
    controls.autoForward = false;
  }


  // lights
  var light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1.0 );
  mainScene.add( light );


  // model
  group = new THREE.Object3D();



  //event listeners
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousewheel', onMouseWheel, false);
  document.addEventListener("keydown", onKeyDown, false);

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
});

$("#loadedScreen").fadeOut( "slow", function() {
  isLoading = false;
});

}

//
// create a show the selection menu
//
function showMenuSelect(){

  function carregarCinemas() {
      $.ajax({
        url:        'php/ler_BDCc.php',
        dataType:   "json", // <== JSON-P request
        success:    function(data){
          cinemasJSON = data;
          loadCinemas();
          console.log("Lista de cinemas carregados");
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
           console.log("Dias Carregados");
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
        console.log("Lista de sessões carregadas");
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
          btnComprar.style.display = "inline-block";
          showSessao.text = this.text;
          showSessao.appendChild(iconSessao);
          carregarJSONBD(this.id);
          $('#iconSessao').toggleClass('fa fa-angle-down fa fa-angle-up');
          $('#showSessaoDiv').slideUp();
          slidedownsessao = false;
        }
        showSessaoDiv.appendChild(n_sessao);
      }
    }




  // create main legenda for cinema
  var legDiv = document.createElement('div');
  legDiv.style.width = '100%';
  legDiv.style.top = "100%";
  legDiv.style.marginTop = "-80px";
  legDiv.style.height = '160px';
  legDiv.style.position = "absolute";
  legDiv.id = 'LegDiv';

  // create sub main legenda for cinema
  var legenda = document.createElement('div');
  legenda.style.width = '780px';
  legenda.style.margin = "auto";
  legenda.style.textAlign = "center";
  legenda.style.height = '200px';
  legenda.style.borderRadius = "10px";
  legenda.id = 'legenda';

  // create legend for cinema
  var legEsq = document.createElement('div');
  legEsq.style.width = '670px';
  legEsq.style.float = "left";
  legEsq.style.textAlign = "center";
  legEsq.style.height = '200px';
  legEsq.style.background = '#243141';
  legEsq.style.borderRadius = "10px";
  legEsq.id = 'legEsq';
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
  legEsq.appendChild(topicDiv1);

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
  legEsq.appendChild(topicDiv2);

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
  legEsq.appendChild(topicDiv3);

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
  legEsq.appendChild(topicDiv4);

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
  legEsq.appendChild(topicDiv5);

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
  legEsq.appendChild(capacityDiv);

  lugaresLivres = capacidade;
  for(var j=0 ; j < cadeirasJSON.length ; j++) {
    if (cadeirasJSON[j].estado == "OCUPADA"){
      lugaresLivres -= 1;
    }
  }
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
  pfreeseatsNumber.style.fontSize = "17px";
  pfreeseatsNumber.style.fontFamily = "osb";
  pfreeseatsNumber.style.float = "right";
  pfreeseatsNumber.style.marginTop = "0px";

  freeseatsDiv.appendChild(pfreeseats);
  freeseatsDiv.appendChild(pfreeseatsNumber);
  legEsq.appendChild(freeseatsDiv);

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

  legDir.appendChild(ptrocapresp);
  legDir.appendChild(ptrocaprespImg);

  legDiv.appendChild(legenda);
  legenda.appendChild(legEsq);
  legenda.appendChild(legDir);
  document.body.appendChild(legDiv);
  document.getElementById("pverPrespImg").src="img/ver.png";
  document.getElementById("pavailableImg").src="img/Bola_0001_vermelho.png";
  document.getElementById("pselectedImg").src="img/Bola_0003_verde.png";
  document.getElementById("pdefecientImg").src="img/Bola_0002_azul.png";
  document.getElementById("pnotavaImg").src="img/Bola_0000_cinza.png";
  document.getElementById("ptrocaprespImg").src="img/icon cadeiras.png";

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
  movieName.innerHTML = "Pedro Motta vs Predator | 3D";
  movieName.style.fontFamily = "osb";
  movieName.style.lineHeight ="80%";
  movieName.style.color = "#243141";
  movieName.style.fontSize = "18px";

  // create element for info of movie
  var movieInfo = document.createElement("p");
  movieInfo.id = "movieInfo";
  movieInfo.innerHTML = "VFX e Motta Graphics | M30";
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
  for(var i=0 ; i<selectedChairs.length ; i++){
    for( var j=0 ; j<cadeirasJSON.length ; j++){
      if(selectedChairs[i].name == cadeirasJSON[j].nome_procedural){
        var item =
        {
        fila: cadeirasJSON[j].fila,
        lugar:cadeirasJSON[j].lugar,
        tipoBilhete:selectedChairs[i].class
        }
        jsonArray.push(item);
      }
    }
  }
  jsonChairs = JSON.stringify(jsonArray);
  alert("cadeiras seleccionadas " + jsonChairs);
  },false);

  // create div that contain the advertise
  var pub = document.createElement("div");
  pub.style.height = '190px';
  pub.style.width = "100%";
  pub.id = "pub";
  pub.style.bottom = "150px";
  pub.style.right = "0";
  pub.style.position = "absolute";

  var imgPub = document.createElement("img");
  imgPub.id = "imgPub";
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
  document.getElementById("imgPub").src="img/pedrinho.jpg";

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
  carregarJSONBD(num_sessao);

  loadSala();
  loadCadeiras(populateCadeirasInstances);
  loadBracos(populateBracosInstances);

  // load the model for the EYE icon
  loader.load( "models/Cinema_Motta/olho_v03.js", function( geometry,materials ) {
    spriteEyeModel = new THREE.Mesh(geometry,materials);
  });

  // create the cinema screen
  /*var geometry = new THREE.PlaneGeometry( 7, 2.5, 10, 10);
  var material = new THREE.MeshBasicMaterial( {side:THREE.DoubleSide, map:textureVideo} );
  var plane = new THREE.Mesh( geometry, material );
  plane.position.x = -6.5;
  plane.position.y = 1.2;
  plane.rotation.y = Math.PI/2;
  mainScene.add( plane );*/
}

//
// Here we load the venue model
//
function loadSala() {

  // load JSON model
  loaderJSON.load( "models/Cinema_Motta/Sala_Vazia.js", function( geometry, material ) {

    var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );

    mesh = new THREE.Mesh( bufferGeometry, new THREE.MeshFaceMaterial( material ));

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
    //mainScene.add( screenReferenceSphere );


  } );

}

//
// here we load the chairs
//
function loadCadeiras(populateCadeirasInstances) {
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
  });


  // 2. load the model itself (only once) to replicate and get the geometry to pass along
  var loaderOBJ = new THREE.OBJMTLLoader();
  loaderOBJ.load( 'models/Cinema_Motta/Cadeira_Nova/Cadeira_Nova.obj', 'models/Cinema_Motta/Cadeira_Nova/Cadeira_Nova.mtl', function ( object ) {
    var bufferGeometry;
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh && child.geometry != "undefined") {

        bufferGeometry = new THREE.BufferGeometry().fromGeometry( child.geometry );

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

  // for each point in the point cloud
  for(i=0; i<mesh.geometry.vertices.length; i++){
    var vertex = mesh.geometry.vertices[i];

    // create the material
    var material = new THREE.MeshPhongMaterial( {
      color: 0xffffff,
      map: texturaCadeira,
      normalMap: texturaCadeiraNormalMap,
    } );

    // create the new instance
    newObject = new THREE.Mesh(bufferGeometry,material);

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
      newObject.geometry.computeFaceNormals();
      newObject.geometry.computeVertexNormals();

      // calculate the quaternion from the vertical axis and the computed normal vector
      var quaternion = new THREE.Quaternion().setFromUnitVectors( vAxis.normalize(),to.normalize()  );
      newObject.setRotationFromQuaternion(quaternion);

      // identify the instance
      newObject.name = "CADEIRA_" + i;
      newObject.updateMatrix();

      // add it to the array of chairs and to the octree
      chairGroup.add(newObject);
      octree.add(newObject);
    }

  }

  // add the chairs to scene (bulk add);
  mainScene.add(chairGroup);
}

//
// Here we access the DB and load the chair occupation info
//
function carregarJSONBD(num_sessao) {
  $.ajax({
       url: 'php/ler_BDCinema.php', //This is the current doc
       type: "POST",
       dataType:'json', // add json datatype to get json
       data: ({sessao: "cadeiras"+num_sessao}),
       success: function(data){
         cadeirasJSON = data;
         console.log("JSON Loaded Correctly from DB cadeiras " + num_sessao);
         pintarCadeiras();
       },
       error:    function(textStatus,errorThrown){
         console.log(textStatus);
         console.log(errorThrown);
       }
  });
}

//
// Here we color the chairs according to the loaded occupation info
//
function pintarCadeiras() {
  for(var i=0 ; i< chairGroup.children.length ; i++)
  {
    for(var j=0 ; j < cadeirasJSON.length ; j++)
    {
      if(chairGroup.children[i].name == cadeirasJSON[j].nome_procedural)
      {
        switch(cadeirasJSON[j].estado) {
          case 'OCUPADA':
          if(selectedChairs.length < 1)
          {
            console.log(selectedChairs)
            isSelected = false;
            chairGroup.children[i].material.map = texturaCadeiraOcupada;
          }else{
            for(var x=0; x<selectedChairs.length; x++)
            {
                if (selectedChairs[x].name == cadeirasJSON[j].nome_procedural)
                {
                  var removalThing = "#"+selectedChairs[x].name;
                  $(removalThing).remove();
                  selectedChairs[x].material.map = texturaCadeiraOcupada;
                  selectedChairs.splice(x, 1);
                  var eyeSpriteToRemove = spriteEyeArray[x];
                  mainScene.remove(eyeSpriteToRemove);
                  octree.remove(eyeSpriteToRemove);
                  spriteEyeArray.splice(x, 1);
                  console.log(selectedChairs)
                }else{
                  chairGroup.children[i].material.map = texturaCadeiraOcupada;
                }
            }
          }
          break;
          case 'DEFICIENTE':
          chairGroup.children[i].material.map = texturaCadeiraDeficiente;
          break;
          default:
          chairGroup.children[i].material.map = texturaCadeira;
        }
      }
    }
  }
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
    normalMap: texturaBracoNormalMap,
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

  var preNewObject;

  // 2. load the model itself (only once) to replicate and get the geometry to pass along
  var loaderOBJ = new THREE.OBJMTLLoader();
  loaderOBJ.load( 'models/Cinema_Motta/Braco_Novo/Braco_Novo.obj', 'models/Cinema_Motta/Braco_Novo/Braco_Novo.mtl', function ( object ) {
    object.traverse(function(child) {
      //(child.name);
      if (child instanceof THREE.Mesh){// && child.name == "BracoCadeira:Group2.001") {
        preNewObject = new THREE.Mesh( child.geometry, material );
        populateBracosInstances(singleGeometry,meshBracos,normalsArrayBracos,normalVector,preNewObject,material);

      }
    });
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
function onMouseMove(e) {

  // retrieve mouse coordinates
  var mouse = new THREE.Vector2();
  mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
  mouse.y = 1 - 2 * (e.clientY / window.innerHeight);


  // define the look speed through the mouse position
  // if mouse is moving to the edges of the screen, speed increases
  if(!isSelected && !sittingDown && !mouseIsOnMenu && !mouseIsOutOfDocument)
  controls.lookSpeed = (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.05;
  else if (isSelected && !sittingDown && !mouseIsOnMenu && !mouseIsOutOfDocument)
  controls.lookSpeed = 0.005;
  else if (sittingDown)
  controls.lookSpeed = (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.05;

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

      // if previously intersected object is not the current intersection and is not a sprite
      if ( intersected != intersections[ 0 ].object && !spriteFound && !mouseIsOnMenu && !mouseIsOutOfDocument) {

        // if there was a previously intersected object
        if ( intersected )
        {
          // change the texture of the intersected object to the old object to the original color
          switch(uuidTexturaAntiga) {
            case texturaCadeiraOcupada.uuid:
            intersected.material.map = texturaCadeiraOcupada;
            break;
            case texturaCadeiraDeficiente.uuid:
            intersected.material.map = texturaCadeiraDeficiente;
            break;
            default:
            intersected.material.map = texturaCadeira;
          }
        }

        // intersected object
        intersected = intersections[ 0 ].object;
        uuidTexturaAntiga = intersected.material.map.uuid;

        // if intersection is new : change color to highlight
        switch(intersected.material.map.uuid) {
          case texturaCadeiraOcupada.uuid:
          intersected.material.map = texturaCadeiraOcupada;
          document.body.style.cursor = 'no-drop';
          break;
          case texturaCadeiraDeficiente.uuid:
          intersected.material.map = texturaCadeiraHighlight;
          document.body.style.cursor = 'pointer';
          break;
          default:
          intersected.material.map = texturaCadeiraHighlight;
          document.body.style.cursor = 'pointer';

        }
      }
    }
    else // if there are no intersections
    {
      // if there was a previous intersection
      if ( intersected ) {
        // change the texture of the intersected object to the old object to the original color
        switch(uuidTexturaAntiga) {
          case texturaCadeira.uuid:
          intersected.material.map = texturaCadeira;
          break;
          case texturaCadeiraOcupada.uuid:
          intersected.material.map = texturaCadeiraOcupada;
          break;
          case texturaCadeiraDeficiente.uuid:
          intersected.material.map = texturaCadeiraDeficiente;
          break;
          default:
        }

        document.body.style.cursor = 'auto';
      }
      intersected = null;
      uuidTexturaAntiga = "";
    }

    // paint all the selected chairs (check the array) with the selected color
    for(var i=0 ; i< selectedChairs.length ; i++)
    {
      selectedChairs[i].material.map = texturaCadeiraSelect;
    }
  }

}

var primeiravez = true;

//
// Mouse Click Event
//
function onMouseDown(e) {
  // if we are in the cinema overview
  if(!sittingDown)
  {
    // normal raycaster variables
    var intersectedOne = false;

    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();

    mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
    mouse.y = 1 - 2 * (e.clientY / window.innerHeight);

    raycaster.setFromCamera( mouse, camera );

    octreeObjects = octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction );

    var intersects = raycaster.intersectOctreeObjects( octreeObjects );

    var textSelChairs = "";

    // for each intersected object
    for (var i = 0; i < intersects.length; i++) {

      var intersection = intersects[i];
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

      // for each intersected object
      for(var i=0; i<intersects.length; i++)
      {

        // if intersected object is a sprite then call the change perspective function (which seats you down)
        if(intersects[i].object.name == "spriteEye")
        {
          spriteFound = true;

          var index = spriteEyeArray.indexOf(intersects[i].object);

          changePerspective(point.x,point.y,point.z,selectedChairs[index]);
        }

      }

      // if chair is not selected yet && chair is not occupied && intersected object is not a sprite
      if(($.inArray(obj, selectedChairs)=="-1") && (obj.material.map.uuid != texturaCadeiraOcupada.uuid) && !spriteFound && !mouseIsOnMenu && !mouseIsOutOfDocument)
      {

        if (primeiravez == true){
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

        octree.add(spriteEyeInstance);
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
    calculaTotal(6.95); // considers with the initial value
  }
  else if(!sittingDownOrtho) // if clicked when sitting down
  {
    $("#menuSelect").animate({"right": '+=300px'});

    sittingDown = false;
    setupTweenOverview();

    for(var i=0; i<spriteEyeArray.length ; i++)
    {
      spriteEyeArray[i].visible = true;
    }

  }
  else
  {
    $("#menuSelect").animate({"right": '+=300px'});

    sittingDown = false;

    switchToOrtho();

    for(var i=0; i<spriteEyeArray.length ; i++)
    {
      spriteEyeArray[i].visible = true;
    }
  }

  // if left mouse button is pressed - clean all the selection
  /*if(e.which == 3)
  {
  for(var i=0 ; i< selectedChairs.length ; i++)
  {
  selectedChairs[i].material.map = texturaCadeira;
}
selectedChairs = new Array();
}*/
}

//
// Here we remove a chair
//
function removeCadeira(obj) {

  var removalThing = "#"+obj.name;

  $(removalThing).remove();

  var index = selectedChairs.indexOf(obj);

  for(var i=0; i<cadeirasJSON.length; i++)
  {
    if(selectedChairs[index].name == cadeirasJSON[i].nome_procedural)
    {
      switch(cadeirasJSON[i].estado)
      {
        case "LIVRE":
        selectedChairs[index].material.map = texturaCadeira;
        break;
        case "OCUPADA":
        selectedChairs[index].material.map = texturaCadeiraOcupada;
        break;
        case "DEFICIENTE":
        selectedChairs[index].material.map = texturaCadeiraDeficiente;
        break;
        default:

      }
    }
  }

  var eyeSpriteToRemove = spriteEyeArray[index];
  mainScene.remove(eyeSpriteToRemove);
  octree.remove(eyeSpriteToRemove);
  calculaTotal(0);

  if (index > -1)
  {
    selectedChairs.splice(index, 1);
    spriteEyeArray.splice(index, 1);
  }

  // if the selected chair array is empty (e.g. no chair is selected)
  if(selectedChairs.length < 1)
  {
    isSelected = false;
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
            fov:45
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

//
// main render function (render cycle)
//
function animate() {
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
      spriteEyeArray[i].rotation.y += 0.01 * Math.sin(clock.getElapsedTime() * (Math.sin(0.6)*5));
    }

    renderer.render( mainScene, camera );
    statsFPS.begin();
    statsMS.begin();
    statsMB.begin();

    controls.update(clock.getDelta()); //for cameras

    octree.update();
    TWEEN.update();

    statsFPS.end();
    statsMS.end();
    statsMB.end();

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
    if(!sittingDown)
    {
      // if we reach the edges of the screen with the mouse, the camera stops
      if(controls.lon <= 0){
        if(controls.lon < -60)
        {
          controls.lookSpeed = 0.001;
          controls.lon = -60;
        }
      }
      else
      {
        if(controls.lon > 60)
        {
          controls.lookSpeed = 0.001;
          controls.lon = 60;
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

  $("#menuSelect").animate({"right": '-=300px'});

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
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );

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
iDiv.style.color = "#243141";
iDiv.style.top = '30px';
iDiv.style.fontSize = "38px";
document.body.appendChild(iDiv);
$("#ecraDiv").hide();

//
// if we press the keyboard
//
function onKeyDown(event) {
  var keyCode = event.which;

  if ( keyCode == 112 )
  video.play();

  if ( keyCode == 32 )
  video.pause();

  if ( keyCode == 115 ) // stop video
  {
    video.pause();
    video.currentTime = 0;
  }

  if ( keyCode == 114 ) // rewind video
  video.currentTime = 0;
}


// ******************************************** Video Update FbF ********************************************


/*updateFcts.push(function() {
renderer.render(scene, camera);
})

var lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
// keep looping
requestAnimationFrame(animate);
// measure time
lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
lastTimeMsec = nowMsec
// call each update function
updateFcts.forEach(function(updateFn) {
updateFn(deltaMsec / 1000, nowMsec / 1000)
})
})*/

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
    fov:45
  },1000).easing(TWEEN.Easing.Exponential.Out).onUpdate(function () {
    camera.updateProjectionMatrix();
  }).onComplete(function () {
  }).start();

  // tween camera movement
  tweenFP = new TWEEN.Tween(camera.position).to({
    x: centroid.x,
    y: centroid.y+0.25, // head height
    z: centroid.z
  },2000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {

  }).onComplete(function () {
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
    lat:angle*180/Math.PI,
  },3000).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {
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
  TWEEN.removeAll();

  // tween the fov fowards
  tweenFov = new TWEEN.Tween(camera).to({
    fov:45
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
      controls.verticalMin = Math.PI/3;
      controls.verticalMax = 2*Math.PI/3;
      controls.movementSpeed = 0;
      controls.autoForward = false;
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
    isPerspectiveOrtho = false;

    $("#ecraDiv").hide();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );

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

// detect if we are using a mobile
function detectmob() {
  if( navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)){
    return true;
  }
  else{
    return false;
  }
}
