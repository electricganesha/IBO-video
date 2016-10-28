<?php
	$state = $_GET['state'];
	$id_conf = $_GET['id_conf'];
	$dia = date('d/m/Y');
	$hora = date("h:i");
	$mysqli = new mysqli('localhost', 'p4p', 'p4p', 'bd_conf');
	if($state == 'new'){
		$first_name = $_GET['first_name'];
		$last_name = $_GET['last_name'];
		$conf_name = $_GET['conf_name'];
		$mysqli->query("INSERT INTO tb_conferencias(nome, orador, estado, dia, hour, peer_id) VALUES ('$conf_name','$first_name . " " . $last_name', 'live', '$dia', $hora, $id_conf)");
	}else if($state == 'disconnected'){
		$mysqli->query("DELETE FROM tb_conferencias WHERE peer_id = '$id_conf'");
	}
	$mysqli->close();
?>
