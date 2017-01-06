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
    repositorio.show(function (error, repo) {
        if (error) {
            $("#botones-github").after("<p>Se ha producido un error</p>");
        } else {
            var contenido = JSON.stringify(colecciones);
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
    // Compruebo si hay error y extraigo el contenido
    repositorio.show(function (error, repo) {
        if (error) {
            $("#botones-github").after("<p>Se ha producido un error</p>");
        } else {
            repositorio.read('master', fichero, function(err, data) {
                    colecciones = JSON.parse(data);
                    // Se cargan todos los campos de las colecciones
                    cargar_colecciones();
            });
        }  
    });
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

// --------------------------------------COLECCIONES-------------------------------------------

// Muestra la lista de alojamientos de una coleccion
function mostrar_alojamientos_coleccion(coleccion) {
    var lista = "<p>Lista de alojamientos de la colección " + coleccion.nombre + ":</p>";
    if (coleccion.lista_alojamientos.length == 0) {
        lista = lista + "Todavía no se han añadido alojamientos.";
    } else {
        lista = lista + '<ul>';
        for (var i=0; i<coleccion.lista_alojamientos.length; i++) {
            var id = coleccion.lista_alojamientos[i];
            lista = lista + '<li no=' + id + '>' + alojamientos[id].basicData.title + '</li>';
        }
        lista = lista + "</ul>";
    }
    $('.lista-alojamientos-coleccion').html(lista);
    // Habilito que se pueda seleccionar un alojamiento desde esta lista
    $('.lista-alojamientos-coleccion li').click(mostrar_alojamiento);
}

// Añade un alojamiento a la colección seleccionada
function añadir_alojamiento_a_coleccion() {
    // Guardo el identificador en la coleccion
    coleccion_seleccionada.lista_alojamientos.push($(this).attr('no'));
    // Actualizo el HTML de la lista de los alojamientos de una coleccion
    mostrar_alojamientos_coleccion(coleccion_seleccionada);
}

// Cuando se selecciona una coleccion se muestra la lista de sus alojamientos
function seleccionar_coleccion() {
    var coleccion = colecciones[$(this).attr('no')];
    // Guardo en una variable global la coleccion
    coleccion_seleccionada = coleccion;
    mostrar_alojamientos_coleccion(coleccion);
}

// Muestra todas las colecciones creadas
function mostrar_colecciones() {
    var lista = "<p>Lista de colecciones:</p>";
    if (colecciones.length == 0) {
        lista = lista + "Todavía no hay colecciones creadas.";
    } else {
        lista = lista + '<ul>';
        for (var i=0; i<colecciones.length; i++) {
            lista = lista + '<li no=' + i + '>' + colecciones[i].nombre + '</li>';
        }
        lista = lista + "</ul>";
    }
    $('.lista-colecciones').html(lista);
}

// Crea una colección y la añade a la lista de colecciones
function añadir_coleccion() {
    var nombreColeccion = $("input#nombre_coleccion").val();
    var coleccion = {nombre:nombreColeccion, lista_alojamientos:[]};
    colecciones.push(coleccion);
    // Refresco la informacion del HTML
    mostrar_colecciones();
    // Elimino el contenido del formulario
    $("input#nombre_coleccion").val("")
    // Refresco el handler para seleccionar cada coleccion
    $(".lista-colecciones li").click(seleccionar_coleccion);
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

/* Comprueba si un elemento del alojamiento es null. Devuelve un texto en formato HTML
   indicando el resultado */
function comprobar_null(alojamiento, txt) {
    var resultado = "<p>" + txt + ": ";
    var valor = "";
    switch (txt) {
        case "Direccion":
            try {
                valor = alojamiento.geoData.address;
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Descripcion":
            try {
                valor = alojamiento.basicData.body;
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Latitud":
            try {
                valor = alojamiento.geoData.latitude;
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Longitud":
            try {
                valor = alojamiento.geoData.longitude;
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Tipo":
            try {
                valor = alojamiento.extradata.categorias.categoria.item[1]['#text'];
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Calidad":
            try {
                valor = alojamiento.extradata.categorias.categoria
                        .subcategorias.subcategoria.item[1]['#text'];
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Telefono":
            try {
                valor = alojamiento.basicData.phone;
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Email":
            try {
                valor = alojamiento.basicData.email;
            } catch (e) {
                valor = "No disponible";
            }
            break;
        case "Pagina web":
            try {
                valor = alojamiento.basicData.web;
            } catch (e) {
                valor = "No disponible";
            }
            break;
        default:
            valor = "Campo erróneo";
    }
    resultado = resultado + valor + "</p>";
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
	var direccion = comprobar_null(alojamiento, "Direccion");
	var descripcion = comprobar_null(alojamiento, "Descripcion");
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
    var lat = comprobar_null(alojamiento, "Latitud");
    var lon = comprobar_null(alojamiento, "Longitud");
	var direccion = comprobar_null(alojamiento, "Direccion");
    var tipo = comprobar_null(alojamiento,"Tipo");
    var clasif = comprobar_null(alojamiento, "Calidad");
    var tlf = comprobar_null(alojamiento, "Telefono");
    var email = comprobar_null(alojamiento, "Email");
    var url = comprobar_null(alojamiento, "Pagina web");
	var descripcion = comprobar_null(alojamiento, "Descripcion");
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
	// Muestra la información completa del alojamiento
	$('#infoAlojCompleta').html(mostrar_info_completa(alojamiento));
	// Añado el marcador del alojamiento sobre el mapa
	añadir_marcador(alojamiento);
};

// Carga la información de las colecciones
function cargar_colecciones() {
    coleccion_seleccionada = "";
    mostrar_colecciones();
    // Formulario para crear colecciones
    $('#form-nueva-coleccion').html("Nombre: <input type='text' name='nombre_coleccion' "
                                    + "value='' id='nombre_coleccion' size='30' />"
                                    + "<button type='button' id='añadir_coleccion'>Añadir</button>");
    // Handler para crear una nueva coleccion
    $('p#form-nueva-coleccion button#añadir_coleccion').click(añadir_coleccion);
    // Handler para seleccionar una coleccion
    $('.lista-colecciones li').click(seleccionar_coleccion);
}

// Se muestran los botones para cargar y guardar en github y se habilita el handler
function mostrar_botones() {
    $('#botones-github').html("<button type='button' id='guardar'>Guardar</button>"
                              + "<button type='button' id='cargar'>Cargar</button>"
                              + "<div id='token-form'></div>");
    $('button#guardar').click(click_guardar);
    $('button#cargar').click(click_cargar);
}

// Crea una lista de todos los alojamientos y habilita el handler para cuando se haga click
// en cada elemento
function crear_lista_alojamientos() {
    var lista = '<p>Alojamientos encontrados: ' + alojamientos.length + '</p>';
    lista = lista + '<ul>';
	for (var i = 0; i < alojamientos.length; i++) {
	    lista = lista + '<li no=' + i + '>' + alojamientos[i].basicData.title + '</li>';
	}
    lista = lista + '</ul>';
    $('.lista-total').html(lista);
    $('.lista-total li').click(mostrar_alojamiento);
}

/* Carga los alojamientos del fichero alojamientos.json. Muestra una lista con el nombre
   de cada uno de ellos y habilita el handler para clickear sobre ellos. */
function cargar_alojamientos() {
	$.getJSON("JSON/alojamientos.json", function(data) {
		// Reseteo el elemento cargarJSON pues ahora es inútil
		$('#cargarJSON').html('');
		// Guardo en la variable global alojamientos todos los objetos que son alojamientos
		alojamientos = data.serviceList.service;
		// Introduzco en una lista no ordenada el nombre de todos los alojamientos
		crear_lista_alojamientos();
        // Se muestran en la página los botones para cargar y guardar los datos en github
        mostrar_botones();
        // Se cargan todos los campos de las colecciones. Se inicializa la variable global.
        colecciones = [];
        cargar_colecciones();
        // Handler para añadir alojamientos a la coleccion seleccionada
        $('div#colecciones .lista-total li').click(añadir_alojamiento_a_coleccion);
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
