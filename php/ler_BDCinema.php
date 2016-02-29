<?php
  $sessao = $_POST['sessao'];
  $mysqli = new mysqli('localhost', 'cinema', 'cinema', 'bd_cinema');
	$sql = "SELECT * from `" . $sessao . "`";
	$query = $mysqli->query($sql);
	while($row = $query->fetch_assoc())
	{
	$output[]=$row;
	}
  	print(json_encode($output));
?>