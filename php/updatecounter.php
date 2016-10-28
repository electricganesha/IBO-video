<?php
	$count = 0;
	$estado = $_GET['estado'];
	$mysqli = new mysqli('localhost', 'p4p', 'p4p', 'bd_conf');
	if($estado == 'entrou'){
		$id = $_GET['id'];
		$query = $mysqli->query("SELECT n_pessoas FROM tb_conferencias WHERE id_conferencia = '$id'");
		while($row = $query->fetch_assoc()){
			$count = $row['n_pessoas'];
			$count += 1;
			$mysqli->query("UPDATE tb_conferencias SET n_pessoas= $count WHERE id_conferencia = '$id'");
		}
	}else if($estado == 'saiu'){
		$id = $_GET['id_peer'];
		$npeople = $_GET['numero_pessoas'];
		$mysqli->query("UPDATE tb_conferencias SET n_pessoas= $npeople WHERE peer_id = '$id'");
	}
	$mysqli->close();
?>
