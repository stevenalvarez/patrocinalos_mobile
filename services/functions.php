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
    
?>