<?php
  $mysqli = new mysqli('localhost', 'p4p', 'p4p', 'bd_conf');
	$sql = "SELECT * from cadeiras";
	$query = $mysqli->query($sql);
	while($row = $query->fetch_assoc())
	{
	$output[]=$row;
	}
  	print(json_encode($output));
?>
