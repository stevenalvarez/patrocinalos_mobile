<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

$sql = "SELECT Usuario.title, Usuario.imagen FROM usuarios as Usuario WHERE Usuario.imagen <> 'default.png' ORDER BY RAND() limit 10";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $dbh->query($sql);  
	$usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
    
	$dbh = null;
	echo '{"items":'. json_encode($usuarios) .'}'; 
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}


?>