<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

//$nombre = mysql_real_escape_string(urldecode(trim($_POST["u_nombre"])));
$nombre = urldecode(trim($_POST["u_nombre"]));
//$apellidos = mysql_real_escape_string(urldecode(trim($_POST["u_apellido"])));
$apellidos = urldecode(trim($_POST["u_apellido"]));
$title = $nombre . " " . $apellidos;
//$email = mysql_real_escape_string(trim($_POST["u_email_register"]));
$email = trim($_POST["u_email_register"]);
$password = trim($_POST["u_password_register"]);
$deporte_id = !empty($_POST["u_deporte"]) ? $_POST["u_deporte"] : NULL;

//Addtion
$code = preg_replace('/[^a-zA-Z0-9]/','',uniqid('app',true));
$some_special_chars = array("á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "ñ", "Ñ");
$replacement_chars  = array("a", "e", "i", "o", "u", "A", "E", "I", "O", "U", "n", "N");
$replaced_string    = str_replace($some_special_chars, $replacement_chars, $title);
$now = date("Y-m-d");

//password con sha1
$security_salt = "DYhG93b0qyJfIxfs2guVoUubWwvniR2G0FgaC9mioprtg";
$password_salt = sha1($security_salt . $password);

try {
    $lastId = -1;
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

    $stmt = $dbh->prepare("INSERT INTO usuarios (deporte_id, title, nombre, apellidos, email, password, codigovalidacion, diaregistro) VALUES(?,?,?,?,?,?,?,?)");

    try {
        $dbh->beginTransaction();
        $stmt->execute( array($deporte_id, "$title", "$nombre", "$apellidos", "$email", "$password_salt", "$code", "$now"));
        $lastId =  $dbh->lastInsertId();
        $dbh->commit();
        
        //Update urlamigable
        $urlamigable = strtolower(preg_replace('/[^a-zA-Z0-9]/','', $replaced_string. $lastId));
        $stmt2 = $dbh->prepare("UPDATE usuarios SET urlamigable= :urlamigable WHERE id= :id");
        $dbh->beginTransaction();
        $stmt2->bindParam("urlamigable", $urlamigable);
        $stmt2->bindParam("id", $lastId);
        $stmt2->execute();
        $dbh->commit();
        
        //Enviamos el codigo de confirmacion al email del usuario registrado.
        $success = enviar_codigo_confirmacion($nombre, $code, $email);
        
    } catch(PDOExecption $e) {
        $dbh->rollback();
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
    echo '{"item":'. json_encode($lastId) .'}'; 
} catch( PDOExecption $e ) {
    echo '{"error":{"text":'. $e->getMessage() .'}}';
} 

?>