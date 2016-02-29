<?php
  $cinema = $_POST['cinema'];
	$mysqli = new mysqli('localhost', 'cinema', 'cinema', 'bd_cinema');
	$sql = "select n_dias from datas WHERE id_cinema = '".$cinema."'";
	$query = $mysqli->query($sql);
	while($row = $query->fetch_assoc())
	{
	$output[]=$row['n_dias'];
	}
  	print(json_encode($output));
?>
