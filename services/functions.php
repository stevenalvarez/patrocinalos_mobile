<?php
	
    function deserializar($unserserialize){
        $serializado=@unserialize($unserserialize);
        if(!$serializado){
            $serializado=@unserialize(preg_replace('!s:(\d+):"(.*?)";!se', "'s:'.strlen('$2').':\"$2\";'",$unserserialize));
        }
        return $serializado;
    }
    
    function obtener_dia($dia_ingles){
        $dia = "";
        switch ($dia_ingles) {
            case "Monday":
                $dia = "Lunes";
                break;
            case "Tuesday":
                $dia = "Martes";
                break;
            case "Wednesday":
                $dia = "Miércoles";
                break;
            case "Thursday":
                $dia = "Jueves";
                break;
            case "Friday":
                $dia = "Viernes";
                break;
            case "Saturday":
                $dia = "Sábado";
                break;
            case "Sunday":
                $dia = "Domingo";
                break;
        }
        
        return $dia;
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
    
    function obtener_plato($plato){
        $tipo_plato = "";
        switch ($plato) {
            case "entrante":
                $tipo_plato = "ENTRANTES";
                break;
            case "primero":
                $tipo_plato = "PRIMEROS";
                break;
            case "pescado":
                $tipo_plato = "PESCADOS";
                break;
            case "asado_carne":
                $tipo_plato = "ASADOS Y CARNES";
                break;
            case "comida_para_llevar":
                $tipo_plato = "COMIDA PARA LLEVAR";
                break;
        }
        
        return $tipo_plato;
    }
    
    
    function enviar_mail($name, $to, $title, $menssage){
        $para  = $to;
        $titulo = $title;
        
        // message
        $mensaje = '
        <html>
        <head>
          <title></title>
        </head>
        <body>
          <table>
            <tr>
              <th><p>'.$menssage.'</p></th>
            </tr>
          </table>
        </body>
        </html>
        ';
        
        // Para enviar un correo HTML mail, la cabecera Content-type debe fijarse
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        
        // Cabeceras adicionales
        $cabeceras .= 'To: '.$name.' <'.$to.'>' . "\r\n";
        $cabeceras .= 'From: Restaurante las Terrazas <contacto@lasterrazasdebecerril.es>' . "\r\n";
        //$cabeceras .= 'Cc: test@example.com' . "\r\n";
        //$cabeceras .= 'Bcc: test@example.com' . "\r\n";
        // Mail it
        
        return mail($para, $titulo, $mensaje, $cabeceras);
    }
    
    function enviar_contacto($name, $phone, $email, $menssage){
        // message
        $mensaje = '
        <html>
        <head>
        <style> b { color: #cc1414;} td { color: #040404; font-size: 18px; font-family: Arial; line-height: 24px; text-align: justify; } a { text-transform: none; color: #cc1414; } </style><br>
          <title></title>
        </head>
        <body>
            <table style="border: solid 2px #cdcaca;" align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" width="611">
            <tbody>
            	<tr>
            		<td style="text-align: center;">
                        <a target="_blank" href="http://terrazas.arrobacreativa.com/" title="Terrazas">
                            <img style="" src="http://terrazas.arrobacreativa.com/img/bg_logo_terrazas.png" title="Restaurante las terrazas" height="109" width="370">
                        </a>
                    </td>
            	</tr>
            
            	<tr>
                <tr>
                    <td>
                        <hr />
                    </td>
                </tr>
            		<td>
            <table align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" width="611">
            <tbody>
            	<tr>
            		<td height="10"></td>
            	</tr>
            
            	<tr>
                    <td style="font-size: 18px;">
                        <label style="color: #C30505;">Nombre : </label>'.$name.'<br><br>
                        <label style="color: #C30505;">Telefono : </label><b>'.$phone.'</b><br><br> 
                        <label style="color: #C30505;">Email : </label><a href="mailto:'.$email.'">'.$email.'</a>: <br><br><br>
                        <label style="color: #C30505;">Mensaje : </label>'.$menssage.'
                    </td>
            
            		<td width="20"></td>
            
            		<td></td>
            	</tr>
            
            	<tr>
            		<td colspan="3" style="text-align: center;" height="100"><a style="color: #c30505; font-family: arial;" href="http://terrazas.arrobacreativa.com/"><b><span style="color: #c30505; font-family: arial; font-size: 18px;">terrazas.arrobacreativa.com/</span></b></a><a></a></td>
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
            <table align="center" bgcolor="white" border="0" cellpadding="0" cellspacing="0" width="770">
            <tbody>
            	<tr>
            		<td style="font-size: 14px;"> &nbsp; </td>
            	</tr>
            </tbody>
            </table>
        </body>
        </html>
        ';
        
        // Para enviar un correo HTML mail, la cabecera Content-type debe fijarse
        $cabeceras  = 'MIME-Version: 1.0' . "\r\n";
        $cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        
        // Cabeceras adicionales
        $cabeceras .= 'To: Jhonny  <steven.alvarez.v@gmail.com>' . "\r\n";
        $cabeceras .= 'From: ' . $email . "\r\n";
        $subject = 'Contacto - ' . $name;
        //$cabeceras .= 'Cc: test@example.com' . "\r\n";
        //$cabeceras .= 'Bcc: test@example.com' . "\r\n";
        // Mail it
        
        return mail('steven.alvarez.v@gmail.com', $subject, $mensaje, $cabeceras);
    }
    
?>