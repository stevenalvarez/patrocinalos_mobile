<?php
include 'config.php';
include 'functions.php';

header ('Content-type: text/html; charset=ISO-8859-1');

//print_r($_FILES);
//$new_image_name = "namethisimage.jpg";
//move_uploaded_file($_FILES["file"]["tmp_name"], "/srv/www/upload/".$new_image_name);
echo '{"item":'. json_encode($_FILES["file"]["tmp_name"]) .'}'; 

?>