<?php
include 'config.php';
include 'functions.php';

if (!empty($_FILES)) {
    
    //Para donde es la foto
    $upload_photo_to = $_POST['folder'];
    
    //Si carga un foto a su perfil
    if($upload_photo_to == "perfil"){
        
        $dir = "/app/webroot/img/";
        $targetFolder = $dir .'Usuario/full/'; //Path de donde se va a guardar la imagen original
        
        $tempFile = $_FILES["file"]["tmp_name"];
        $pathinfo = pathinfo($_FILES['file']['name']);
        $filename = $pathinfo['filename'];
        $filename = preg_replace('/[^a-zA-Z0-9]/','',uniqid('mob_img',true).$filename);
        $ext = $pathinfo['extension'];
        $targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
        $targetFile = rtrim($targetPath,'/') . '/' .$filename.'.'.$ext;
        
        /* Variable para la copia de la imagen*/
        $targetFileImg = rtrim($targetPath,'/') . '/';
        $targetFileCopy = $_SERVER['DOCUMENT_ROOT'] . $dir;
        $imagevars = getimagesize($tempFile);
        $fileNameImg = $filename.'.'.$ext;
        
        
        if(move_uploaded_file($tempFile,$targetFile)){
            copia_optimizada($targetFileImg, $targetFileCopy."Usuario/800/", $imagevars, $fileNameImg, 800, 800);
            copia_optimizada($targetFileImg, $targetFileCopy."Usuario/169/", $imagevars, $fileNameImg, 169);
            
            echo $filename.'.'.$ext;
        }else{
            echo "error_img_mobile";
        }
    
    //Si carga un foto a su galeria de fotos
    }else if($upload_photo_to == "galeria_foto"){
        
    }
	
}else{
    echo 'file empty';
} 

?>