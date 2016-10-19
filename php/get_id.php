<?php
	$mysqli = new mysqli('eu-cdbr-azure-west-d.cloudapp.net', 'b30cd661f2834b', 'e8c9e5be', 'bd_cinema');
	$query = $mysqli->query("SELECT * FROM tb_conferencias WHERE id_conferencia = '1'");
	while($row = $query->fetch_assoc()){
	   echo $row['id'];
	}
?>
