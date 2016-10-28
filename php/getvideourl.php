<?php
	$id = $_GET['id'];
	$mysqli = new mysqli('localhost', 'p4p', 'p4p', 'bd_conf');
	$query = $mysqli->query("SELECT video_url FROM tb_conferencias WHERE id_conferencia = '$id'");
	while($row = $query->fetch_assoc()){
	   echo $row['video_url'];
	}
?>
