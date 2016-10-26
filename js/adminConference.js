var peerStatusWaitingIsActive = true;

var speakerQueue = [];
var connectedUsers = [];


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

  var video = document.getElementById( 'video1' );

  var hasUserMedia = navigator.webkitGetUserMedia ? true : false;

  //var peer = new Peer({host: 'push.serveftp.com', port: 9000, path: '/'});
  var peer = new Peer({key: 'xinpfgueyexez5mi'});
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
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

                  $('#video1').fadeIn(200);

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
      console.log(textStatus);
      console.log(errorThrown);
      $('#peerStatus').html("Not connected, something went wrong. " + textStatus);
      $('#peerStatus').css("color", "red");
    }
  });

}

$(window).on('beforeunload', function() {
  callDB(id,"disconnected","","","");
});
