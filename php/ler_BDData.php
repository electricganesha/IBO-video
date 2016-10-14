<?php
  $cinema = $_POST['cinema'];
	$mysqli = new mysqli('eu-cdbr-azure-west-d.cloudapp.net', 'b30cd661f2834b', 'e8c9e5be', 'bd_cinema');;
	$sql = "select n_dias from datas WHERE id_cinema = '".$cinema."'";
	$query = $mysqli->query($sql);
	while($row = $query->fetch_assoc())
	{
	$output[]=$row['n_dias'];
	}
  	print(json_encode($output));
?>
