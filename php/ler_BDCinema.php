<?php
	$mysqli = new mysqli('localhost', 'pushvr', 'pushvr', 'cinema');
	$sql = "select * from cadeiras";
	$query = $mysqli->query($sql);
	while($row = $query->fetch_assoc())
	{
	$output[]=$row;
	}
  	print(json_encode($output));
?>
