<?php
	$id_conf = $_GET['id_conf'];
	$mysqli = new mysqli('eu-cdbr-azure-west-d.cloudapp.net', 'b30cd661f2834b', 'e8c9e5be', 'bd_cinema');
	$mysqli->query("UPDATE tb_conferencias SET id='$id_conf' WHERE id_conferencia = '1'");
?>
