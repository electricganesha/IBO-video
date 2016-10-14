<?php
	$dados = $_POST['dados'];
	$dadosdecode = json_decode($dados, true);
	$mysqli = new mysqli('eu-cdbr-azure-west-d.cloudapp.net', 'b30cd661f2834b', 'e8c9e5be', 'bd_cinema');
	for ($i=1; $i<= count($dadosdecode); $i++){
		$n_sessao = $dadosdecode[$i][sessao];
		$n_fila = $dadosdecode[$i][fila];
		$n_lugar = $dadosdecode[$i][lugar];
		$sql = "UPDATE $n_sessao SET estado = 'OCUPADA' WHERE fila = '$n_fila' AND lugar = '$n_lugar'";
		$mysqli->query($sql);
	}
?>
