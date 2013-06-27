//Validar deporte seleccionado
jQuery.validator.addMethod("seleccionarDeporte", function(value, element) {    
    return jQuery.trim(value) != "";
}, "Debe seleccionar un deporte");

$.validator.addMethod("validarEmail", function(value, element) {
 return validar_email(value);
}, "Este email ya est&aacute; registrado");

//Formulario de registro
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
                saveData();
            }
        }
      return false;
    });
}

function saveData(){
    //mostramos loading
    $.mobile.loading( 'show', {
    	text: 'Guardando datos...',
    	textVisible: true,
    	theme: 'c',
    	html: ""
    });
            
    /*$.post(serviceURL + 'set_datos_registro.php', $("#form_registro").serialize()).done(function(data) {
        $.mobile.loading( 'hide' );
        document.getElementById("form_registro").reset();
        $.mobile.changePage('#register_finalizado', {transition: "slide"});
    });*/
    uploadPhoto();
}