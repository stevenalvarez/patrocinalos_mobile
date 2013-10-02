/************************************ FUNCTION PHONEGAP *******************************************************/

// A button will call this function
//
function getPhoto(source) {
  // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI,
    sourceType: source });
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
  // Uncomment to view the image file URI 
  // console.log(imageURI);
  IMAGEURI = imageURI;

  // Get image handle
  //
  var pictureImage = document.getElementById('pictureImage');
  var img_url = document.getElementById("u_img_url_social");

  // Unhide image elements
  //
  pictureImage.style.display = 'block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  pictureImage.src = imageURI;
  img_url.value = "";
}

// Called if something bad happens.
// 
function onFail(message) {
    mensaje = message == "no image selected" ? "no se selecciono ninguna imagen" : message;
    showAlert(mensaje, 'Aviso', 'Aceptar');
}

// UploadPhoto
//
function uploadPhoto(params) {
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = IMAGEURI.substr(IMAGEURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(IMAGEURI, BASE_URL_APP + "usuarios/mobileUploadImagen", function(r){
        // Callback success upload photo
        //
        //console.log("Code = " + r.responseCode);
        //console.log("Response = " + r.response);
        //console.log("Sent = " + r.bytesSent);
        
        var respuesta = $.parseJSON(r.response);
        if(respuesta.success){
            IMAGEURI = '';
            $.mobile.loading( 'hide' );
            success_registro();
        }else{
            error_registro('Ha ocurrido un error al momento de actualizar los datos del deportista!, por favor intente de nuevo');
        }
        
    }, function(error){
        //Callback error upload photo
        //
        //console.log("An error has occurred: Code = " + error.code);
        showAlert("Se ha producido un error al momento de subir la imagen desde el dispositivo", "Aviso", "Aceptar");
        
    }, options);
}

/************************************ FUNCTIONS APP *******************************************************/

//LLENAR DEPORTES PARA EL FORMULARIO DE REGISTRO
function llenarDeportes(){
	$.getJSON(BASE_URL_APP + 'usuarios/mobileGetDeportes', function(data) {
		var deportes = data.items;
        var html = "";
        $.each(deportes, function(index, item) {
            html+= "<option value="+item.deportes.id+">"+item.deportes.nombre+"</option>";
        });
        
        jQuery("#select_deporte").find("option").after(html);
	});
}

//LLENAR DEPORTES PARA EL FORMULARIO DE REGISTRO PARA PATROCINADOR
function llenarDeportesPatrocinador(parent_id){
	$.getJSON(BASE_URL_APP + 'usuarios/mobileGetDeportes', function(data) {
		var deportes = data.items;
        var html = "";
        $.each(deportes, function(index, item) {
            html+="<li>"
            html+="<label>";
            html+="<input name='deportes["+item.deportes.id+"]' value='"+item.deportes.id+"' type='checkbox'/>"+item.deportes.nombre;
            html+="</label>";
            html+="</li>"
        });
        
        jQuery("#"+parent_id).find("#deportes_que_sigues").append(html);
	});
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE REGISTRO
function form_registro(){
    jQuery("#form_registro").validate({
        errorElement:'span',
    	rules: {
            "u_urlamigable": {
    			required: true,
    			minlength: 2,
                onlyLetterNumber:true
    		},
    		"u_email_register": {
    			required: true,
    			email: true
    		},
    		"u_password_register": {
    			required: true,
    			minlength: 5
    		},
    	},
    	messages: {
    		"u_urlamigable": {
    			required: "Por favor, introduzca su nombre de usuario <i></i>",
    			minlength: "M&iacute;nimo de 2 caracteres <i></i>",
                onlyLetterNumber: "No se permiten caracteres especiales, solo a-z,0-9 <i></i>",
    		},
            "u_email_register": {
    			required: "Por favor, introduzca su email <i></i>",
    			email: "Direcci&oacute;n de email no v&aacute;lida <i></i>"
    		},
    		"u_password_register": {
    			required: "Por favor, ingrese su contrase&ntilde;a <i></i>",
    			minlength: "M&iacute;nimo de 5 caracteres <i></i>"
    		},
    	}
    });
    
    //Cambiamos de texto para la foto dependiendo si es empresa, deportista o patrocinador
    jQuery("#form_registro").find("#select_tipo_u").change(function(){
        var form_registro = jQuery("#form_registro");
        var content_upload_foto = form_registro.find(".content_upload_foto"); 
        if($(this).val() == "empresa"){
            form_registro.find("input[name='u_urlamigable']").attr("placeholder","Nombre de la empresa...");
            content_upload_foto.find("span.foto_normal").hide();
            content_upload_foto.find("span.foto_empresa").show();
        }else{
            form_registro.find("input[name='u_urlamigable']").attr("placeholder","Nombre de usuario...");
            content_upload_foto.find("span.foto_normal").show();
            content_upload_foto.find("span.foto_empresa").hide();
        }
    });
    
    //Submit form registro
    jQuery('#form_registro').submit(function() {
        
        fixedSelector("form_registro", "select_deporte");
        fixedSelector("form_registro", "select_tipo_u");
        
        $("#u_email_register").parent().removeClass("error_field_email");
        
        //Si todo el form es valido mandamos a registrar los datos
        if (jQuery(this).valid()) {
            //Mandamos a validar el mail
            var email = $.trim(document.getElementById("u_email_register").value);
            email = email + "\n\t";
            var urlamigable = $.trim(document.getElementById("u_urlamigable").value);
            urlamigable = urlamigable + "\n\t";
            
            var email_registrado = validar_email(email);
            var urlamigable_registrado = validar_urlamigable(urlamigable,'');
            //Unicamente si el email no esta registrado y la urlamigable no esta registrado mandamos a guardar
            if(email_registrado == false && urlamigable_registrado == false){
                
                $.ajax({
                    data: $("#form_registro").serialize(),
                    type: "POST",
                    url: BASE_URL_APP + 'usuarios/mobileNewRegistro',
                    dataType: "html",
                    success: function(data){
                        data = $.parseJSON(data);
                        var success = data.success;
                        
                        if(success){
                            var usuario = data.usuario.Usuario;
                            var usuario_id = usuario.id;
                            
                            //una vez creado guardamos en cookies su datos importantes
                            createCookie("userRegistered", JSON.stringify(usuario), 1);
                            
                            //Si selecciono un imagen mandamos a guardar en la base de datos
                            var pictureImage = document.getElementById("pictureImage");
                            var img_url = document.getElementById("u_img_url_social");
                            if($(pictureImage).attr("src") != "" && $(img_url).val() == ""){
                                var params = new Object();
                                params.folder = "Usuario";
                                params.usuario_id = usuario_id;
                                //Subimos la imagen seleccionada desde el dispositivo
                                uploadPhoto(params);
                            }else{
                                success_registro();
                            }
                        }else{
                            error_registro('Ha ocurrido un error al momento de registrarse!, por favor intente de nuevo');
                        }
                    },
                    beforeSend : function(){
                        //mostramos loading
                        showLoadingCustom('Guardando datos...');
                    }
                });
            }
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE ENVIO DE CODIGO DE VALIDACION - RECUPERAR PASSWORD
function form_codigovalidacion(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
    		"u_email": {
    			required: true,
    			email: true
    		}
    	},
    	messages: {
            "u_email": {
    			required: "Por favor, introduzca su email <i></i>",
    			email: "Direcci&oacute;n de email no v&aacute;lida <i></i>"
    		}
    	}
    });
    
    //Submit form
    formulario.submit(function() {
        
        formulario.find("input[type='email']").parent().removeClass("error_field_email");
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            $.ajax({
                data: formulario.serialize(),
                type: "POST",
                url: BASE_URL_APP + 'usuarios/mobileEnviarCodigoValidacion',
                dataType: "html",
                success: function(data){
                    $.mobile.loading( 'hide' );
                    
                    data = $.parseJSON(data);
                    if(data.success){
                        clear_form(element);
                        showAlert(data.mensaje, "Aviso", "Aceptar");
                    }else{
                        showAlert(data.mensaje, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Enviando codigo...');
                }
            });
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE CAMBIAR PASSWORD - RECUPERAR PASSWORD
function form_cambiar_password(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
    		"u_email": {
    			required: true,
    			email: true
    		},
            "u_codigovalidacion": {
    			required: true,
    			minlength: 2
    		},
    	},
    	messages: {
            "u_email": {
    			required: "Por favor, introduzca su email <i></i>",
    			email: "Direcci&oacute;n de email no v&aacute;lida <i></i>"
    		},
            "u_codigovalidacion": {
    			required: "Por favor, ingrese el codigo de validacion <i></i>",
    			minlength: "M&iacute;nimo de 2 caracteres <i></i>"
    		}
    	}
    });
    
    //Submit form
    formulario.submit(function() {
        
        formulario.find("input[type='email']").parent().removeClass("error_field_email");
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            $.ajax({
                data: formulario.serialize(),
                type: "POST",
                url: BASE_URL_APP + 'usuarios/mobileVerificarCodigoValidacion',
                dataType: "html",
                success: function(data){
                    $.mobile.loading( 'hide' );
                    
                    data = $.parseJSON(data);
                    if(data.success){
                        clear_form(element);
                        //Mostramos el popup
                        $("#recuperar_password").find("#popupPassword").find("#usuario_id").val(data.item.Usuario.id);
                        $("#recuperar_password").find("#popupPassword").popup("open");
                    }else{
                        showAlert(data.mensaje, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Verificando datos...');
                }
            });
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE POPUP CAMBIAR PASSWORD - RECUPERAR PASSWORD
function popup_form_cambiar_password(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
    	   
    		"u_new_password": {
    			required: true,
    			minlength: 5
    		},
            "u_repetir_password": {
    			required: true,
    			minlength: 5,
    			equalTo: "#u_new_password"
    		}
    	},
    	messages: {
    		"u_new_password": {
    			required: "Por favor, ingrese su contrase&ntilde;a <i></i>",
    			minlength: "M&iacute;nimo de 5 caracteres <i></i>"
    		},
            "u_repetir_password": {
    			required: "Por favor, ingrese su contrase&ntilde;a <i></i>",
    			minlength: "M&iacute;nimo de 5 caracteres <i></i>",
    			equalTo: "Repita contrase&ntilde;a <i></i>"
    		}
    	}
    });
    
    //Submit form
    formulario.submit(function() {
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            $.ajax({
                data: formulario.serialize(),
                type: "POST",
                url: BASE_URL_APP + 'usuarios/mobileCambiarPassword',
                dataType: "html",
                success: function(data){
                    $.mobile.loading( 'hide' );
                    
                    data = $.parseJSON(data);
                    if(data.success){
                        clear_form(element);
                        showAlert(data.mensaje, "Aviso", "Aceptar");
                        $.mobile.changePage('login.html', {transition: "fade"});
                    }else{
                        showAlert(data.mensaje, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Guardando datos...');
                }
            });
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO COMPLETAR PERFIL DEPORTISTA(INDIVIDUAL O EQUIPO)
function form_completar_perfil(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
    	   "u_tipo": "required",
           "u_nombre": "required",
           "u_apellidos": "required",
    	   "u_genero": "required",
           "u_fecha_nacimiento": "required",
           "u_ciudad": "required",
           "u_tipo_deportista": "required",
           "u_deporte": "required",
    	},
    	messages: {
    	   "u_tipo": "",
           "u_nombre": "Por favor, coloque un nombre <i></i>",
           "u_apellidos": "Por favor, coloque un apellido <i></i>",
    	   "u_genero": "",
           "u_fecha_nacimiento": "Por favor, seleccione una fecha <i></i>",
           "u_ciudad": "",
           "u_tipo_deportista": "",
           "u_deporte": "",
    	}
    });
    
    //Si hubo un registro entonces actualizamos los datos con los valores del registro
    if(isUserRegistered())
    {
        var userRegistered = COOKIE_NEW_REGISTER;
        formulario.find("input[name='u_usuario_id']").val(userRegistered.id);
        formulario.find("input[name='u_pais_id']").val(userRegistered.pais_id);
        
        //llenamos las ciudades, ya sabemos de que pais es el usuario y en que ciudad esta  
        llenarCiudades(formulario, "select_ciudad",userRegistered.pais_id,userRegistered.ciudad_id);
    }else{
        llenarCiudades(formulario, "select_ciudad");
    }
    
    //Si alterna entre deportista individual o equipo
    formulario.find("#select_tipo").change(function(){
        var tipo = $(this).val();
        if(tipo == "individual"){
            formulario.find("input[name='u_nombre']").attr("placeholder","Nombre...");
            formulario.find("input[name='u_fecha_nacimiento']").attr("placeholder","Fecha de nacimiento...");
            formulario.find("input[name='u_apellidos']").removeAttr("disabled").parent().show();
            formulario.find("select[name='u_genero']").removeAttr("disabled").parent().parent().show();
            
        }else if(tipo == "equipo"){
            formulario.find("input[name='u_nombre']").attr("placeholder","Nombre del equipo...");
            formulario.find("input[name='u_fecha_nacimiento']").attr("placeholder","Fecha de creacion de tu equipo...");
            formulario.find("input[name='u_apellidos']").attr("disabled","disabled").parent().hide();
            formulario.find("select[name='u_genero']").attr("disabled","disabled").parent().parent().hide();
        }
    })
    
    //Submit form
    formulario.submit(function() {
        
        fixedSelector(element, "select_tipo");
        fixedSelector(element, "select_genero");
        fixedSelector(element, "select_ciudad");
        fixedSelector(element, "select_tipo_deportista");
        fixedSelector(element, "select_deporte");
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            var usuario_id = formulario.find("input[name='u_usuario_id']").val();
            
            if(usuario_id != '' && parseInt(usuario_id) > 0)
            {
                $.ajax({
                    data: formulario.serialize(),
                    type: "POST",
                    url: BASE_URL_APP + 'usuarios/mobileCompletarPerfil',
                    dataType: "html",
                    success: function(data){
                        $.mobile.loading( 'hide' );
                        
                        data = $.parseJSON(data);
                        if(data.success){
                            showAlert(data.mensaje, "Aviso", "Aceptar");
                        }else{
                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    },
                    beforeSend : function(){
                        //mostramos loading
                        showLoadingCustom('Guardando datos...');
                    }
                });
            
            }else{
                showAlert("Error no puede actualizar datos!, antes debe registrarse.","Error", "Aceptar");
            }
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO COMPLETAR PERFIL DEPORTISTA(INDIVIDUAL O EQUIPO)
function form_completar_perfil_patrocinador(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
           "u_nombre": "required",
           "u_apellidos": "required",
    	   "u_genero": "required",
           "u_fecha_nacimiento": "required",
           "u_ciudad": "required",
    	},
    	messages: {
           "u_nombre": "Por favor, coloque un nombre <i></i>",
           "u_apellidos": "Por favor, coloque un apellido <i></i>",
    	   "u_genero": "",
           "u_fecha_nacimiento": "Por favor, seleccione una fecha <i></i>",
           "u_ciudad": "",
    	}
    });
    
    //Si hubo un registro entonces actualizamos los datos con los valores del registro
    if(isUserRegistered())
    {
        var userRegistered = COOKIE_NEW_REGISTER;
        formulario.find("input[name='u_usuario_id']").val(userRegistered.id);
        formulario.find("input[name='u_pais_id']").val(userRegistered.pais_id);
        
        //llenamos las ciudades, ya sabemos de que pais es el usuario y en que ciudad esta  
        llenarCiudades(formulario, "select_ciudad2",userRegistered.pais_id,userRegistered.ciudad_id);
    }else{
        llenarCiudades(formulario, "select_ciudad2");
    }
    
    //Submit form
    formulario.submit(function() {
        
        fixedSelector(element, "select_genero2");
        fixedSelector(element, "select_ciudad2");
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            var usuario_id = formulario.find("input[name='u_usuario_id']").val();
            
            if(usuario_id != '' && parseInt(usuario_id) > 0)
            {
                $.ajax({
                    data: formulario.serialize(),
                    type: "POST",
                    url: BASE_URL_APP + 'usuarios/mobileCompletarPerfil',
                    dataType: "html",
                    success: function(data){
                        $.mobile.loading( 'hide' );
                        
                        data = $.parseJSON(data);
                        if(data.success){
                            showAlert(data.mensaje, "Aviso", "Aceptar");
                            
                            //una vez que guarda sus datos le redireccionamos al login
                            $.mobile.changePage('login.html', {transition: "fade"});
                        }else{
                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    },
                    beforeSend : function(){
                        //mostramos loading
                        showLoadingCustom('Guardando datos...');
                    }
                });
            
            }else{
                showAlert("Error no puede actualizar datos!, antes debe registrarse.","Error", "Aceptar");
            }
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO COMPLETAR PERFIL EMPRESA
function form_completar_perfil_empresa(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
           "u_ciudad": "required",
           "e_direccion": "required",
           "e_cod_postal": "required",
           "u_nombre": "required",
           "e_persona_contacto": "required",
   		   "e_telefono": {
   		        required: true,
    			number: true
   		   },
   		   "e_cif": {
    			required: true,
    			number: true
   		   },
    	},
    	messages: {
           "u_ciudad": "",
           "e_direccion": "Por favor, coloque su direccion <i></i>",
           "e_cod_postal": "Por favor, coloque su codigo postal <i></i>",
           "u_nombre": "Por favor, coloque el nombre de la empresa <i></i>",
           "e_persona_contacto": "Por favor, coloque un nombre <i></i>",
           "e_telefono": {
                required: "Por favor, coloque un telefonico <i></i>",
                number: "Por favor, ingrese solo numeros telefonicos <i></i>"
           },
           "e_cif": {
            	required: "Por favor, coloque su CIF <i></i>",
            	number: "Por favor, ingrese solo numeros <i></i>"
           },
    	}
    });
    
    //Si hubo un registro entonces actualizamos los datos con los valores del registro
    if(isUserRegistered())
    {
        var userRegistered = COOKIE_NEW_REGISTER;
        formulario.find("input[name='u_usuario_id']").val(userRegistered.id);
        formulario.find("input[name='u_pais_id']").val(userRegistered.pais_id);
        
        //llenamos las ciudades, ya sabemos de que pais es el usuario y en que ciudad esta  
        llenarCiudades(formulario, "select_ciudad3",userRegistered.pais_id,userRegistered.ciudad_id);        
    }else{
        llenarCiudades(formulario, "select_ciudad3");
    }
    
    //Submit form
    formulario.submit(function() {
        
        //Expandimos todos los collasibles, para que vea que debe llenar datos en donde se pide
        formulario.find(".ui-collapsible-inset").trigger('expand');
        
        fixedSelector(element, "select_ciudad3");
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            var usuario_id = formulario.find("input[name='u_usuario_id']").val();
            
            if(usuario_id != '' && parseInt(usuario_id) > 0)
            {
                $.ajax({
                    data: formulario.serialize(),
                    type: "POST",
                    url: BASE_URL_APP + 'usuarios/mobileCompletarPerfil',
                    dataType: "html",
                    success: function(data){
                        $.mobile.loading( 'hide' );
                        
                        data = $.parseJSON(data);
                        if(data.success){
                            //mandamos a la pagina de perfil completado satisfactoriamente
                            $.mobile.changePage('#completar_perfil_exitosamente', {transition: "slide"});
                        }else{
                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    },
                    beforeSend : function(){
                        //mostramos loading
                        showLoadingCustom('Guardando datos...');
                    }
                });
            
            }else{
                showAlert("Error no puede actualizar datos!, antes debe registrarse.","Error", "Aceptar");
            }
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO SOLICITAR PATROCINIO
function form_solicitar_patrocinio(element){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
   		   "proyecto_monto": {
    			required: true,
    			number: true
   		   },
   		   "proyecto_title": {
    			required: true
   		   },
   		   "proyecto_enlace": {
    			url: true
   		   },           
           "proyecto_fecha_limite" : {
                required: true
           }
    	},
    	messages: {
            "proyecto_monto": {
    			required: "Por favor, ingrese un monto <i></i>",
    			number: "Por favor, ingrese solo numeros <i></i>"
    		},
            "proyecto_title": {
    			required: "Por favor, ingrese un frase breve <i></i>"
    		},
            "proyecto_enlace": {
    			url: "Por favor, escribe una URL v&aacute;lida. <i></i>"
    		},            
            "proyecto_fecha_limite": {
    			required: "Por favor, establezca una fecha limite <i></i>"
    		},
    	}
    });
    
    //Si hubo un registro entonces actualizamos los datos con los valores del registro
    var userRegistered;
    if(isUserRegistered())
    {
        userRegistered = COOKIE_NEW_REGISTER;
        formulario.find("input[name='u_usuario_id']").val(userRegistered.id);
    }
    
    //Submit form
    formulario.submit(function() {
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            var usuario_id = formulario.find("input[name='u_usuario_id']").val();
            
            if(usuario_id != '' && parseInt(usuario_id) > 0)
            {
                $.ajax({
                    data: formulario.serialize(),
                    type: "POST",
                    url: BASE_URL_APP+'proyectos/mobileSolictarPatrocinio/'+userRegistered.id,
                    dataType: "html",
                    success: function(data){
                        $.mobile.loading( 'hide' );
                        
                        data = $.parseJSON(data);
                        if(data.success){
                            //controlamos que el valor de la imagen a subir no este vacia, 
                            //eso significa que se selecciono un imagen o se capturo una imagen
                            if(IMAGEURI != ''){
                                
                                //creamos un objecto con los parametros que queremos que llegue al servidor
                                //para luego ahi hacer otra operaciones con esos parametros.
                                var params = new Object();
                                params.folder = "Proyecto"; // la carpeta donde se va a guardar la imagen
                                params.usuario_id = userRegistered.id; // id del usuario para el cual es la nueva imagen.
                                params.proyecto_id = data.proyecto_id; // id del proyecto para el cual es la imagen.
                                
                                //Utilizamos la funcion de subir la imagen de forma asincrona, ya que solo
                                //va subir la imagen y nada mas, ahi termina el proceso.
                                uploadImagenAsynchronous(params);
                            }
                            
                            //mandamos a la pagina de patrocinio finalizado
                            $.mobile.changePage('#patrocinio_registrado', {transition: "slide"});
                        }else{
                            showAlert(data.mensaje, "Error", "Aceptar");
                        }
                    },
                    beforeSend : function(){
                        //mostramos loading
                        showLoadingCustom('Guardando datos...');
                    }
                });
            
            }else{
                showAlert("Error no puede solicitar patrocinio!, antes debe registrarse.","Error", "Aceptar");
            }
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE LOGIN
function form_login(){
    jQuery("#form_login").validate({
        errorElement:'span',
    	rules: {
    		"u_email": {
    			required: true,
    			email: true
    		},
    		"u_password": {
    			required: true,
    			minlength: 5
    		}
    	},
    	messages: {
            "u_email": {
    			required: "Por favor, introduzca su email <i></i>",
    			email: "Direcci&oacute;n de email no v&aacute;lida <i></i>"
    		},
    		"u_password": {
    			required: "Por favor, ingrese su contrase&ntilde;a <i></i>",
    			minlength: "M&iacute;nimo de 5 caracteres <i></i>"
    		},
    	}
    });
    
    //Submit form login
    jQuery('#form_login').submit(function() {
        
        //Si todo el form es valido mandamos a verificar los datos de acceso
        if (jQuery(this).valid()) {
            
            $.ajax({
                data: $("#form_login").serialize(),
                type: "POST",
                url: BASE_URL_APP + 'usuarios/mobileLogin',
                dataType: "html",
                success: function(msg){
                    $.mobile.loading( 'hide' );
                    msg = $.parseJSON(msg);
                    var success = msg.success;
                    var datas = msg.item;
                    if(success){
                        //verificamos si el usuario esta validado, 
                        //sino es un usuario registrado pero aun no validado
                        //entonces mostramos el campo para que meta su codigo de activacion
                        var validado = msg.validado;
                        if(validado){
                            var usuario = datas.Usuario;
                            var days = $("#u_remember_me").is(":checked") ? 365 : 1;
                            
                            //una vez logeado guardamos en cookies su datos importantes y lo llevamos a otra vista
                            createCookie("user", JSON.stringify(usuario), days);
                            
                            var goToPage =  "home.html";
                            if(REDIREC_TO != ''){
                                goToPage = REDIREC_TO;
                            }
                            $.mobile.changePage(goToPage, {transition: "fade"});
                        }else{
                            //mostramos el mensaje de que debe colocar el codigo de activacion para quedar activo en el sistema
                            $("#login").find(".msg_error").find("label").html("Usted no activo su cuenta, por favor coloque el c&oacute;digo de validaci&oacute;n");
                            $("#login").find(".msg_error").fadeIn("slow");
                            $("#login").find(".campo_codigo_validacion").show();
                        }
                    }else{
                        //mostramos el mensaje de login fallido
                        $("#login").find(".msg_error").fadeIn("slow");
                    }
                },
                beforeSend : function(){
            	    //mostramos loading
                    showLoadingCustom('Validando datos...');
                }
            });
        }
      return false;
    });
}

// REGISTRO SUCCESS
//
function success_registro(){
    $.mobile.loading( 'hide' );
    document.getElementById("form_registro").reset();
    $.mobile.changePage('#register_finalizado', {transition: "slide"});
}

// REGISTRO ERROR
//
function error_registro(msg){
    $.mobile.loading( 'hide' );
    showAlert(msg, 'Aviso', 'Aceptar');
}

// VALIDAR SI EL MAIL SE ENCUESTRA REGISTRADO
function validar_email(value){
    var response = false;
    jQuery.ajax({
        type: "POST",
        url: BASE_URL_APP + "usuarios/mobileValidarEmail",
        data: "email="+value,
        dataType:"html",
        async : false,
        cache: false,
        success: function(msg){
            $.mobile.loading( 'hide' );
            msg = $.parseJSON(msg);
            var result = msg.success;
            if(result){
                var input = jQuery("#u_email_register");
                input.parent().find("span.error").remove();
                input.parent().find("span.success").remove();
                input.after("<span class='error'>Este email ya est&aacute; siendo usado o no esta permitido <i></i></span>");
                input.parent().find("span.error").css("color", "#671717");
                input.parent().find("span.error").css("font-weight", "bold");
                input.parent().find("span.error").fadeOut(8000);
                input.focus();
                response = true;
            }
        },
        beforeSend : function(){
    	    //mostramos loading
            showLoadingCustom('Validando Email...');
        }
    });
    
    return response;
}

function validar_urlamigable(urlamigable,usuario_id){
    var response = false;
    jQuery.ajax({
        type: "POST",
        url: BASE_URL_APP + "usuarios/mobileValidarUrlamigable",
        data: {urlamigable:urlamigable,usuario_id:usuario_id},
        dataType:"html",
        async : false,
        cache: false,
        success: function(msg){
            $.mobile.loading( 'hide' );
            msg = $.parseJSON(msg);
            var result = msg.success;
            if(result){
                var input = jQuery("#u_urlamigable");
                input.parent().find("span.error").remove();
                input.parent().find("span.success").remove();
                input.after("<span class='error'>Este nombre de usuario ya est&aacute; siendo utilizado <i></i></span>");
                input.parent().find("span.error").css("color", "#671717");
                input.parent().find("span.error").css("font-weight", "bold");
                input.parent().find("span.error").fadeOut(8000);
                input.focus();
                response = true;
            }
        },
        beforeSend : function(){
    	    //mostramos loading
            showLoadingCustom('Validando Nombre de usuario...');
        }
    });
    
    return response;
}

function key_press(id){
    var element = $("#" + id).find("input[type='text'], input[type='email'], input[type='password']");
    element.bind('keyup blur', function(){
        if($(this).hasClass("valid")){
            $(this).parent().find("span.success").remove();
            if(($(this).attr("name") == "u_email_register") || $(this).attr("name") == "u_email"){
                $(this).parent().removeClass("error_field_email").addClass("valid_field");
            }else{
                $(this).parent().removeClass("error_field").addClass("valid_field");
            }
            $(this).after("<span class='success'><i></i></span>");
        
        }else if($(this).hasClass("error")){
            $(this).parent().find("span.success").remove();
            var chart = ($(this).attr("name") == "u_email_register") ? 12 : 10;
            if(($(this).attr("name") == "u_email_register") || ($(this).attr("name") == "u_email")){
                if(($(this).val()).length > chart){
                    $(this).parent().removeClass("valid_field").addClass("error_field_email");
                }else{
                    $(this).parent().removeClass("error_field_email");
                }
            }else if(($(this).attr("name") == "u_repetir_password")){
                if((($(this).val()).length > 6)){
                    $(this).parent().removeClass("valid_field").addClass("error_field_email");
                }else{
                    $(this).parent().removeClass("error_field_email");
                }
            }else{
                $(this).parent().removeClass("valid_field").addClass("error_field");
            }
        }
    });
}

function clear_form(form){
    $("#"+form).find("span.success").remove();
    document.getElementById(form).reset();
}

/* REGISTRO FACEBOOK FUNCTION */
//getLoginStatus
function getLoginStatus() {
    var connected = false;
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            connected = true;
        }
    });
    
    return connected;
}

//loginFacebookConnect
function loginFacebookConnect() {
    if(FB_LOGIN_SUCCESS){
        showRegistroSocial("facebook");
    }else{
    	FB.login(function(response) {
    		if (response.authResponse) {
    		  
                FB_LOGIN_SUCCESS = true;
                
                //llenamos los datos name, email
                FB.api('/me', {
                    fields: 'id, name, email, picture'
                },function(response) {
                    if (response.error) { 
                       showAlert('get user datas failed ' + JSON.stringify(response.error));
                    }else{
                        var user = response;
                        $("#form_registro").find("#u_title").val(user.name);
                        $("#form_registro").find("#u_email_register").val(user.email);
                        
                        //ocultamos el loading...
                        $.mobile.loading( 'hide' );
                    }
                });
                
                //imagen del usuario
                FB.api("/me/picture?width=960",  function(response) {
                    if (response.error) { 
                       showAlert('get picture failed ' + JSON.stringify(response.error));
                    }else{
                        var picture = response;
                        $("#form_registro").find("#pictureImage").attr("src", picture.data.url).show();
                        $("#form_registro").find("#u_img_url_social").val(picture.data.url);
                    }
                });
                
                //mandamos al registro
                setTimeout(function(){
                    showRegistroSocial('facebook');
                    showLoadingCustom('Cargando datos...');
                }, 10);
                
    		} else {
                showAlert("User cancelled login or did not fully authorize.", 'Error Login', 'Aceptar');
    		}
    	}, {
    		scope : "email,offline_access,publish_stream,user_birthday,user_location,user_work_history,user_about_me,user_hometown"
    	});
    }
}

//loginTwitter
function loginTwitter() {
    if(TW_LOGIN_SUCCESS){
        showRegistroSocial("twitter");
    }else{
        Twitter.init();
    }
}

function showRegistroSocial(social){
    
    if(social == "facebook"){
        $("#register_user").find(".page span").html("REGISTRO CON FACEBOOK");
    }else if(social == "twitter"){
        $("#register_user").find(".page span").html("REGISTRO CON TWITTER");
    }
    
    $.mobile.changePage('#register_user', {transition: "slide"});
}

function isLogin(){
    var res = false;
    var cookie_user = $.parseJSON(readCookie("user"));
    if(cookie_user !== null){
        res = true;
        COOKIE = cookie_user;
    }else{
        REDIREC_TO = window.location.href;
    }
    return res;
}

function isUserRegistered(){
    var res = false;
    var cookie_userRegistered = $.parseJSON(readCookie("userRegistered"));
    if(cookie_userRegistered !== null){
        res = true;
        COOKIE_NEW_REGISTER = cookie_userRegistered;
    }
    return res;
}

function redirectLogin(){
    $.mobile.changePage('login.html', {transition: "fade", changeHash: false});
}

//Abrimos el enlace en un navegador del sistema (IOS|ANDROID)
//target: the target to load the URL in (String) (Optional, Default: "_self")
//_self - opens in the Cordova WebView if url is in the white-list, else it opens in the InAppBrowser 
//_blank - always open in the InAppBrowser 
//_system - always open in the system web browser/
function openOnWindow(element, target){
	element.find('a').click( function() {
	   window.open($(this).attr('href') , target );
	   return false;
	});
}

/*funccion para cerrar un modal*/
//thiss:link que cierra el modal
//status:para cerrar o mostrar un modal
function modalOpenHide(thiss,status){
    if(status=="hide")
        jQuery("#"+jQuery(thiss).attr("rel")).fadeOut("fast");
    else if(status=="show")
            jQuery("#"+jQuery(thiss).attr("rel")).fadeIn("fast");
}

//funcion que se ejecuta una vez que se subio con exito la imagen
//para luego hacer otros procedimientos
//recibe toda la respuesta del servidor
function callbackSynchronous(response){
    //aqui controlamos que mas se hace despues de subir la imagen
    //podemos ejecutar actualizaciones, mandar un post, etc.
}

//llena las ciudades de un determinado pais y coloca seleccionado a la ciudad seleccionada
//parent : formulario padre
//element : elemento donde se va colocar todas las ciudades
//param : pais_id, id de pais que se quiere seleccionar sus ciudades
//param : provincia_id, id de la provincia o ciudad que se quiere seleccionar como pre determinada
function llenarCiudades(parent, element, pais_id, provincia_id){
    //si no hay pais a listar sus ciudades por defecto es españa
    if(pais_id == undefined || pais_id == ''){
        pais_id = 28;
    }
    //si no hay pais a listar sus ciudades por defecto es españa
    if(provincia_id == undefined || provincia_id == ''){
        provincia_id = '';
    }
    
    $.getJSON(BASE_URL_APP+'usuarios/mobileGetCiudades/'+pais_id, function(data){
        $.each(data.items,function(index,item){
            if(item.ciudades.id==provincia_id)
                parent.find("#"+element).append('<option selected="selected" value="'+item.ciudades.id+'">'+item.ciudades.nombre+'</option>');
            else
                parent.find("#"+element).append('<option value="'+item.ciudades.id+'">'+item.ciudades.nombre+'</option>');
        });
        //actualiza el texto
        fixedSelector(parent.attr("id"), element);
    });
}

//fixea el error que hay cuando se selecciona un elemento del selector
function fixedSelector(form_id, element_selector){
    var selector_deporte = jQuery('#'+form_id).find("#" +element_selector);
    var opcion_selected = selector_deporte.find("option:selected").html();
    var element = selector_deporte.prev(".ui-btn-inner").find(".ui-btn-text").find("span");
    element.removeClass()
    element.addClass("valid")
    element.text(opcion_selected);
    element.show();
}