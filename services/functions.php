<?php
	
    function deserializar($unserserialize){
        $serializado=@unserialize($unserserialize);
        if(!$serializado){
            $serializado=@unserialize(preg_replace('!s:(\d+):"(.*?)";!se', "'s:'.strlen('$2').':\"$2\";'",$unserserialize));
        }
        return $serializado;
    }
    
    function obtener_mes($mes_ingles){
        $mes = "";
        switch ($mes_ingles) {
            case "January":
                $mes = "Enero";
                break;
            case "February":
                $mes = "Febrero";
                break;
            case "March":
                $mes = "Marzo";
                break;
            case "April":
                $mes = "Abril";
                break;
            case "May":
                $mes = "Mayo";
                break;
            case "June":
                $mes = "Junio";
                break;
            case "July":
                $mes = "Julio";
                break;
            case "August":
                $mes = "Agosto";
                break;
            case "September":
                $mes = "Septiembre";
                break;
            case "October":
                $mes = "Octubre";
                break;
            case "November":
                $mes = "Noviembre";
                break;
            case "December":
                $mes = "Diciembre";
                break;
        }
        
        return $mes;
    }
    
    function copia_optimizada($targetFileImg, $targetFileCopy, $imagevars, $fileName, $top_width=null, $top_height=null){
        
        $tempuploaddir = $targetFileImg;
        $destinationddir = $targetFileCopy;
        $imagen = $imagevars;
        $image_src = $fileName;
        
        if(!is_dir($destinationddir)){
            mkdir($destinationddir,0777,true);
        }
        
        if($imagen[2]==1){$img = imagecreatefromgif($tempuploaddir.$image_src);}
        if($imagen[2]==2){$img = imagecreatefromjpeg($tempuploaddir.$image_src);}
        if($imagen[2]==3){$img = imagecreatefrompng($tempuploaddir.$image_src);}  
        
        if($top_width && $top_height)
        {
            if($imagen[0]>$top_width)//si la imagen es mas ancha
            {
                $width=$top_width;
                $height=($top_width/$imagen[0])*$imagen[1];            
            }
            else
            {
                $width=$imagen[0];
                $height=$imagen[1];
            }
            if($height>$top_height)//si el alto es mas alto todavia
            {
                $width= ($top_height/$height)* $width;
                $height=$top_height;
            }//se crea una imagen
        }
        else  //si hay top width o height
        {
            if(!$top_width && !$top_height)
            {
                $height=$this->height;
                $width=$this->width;
            }
            else{
                if(!$top_width)
                {
                    $width= ($top_height/$imagen[1])* $imagen[0];
                    $height=$top_height;
                }
                else if(!$top_height)
                {
                    $width=$top_width;
                    $height=($top_width/$imagen[0])*$imagen[1];
                }
            }
        }
        
        $img_des = ImageCreateTrueColor($width,$height);
        imagecopyresampled ($img_des,$img, 0, 0, 0, 0, $width, $height, $imagen[0], $imagen[1]);
        
        if($imagen[2]==1){imagegif($img_des,$destinationddir.$fileName,100); }
        if($imagen[2]==2){imagejpeg($img_des,$destinationddir.$fileName,100); }
        if($imagen[2]==3){imagepng($img_des,$destinationddir.$fileName); }
    }
    
    /**
     * para guardar imagenes desde una url
     * @param mixed $url
     * @return
     */
    function saveImage($url, $targetPath) {
        $ext = end(explode(".", $url));
        
    	$c = curl_init();
    	curl_setopt($c,CURLOPT_URL,$url);
    	curl_setopt($c,CURLOPT_HEADER,0);
    	curl_setopt($c,CURLOPT_RETURNTRANSFER,true);
    	$s = curl_exec($c);
    	curl_close($c);
        $fileName = preg_replace('/[^a-zA-Z0-9]/','',uniqid('mob_img')."social");
        $path = $targetPath.$fileName.".$ext";
    	$f = fopen($path, 'wb');
    	$z = fwrite($f,$s);
    	if ($z != false) return $fileName.".$ext";
    	return false;
    }
    
    function save_img($url, $targetPath) {
        
        $img_file = file_get_contents($url); // url: https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/625699_575981255765699_1150061574_n.jpg 
        $image_path = parse_url($url);
        $img_path_parts = pathinfo($image_path['path']);
        
        $filename = $img_path_parts['filename'];
        $img_ext = $img_path_parts['extension'];
    
        $path = $targetPath;
        $filex = $path . $filename . "." .$img_ext;
        $fh = fopen($filex, 'w');
        fputs($fh, $img_file);
        fclose($fh);
        return filesize($filex);
    }
    
    function enviar_codigo_confirmacion($name, $codigo_confirmacion, $email){
        // message
        $mensaje = '
        <style> b { color: #cc1414;} td { color: #040404; font-size: 18px; font-family: Arial; line-height: 24px; text-align: justify; } a { text-transform: none; color: #cc1414; } </style><br>
        
        <table style="border: solid 2px #cdcaca;" align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" width="611">
        <tbody>
        	<tr>
        		<td><a target="_blank" href="http://www.patrocinalos.com/" title="Mazzel"><img style="" src="http://www.patrocinalos.com/img/mailing/mail-header2.jpg" title="Mazzel" height="104" width="611"></a></td>
        	</tr>
        
        	<tr>
        		<td>
        <table align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" width="611">
        <tbody>
        	<tr>
        		<td height="10"></td>
        	</tr>
        
        	<tr>
        		<td width="130"><img style="" src="http://www.patrocinalos.com/img/mailing/lapiz.jpg" height="132" width="130"></td>
        
        		<td style="font-size: 18px;">Hola <span style="color: #c30505; font-family: arial;"></span>'.$name.'<br>
        <br>
         Te has registrado en www.patrocinalos.com, para completar tu registro, introduce éste codigo de confirmación: <span style="font-weight: bold">'.$codigo_confirmacion.'</span> en la opcion LOGIN de la app de patrocinalos, de esa forma activarás tu cuenta email registrada durante el registro.</td>
        
        		<td width="20"></td>
        
        		<td></td>
        	</tr>
        
        	<tr>
        		<td colspan="3" style="text-align: center;" height="100"><a style="color: #c30505; font-family: arial;" href="http://www.patrocinalos.com/"><b><span style="color: #c30505; font-family: arial; font-size: 18px;">www.patrocinalos.com</span></b></a><a></a></td>
        	</tr>
        </tbody>
        </table>
        </td>
        	</tr>
        
        	<tr>
        		<td><img style="" src="http://www.patrocinalos.com/img/mailing/mail-footerxx.jpg" height="28" width="611"></td>
        	</tr>
        
        	<tr>
        		<td width="533">
        <table align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" width="533">
        <tbody>
        	<tr>
        		<td height="43" width="188">&nbsp;</td>
        
        		<td width="52"><a target="_blank" href="https://twitter.com/patrocinalos" title="twitter"><img style="" src="http://www.patrocinalos.com/img/mailing/tw.jpg" height="43" width="42"></a></td>
        
        		<td width="52"><a target="_blank" href="http://www.tuenti.com/#m=Page&amp;func=index&amp;page_key=1_2292_74098278" title="tuenti"><img style="" src="http://www.patrocinalos.com/img/mailing/tu.jpg" height="43" width="42"></a></td>
        
        		<td width="52"><a target="_blank" href="https://www.facebook.com/patrocinalos" title="facebook"><img style="" src="http://www.patrocinalos.com/img/mailing/fa.jpg" height="43" width="42"></a></td>
        
        		<td width="188">&nbsp;</td>
        	</tr>
        
        	<tr>
        		<td height="8"></td>
        	</tr>
        </tbody>
        </table>
        </td>
        	</tr>
        </tbody>
        </table>
        <!-- 
        <table align="center" cellpadding="0" cellspacing="0" width="611" bgcolor="white" border="0" >
        	<tr>
        		<td style="font-size: 14px;"> &nbsp; </td>
        	</tr>
        
        	<tr>
        		<td style="font-size: 12px; color: #5b5b5b;"> Recibes este comunicado en tanto que estes suscrito/a al servicio de información periódica de patrocinalos.com, Si quieres dejar de recibir estos emails, haz clic <a href="http://www.patrocinalos.com/baja-news.php?mail=">aquí</a></p>
        </td>
        	</tr>
        </table>
         -->
        <table align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" width="770">
        <tbody>
        	<tr>
        		<td style="font-size: 14px;"> &nbsp; </td>
        	</tr>
        
        	<tr>
        		<td style="font-size: 12px; color: #5b5b5b;">
        <p>Recibes estas alertas porque estás registrado como deportista en Patrocinalos by mazzel <a href="http://www.patrocinalos.com/" style="text-decoration: none;"><span style="color: #c30505!important;">www.patrocinalos.com</span></a> Es importante que tengas activadas las alertas para recibir las notificiaciones y novedades, sino quieres recibir estos emails de alertas, puedes darte de baja en tu panel de gestión, <a href="http://www.patrocinalos.com/gestion-perfil.php?section_open=Alertas" style="text-decoration: none;"><span style="color: #c30505!important;">sección alertas</span></a></p>
        </td>
        	</tr>
        </tbody>
        </table>
        ';
        
        // Para enviar un correo HTML mail, la cabecera Content-type debe fijarse
        $cabeceras = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        
        // Cabeceras adicionales
        $cabeceras .= 'From: Patrocínalos by mazzel <noreply@patrocinalos.com>'. "\r\n";
        $subject = 'Activa tu cuenta';
        
        return mail($email, $subject, $mensaje, $cabeceras);
    }    
    
?>