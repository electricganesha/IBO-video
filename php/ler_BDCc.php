<?php
	$mysqli = new mysqli('eu-cdbr-azure-west-d.cloudapp.net', 'b30cd661f2834b', 'e8c9e5be', 'bd_cinema');
	$sql = "select * from cinemas";
	$query = $mysqli->query($sql);
	while($row = $query->fetch_assoc())
	{
	$output[]=$row;
	}
  	print(json_encode($output));
?>
