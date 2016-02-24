<!DOCTYPE html>
<html>
<header>
<title>Resumo</title>
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
    #tabela{
      border: solid 1px #D3D3D3;
      margin: auto;
      width: 350px;
    }
    #cabecalho{
      border-bottom: solid 1px #D3D3D3;
      margin: auto;
      width: 325px;
      padding-left: 25px;
      background-color: #F7F7F7;
      padding-top: 1px;
      font-size: 17px;
      height: 55px;
    }
    #filme_escolhido{
      border-bottom: solid 1px #D3D3D3;
      margin: auto;
      width: 300px;
    }
    #cinema_escolhido{
      border-bottom: solid 1px #D3D3D3;
      margin: auto;
      width: 300px;
    }
    #sessao_escolhida{
      border-bottom: solid 1px #D3D3D3;
      margin: auto;
      width: 300px;
    }
    #bilhetes_comprados{
      margin: auto;
      width: 300px;
    }
    #total{
      border-top: solid 1px #D3D3D3;
      margin: auto;
      width: 325px;
      background-color: #F7F7F7;
      padding-left: 25px;
      height: 55px;
    }
    #plight{
      font-family: osr;
      font-size: 13px;
    }
    #pbold{
      font-family: osb;
    }
  </style>
</header>
<body>
<div id="tabela">
  <?php
  $dados = $_COOKIE["dados"];
  $dadosdecode = json_decode($dados, true);
  $total_bilhetes = count($dadosdecode) -1;
  $valor_total;
  echo "<div id='cabecalho'>";
    echo "<p id='pbold'>Resumo</p>";
  echo "</div>";
  echo "<div id='filme_escolhido'>";
    echo "<p id='plight'>Filme escolhido</p>";
    echo "<p id='pbold'><b>" . $dadosdecode[0][nome_filme] . "</b></p>";
    echo "<p id='plight' style='font-size: 16px'>" . $dadosdecode[0][info_filme] . "</p>";
  echo "</div>";
  echo "<div id='cinema_escolhido'>";
    echo "<p id='plight'>Cinema escolhido</p>";
    echo "<p id='pbold'><b>" . $dadosdecode[0][cinema] . "</b></p>";
  echo "</div>";
  echo "<div id='sessao_escolhida'>";
    echo "<p id='plight'>Sessão escolhida</p>";
    echo "<p id='pbold'><b> Dia " . $dadosdecode[0][data] . "</b></p>";
    echo "<p id='pbold'><b>" . $dadosdecode[0][sala] . ", ás " . $dadosdecode[0][sessao] . "</b></p>";
  echo "</div>";
  echo "<div id='bilhetes_comprados'>";
    echo "<p id='plight'>Bilhetes Comprados</p>";
    echo "<p id='pbold'><b>" . $total_bilhetes . " Bilhete(s)</b></p>";
    for ($i=1; $i<= $total_bilhetes; $i++){
      echo "<p id='plight' style='font-size: 16px'>&nbsp;&nbsp;&nbsp;&nbsp;Fila " . $dadosdecode[$i][fila] . " Lugar " . $dadosdecode[$i][lugar] . "&nbsp;-&nbsp;" . $dadosdecode[$i][tipoBilhete] . "</p>";
      switch ($dadosdecode[$i][tipoBilhete])
      {
          case "normal":
            $valor_total += 6.95;
            break;
          case "estudante":
            $valor_total += 6.05;
            break;
          case "senior":
            $valor_total += 6.05;
            break;
          case "crianca":
            $valor_total += 6.05;
            break;
      }
    }
  echo "</div>";
  echo "<div id='total'>";
    echo "<p id='pbold'>Total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" . $valor_total . " EUR</p>";
  echo "</div>";
  ?>
</div>
</body>
</html>
