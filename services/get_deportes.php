<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

$sql = "SELECT Deporte.id, Deporte.nombre, Deportecategoria.id as id_categoria, Deportecategoria.nombre as nombre_categoria FROM deportes AS Deporte LEFT JOIN deportecategorias AS Deportecategoria ON (Deporte.deportecategoria_id = Deportecategoria.id) ORDER BY Deportecategoria.nombre ASC, Deporte.nombre ASC";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $dbh->query($sql);
	$deportes = $stmt->fetchAll(PDO::FETCH_OBJ);
    
    foreach($deportes as $key => $deporte){
        $deportes[$key]->nombre = htmlentities($deporte->nombre);
        $deportes[$key]->nombre_categoria = htmlentities($deporte->nombre_categoria);
    }
    
	$dbh = null;
	echo '{"items":'. json_encode($deportes) .'}'; 
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}


?>