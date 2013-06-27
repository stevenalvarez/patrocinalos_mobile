<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

$sql = "SELECT `Deporte`.`id`, `Deporte`.`deportecategoria_id`, `Deporte`.`nombre`, `Deporte`.`nombre_en`, `Deporte`.`nombre_it`, `Deporte`.`codigo`, `Deporte`.`fechahora`, `Deportecategoria`.`id`, `Deportecategoria`.`codigo`, `Deportecategoria`.`nombre`, `Deportecategoria`.`nombre_en`, `Deportecategoria`.`nombre_it` FROM `prod_patrocinalos`.`deportes` AS `Deporte` LEFT JOIN `prod_patrocinalos`.`deportecategorias` AS `Deportecategoria` ON (`Deporte`.`deportecategoria_id` = `Deportecategoria`.`id`) WHERE 1 = 1 ORDER BY `Deportecategoria`.`nombre` ASC, `Deporte`.`nombre` ASC";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $dbh->query($sql);
	$deportes = $stmt->fetchAll(PDO::FETCH_OBJ);
    
	$dbh = null;
	echo '{"items":'. json_encode($deportes) .'}'; 
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}


?>