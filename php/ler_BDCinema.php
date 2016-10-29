<?php
  $tb_id = $_POST['tbid'];
  $mysqli = new mysqli('localhost', 'p4p', 'p4p', 'bd_conf');
	$query = $mysqli->query("SELECT * from $tb_id");
	while($row = $query->fetch_assoc())
	{
	$output[]=$row;
	}
  print(json_encode($output));
?>
