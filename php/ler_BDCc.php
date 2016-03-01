<?php
	$mysqli = new mysqli('localhost', 'cinema', 'cinema', 'bd_cinema');
	$sql = "select * from cinemas";
	$query = $mysqli->query($sql);
	while($row = $query->fetch_assoc())
	{
	$output[]=$row;
	}
  	print(json_encode($output));
?>
