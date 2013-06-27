<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

$sql = "SELECT Usuario.id, Usuario.email FROM usuarios as Usuario WHERE Usuario.email =:email LIMIT 1";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $dbh->prepare($sql);
    $stmt->bindParam("email", $_POST['email']);
    $stmt->execute();
    $usuario = $stmt->fetchObject();
    $success = !empty($usuario) ? true : false;
    
	$dbh = null;
    echo '{"item":'. json_encode($usuario) .',"success":'.json_encode($success).'}';
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}

?>