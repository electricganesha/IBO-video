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
    <title>P4P - Conference Room</title>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <link rel="stylesheet" href="css/font-awesome.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <style>
        @font-face {
            font-family: osb;
            src: url(fonts/OpenSans-Bold.ttf);
        }
        @font-face {
            font-family: osr;
            src: url(fonts/OpenSans-Regular.ttf);
        }
        @font-face {
            font-family: ossb;
            src: url(fonts/OpenSans-Semibold.ttf);
        }
        @font-face {
            font-family: osl;
            src: url(fonts/OpenSans-Light.ttf);
        }
        body {
        margin: 0;
        overflow: hidden;
        }

        .Blink {
          animation: blinker 1s cubic-bezier(0, 0, 1, 1) infinite alternate;
        }
        @keyframes blinker {
          from { opacity: 1; }
          to { opacity: 0.2; }
        }

        .conferencia{
          border : 1px solid #5d5d5d;
          -webkit-transition : border 400ms ease-out;
          -moz-transition : border 400ms ease-out;
          -o-transition : border 400ms ease-out;
        }

        .conferencia:hover{
           border : 1px solid #917a57;
        }

        .btentrar{
          color : white;
          -webkit-transition : color 100ms ease-out;
          -moz-transition : color 100ms ease-out;
          -o-transition : color 100ms ease-out;
        }

        .btentrar:hover{
          color: #917a57;
        }

        .npeople {
          border-left: 1px solid #5d5d5d;
          -webkit-transition : border-left 400ms ease-out;
          -moz-transition : border-left 400ms ease-out;
          -o-transition : border-left 400ms ease-out;
        }

        .conferencia:hover > .npeople { border-left: 1px solid #917a57; }

        @-webkit-keyframes coloranim {
            0%     {border-color: #5d5d5d;}
            50.0%  {border-color:#917a57;}
            100.0%  {border-color:#5d5d5d;}
        }

        @keyframes coloranim {
            0%     {border-color:#5d5d5d;}
            50.0%  {border-color:#917a57;}
            100.0%  {border-color:#5d5d5d;}
        }

        ::-webkit-input-placeholder {
           text-align: center;
        }

        :-moz-placeholder { /* Firefox 18- */
           text-align: center;
        }

        ::-moz-placeholder {  /* Firefox 19+ */
           text-align: center;
        }

        :-ms-input-placeholder {
           text-align: center;
        }

        #divMainConf
        {
          overflow-y:scroll;
        }

      /* Let's get this party started */
      #divMainConf::-webkit-scrollbar {
          width: 8px;

      }

      /* Track */
      #divMainConf::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          -webkit-border-radius: 10px;
          border-radius: 10px;
          background-color:rgba(255,255,255,0.3);
      }

      /* Handle */
      #divMainConf::-webkit-scrollbar-thumb {
          -webkit-border-radius: 10px;
          border-radius: 10px;
          background: #917a57;
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);

      }
    </style>
  </head>
  <body>
    <script src="js/peer.js"></script>
    <script src="js/jquery-2.1.4.min.js"></script>
    <script src="js/jquery-ui.js"></script>

    <script>
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

      if (detectmob()){
        document.write('<video id="video" style="display:none"><\/video>');
        document.write('<audio id="audio" style="display:none"></audio>');
        document.write("<script src='cinema_mobile.js'><\/script>");
      }else{
        document.write('<video id="video" style="display:none"><\/video>');
        document.write('<audio id="audio" style="display:none"></audio>');
        document.write("<script src='cinema.js'><\/script>");
      }
    </script>
  </body>
</html>
<?php } ?>
