<?php
	$count = 0;
	$estado = $_GET['estado'];
	$mysqli = new mysqli('localhost', 'p4p', 'p4p', 'bd_conf');
	if($estado == 'entrou'){
		$id = $_GET['id'];
		$peer_id = $_GET['peer_id'];
		$dispositivo = $_GET['dispositivo'];
		$nome_user=$_GET['nome_user'];
		$query = $mysqli->query("SELECT n_pessoas, nome FROM tb_conferencias WHERE id_conferencia = '$id'");
		while($row = $query->fetch_assoc()){
			$nome_conf = $row['nome'];
			echo date('I');
			if(date('I') == 0){
				$data_entrada = date('d/m/Y H:i:s', time());
			}else{
				$data_entrada = date('d/m/Y H:i:s', time()-(60*60));
			}
			$user_ip = getenv('REMOTE_ADDR');
	    $geo = unserialize(file_get_contents("http://www.geoplugin.net/php.gp?ip=$user_ip"));
			$pais = $geo["geoplugin_countryName"];
			$regiao = $geo["geoplugin_region"];
			$cidade = $geo["geoplugin_city"];

			$mysqli->query("INSERT INTO tb_registos (peer_id, nome_user, ip, nome_conferencia, pais, regiao, cidade, hora_entrada, dispositivo) VALUES ('$peer_id','$nome_user', '$user_ip', '$nome_conf', '$pais', '$regiao', '$cidade', '$data_entrada', '$dispositivo')");

			$count = $row['n_pessoas'];
			$count += 1;
			$mysqli->query("UPDATE tb_conferencias SET n_pessoas= $count WHERE id_conferencia = '$id'");
		}
	}else if($estado == 'saiu'){
		echo date('I');
		if(date('I') == 0){
			$data_saida = date('d/m/Y H:i:s', time());
		}else{
			$data_saida = date('d/m/Y H:i:s', time()-(60*60));
		}
		$id = $_GET['id_peer'];
		$peer_id = $_GET['peer_id'];
		$npeople = $_GET['numero_pessoas'];
		$mysqli->query("UPDATE tb_conferencias SET n_pessoas = $npeople WHERE peer_id = '$id'");
		$mysqli->query("UPDATE tb_registos SET hora_saida = '$data_saida' WHERE peer_id = '$peer_id'");
	}
	$mysqli->close();
?>
