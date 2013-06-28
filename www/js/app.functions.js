/************************************ GLOBAL VARIABLES *******************************************************/
var IMAGEURI;
var ID_USUARIO;

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

  // Unhide image elements
  //
  pictureImage.style.display = 'inline-block';

  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  pictureImage.src = imageURI;
}

// Called if something bad happens.
// 
function onFail(message) {
    mensaje = message == "no image selected" ? "no se selecciono ninguna imagen" : message;
    showAlert(mensaje, 'Aviso', 'Aceptar');
}

// UploadPhoto
//
function uploadPhoto(id_usuario) {
    //Asignamos el id del usuario para realizar otras operaciones
    ID_USUARIO = id_usuario;
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = IMAGEURI.substr(IMAGEURI.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    
    var params = new Object();
    params.value1 = "test";
    params.value2 = "param";
    
    options.params = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(IMAGEURI, serviceURL + "upload_photo.php", win, fail, options);
}

// Callback success upload photo
//
function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    //alert(r.response);
    update_row('usuarios', 'imagen', r.response, 'id', ID_USUARIO);
}

//Callback error upload photo
function fail(error) {
    alert("An error has occurred: Code = " + error.code);
}

/************************************ FUNCTIONS APP *******************************************************/

//LLENAR DEPORTES PARA EL FORMULARIO DE REGISTRO
function llenarDeportes(){
	$.getJSON(serviceURL + 'get_deportes.php', function(data) {
		var deportes = data.items;
        var categoria = "";
        var html = "";
        $.each(deportes, function(index, deporte) {
            if(categoria != deporte.id_categoria){
                if(categoria != ""){
                    html+= "</optgroup>";
                }
                html+= "<optgroup label='"+htmlspecialchars_decode(deporte.nombre_categoria)+"'>";
                categoria = deporte.id_categoria;
            }
            html+= "<option value="+deporte.id+">"+htmlspecialchars_decode(deporte.nombre)+"</option>";
        });
        html+= "</optgroup>";
        
        //empty selector
        jQuery("#select_deporte").find("optgroup").remove();
        jQuery("#select_deporte").find("option").after(html);
	});
}

//INICIA LAS VALIDACIONES PARA EL FORMULARIO DE REGISTRO
function form_registro(){
    jQuery("#form_registro").validate({
        errorElement:'span',
    	rules: {
    		"usuario[nombre]": {
    			required: true,
    			minlength: 2
    		},
    		"usuario[apellido]": {
    			required: true,
    			minlength: 2
    		},
    		"usuario[email_register]": {
    			required: true,
    			email: true
    		},
    		"usuario[password_register]": {
    			required: true,
    			minlength: 5
    		},
    		"usuario[repetir_password]": {
    			required: true,
    			minlength: 5,
    			equalTo: "#usuario_email_password_register"
    		},
    		/*"usuario[deporte]": {
    			seleccionarDeporte: true
    		},*/
    		"usuario[terminos]": "required"
    	},
    	messages: {
    		"usuario[nombre]": {
    			required: "Por favor, introduzca su nombre",
    			minlength: "M&iacute;nimo de 2 caracteres"
    		},
    		"usuario[apellido]": {
    			required: "Por favor, introduzca su Apellido",
    			minlength: "M&iacute;nimo de 2 caracteres"
    		},
            "usuario[email_register]": {
    			required: "Por favor, introduzca su email",
    			email: "Direcci&oacute;n de email no v&aacute;lida"
    		},
    		"usuario[password_register]": {
    			required: "Por favor, ingrese su contrase&ntilde;a",
    			minlength: "M&iacute;nimo de 5 caracteres"
    		},
    		"usuario[repetir_password]": {
    			required: "Por favor, ingrese su contrase&ntilde;a",
    			minlength: "M&iacute;nimo de 5 caracteres",
    			equalTo: "Repita contrase&ntilde;a"
    		},
            "usuario[terminos]": "Por favor, acepte nuestros t&eacute;rminos"
    	}
    });
    
    //Submit form registro
    jQuery('#form_registro').submit(function() {
        /* start Fixed seleccionar deporte */
        var selector = jQuery('#form_registro').find("#select_deporte");
        var opcion_selected = selector.find("option:selected").html();
        var element = selector.prev(".ui-btn-inner").find(".ui-btn-text").find("span");
        element.removeClass()
        element.addClass("valid")
        element.text(opcion_selected);
        element.show();
        /* end Fixed seleccionar deporte */
        
        //Si todo el form es valido mandamos a registrar los datos
        if (jQuery(this).valid()) {
            //Mandamos a validar el mail
            var success = validar_email($.trim(document.getElementById("usuario_email_register").value));
            //Unicamente si el email no esta registrado mandamos a guardar
            if(success == false){
                //mostramos loading
                showLoadingCustom('Guardando datos...');
                        
                $.post(serviceURL + 'set_create_registro.php', $("#form_registro").serialize()).done(function(data) {
                    data = $.parseJSON(data);
                    var id_usuario = parseInt(data.item);
                    if(id_usuario){
                        //Si selecciono un imagen mandamos a guardar en la base de datos
                        var pictureImage = document.getElementById("pictureImage");
                        if($(pictureImage).attr("src") != ""){
                            uploadPhoto(id_usuario);
                        }else{
                            success_registro();
                        }
                    }else{
                        error_registro('Ha ocurrido un error al momento de registrarse!, por favor intente de nuevo');
                    }
                });
            }
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
        url: serviceURL + "get_validar_email.php",
        data: "email="+value,
        dataType:"html",
        async : false,
        cache: false,
        success: function(msg){
            $.mobile.loading( 'hide' );
            msg = $.parseJSON(msg);
            var result = msg.success;
            //response = ( result == true ) ? false : true;
            if(result){
                var input = jQuery("#usuario_email_register");
                input.parent().find("span.error").remove();
                input.after("<span class='error'>Este email ya est&aacute; registrado</span>");
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

// ACTUALIZAR UN CAMPO DE UNA TABLA
//
function update_row(tabla, campo, valor, condicion_campo, condicion_valor){
    jQuery.ajax({
        type: "POST",
        url: serviceURL + "set_update_data.php",
        data: { 'tabla': tabla, 'campo': campo, 'valor': valor, 'condicion_campo': condicion_campo, 'condicion_valor' : condicion_valor},
        dataType:"html",
        async : false,
        cache: false,
        success: function(data){
            data = $.parseJSON(data);
            $.mobile.loading( 'hide' );
            var success = data.item;
            if(success){
                success_registro();
            }else{
                error_registro('Ha ocurrido un error al momento de actualizar los datos del deportista!, por favor intente de nuevo');
            }
        }
    });
}