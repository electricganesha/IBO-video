<!DOCTYPE html>
<html>
  <head>
    <meta charset=utf-8>
    <title>P4P - Conference Room</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
    <link rel="stylesheet" href="css/font-awesome.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="css/indexStyle.css">
    <script src="js/jquery-2.1.4.min.js"></script>
    <script src="js/jquery-ui.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
      </head>
      <style>
      .btentrar{
        color : white;
        -webkit-transition : color 100ms ease-out;
        -moz-transition : color 100ms ease-out;
        -o-transition : color 100ms ease-out;
      }

      .btentrar:hover{
        color: #bd2124;
      }
      </style>
      <body>
        <?php
          if (isset($_POST['entrar'])){
            if($_POST['pass'] == 'p4p'){
              session_start();
              $_SESSION['entrou'] = 'true';
              header('location: ibo.php');
            }
          }
        ?>
        <div id="mainContainer" class="container" style="width:100%;">
          <div class="row" style="margin:auto; width:100%; height:20%;">
            <img id="p4pLogo" class="img-responsive" src="img/p4p.png" style="margin:auto; height:90%;"></img>
          </div>
          <div class="row" style="height:10%; ">
            <h1 id="mainTitle"> Virtual <div style="display:inline; color:#BD2124;">Conference</div> Room</h1>
          </div>
          <div class="row" style="position: absolute; width: 100%; top: 50%; height: 70px; margin-top: -50px;">
            <div class="col-md-12" style="text-align:center;">
              <form method="post" id="form_login">
                <input type="password" id="pass" name="pass" style="border:solid 1px #bd2124; width: 200px; text-align: center; height: 30px; background-color:transparent; color: white; font-size: 18px; outline: none; font-family: ossb;" placeholder="Password">
                <br>
                <br>
                <input type="submit" id="entrar" name="entrar" class="btentrar" value="Log In" style=" display: none;border:transparent; background-color:transparent; font-size: 20px; outline: none; font-family: ossb;" placeholder="Password">
              </form>
            </div>
          </div>
      </div>
        <div id="footer" class="row" style="margin:0px; width:100%;">
          <div class="col-md-12 col-sm-12 col-xs-12" style=" width:100%;">
            <a href="https://www.pushvfx.com"><img id="poweredByPUSHImage" src="img/Push_Logo_transparente.png"></img></a>
          </div>
        </div>
      </body>

      <script>
        $('#pass').keyup(function(){
            var value = $(this).val();
            if (value.length > 0) {
                $('.btentrar').show();
            } else {
                $('.btentrar').hide();
            }
        });
        if(detectmob())
        {
          $('#poweredByPUSHImage').css("width","100px");
          $('#poweredByPUSH').css("position","absolute");
          $('#poweredByPUSH').css("bottom","5px");
          $('#poweredByPUSH').css("margin-left","35%");
        }
        else
          $('#poweredByPUSHImage').css("width","150px");

        var totalDeviceHeight = window.innerHeight;
        var footerHeight = $('#poweredByPUSHImage').height();

        var mainDiv = totalDeviceHeight - footerHeight;

        $('#mainContainer').css("height",mainDiv+"px");
        $('#footer').css("height",footerHeight+"px");

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

          window.onorientationchange = function() {
        var orientation = window.orientation;
            switch(orientation) {
                case 0:
                case 90:
                case -90: window.location.reload();
                break; }
    };

      </script>
</html>
