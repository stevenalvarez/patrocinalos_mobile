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
    mensaje = message == "no image selected" ? "No se ha seleccionado ninguna imagen" : message;
    showAlert(mensaje, 'Error', 'Aceptar');
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
    
    //ocultamos los campo nombre y apellido
    jQuery("#form_registro").find("input[name='u_nombre']").parent().hide();
    jQuery("#form_registro").find("input[name='u_apellidos']").parent().hide();
    
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

//INICIA LAS VALIDACIONES PARA EL MODAL CAMBIAR PASSWORD - PERFIL
function form_perfil_cambiar_password(element,user){
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {

    		"u_old_password": {
    			required: true,
    			minlength: 5
    		},
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
    		"u_old_password": {
    			required: "Por favor, ingrese su antigua contrase&ntilde;a <i></i>",
    			minlength: "M&iacute;nimo de 5 caracteres <i></i>"
    		},
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
    
    //colocamos el id del usuario
    formulario.find("input[name='usuario_id']").val(user.id);
    
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
                        //cerramos e modal
                        $("#modal_box_pass").fadeOut("slow");
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
                        //borramos los datos del formulario
                        clear_form(element);
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
                        //borramos los datos del formulario
                        clear_form(element);
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
                        //borramos los datos del formulario
                        clear_form(element);
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
                                params.accion = 'crear'; // que tipo accion se hizo.
                                
                                //Utilizamos la funcion de subir la imagen de forma asincrona, ya que solo
                                //va subir la imagen y nada mas, ahi termina el proceso.
                                uploadImagenAsynchronous(params);
                            }
                            
                            //mandamos a la pagina de patrocinio finalizado
                            $.mobile.changePage('#patrocinio_registrado', {transition: "slide"});
                            //borramos los datos del formulario
                            clear_form(element);
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

//INICIA LAS VALIDACIONES PARA EL FORMULARIO SOLICITAR EDITAR PATROCINIO
function form_solicitar_editar_patrocinio(parent_id, element, user){
    var parent = $("#"+parent_id);
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
   		   "proyecto_monto": {
    			required: true,
    			number: true
   		   },
   		   "proyecto_title": {
    			required: true,
                minlength:20,
                maxlength:60,
   		   },
   		   "proyecto_actividad_patrocinio": {
    			required: true,
                minlength:60,
                maxlength:150,
   		   },
   		   "proyecto_enlace": {
    			url: true
   		   },
           "proyecto_fecha_limite" : {
                required: true
           },
   		   "proyecto_masinfo": {
                maxlength:1000,
   		   }
    	},
    	messages: {
            "proyecto_monto": {
    			required: "Por favor, ingrese un monto <i></i>",
    			number: "Por favor, ingrese solo numeros <i></i>"
    		},
            "proyecto_title": {
    			required: "Por favor, ingrese un frase breve <i></i>",
                minlength: "Por favor, no escribas menos de 20 caracteres. <i></i>",
                maxlength: "Por favor, no escribas m&aacute;s de 60 caracteres. <i></i>",
    		},
            "proyecto_actividad_patrocinio": {
    			required: "Por favor, ingrese una descripcion corta <i></i>",
                minlength: "Por favor, no escribas menos de 60 caracteres. <i></i>",
                maxlength: "Por favor, no escribas m&aacute;s de 150 caracteres. <i></i>",
    		},
            "proyecto_enlace": {
    			url: "Por favor, escribe una URL v&aacute;lida. <i></i>"
    		},
            "proyecto_fecha_limite": {
    			required: "Por favor, establezca una fecha limite <i></i>"
    		},
            "proyecto_masinfo": {
                maxlength: "Por favor, no escribas m&aacute;s de 1000 caracteres. <i></i>",
    		},
    	}
    });
    
    //establecemos el id del usuario el cual solicita un patrocinio
    formulario.find("input[name='u_usuario_id']").val(user.id);
    
    //revisamos si tiene proyecto, para mostrar el texto correcto de la page, no importa si el proyecto es activo o pendiente
    if(user.proyecto_id !== undefined && parseInt(user.proyecto_id) > 0){
        parent.find(".page").find("span:nth-child(2)").removeClass().addClass("show");
        formulario.find("input[name='u_proyecto_id']").val(user.proyecto_id);
        formulario.find(".informacion.editar").show();
        
        //ya que tiene proyecto llenamos los campos del formulario
        $.mobile.loading( 'show' );
        formulario.css("opacity",0.5);
        $.getJSON(BASE_URL_APP+'proyectos/mobileGetProyectoByIds/'+user.id+"/"+user.proyecto_id, function(data){
            var success = data.success;
            var mensaje_mejora = data.mensaje;
            if(success){
                var item = data.proyecto;
                formulario.find("input[name='proyecto_title']").val(item.Proyecto.title).parent().hide(); //ocultamos esto porque en la web tampoco puedes modificar el titulo
                if(item.Proyecto.serializado.actividad_patrocinio !== undefined && item.Proyecto.serializado.actividad_patrocinio != ""){
                    formulario.find("textarea[name='proyecto_actividad_patrocinio']").val(item.Proyecto.serializado.actividad_patrocinio);
                }
                formulario.find("input[name='proyecto_monto']").val(item.Proyecto.monto).parent().hide(); //ocultamos esto porque en la web tampoco puedes modificar el titulo
                if(item.Proyecto.serializado.enlace !== undefined && item.Proyecto.serializado.enlace != ""){
                    formulario.find("input[name='proyecto_enlace']").val(item.Proyecto.serializado.enlace);
                }
                formulario.find("input[name='proyecto_fecha_limite']").val(item.Proyecto.fecha_fin_virtual);
                if(item.Proyecto.serializado.masinfo !== undefined && item.Proyecto.serializado.masinfo != ""){
                    formulario.find("textarea[name='proyecto_masinfo']").val(item.Proyecto.serializado.masinfo);
                }
                if(item.Proyecto.serializado.imagen !== undefined && item.Proyecto.serializado.imagen != ""){
                    formulario.find("img").attr("src",BASE_URL_APP+'img/Usuario/800/'+item.Proyecto.serializado.imagen).show();
                    formulario.promise().done(function() {
                        $(this).find("img").load(function(){
                            //ocultamos loading
                            formulario.animate({opacity: 1}, 500 );
                            $.mobile.loading( 'hide' );
                        });
                    });
                }else{
                    formulario.animate({opacity: 1}, 500 );
                    $.mobile.loading( 'hide' );
                }
                
                //si tiene mensaje de mejorar proyecto mostramos un alert
                if(mensaje_mejora != ""){
                    showAlert(mensaje_mejora, "Aviso", "Aceptar");
                }
                
            }
        });
        
    }else{
        parent.find(".page").find("span:nth-child(1)").removeClass().addClass("show");
        formulario.find(".informacion.crear").show();
    }
    
    //Submit form
    formulario.submit(function() {
        
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            var accion = "crear";
            var usuario_id = formulario.find("input[name='u_usuario_id']").val();
            var proyecto_id = formulario.find("input[name='u_proyecto_id']").val();
            var url = BASE_URL_APP+'proyectos/mobileSolictarPatrocinio';
            if(proyecto_id != '' && parseInt(proyecto_id) > 0){
                url = BASE_URL_APP+'proyectos/mobileEditarPatrocinio';
                accion = "editar";
            }
            
            if(usuario_id != '' && parseInt(usuario_id) > 0)
            {
                $.ajax({
                    data: formulario.serialize(),
                    type: "POST",
                    url: url,
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
                                params.usuario_id = user.id; // id del usuario para el cual es la nueva imagen.
                                params.proyecto_id = data.proyecto_id; // id del proyecto para el cual es la imagen.
                                params.accion = accion; // que tipo accion se hizo.
                                
                                //Utilizamos la funcion de subir la imagen de forma asincrona, ya que solo
                                //va subir la imagen y nada mas, ahi termina el proceso.
                                uploadImagenAsynchronous(params);
                            }
                            
                            //solo si la accion fué crear entra, no asi para la accion editar
                            if(accion == "crear"){
                                //establecemos el id del proyecto creado, con eso sabemos si tiene ya un proyecto creado
                                formulario.find("input[name='u_proyecto_id']").val(data.proyecto_id);
                                //actualizamos la cookie y re-escribimos la cookie con esa nueva variable
                                COOKIE.proyecto_id = data.proyecto_id;
                                reWriteCookie("user","proyecto_id",data.proyecto_id);
                                //actualizamos el panel
                                actualizar_panel();
                                
                                //colocamos el texto correcto para saber en que page estamos
                                parent.find(".page").find("span").removeClass().addClass("hide");
                                parent.find(".page").find("span:nth-child(2)").removeClass().addClass("show");
                            }
                            
                            //mostramos el mensaje de exito al guardar el patrocinio
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
                showAlert("Error no puede solicitar patrocinio!.","Error", "Aceptar");
            }
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO EDITAR PERFIL
function form_editar_perfil(parent_id, element, user){
    var parent = $("#"+parent_id);
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {
   		   "u_nombre": {
    			required: true
   		   },
   		   "u_fecha_nacimiento": {
    			required: true
   		   },
   		   "u_pais_id": {
    			required: true
   		   },
   		   "u_ciudad": {
    			required: true
   		   },
           "u_deporte" : {
                required: true
           },
           "u_telefono" : {
                number: true
           }
    	},
    	messages: {
            "u_nombre": {
    			required: "Por favor, ingrese un nombre <i></i>",
    		},
            "u_fecha_nacimiento": {
    			required: "Por favor, establezca una fecha <i></i>"
    		},
            "u_pais_id": {
    			required: ""
    		},
            "u_ciudad": {
    			required: ""
    		},
            "u_deporte": {
    			required: ""
    		},
            "u_telefono" : {
                number: "Por favor, ingrese solo numeros <i></i>"
           }
    	}
    });
    
    //establecemos los datos
    formulario.find("input[name='u_usuario_id']").val(user.id);
    formulario.find("#imagen_dep").attr("src",BASE_URL_APP+'img/Usuario/169/crop.php?w=50&i='+user.imagen);
    var tipodeportista = formulario.find("input."+user.tipodeportista+"[name='u_tipo_deportista']"); 
    tipodeportista.attr("checked","checked");
    tipodeportista.parent().find("label").trigger("click");
    var genero = formulario.find("input."+user.genero+"[name='u_genero']"); 
    genero.attr("checked","checked");
    genero.parent().find("label").trigger("click");
    formulario.find("input[name='u_nombre']").val(user.nombre);
    formulario.find("input[name='u_apellidos']").val(user.apellidos);
    formulario.find("input[name='u_fecha_nacimiento']").val(formatDate(user.fechanacimiento));
    formulario.find("input[name='u_telefono']").val(user.telefono);
    formulario.find("input[name='u_direccion']").val(user.direccion);
    $("#modal_box img.preview").attr("src",BASE_URL_APP+'img/Usuario/169/'+user.imagen);
    
    //llenamos los paises y seleccionamos en el cual esta
    llenarPaises(formulario, "select-pais",user.pais_id);
    //llenamos las ciudades, ya sabemos de que pais es el usuario y en que ciudad esta
    llenarCiudades(formulario, "select-ciudad",user.pais_id,user.ciudad_id);
    //llenamos los deportes
    llenarDeportes(formulario.attr("id"), user.deporte_id);
    
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
                    url: BASE_URL_APP + 'usuarios/mobileCompletarPerfil',
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
                                params.folder = "Usuario"; // la carpeta donde se va a guardar la imagen
                                params.usuario_id = user.id; // id del usuario para el cual es la nueva imagen.
                                
                                //Utilizamos la funcion de subir la imagen de forma asincrona, ya que solo
                                //va subir la imagen y nada mas, ahi termina el proceso.
                                uploadImagenAsynchronous(params);
                                
                                //Actualizamos la nueva imagen de su perfil
                                var pictureImage = document.getElementById('imagen_dep');
                                pictureImage.src = IMAGEURI;
                            }
                            
                            //actualizamos la COOKIE
                            var usuario = data.usuario.Usuario;
                            createCookie("user", JSON.stringify(usuario), 1);
                            COOKIE = $.parseJSON(readCookie("user"));
                            
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
                showAlert("Error no puede actualizar datos!.","Error", "Aceptar");
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
                            if(msg.activo_su_cuenta){
                                showAlert("Haz validado tu cuenta, ahora puedes crear tu patrocinio para empezar a recibir aportaciones.", "Enhorabuena", "Aceptar");
                            }
                            $.mobile.changePage(goToPage, {transition: "fade"});
                        }else{
                            //mostramos el mensaje de que debe colocar el codigo de activacion para quedar activo en el sistema
                            //si el codigo que puso es erroneo
                            if(msg.codigo_validacion != ""){
                                $("#login").find(".msg_error").find("label").html("El c&oacute;digo de confirmaci&oacute;n, que introdujo es err&oacute;neo. Por favor verifique o ingrese nuevamente el c&oacute;digo de confirmaci&oacute;n.");
                            }else{
                                $("#login").find(".msg_error").find("label").html("Hemos detectado que no has validado tu cuenta, por favor introduce el c&oacute;digo de confirmaci&oacute;n, que se te envi&oacute; a tu correo.");
                            }
                            $("#login").find(".msg_error").find("label").css("width","90%");
                            $("#login").find(".msg_error").fadeIn("slow");
                            $("#login").find(".campo_codigo_validacion").show();
                        }
                    }else{
                        //mostramos el mensaje de login fallido
                        $("#login").find(".campo_codigo_validacion").hide();
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

//INICIA LAS VALIDACIONES PARA CONFUGURAR ALERTAS - PERFIL
function form_configurar_alertas(element,user){
    var formulario = jQuery("#"+element); 
    
    //obtenemos las alertas
    $.mobile.loading( 'show' );
    formulario.css("opacity",0.5);
    $.getJSON(BASE_URL_APP+'usuarios/mobileGetAlertas/'+user.id, function(data){
        var alertas = data.item;
        if(alertas){
            $.each(alertas,function(index,value){
                if(value !== undefined && value != ""){
                    formulario.find("input[name='alerta_"+index+"']").parent().find("label").trigger("click");
                    formulario.find("input[name='alerta_"+index+"']").attr("checked","checked");
                }
            });
            formulario.css("opacity",1);
        }else{
            formulario.css("opacity",1);
        }
    });
    $.mobile.loading( 'hide' );
    
    //colocamos el id del usuario
    formulario.find("input[name='usuario_id']").val(user.id);
    
    //Submit form
    formulario.submit(function() {
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            $.ajax({
                data: formulario.serialize(),
                type: "POST",
                url: BASE_URL_APP + 'usuarios/mobileSaveAlertas',
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
        }
      return false;
    });
}

//INICIA LAS VALIDACIONES PARA EL MODAL SUBIR VIDEO - PERFIL
function form_subir_video(parent_id, element,user){
    var parent = $("#"+parent_id);
    var formulario = jQuery("#"+element); 
    formulario.validate({
        errorElement:'span',
    	rules: {

    		"videourl": {
    			required: true
    		},
    		"descripcion_media": {
    			maxlength:100
    		}
    	},
    	messages: {
    		"videourl": {
    			required: "Por favor, ingrese la url del video <i></i>"
    		},
    		"descripcion_media": {
    			maxlength: "M&aacute;ximo permitido 100 caracteres <i></i>"
    		}
    	}
    });
    
    //colocamos el id del usuario
    formulario.find("input[name='usuario_id']").val(user.id);
    
    //Submit form
    formulario.submit(function() {
        //Si todo el form es valido mandamos
        if (jQuery(this).valid()) {
            $.ajax({
                data: formulario.serialize(),
                type: "POST",
                url: BASE_URL_APP + 'publicaciones/mobileSaveVideo',
                dataType: "html",
                success: function(data){
                    $.mobile.loading( 'hide' );
                    
                    data = $.parseJSON(data);
                    if(data.success){
                        var publicacion = data.publicacion.publicacion; 
                        //add nuevo item
                        html_data='<div class="preview">';
                        html_data+='    <a href="javascript:void(0)" onclick="playVideo(this)" rel="'+publicacion.src_iframe+'" class="zoom_media">&nbsp;</a>';
                        html_data+='    <img src="'+publicacion.src+'" width="auto" height="auto" />';
                        html_data+='</div>';
                    
                        parent.find("ul.list_media_videos li.list_left").prepend(html_data);
                                
                        clear_form(element);
                        showAlert(data.mensaje, "Aviso", "Aceptar");
                        //cerramos el modal
                        $("#modal_box_video").fadeOut("slow");
                    }else{
                        clear_form(element);
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

// REGISTRO SUCCESS
//
function success_registro(){
    $.mobile.changePage('#registro_finalizado', {transition: "slide"});
    clear_form("form_registro");
    $.mobile.loading( 'hide' );
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
                input.after("<span class='error email_repetido'>Este email ya est&aacute; siendo usado o no esta permitido <i></i></span>");
                input.parent().find("span.error").fadeOut(14000);
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
                input.after("<span class='error urlamigable_repetido'>Este nombre de usuario ya est&aacute; siendo utilizado <i></i></span>");
                input.parent().find("span.error").fadeOut(14000);
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
    $("#"+form).find("img").attr("src","").hide();;
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
                    fields: 'id, name, first_name, last_name, username, email, picture'
                },function(response) {
                    if (response.error) { 
                       showAlert('get user datas failed ' + JSON.stringify(response.error));
                    }else{
                        var user = response;
                        $("#form_registro").find("#u_nombre").val(user.first_name);
                        $("#form_registro").find("#u_apellidos").val(user.last_name);
                        $("#form_registro").find("#u_urlamigable").val(user.username);
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

//compartiFacebookWallPost
//comparte en facebook el proyecto del deportista
function compartiFacebookWallPost(usuario_title, proyecto_title, proyecto_actividad_patrocinio, proyecto_imagen, enlace_proyecto) {
    var params = {
        method: 'feed',
        name: usuario_title + ' - ' + proyecto_title,
        link: enlace_proyecto,
        picture: proyecto_imagen,
        caption: 'www.patrocinalos.com',
        description: proyecto_actividad_patrocinio
    };
    FB.ui(params, function(obj) { 
        //console.log(obj);
        showAlert("Haz compartido con exito el proyecto!.", "Enhorabuena", "Aceptar");
    });
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
	element.find('a').bind("click", function() {
	   window.open($(this).attr('href') , target );
	   return false;
	});
}

/*funccion para cerrar un modal*/
//thiss:link que cierra el modal
//status:para cerrar o mostrar un modal
//tipo:paramentro extra
function modalOpenHide(thiss,status,tipo){
    if(status=="hide"){
        jQuery("#"+jQuery(thiss).attr("rel")).fadeOut("fast");
        if(tipo !== undefined && tipo == "video"){
            jQuery("#"+jQuery(thiss).attr("rel")).find("iframe").attr("src","");
        }
    }
    else if(status=="show"){
        jQuery("#"+jQuery(thiss).attr("rel")).fadeIn("fast");
    }
}

//funcion que se ejecuta una vez que se subio con exito la imagen
//para luego hacer otros procedimientos
//recibe toda la respuesta del servidor
function callbackSynchronous(response){
    //aqui controlamos que mas se hace despues de subir la imagen
    //podemos ejecutar actualizaciones, mandar un post, etc.
    var respuesta = $.parseJSON(response);
    if(respuesta.success && respuesta.seccion == "foto"){
        var parent = $("#mis_fotos").find(".list_media_fotos");
        parent.find(".no_imagenes").remove();
        html_data='<div class="preview">';
        html_data+='    <a href="javascript:void()" onclick="zoomPhoto(this)" rel="'+BASE_URL_APP+'/img/Usuario/800/'+respuesta.nombre_imagen+'" class="zoom_media">&nbsp;</a>';
        html_data+='    <img src="'+BASE_URL_APP+'/img/Usuario/169/'+respuesta.nombre_imagen+'" width="auto" height="auto" />';
        html_data+='</div>';
    
        parent.find("li.list_left").prepend(html_data);
        showAlert("La imagen se subio con exito!.", 'Enhorabuena!', 'Aceptar');
        $.mobile.loading( 'hide' );
    }
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

//llena los paises y coloca seleccionado ala pais seleccionado
//parent : formulario padre
//element : elemento donde se va colocar todos los paises
//param : pais_id, id del pais que se quiere seleccionar
function llenarPaises(parent, element, pais_id){
    //si no hay pais a listar sus ciudades por defecto es españa
    if(pais_id == undefined || pais_id == ''){
        pais_id = '';
    }
    
    $.getJSON(BASE_URL_APP+'usuarios/mobileGetPaises/'+pais_id, function(data){
        $.each(data.items,function(index,item){
            if(item.paises.id==pais_id)
                parent.find("#"+element).append('<option selected="selected" value="'+item.paises.id+'">'+item.paises.nombre+'</option>');
            else
                parent.find("#"+element).append('<option value="'+item.paises.id+'">'+item.paises.nombre+'</option>');
        });
        //actualiza el texto
        fixedSelector(parent.attr("id"), element);
    });
}

//LLENAR DEPORTES PARA EL FORMULARIO
function llenarDeportes(parent_id, deporte_id){
    //si no hay deporte a seleccionar
    if(deporte_id == undefined || deporte_id == ''){
        deporte_id = '';
    }
    
	$.getJSON(BASE_URL_APP + 'usuarios/mobileGetDeportes', function(data) {
		var deportes = data.items;
        var html = "";
        $.each(deportes, function(index, item) {
            if(item.deportes.id==deporte_id)
                html+= "<option selected='selected' value="+item.deportes.id+">"+item.deportes.nombre+"</option>";
            else
                html+= "<option value="+item.deportes.id+">"+item.deportes.nombre+"</option>";
        });
        
        jQuery("#"+parent_id).find("#select_deporte").find("option").after(html);
        //actualiza el texto
        fixedSelector(parent_id, 'select_deporte');
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

//LLENAR ONG'S PARA EL FORMULARIO
function llenarOngs(parent_id){
	$.getJSON(BASE_URL_APP + 'ongs/mobileGetOngs', function(data) {
		var ongs = data.items;
        var html = "";
        $.each(ongs, function(index, item) {
            html+= "<option value="+item.ongs.id+">"+item.ongs.title+"</option>";
        });
        
        jQuery("#"+parent_id).find("#ong_id").append(html);
        //actualiza el texto
        fixedSelector(parent_id, 'ong_id');
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

//INICIAMOS LOS EVENTO SEGUIR, PATROCINAR DEPORTISTA
function loadEventPerfilDeportista(parent, me, to_usuario_id){
    parent.find("#seguir_deportista").click(function(){
        
        if($(this).hasClass("seguir")){
            //mostramos loading
            $.mobile.loading( 'show' );
            $.getJSON(BASE_URL_APP + 'seguidores/mobileSeguirDeportista?me=' + me + "&to_usuario_id=" + to_usuario_id, function(data){
                if(data.success){
                    parent.find("#seguir_deportista").find(".ui-btn-text").text("Dejar de Apoyar");
                    parent.find("#seguir_deportista").removeClass("seguir");
                    parent.find("#seguir_deportista").addClass("dejar_seguir");
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                }else{
                    showAlert("Ocurrio un error", "Error", "Aceptar");
                }
            });
        
        }else if($(this).hasClass("dejar_seguir")){
            //mostramos loading
            $.mobile.loading( 'show' );
            $.getJSON(BASE_URL_APP + 'seguidores/mobileDejarSeguirDeportista?me=' + me + '&to_usuario_id=' + to_usuario_id, function(data){
                if(data.success){
                    parent.find("#seguir_deportista").find(".ui-btn-text").text("Apoyar Proyecto");
                    parent.find("#seguir_deportista").removeClass("dejar_seguir");
                    parent.find("#seguir_deportista").addClass("seguir");
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                }else{
                    showAlert("Ocurrio un error", "Error", "Aceptar");
                }
            });
        }
        
        return false;
    });
    
    //llenamos las ongs
    llenarOngs(parent.attr("id"));
    
    form_pago = parent.find("#formulario_pago_individual");
    form_pago.find("#pago_monto").keyup(function(){
        var monto = 0;
        if($(this).val() == ""){
            monto = 0;
        }else{
            if(validarInt("pago_monto")){
                monto = $(this).val();
            }
        }
        //calculamos el porcentaje, por ahora siempre es 5 %
        var porcentaje = 5;
        var porcentaje_ong = parseInt(monto) -  (parseInt(monto) * ((100-parseInt(porcentaje))/100));
        form_pago.find("#porcentaje").find("span").html("(" + parseFloat(porcentaje_ong).toFixed(2) + "&euro;)");
    });
    
    //PAGO MEDIANTE PAYPAL Y TPV
    form_pago.find("a.pago_paypal, a.pago_tpv_4B").off('click').on("click", function(){
        var elem = $(this);
        var pago_monto = form_pago.find("#pago_monto").val();
        var pago_termino = form_pago.find("#pago_termino").is(":checked") ? true : false;
        
        if($.trim(pago_monto) != "" && (parseInt(pago_monto) > 0 && validarInt("pago_monto"))){
            if(isLogin()){
                
                //PAGO PAYPAL
                if(elem.attr("lang") == "PAYPAL"){
                    $.ajax({
                        data: $(form_pago).serialize(),
                        type: "POST",
                        url: BASE_URL_APP+'aportaciones/mobileAddAportacion/'+ me + "/PAYPAL",
                        dataType: "html",
                        success: function(data){
                            
                            //ocultamos el loading
                            $.mobile.loading('hide');
                            var result = $.parseJSON(data);
                            
                            if(result.aportacion_realizada){
                                //Cerramos el popup
                                $("#popupPatrocinar").popup("close");
                                document.getElementById("formulario_pago_individual").reset();
                                
                                var url_pago = result.url_redirect_pago;
                                //window.location = url_pago;
                                window.plugins.childBrowser.showWebPage(url_pago, { showLocationBar : false }); 
                                window.plugins.childBrowser.onLocationChange = function(loc){ procesoPagoPayPal(loc, me); }; // When the ChildBrowser URL changes we need to track that
                            }else{
                                showAlert(result.error_alcanzado, "Error", "Aceptar");
                            }
                        },
                        beforeSend : function(){
                            //mostramos loading
                            showLoadingCustom('Verificando datos...');
                        }
                    });
                
                //PAGO TPV
                }else if(elem.attr("lang") == "TPV"){
                    $.ajax({
                        data: $(form_pago).serialize(),
                        type: "POST",
                        url: BASE_URL_APP+'aportaciones/mobileAddAportacion/'+ me + "/TPV",
                        dataType: "html",
                        success: function(data){
                            
                            //ocultamos el loading
                            $.mobile.loading('hide');
                            var result = $.parseJSON(data);
                            
                            if(result.aportacion_realizada){
                                //Cerramos el popup
                                $("#popupPatrocinar").popup("close");
                                document.getElementById("formulario_pago_individual").reset();
                                
                                var url_pago = result.url_redirect_pago;
                                var params = result.params;
                                var site_url = BASE_URL_APP+'aportaciones/mobileRedireccionamientoTPV/?url='+url_pago+'&ref='+params.ref+'&store='+params.store+'&idioma='+params.idioma;
                                //window.location = site_url;
                                window.plugins.childBrowser.showWebPage(site_url, { showLocationBar : false });
                                window.plugins.childBrowser.onLocationChange = function(loc){ procesoPagoTPV(loc); }; // When the ChildBrowser URL changes we need to track that
                            }else{
                                showAlert(result.error_alcanzado, "Error", "Aceptar");
                            }
                        },
                        beforeSend : function(){
                            //mostramos loading
                            showLoadingCustom('Verificando datos...');
                        }
                    });
                }
            }else{
                showAlert("Por favor vuelva a logearse he intente de nuevo", "Aviso", "Aceptar");
            }
        }else{
            showAlert("Por favor!, introduzca un monto valido.", "Aviso", "Aceptar");
            form_pago.find("#pago_monto").val("");
        }
    });
    //END
}

//CONTROLAMOS LAS DISTINTAS RESPUESTAS AL MOMENTO DE REALIZAR EL PAGO POR PAYPAL
function procesoPagoPayPal(loc, usuario_id){
    
    var url_callback = BASE_URL_APP + 'aportaciones/mobileAddAportacion/' + usuario_id + '/';
    if (loc.indexOf(url_callback + "?") >= 0) {
        
        // Parse the returned URL
        var token, payer_id = '';
        var params = loc.substr(loc.indexOf('?') + 1);
         
        params = params.split('&');
        for (var i = 0; i < params.length; i++) {
            var y = params[i].split('=');
            if(y[0] === 'PayerID') {
                payer_id = y[1];
            }
            //Obtenemos el token generado
            if(y[0] === 'token') {
                token = y[1];
            }
        }
        
        //controlamos si es que se realizo el pago correctamete, porque tambien puede cancelarlo
        if(payer_id != '')
        {
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            
            //Actualizamos la aportacion, porque se realizo correctamente el pago
            $.ajax({
                data: "token="+token,
                type: "POST",
                url: BASE_URL_APP+'aportaciones/mobileUpdateAportacionPayPal',
                dataType: "html",
                success: function(data){
                    
                    //ocultamos el loading
                    $.mobile.loading('hide');
                    var result = $.parseJSON(data);
                    
                    if(result.update_success){
                        if(result.publicacion_nueva != ""){
                            var parent = $("#proyecto_deportivo");
                            parent.find("#publicaciones").css("opacity",0.5);
                            parent.find("#publicaciones").prepend(result.publicacion_nueva);
                            parent.find("#publicaciones").promise().done(function() {
                                parent.find("#publicaciones").animate({opacity: 1}, 500 );
                                $(".age").age();
                            });
                        }
                        showAlert(result.success_alcanzado, "Aviso", "Aceptar");
                    }else{
                        showAlert(result.error_alcanzado, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Guardando aportacion...');
                }
            });
        }else{
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            showAlert("Su aportacion fue cancelada", "Aviso", "Aceptar");
        }
        
    }else {
        // TODO
    }
}

//CONTROLAMOS LAS DISTINTAS RESPUESTAS AL MOMENTO DE REALIZAR EL PAGO POR TPV
function procesoPagoTPV(loc){
    //Exiten 3 tipos de estados en el cual se mueve el pago para realizar la transaccion
    //aceptadaconfirmadortodotpvokpasarela -> Coloca el pago si todo esta bine en estado "pagado"
    //denegada -> error al momento de realizar el pago
    //vuelve -> Significa que se hizo correctamente el pago
    
    //Controlamos 2 casos de estados de transaccion "denegada y vuelve"
    
    var url_callback_denegada = BASE_URL_APP + 'aportaciones/denegada/';
    var url_callback_vuelve = BASE_URL_APP + 'aportaciones/vuelve/';
    
    if (loc.indexOf(url_callback_vuelve + "?") >= 0) {
        
        // Parse the returned URL
        var token = '';
        var params = loc.substr(loc.indexOf('?') + 1);
         
        params = params.split('&');
        for (var i = 0; i < params.length; i++) {
            var y = params[i].split('=');
            if(y[0] === 'pszPurchorderNum') {
                token = y[1];
            }
        }
        
        //controlamos si es que se realizo el pago correctamete, porque tambien puede cancelarlo
        if(token != '')
        {
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            
            //Verificamos si la aportacion fue pagada, si llega al metodo vuelve, 
            //sabemos que fue completada la aportacion, pero para mayor seguridad verificamos si se hizo correctamente la aportacion.
            //solo verificamos si la aportacion tiene su estado 'pagado', no enviamos mail ni nada por el estilo ya que se supone
            //que llego al metodo vuelve y éste sabe hacer todo(enviar mail, colocar la aportacion en estado pagado, etc)
            $.ajax({
                data: "token="+token,
                type: "POST",
                url: BASE_URL_APP+'aportaciones/mobileVerificarAportacion',
                dataType: "html",
                success: function(data){
                    
                    //ocultamos el loading
                    $.mobile.loading('hide');
                    var result = $.parseJSON(data);
                    
                    if(result.aportacion_pagada){
                        showAlert(result.success_alcanzado, "Aviso", "Aceptar");
                    }else{
                        showAlert(result.error_alcanzado, "Error", "Aceptar");
                    }
                },
                beforeSend : function(){
                    //mostramos loading
                    showLoadingCustom('Verificando aportacion...');
                }
            });
        }else{
            //Cerramos el childBrowser
            window.plugins.childBrowser.close();
            showAlert("Ocurrio un error al momento de realizar el pago. Por favor, asegurese de que ha introducido correctamente sus datos de pago y vuelva a intentarlo.", "Error", "Aceptar");
        }
        
    }else if (loc.indexOf(url_callback_denegada + "?") >= 0) {
        //Cerramos el childBrowser
        window.plugins.childBrowser.close();
        showAlert("Su aportacion fue denegada. Por favor, asegurese de que ha introducido correctamente sus datos de pago y vuelva a intentarlo.", "Error", "Aceptar");
        
    }else{
        // TODO
    }
}

/*MOSTRAMOS LAS NOTIFICACIONES DE LA RONDA*/
function showNotificacionesRonda(parent,notificaciones_ronda,show_lista){
    //actividad en las rondas
    parent.find('#lista_actividades_ronda').find("li").remove();
    $.each(notificaciones_ronda, function(index, item) {
        html='<li>';
        html+='<div class="recorte">';
        html+='<img src="'+BASE_URL_APP+'img/Usuario/169/'+item.Notificacion.usuario_imagen+'"/>';
        html+='</div>';
        html+='<div class="content_descripcion left">';
        html+='<time class="age" date="'+item.Notificacion.date+'" datetime="'+item.Notificacion.datetime+'">&nbsp;</time>';
        html+='<h4 class="ui-li-heading">';
        html+='<b>'+item.Notificacion.usuario_title+'</b>';
        html+='</h4>';
        html+='<p class="ui-li-desc">'+item.Notificacion.texto_descripcion+'</p>';
        html+='</div>';
        html+='</li>';
        
        parent.find('#lista_actividades_ronda').append(html);
     });
     
    parent.find('#lista_actividades_ronda').listview('refresh');
    
    //mostralos la lista de actividad de patrocinalos
    parent.find("#lista_actividades_ronda").promise().done(function() {
        //ocultamos loading
        $.mobile.loading( 'hide' );
        $(".age").age();
        
        if(show_lista){
            parent.find("#lista_actividades_ronda").fadeIn("slow");
        }
    });
}

/*ACTUALIZA EL PANEL QUE TIENE TODAS LA OPCIONES DE NAVEGABILIDAD*/
function actualizar_panel(){
    //verificamos si el usuario logeado tiene proyecto
    if(COOKIE !== ''){
        var user = COOKIE;
        if(user.proyecto_id !== undefined && parseInt(user.proyecto_id) > 0){
            //actualizamos el texto a "EDITAR PROYECTO", PORQUE TIENE UN PROYECTO
            $(".mi_patrocinio").find("ul li:nth-child(2)").find("a").html("EDITAR PROYECTO"); //solicitar|editar patrocinio
        }
        
        //mostramos las opciones del panel-menu, segun el tipo de usuario
        if(user.tipo == "empresa"){
            $(".actividad_comunidad").hide();
            $(".mi_patrocinio").hide();
            $(".mi_perfil").hide();
        }else if(user.tipo != "patrocinador" && user.tipo != "seguidor"){
            //controlamos si tiene el proyecto activo solo asi se muestra la opcion "mis recaudaciones"
            if(user.proyecto_estado !== undefined && user.proyecto_estado == "activo"){
                $(".mi_patrocinio").find("ul li:nth-child(3)").show(); //mis recaudaciones
            }
            $(".mi_patrocinio").find("ul li:nth-child(1)").show(); //mis proyectos
            $(".mi_patrocinio").find("ul li:nth-child(2)").show(); //solicitar|editar patrocinio
            $(".mi_patrocinio").find("ul li:nth-child(5)").show(); //mi widget
        }
    }
}

/*EFECTO DE ZOOM SOBRE LA FOTO*/
function zoomPhoto(thiss){
    jQuery("#modal_box_media").css("padding-top",$(document).scrollTop()+"px");
    jQuery("#modal_box_media").find(".zoom_image img").attr("src",jQuery(thiss).attr("rel"));
    jQuery("#modal_box_media").fadeIn("fast");
}

/*REPRODUCE EL VIDEO*/
function playVideo(thiss){
    jQuery("#modal_box_playvideo").css("padding-top",$(document).scrollTop()+"px");
    jQuery("#modal_box_playvideo").find(".ui-icon-loading").show();
    jQuery("#modal_box_playvideo").find(".zoom_image iframe").attr("src",jQuery(thiss).attr("rel"));
    jQuery("#modal_box_playvideo").fadeIn("fast");
    jQuery("#modal_box_playvideo").find(".zoom_image iframe").load(function(){
        jQuery("#modal_box_playvideo").find(".ui-icon-loading").hide();
    });
}

function playVideoPublicacion(thiss){
    jQuery("#modal_box_playvideo_publicacion").css("padding-top",$(document).scrollTop()+"px");
    jQuery("#modal_box_playvideo_publicacion").find(".ui-icon-loading").show();
    jQuery("#modal_box_playvideo_publicacion").find(".zoom_image iframe").attr("src",jQuery(thiss).attr("rel"));
    jQuery("#modal_box_playvideo_publicacion").fadeIn("fast");
    jQuery("#modal_box_playvideo_publicacion").find(".zoom_image iframe").load(function(){
        jQuery("#modal_box_playvideo_publicacion").find(".ui-icon-loading").hide();
    });
}

/*SUBE LA IMAGEN QUE SE SELECCION0 DESDE EL DIPOSITIVO O QUE SE CAPTURA CON EL DISPOSITIVO, LO HACE A TRAVEZ DEL EVENTO "SUBIR FOTO"*/
function subirFotoSeleccionada(folder){
    //controlamos que el valor de la imagen a subir no este vacia, 
    //eso significa que se selecciono un imagen o se capturo una imagen
    if(IMAGEURI != ''){
        
        //creamos un objecto con los parametros que queremos que llegue al servidor
        //para luego ahi hacer otra operaciones con esos parametros.
        var params = new Object();
        params.folder = folder; // la carpeta donde se va a guardar la imagen
        params.usuario_id = COOKIE.id; // id del usuario para el cual es la nueva imagen.
        
        //Utilizamos la funcion de subir la imagen de forma sincrona, porque vamos a efectuar otra operacion
        showLoadingCustom('Subiendo la imagen. Por favor espere...');
        uploadImagenSynchronous(params);
    
    }else{
        showAlert("No ha seleccionado ninguna foto!", "Error", "Aceptar");
    }
}

/*EVENTOS QUE SE LANZAN AL MOMENTO DE CAMBIAR DE LANSCAPE A PORTRAIT O VICEVERSA*/
/*orientation:puede ser lanscape o portrait*/
/*page_id:el id de la pagina actual en el que se realizo el movimiento*/
function callbackOrientationChange(orientation, page_id){
    
}

/*borramos los datos de la cookie*/
function logout(){
    eraseCookie("user");
    redirectLogin();
}