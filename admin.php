<?php
session_start();
if($_SESSION['entrou'] == "") {
  header("location: index.php");
}else{
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8>
  <title>P4P Conference Room Admin</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <link rel="stylesheet" href="css/font-awesome.css">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <link rel="stylesheet" href="css/adminStyle.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/slideout/0.1.12/slideout.min.js"></script>
  <script src="js/jquery-2.1.4.min.js"></script>
  <script src="js/jquery-ui.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="js/peer.js"></script>
  <script src="js/adminConference.js"></script>
</head>
<body>
  <nav id="menu" class="menu" style="background-color:#917a57; display:none; ">
    <div id="sideMenuUsers" class="sidenav" style="width:100%;">
      <div id="ligacoes" style="display:block; text-align:center; width:100%; margin-left:10px; border-bottom:1px solid black; padding:10px;"></div>
      <br>
      <div style="margin-left:10px;" id="users"></div>
    </div>
  </nav>

  <main id="main" style="background-color:black;">
    <header class="panel-header" style="position:absolute;">
      <button id="sliderButton" class="btn js-slideout-toggle" style="z-index:999; position:absolute; margin-top:50vh; display:none; background-color:#917a57; border:0px; border-bottom-right-radius:25px; border-top-right-radius:25px;"> <span class="glyphicon glyphicon-user" style="margin-right:5px;"></span> <div style="display:inline; color:rgba(255,255,255,0.25);">></div>
      </button>
    </header>
    <div id="mainContainer" class="container" style="width:100%;">
      <div class="row" id="mainRow" style="height:100%;">
        <div class="row" style="height:15%;">
          <img class="img-responsive" style="margin:auto; height:100%;" src="img/P4PLogo.png"></img>
        </div>
        <div class="row" id="mainTitleRow">
          <h1 style="width:70%; margin:auto; border-bottom:2px solid #917a57; padding-bottom:1%;"> Virtual <div style="display:inline; color:#917a57">Conference</div> Room - Speaker</h1>
        </div>
        <div class="row" id="loginRow">
          <div id="login" style="width:100%;">
            <div class="row" id="rowFirstLastName" style="width:50%; margin:auto; margin-bottom:10px;">
              <div class="col-md-6 col-sm-6 col-xs-6" id="yourNameColumn" >
                <small> Your name : </small> &nbsp;
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6">
                <input id="loginInputFirstName" class="loginConfInput" type="text" placeholder="First Name"></input>&nbsp;<input id="loginInputLastName" class="loginConfInput" type="text" placeholder="Last Name"></input>
              </div>
            </div>
            <div class="row" id="rowConferenceName" style="width:50%; margin:auto;">
              <div class="col-md-6 col-sm-6 col-xs-6" id="conferenceNameColumn">
                <small style="width:100%;"> Conference/Room name : </small> &nbsp;
              </div>
              <div class="col-md-6 col-sm-6 col-xs-6">
                <input id="loginInputConfName" class="loginConfInput" type="text" placeholder="Conference/Room Name"></input><button type="button" id="loginConfButton" onclick="startConf()" class='btn'> Start </button>
              </div>
            </div>
            <br>
            <div class="row" id="errorRow">
              <div id="formErrorMessageDiv" style="display:none;"><p style="display:inline;"> Please specify a </p> <p id="formErrorMessage" style="display:inline; color:#917a57"> </p> <p style="display:inline;"> in order to continue. </p></div>
            </div>
        </div>
      </div>
        <div id="mainStructure">
          <div style="margin:auto; margin-bottom:5px;"> <b><u>Status</u></b></div>
          <div id="peerStatus"></div>
          <div id="peerStatusWaiting" style="margin:auto;"></div>
        </div>
        <br>
        <video id="video" autoplay muted></video>
      </div>
    </div>
    <div id="footer">
      <a id="poweredByPUSH" href="https://www.pushvfx.com"><img id="poweredByPUSHImage" width="150px" src="img/Push_Logo_transparente.png"></img></a>
    </div>
  </main>
</body>
</html>
<?php } ?>
