<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

$tabla = $_POST["tabla"];
$campo = $_POST["campo"];
$valor = $_POST["valor"];
$condicion_campo = $_POST["condicion_campo"];
$condicion_valor = $_POST["condicion_valor"];

try {
    $lastId = -1;
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

    $stmt = $dbh->prepare("UPDATE $tabla SET $campo= :valor WHERE $condicion_campo= :condicion_valor");

    try {
        $dbh->beginTransaction();
        $stmt->bindParam("valor", $valor);
        $stmt->bindParam("condicion_valor", $condicion_valor);
        $fila = $stmt->execute();
        $dbh->commit();
    } catch(PDOExecption $e) {
        $dbh->rollback();
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    echo '{"item":'. json_encode($fila) .'}'; 
} catch( PDOExecption $e ) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
} 

?>