<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

//$nombre = mysql_real_escape_string(urldecode(trim($_POST["u_nombre"])));
$nombre = isset($_POST["u_nombre"]) && !empty($_POST["u_nombre"]) ? urldecode(trim($_POST["u_nombre"])) : NULL;
//$apellidos = mysql_real_escape_string(urldecode(trim($_POST["u_apellido"])));
$apellidos = isset($_POST["u_apellido"]) && !empty($_POST["u_apellido"]) ? urldecode(trim($_POST["u_apellido"])) : NULL;
$title = isset($_POST["u_title"]) && !empty($_POST["u_title"]) ? urldecode(trim($_POST["u_title"])) : NULL;
//$email = mysql_real_escape_string(trim($_POST["u_email_register"]));
$email = isset($_POST["u_email_register"]) && !empty($_POST["u_email_register"]) ? trim($_POST["u_email_register"]) : NULL;
$password = isset($_POST["u_password_register"]) && !empty($_POST["u_password_register"]) ? trim($_POST["u_password_register"]) : NULL;
$deporte_id = isset($_POST["u_deporte"]) && !empty($_POST["u_deporte"]) ? $_POST["u_deporte"] : NULL;
$tipo = isset($_POST["u_tipo"]) && !empty($_POST["u_tipo"]) ? $_POST["u_tipo"] : NULL;

//verificamos si viene una imagen de alguna red social
$img_url = isset($_POST["u_img_url_social"]) && !empty($_POST["u_img_url_social"]) ? $_POST["u_img_url_social"] : NULL;

//Addtion
$code = preg_replace('/[^a-zA-Z0-9]/','',uniqid('app',true));
$some_special_chars = array("�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�", "�");
$replacement_chars  = array("a", "e", "i", "o", "u", "A", "E", "I", "O", "U", "n", "N");
$replaced_string    = str_replace($some_special_chars, $replacement_chars, $title);
$now = date("Y-m-d");

//password con sha1
$security_salt = "DYhG93b0qyJfIxfs2guVoUubWwvniR2G0FgaC9mioprtg";
$password_salt = sha1($security_salt . $password);

try {
    $lastId = -1;
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);

    $stmt = $dbh->prepare("INSERT INTO usuarios (deporte_id, title, nombre, apellidos, email, password, codigovalidacion, diaregistro, tipo) VALUES(?,?,?,?,?,?,?,?,?)");

    try {
        $dbh->beginTransaction();
        $stmt->execute( array($deporte_id, "$title", "$nombre", "$apellidos", "$email", "$password_salt", "$code", "$now", "$tipo"));
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
        
        //Subimos la imagen de la red social si es que hay
        if($img_url)
        {
            $dir = "/app/webroot/img/";
            $targetFolder = $dir .'Usuario/full/'; //Path de donde se va a guardar la imagen original
            $targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
            $imagen = saveImage($img_url, $targetPath);
            if($imagen){
                /* Variable para la copia de la imagen*/
                $targetFileImg = rtrim($targetPath,'/') . '/';
                $targetFileCopy = $_SERVER['DOCUMENT_ROOT'] . $dir;
                $imagevars = getimagesize($targetPath.$imagen);
                $fileNameImg = $imagen;
                
                //Copias
                copia_optimizada($targetFileImg, $targetFileCopy."Usuario/800/", $imagevars, $fileNameImg, 800, 800);
                copia_optimizada($targetFileImg, $targetFileCopy."Usuario/169/", $imagevars, $fileNameImg, 169);
                
                //Update imagen
                $stmt3 = $dbh->prepare("UPDATE usuarios SET imagen= :imagen WHERE id= :id");
                $dbh->beginTransaction();
                $stmt3->bindParam("imagen", $imagen);
                $stmt3->bindParam("id", $lastId);
                $stmt3->execute();
                $dbh->commit();
            }
        }
        
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