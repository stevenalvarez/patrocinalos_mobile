<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

$nombre = mysql_real_escape_string(trim($_POST["usuario"]["nombre"]));
$apellidos = mysql_real_escape_string(trim($_POST["usuario"]["apellido"]));
$title = $nombre . " " . $apellidos;
$email = mysql_real_escape_string(trim($_POST["usuario"]["email_register"]));
$password = trim($_POST["usuario"]["password_register"]);
$deporte_id = $_POST["usuario"]["deporte"];

//echo '{"items":'. json_encode($_POST) .'}'; 

$sql = "INSERT INTO usuarios (deporte_id, title, nombre, apellidos, email, password) ";
$sql .= "VALUES ($deporte_id, '$title', '$nombre', '$apellidos', '$email', '$password')";

try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $dbh->query($sql);  
    $usuario = $stmt->fetchObject();
    
	$dbh = null;
	echo '{"item":'. json_encode($usuario) .'}'; 
} catch(PDOException $e) {
	echo '{"error":{"text":'. $e->getMessage() .'}}'; 
}

?>