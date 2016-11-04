var peerStatusWaitingIsActive = true;

var speakerQueue = [];
var connectedUsers = [];

var amIStreaming = false;

window.onload = function() {

  // slideout.js
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.Slideout=e()}}(function(){var e,t,n;return function i(e,t,n){function o(s,a){if(!t[s]){if(!e[s]){var u=typeof require=="function"&&require;if(!a&&u)return u(s,!0);if(r)return r(s,!0);var f=new Error("Cannot find module '"+s+"'");throw f.code="MODULE_NOT_FOUND",f}var l=t[s]={exports:{}};e[s][0].call(l.exports,function(t){var n=e[s][1][t];return o(n?n:t)},l,l.exports,i,e,t,n)}return t[s].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)o(n[s]);return o}({1:[function(e,t,n){"use strict";var i=e("decouple");var o=e("emitter");var r;var s=false;var a=window.document;var u=a.documentElement;var f=window.navigator.msPointerEnabled;var l={start:f?"MSPointerDown":"touchstart",move:f?"MSPointerMove":"touchmove",end:f?"MSPointerUp":"touchend"};var p=function v(){var e=/^(Webkit|Khtml|Moz|ms|O)(?=[A-Z])/;var t=a.getElementsByTagName("script")[0].style;for(var n in t){if(e.test(n)){return"-"+n.match(e)[0].toLowerCase()+"-"}}if("WebkitOpacity"in t){return"-webkit-"}if("KhtmlOpacity"in t){return"-khtml-"}return""}();function c(e,t){for(var n in t){if(t[n]){e[n]=t[n]}}return e}function h(e,t){e.prototype=c(e.prototype||{},t.prototype)}function d(e){e=e||{};this._startOffsetX=0;this._currentOffsetX=0;this._opening=false;this._moved=false;this._opened=false;this._preventOpen=false;this._touch=e.touch===undefined?true:e.touch&&true;this.panel=e.panel;this.menu=e.menu;this.panel.className+=" slideout-panel";this.menu.className+=" slideout-menu";this._fx=e.fx||"ease";this._duration=parseInt(e.duration,10)||300;this._tolerance=parseInt(e.tolerance,10)||70;this._padding=parseInt(e.padding,10)||256;if(this._touch){this._initTouchEvents()}}h(d,o);d.prototype.open=function(){var e=this;this.emit("beforeopen");if(u.className.search("slideout-open")===-1){u.className+=" slideout-open"}this._setTransition();this._translateXTo(this._padding);this._opened=true;setTimeout(function(){e.panel.style.transition=e.panel.style["-webkit-transition"]="";e.emit("open")},this._duration+50);return this};d.prototype.close=function(){var e=this;if(!this.isOpen()&&!this._opening){return this}this.emit("beforeclose");this._setTransition();this._translateXTo(0);this._opened=false;setTimeout(function(){u.className=u.className.replace(/ slideout-open/,"");e.panel.style.transition=e.panel.style["-webkit-transition"]=e.panel.style[p+"transform"]=e.panel.style.transform="";e.emit("close")},this._duration+50);return this};d.prototype.toggle=function(){return this.isOpen()?this.close():this.open()};d.prototype.isOpen=function(){return this._opened};d.prototype._translateXTo=function(e){this._currentOffsetX=e;this.panel.style[p+"transform"]=this.panel.style.transform="translate3d("+e+"px, 0, 0)"};d.prototype._setTransition=function(){this.panel.style[p+"transition"]=this.panel.style.transition=p+"transform "+this._duration+"ms "+this._fx};d.prototype._initTouchEvents=function(){var e=this;i(a,"scroll",function(){if(!e._moved){clearTimeout(r);s=true;r=setTimeout(function(){s=false},250)}});a.addEventListener(l.move,function(t){if(e._moved){t.preventDefault()}});this.panel.addEventListener(l.start,function(t){if(typeof t.touches==="undefined"){return}e._moved=false;e._opening=false;e._startOffsetX=t.touches[0].pageX;e._preventOpen=!e.isOpen()&&e.menu.clientWidth!==0});this.panel.addEventListener("touchcancel",function(){e._moved=false;e._opening=false});this.panel.addEventListener(l.end,function(){if(e._moved){e._opening&&Math.abs(e._currentOffsetX)>e._tolerance?e.open():e.close()}e._moved=false});this.panel.addEventListener(l.move,function(t){if(s||e._preventOpen||typeof t.touches==="undefined"){return}var n=t.touches[0].clientX-e._startOffsetX;var i=e._currentOffsetX=n;if(Math.abs(i)>e._padding){return}if(Math.abs(n)>20){e._opening=true;if(e._opened&&n>0||!e._opened&&n<0){return}if(!e._moved&&u.className.search("slideout-open")===-1){u.className+=" slideout-open"}if(n<=0){i=n+e._padding;e._opening=false}e.panel.style[p+"transform"]=e.panel.style.transform="translate3d("+i+"px, 0, 0)";e.emit("translate",i);e._moved=true}})};t.exports=d},{decouple:2,emitter:3}],2:[function(e,t,n){"use strict";var i=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();function o(e,t,n){var o,r=false;function s(e){o=e;a()}function a(){if(!r){i(u);r=true}}function u(){n.call(e,o);r=false}e.addEventListener(t,s,false)}t.exports=o},{}],3:[function(e,t,n){"use strict";var i=function(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}};n.__esModule=true;var o=function(){function e(){i(this,e)}e.prototype.on=function t(e,n){this._eventCollection=this._eventCollection||{};this._eventCollection[e]=this._eventCollection[e]||[];this._eventCollection[e].push(n);return this};e.prototype.once=function n(e,t){var n=this;function i(){n.off(e,i);t.apply(this,arguments)}i.listener=t;this.on(e,i);return this};e.prototype.off=function o(e,t){var n=undefined;if(!this._eventCollection||!(n=this._eventCollection[e])){return this}n.forEach(function(e,i){if(e===t||e.listener===t){n.splice(i,1)}});if(n.length===0){delete this._eventCollection[e]}return this};e.prototype.emit=function r(e){var t=this;for(var n=arguments.length,i=Array(n>1?n-1:0),o=1;o<n;o++){i[o-1]=arguments[o]}var r=undefined;if(!this._eventCollection||!(r=this._eventCollection[e])){return this}r=r.slice(0);r.forEach(function(e){return e.apply(t,i)});return this};return e}();n["default"]=o;t.exports=n["default"]},{}]},{},[1])(1)});

  var slideout = new Slideout({
    'panel': document.getElementById('main'),
    'menu': document.getElementById('menu'),
    'padding': 256,
    'tolerance': 70
  });

  document.querySelector('.js-slideout-toggle').addEventListener('click', function() {
    slideout.toggle();
  });

  document.querySelector('.js-slideout-toggle').addEventListener('touchstart', function() {
    slideout.toggle();
  });

  document.querySelector('.menu').addEventListener('click', function(eve) {
    if (eve.target.nodeName === 'A') { slideout.close(); }
  });

    window.onload = function() {
      document.querySelector('.iphone').className += ' shown';
      document.querySelector('.tooltip').className += ' shake';
    }

  window.addEventListener('resize', function() {
    var width = window.innerWidth;
    if (width > 780 && slideout.isOpen()) {
      slideout._opened = false;
      slideout.panel.style.transform = 'translateX(0)';
    }
   });


  console.log(window.innerHeight);
  console.log(window.innerWidth);
  console.log($( window ).width());
  console.log($('#poweredByPUSHImage').height());

  var totalDeviceHeight = window.innerHeight;
  var footerHeight = $('#poweredByPUSHImage').height();

  var mainDiv = totalDeviceHeight - footerHeight;

  $('#mainContainer').css("height",mainDiv+"px");
  $('#footer').css("height",footerHeight+"px");
};

var current_id;
function startConf()
{
  if($('#loginInputFirstName').val() == 0)
  {
    blinkLoginErrorMessage(" first name ");
  }
  else if($('#loginInputLastName').val() == 0)
  {
    blinkLoginErrorMessage(" last name ");
  }
  else if($('#loginInputConfName').val() == 0)
  {
    blinkLoginErrorMessage(" conference/room name ");
  }

  if($('#loginInputFirstName').val() != 0 && $('#loginInputLastName').val() != 0 && $('#loginInputConfName').val() != 0)
  {
    $("#login").fadeOut(200);
    $('#loginRow').fadeOut(200);
    //$('#loginRow').remove();
    $("#mainStructure").fadeIn(200);

    startConference();
  }
}

function blinkLoginErrorMessage(errorMessage)
{
  $('#formErrorMessage').html(errorMessage)
  $('#formErrorMessageDiv').fadeIn(500);
  $('#formErrorMessageDiv').fadeOut(500);
  $('#formErrorMessageDiv').fadeIn(500);
  $('#formErrorMessageDiv').fadeOut(500);
  $('#formErrorMessageDiv').fadeIn(500);
  $('#formErrorMessageDiv').fadeOut(500);
}

function startConference()
{
  $('#peerStatus').html("Attempting to connect to server. Please wait.");
  $('#peerStatus').css("color", "#FFDB58");

  speakerButtonIsActive = true;

  var video = document.getElementById( 'video' );

  var hasUserMedia = navigator.webkitGetUserMedia ? true : false;

  var peer = new Peer({host: 'push.serveftp.com', port: 9000, path: '/'});
  //var peer = new Peer({key: '1yy04g33loqd7vi'});
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
    current_id = id;
    $('#peerStatus').html("Connected with ID <b>" + id + "</b>");
    $('#peerStatus').css("color", "lawngreen");
    $('#peerStatusWaiting').html("<b>Waiting for users to connect.</b>");
    $('#peerStatusWaiting').css("color", "#FFDB58");

    var speakerFirstName = $('#loginInputFirstName').val();
    var speakerLastName = $('#loginInputLastName').val();
    var conferenceRoomName = $('#loginInputConfName').val();

    setInterval(blinkPeerStatusWaiting, 1000);
    localStorage.setItem("id", id);

    callDB(id,"new",speakerFirstName,speakerLastName,conferenceRoomName);

  });


  peer.on('close', function() { console.log("someone closed connection."); });

  peer.on('disconnected', function() { console.log("someone disconnected."); });

  peer.on('error', function(err) { console.log("something bad happened. ERROR.");
                                    console.log(err);});
  peer.on('connection', function(conn) {
    navigator.getUserMedia = ( navigator.getUserMedia    || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true, audio: true}, function(stream) {

          /*
           * On Open Connection - PEERJS
           */
          conn.on('open', function() {
            console.log("connection open");

            peerStatusWaitingIsActive = false;

            $('#peerStatusWaiting').html("You are now streaming to all the connected users.");

            $('#peerStatusWaiting').css("color", "lawngreen");

            $("#usersConnectedText").fadeIn("slow");

            if(detectmob())
            {
              $('#sliderButton').fadeIn("slow");
              amIStreaming = true;
            }

            $('#mainStructure').fadeIn("slow");

            $('#menu').fadeIn("fast");

            openNav();

          });

          /*
           * On a new call
           */
          peer.on('call', function(call) {
            call.answer(stream);

            for(key in peer.connections)
            {

              console.log(peer.connections[key][0]);

                peerId = peer.connections[key][0].id;

                userJSON = '{ "id":"'+peerId+'", "name":"'+key+'" }';

                console.log(userJSON);

                setTimeout(function(){

                  $('#video').fadeIn(200);
                  $('#mainStructure').toggleClass('mainStructureVideo');

                }, 1500);



                if(!connectedUsers.includes(userJSON))
                {
                  connectedUsers.push(userJSON);
                }

            }

            refreshConnectionLabel(connectedUsers.length);

            refreshUserList();

          });

          /*
           * On connection close
           */
          conn.on('close', function() {

            for(key in peer.connections)
            {

              var connec = peer.connections[key][0];

                if(peer.connections[key][0].open == false)
                {

                  for(var i=0; i<connectedUsers.length; i++)
                  {
                    var user = JSON.parse(connectedUsers[i]);

                    if(user["name"] == key)
                    {
                      connectedUsers.splice(i, 1);
                    }
                  }

                }
                $.ajax({
                  url: 'php/updatecounter.php',
                  dataType: "text",
                  data:({id_peer:current_id, estado:"saiu", numero_pessoas: connectedUsers.length}),
                  success:function(data){
                  },
                  error:function(textStatus,errorThrown){
                    console.log(textStatus);
                    console.log(errorThrown);
                  }
                });
                refreshConnectionLabel(connectedUsers.length);
                refreshUserList();
            }

          });

          video.srcObject = stream;
        }, function(err) {
          console.log('Failed to get local stream' ,err);
        });
    };

  });
}

function refreshConnectionLabel(count)
{
  if(count < 1)
  {
    closeNav();
  }
  else if(count < 2)
    $('#ligacoes').html("<b>"+count+"</b> <p style='display:inline; color:black;'>person connected</p>");
  else
  {
    $('#ligacoes').html("<b>"+count+"</b> <p style='display:inline; color:black;'>people connected</p>");
  }
}

function refreshUserList()
{

  console.log(connectedUsers);

  var finalUserString = "";

  for(var i=0; i<connectedUsers.length; i++)
  {

    var user = JSON.parse(connectedUsers[i]);

    finalUserString += '<div id="userDiv'+user["name"]+'" style="padding:10px;"><span class="glyphicon glyphicon-user" style="margin-right:10px;"></span> ' + user["name"] +"</div>"; //"<button type='button' id='speakerButton"+user["name"]+"' class='speakerButton btn btn-warning btn-circle'><span class='glyphicon glyphicon-volume-up' style='top:-3px;'></span></button></div>";
  }

  $('#users').html(finalUserString);
}

function removeSpeaker(speaker)
{
  document.getElementById('speakerButton'+speaker).style.display = "none";
}

function blinkPeerStatusWaiting() {
  if(peerStatusWaitingIsActive)
  {
    $('#peerStatusWaiting').fadeOut(500);
    $('#peerStatusWaiting').fadeIn(500);
  }
  else {
    $('#peerStatusWaiting').fadeIn(100);
  }
}

function openNav() {
    document.getElementById("sideMenuUsers").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    peerStatusWaitingIsActive = true;
    $('#peerStatusWaiting').html("<b>Waiting for users to connect.</b>");
    $('#peerStatusWaiting').css("color", "#FFDB58");

    document.getElementById("sideMenuUsers").style.width = "0";
}

function callDB(id,state,speakerFirstName,speakerLastName,conferenceRoomName)
{
  if(state == "new")
  {
    dataToSend = ({id_conf: id, first_name: speakerFirstName, last_name: speakerLastName, conf_name: conferenceRoomName, state: 'new'});
  }
  else {
    dataToSend = ({id_conf: id, state: 'disconnected'});
  }

  $.ajax({
    url: 'php/new_conf.php',
    dataType: "text",
    data: dataToSend,
    success:function(data){
    },
    error:function(textStatus,errorThrown){
      $('#peerStatus').html("Not connected, something went wrong.<br> <h1>" + textStatus["status"] + " / " + textStatus["statusText"] + "</h1>");
      $('#peerStatus').css("color", "#BD2124");
      $('#peerStatusWaiting').html("<b>Please try again.</b>");
      $('#peerStatusWaiting').css("color", "#BD2124");
    }
  });

}

window.onorientationchange = function() {
var orientation = window.orientation;
  switch(orientation) {
      case 0:
      if(!amIStreaming)
        window.location.reload();
      else
      {
        var totalDeviceHeight = screen.height;
        var footerHeight = $('#poweredByPUSHImage').height();

        var mainDiv = totalDeviceHeight - footerHeight;

        $('#mainContainer').css("height",mainDiv+"px");
        $('#footer').css("height",footerHeight+"px");
      }
      break;
      case 90:
      if(!amIStreaming)
        window.location.reload();
      else
      {
        var totalDeviceHeight = screen.height;
        var footerHeight = $('#poweredByPUSHImage').height();

        var mainDiv = totalDeviceHeight - footerHeight;

        $('#mainContainer').css("height",mainDiv+"px");
        $('#footer').css("height",footerHeight+"px");
      }
      break;
      case -90:
        if(!amIStreaming)
          window.location.reload();
        else
        {
          var totalDeviceHeight = screen.height;
          var footerHeight = $('#poweredByPUSHImage').height();

          var mainDiv = totalDeviceHeight - footerHeight;

          $('#mainContainer').css("height",mainDiv+"px");
          $('#footer').css("height",footerHeight+"px");
        }
      break; }
};

window.onunload = function(e) {
  var dialogText = 'Dialog text here';
  e.returnValue = dialogText;
  callDB(current_id,"disconnected","","","");
  return dialogText;
};

function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}
