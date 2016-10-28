<?php
  $id = $_GET['id'];
	$mysqli = new mysqli('localhost', 'p4p', 'p4p', 'bd_conf');
	$query = $mysqli->query("SELECT peer_id FROM tb_conferencias WHERE id_conferencia = '$id'");
	while($row = $query->fetch_assoc()){
	   echo $row['peer_id'];
	}
?>
