// ----------------------------------------GITHUB--------------------------------------------

// Comprueba que el token sea correcto y guarda los datos en el fichero y repositorio indicados
function guardar_datos() {
    // Extraigo los datos de los campos
    var token = $("#token").val();
    var repo_name = $("#repo").val();
    var fichero = $("#nombre_fich").val();
    // Quito el formulario
    $('#token-form').html("");
    // Objeto github
    github = new Github({
	token: token,
	auth: "oauth"
    });
    // Extraigo el repositorio
    repositorio = github.getRepo("cgonzalezsanc", repo_name);
    // Compruebo si hay error y guardo el contenido
    repositorio.show(function (error, repositorio) {
        if (error) {
            $("#botones-github").after("<p>Se ha producido un error</p>");
        } else {
            var contenido = 'a';
            repositorio.write('master', fichero, contenido,
                "Actualizando datos", function(err) {
                    console.log (err)
                });
        }  
    });
}

// Comprueba que el token sea correcto y carga los datos del fichero y repositorio indicados
function cargar_datos() {
    var token = $("#token").val();
    var repositorio = $("#repo").val();
    var fichero = $("#nombre_fich").val();
    // Quito el formulario
    $('#token-form').html("");  
    // Objeto github
    github = new Github({
	token: token,
	auth: "oauth"
    });
    // Extraigo el repositorio
    repositorio = github.getRepo("cgonzalezsanc", repo_name);
}

/* Muestra el formulario para introducir el token, el nombre del repositorio y el nombre del 
   fichero, y habilita el handler para guardar los datos */
function click_guardar() {
    $('#token-form').html("Token: <input type='text' name='token' value='' id='token' "
                          + "size='36' />"
                          + "Repositorio: <input type='text' name='repo' value='X-Nav-Practica-Hoteles' "
                          + "id='repo' size='15' />"
                          + "Fichero: <input type='text' name='nombre_fich' id='nombre_fich' "
                          + "value='datos.json' size='10' />"
                          + "<button type='button' id='guardar-github'>Guardar en Github</button>");
    $("div#token-form button#guardar-github").click(guardar_datos);
}

/* Muestra el formulario para introducir el token y habilita el handler para guardar los datos */
function click_cargar() {
    $('#token-form').html("Token: <input type='text' name='token' value='' id='token' "
                          + "size='36' />"
                          + "Repositorio: <input type='text' name='repo' value='X-Nav-Practica-Hoteles' "
                          + "id='repo' size='15' />"
                          + "Fichero: <input type='text' name='nombre_fich' id='nombre_fich' "
                          + "value='datos.json' size='10' />"
                          + "<button type='button' id='cargar-github'>Cargar de Github</button>");
    $("div#token-form button#cargar-github").click(cargar_datos);
}

// --------------------------------------INFO HOTELES------------------------------------------

// Devuelve las urls de las fotos en formato HTML si las hay
function url_fotos(multimedia) {
    if (multimedia == null) {
        var fotos = '<p>No hay fotos disponibles</p>';
    } else {
        var fotos = '<p>Fotos del lugar:</p>';
        var media = multimedia.media;
	    for (var i=0; i<media.length; i++) {
		    fotos = fotos + '<img src="' + media[i].url + '">';
        }
    }
    return fotos;
}

/* Comprueba si un elemento es null. Devuelve un texto en formato HTML
   indicando el resultado */
function comprobar_null(elemento, txt) {
    var resultado = "<p>" + txt + ": ";
    if (elemento == null) {
        resultado = resultado + "No disponible";
    } else {
        resultado = resultado + " " + elemento;
    }
    resultado = resultado + "</p>";
    return resultado;
}

/* Muestra la siguiente información del alojamiento en formato HTML:
		- Nombre
		- Dirección
		- Descripción
		- Carrusel con fotos
*/
function mostrar_info_reducida(alojamiento) {
	// Extraigo la información del objeto
	var nombre = alojamiento.basicData.name;
	var direccion = comprobar_null(alojamiento.geoData.address, "Direccion");
	var descripcion = comprobar_null(alojamiento.basicData.body, "Descripcion");
    var fotos = url_fotos(alojamiento.multimedia);
    // Concateno la información en formato HTML
	var infoReducida = '<h2>' + nombre + '</h2>'
			          + direccion
                      + descripcion
                      + fotos 
	return infoReducida;
}

/* Muestra la siguiente información del alojamiento en formato HTML:
    - Nombre
    - Coordenadas geográficas
    - Dirección
    - Tipo de alojamiento
    - Clasificación de calidad
    - Teléfono
    - Email
    - Página web
    - Descripción
    - Carrusel con fotos
*/
function mostrar_info_completa(alojamiento) {
    // Extraigo la información del objeto
    var nombre = alojamiento.basicData.name;
    var lat = comprobar_null(alojamiento.geoData.latitude, "Latitud");
    var lon = comprobar_null(alojamiento.geoData.longitude, "Longitud");
	var direccion = comprobar_null(alojamiento.geoData.address, "Direccion");
    var tipo = comprobar_null(alojamiento.extradata.categorias.categoria.item[1]['#text'],"Tipo");
    var clasif = comprobar_null(alojamiento.extradata.categorias.categoria
                .subcategorias.subcategoria.item[1]['#text'], "Calidad");
    var tlf = comprobar_null(alojamiento.basicData.phone, "Teléfono");
    var email = comprobar_null(alojamiento.basicData.email, "Email");
    var url = comprobar_null(alojamiento.basicData.web, "Página web");
	var descripcion = comprobar_null(alojamiento.basicData.body, "Descripcion");
    var fotos = url_fotos(alojamiento.multimedia);
    // Concateno la información en formato HTML
	var infoCompleta = '<h2>' + nombre + '</h2>'
                       + lat
                       + lon
			           + direccion
                       + tipo
                       + clasif
                       + tlf 
                       + email
                       + url
                       + descripcion
                       + fotos 
	return infoCompleta;
}

// Se añade un marcador en el alojamiento y se centra el mapa sobre él
function añadir_marcador(alojamiento) {
	// Extraigo las coordenadas, la URL y el nombre
 	var lat = alojamiento.geoData.latitude;
	var lon = alojamiento.geoData.longitude;
	var url = alojamiento.basicData.web;
	var nombre = alojamiento.basicData.name;
	/* Añado el marcador en esas coordenadas y hago que aparezca su nombre.
       Habilito el handler para que se muestre la información cuando se haga
       click en el marcador */
	L.marker([lat, lon]).addTo(map)
	 .bindPopup('<a href="' + url + '">' + nombre + '</a><br/>')
	 .openPopup()
     .on('click', function() {
        // Cuando se hace click se muestra la informacion
        $('#infoAlojReducida').html(mostrar_info_reducida(alojamiento));
	    $('#infoAlojCompleta').html(mostrar_info_completa(alojamiento));
     });
	// Centro el mapa en ese punto
	map.setView([lat, lon], 15);
}

/* Muestra la información del alojamiento en las pestañas correspondientes y 
   el marcador sobre el mapa */
function mostrar_alojamiento() {
	// Me quedo con el objeto correspondiente a este alojamiento a partir del
	// atributo del elemento seleccionado
 	var alojamiento = alojamientos[$(this).attr('no')];
	// Muestra la información reducida del alojamiento
	$('#infoAlojReducida').html(mostrar_info_reducida(alojamiento));
	// Muestra la información completa del hotel
	$('#infoAlojCompleta').html(mostrar_info_completa(alojamiento));
	// Añado el marcador del alojamiento sobre el mapa
	añadir_marcador(alojamiento);
};

/* Carga los alojamientos del fichero alojamientos.json. Muestra una lista con el nombre
   de cada uno de ellos y habilita el handler para clickear sobre ellos. */
function cargar_alojamientos() {
	$.getJSON("JSON/alojamientos.json", function(data) {
		// Reseteo el elemento cargarJSON pues ahora es inútil
		$('#cargarJSON').html('');
		// Guardo en la variable global alojamientos todos los objetos que son alojamientos
		alojamientos = data.serviceList.service;
		// Introduzco en una lista no ordenada el nombre de todos los alojamientos
		var lista = '<p>Alojamientos encontrados: ' + alojamientos.length + '</p>'
		lista = lista + '<ul>';
		for (var i = 0; i < alojamientos.length; i++) {
			lista = lista + '<li no=' + i + '>' + alojamientos[i].basicData.title + '</li>';
		}
		lista = lista + '</ul>';
		$('.lista-total').html(lista);
		// Cuando se clickea sobre cada uno de ellos se muestra su información
		$('.lista-total li').click(mostrar_alojamiento);
        // Se muestran en la página los botones para cargar y guardar los datos en github
        $('#botones-github').html("<button type='button' id='guardar'>Guardar</button>"
                                  + "<button type='button' id='cargar'>Cargar</button>"
                                  + "<div id='token-form'></div>");
        // Se inicializa el handler de estos botones
        $('button#guardar').click(click_guardar);
        $('button#cargar').click(click_cargar);
	});
};


// ----------------------------------------INICIO--------------------------------------------

$(document).ready(function() {
	// Método para declarar que este elemento sea gestionado como tabs
	$("#pestañas").tabs();
	// Inicializo el mapa en la variable map, selecciono sus coordenadas centrales y el nivel de zoom
	map = L.map('mapa').setView([40.4175, -3.708], 11);
	// Añado a map la capa de teselas extraida de OpenStreetMap
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	/* Habilito el handler para que cuando se haga click en el elemento cargarJSON se carguen los
	   alojamientos */
	$("#cargarJSON").click(cargar_alojamientos);
});
