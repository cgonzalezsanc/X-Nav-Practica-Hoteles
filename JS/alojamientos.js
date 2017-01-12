// ----------------------------------------GITHUB--------------------------------------------

// Comprueba que el token sea correcto y guarda los datos en el fichero y repositorio indicados
function guardar_datos() {
    // Extraigo los datos de los campos
    var token = $("#token").val();
    var repo_name = 'X-Nav-Practica-Hoteles';
    var fichero = 'datos.json';
    // Quito el formulario
    $('#token-form').remove();
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
            alert(error);
        } else {
            var contenido = JSON.stringify(colecciones);
            repositorio.write('master', fichero, contenido,
                "Actualizando datos", function(err) {
                    if (err == null) {
                        alert("Éxito al guardar");
                    } else {
                        alert(err);
                    }
                });
        }  
    });
}

// Comprueba que el token sea correcto y carga los datos del fichero y repositorio indicados
function cargar_datos() {
    var token = $("#token").val();
    var repo_name = 'X-Nav-Practica-Hoteles';
    var fichero = 'datos.json';
    // Quito el formulario
    $('#token-form').remove();  
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
            alert(error);
        } else {
            repositorio.read('master', fichero, function(err, data) {
                    colecciones = JSON.parse(data);
                    // Se cargan todos los campos de las colecciones
                    mostrar_colecciones();
                    alert("Éxito al cargar");
            });
        }  
    });
}

/* Muestra el formulario para introducir el token, el nombre del repositorio y el nombre del 
   fichero, y habilita el handler para guardar los datos */
function form_guardar() {
    $('#token-form').remove();
    $('#principal').before("<div id='token-form'>"
                          + "<h3>Guardar datos en Github</h3>"
                          + "<input type='text' name='token' value='' id='token' placeholder='Token'"
                          + "size='36' />"
                          + "<button type='button' id='guardar-github'><span class='glyphicon glyphicon-upload'>"
                          + "</span></button></div>");
    $("div#token-form button#guardar-github").click(guardar_datos);
}

/* Muestra el formulario para introducir el token y habilita el handler para guardar los datos */
function form_cargar() {
    $('#token-form').remove();
    $('#principal').before("<div id='token-form'>"
                          + "<h3>Cargar datos de Github</h3>"
                          + "<input type='text' name='token' value='' id='token' placeholder='Token'"
                          + "size='36' />"
                          + "<button type='button' id='cargar-github'><span class='glyphicon glyphicon-download'>"
                          + "</span></button></div>");
    $("div#token-form button#cargar-github").click(cargar_datos);
}

// Se activan los botones para cargar y guardar en github y se habilita un handler para cambiar el cursor
function activar_botones_github() {
    $('#boton-guardar').click(form_guardar);
    $('#boton-cargar').click(form_cargar);
    $('#boton-guardar, #boton-cargar').hover(function() {
        $(this).css('cursor','pointer');
    });
}

// --------------------------------------COLECCIONES-------------------------------------------

// Muestra la lista de alojamientos de una coleccion
function mostrar_alojamientos_coleccion(coleccion) {
    var lista = "<h3>Alojamientos de la colección seleccionada</h3>"
    if (coleccion_seleccionada != null) {
        lista = lista + "<p>Lista de alojamientos de la colección " + coleccion.nombre + ":</p>";
        if (coleccion.lista_alojamientos.length == 0) {
            lista = lista + "Todavía no se han añadido alojamientos. Pincha en el que desees añadir para agregarlo.";
        } else {
            lista = lista + '<ul class="lista">';
            for (var i=0; i<coleccion.lista_alojamientos.length; i++) {
                var id = coleccion.lista_alojamientos[i];
                lista = lista + '<li no=' + id + '>' + alojamientos[id].basicData.title + '</li>';
            }
            lista = lista + "</ul>";
        }
    } else {
        lista = lista + "<p>No se ha seleccionado ninguna colección</p>";
    }
    $('.alojamientos-coleccion').html(lista);
    // Habilito que se pueda seleccionar un alojamiento desde esta lista
    $('.alojamientos-coleccion li').click(mostrar_alojamiento);
    $('.alojamientos-coleccion li').hover(function() {
        $(this).css({'cursor': 'pointer', 'background': '#E8E8E8'});
    }, function() {
        $(this).css('background', 'white');
    });
}

// Añade un alojamiento a la colección seleccionada
function añadir_alojamiento_a_coleccion() {
    if (coleccion_seleccionada != null) {
        // Guardo el identificador en la coleccion si aún no está
        if (coleccion_seleccionada.lista_alojamientos.indexOf($(this).attr('no')) == -1) {
            coleccion_seleccionada.lista_alojamientos.push($(this).attr('no'));
            // Actualizo el HTML de la lista de los alojamientos de una coleccion
            mostrar_alojamientos_coleccion(coleccion_seleccionada);
        }
    }
}

// Cuando se selecciona una coleccion se muestra la lista de sus alojamientos
function seleccionar_coleccion() {
    var coleccion = colecciones[$(this).attr('no')];
    coleccion_seleccionada = coleccion;
    mostrar_alojamientos_coleccion(coleccion);
}

// Comprueba si existe el nombre de una colección
function nombre_coleccion_repetido(nombre) {
    encontrado = false;
    for (var i=0; i < colecciones.length; i++) {
        if (nombre == colecciones[i].nombre) {
            encontrado = true;
            break;
        }
    }
    return encontrado;
}

// Crea una colección y la añade a la lista de colecciones si el nombre no está repetido
function añadir_coleccion() {
    var nombreColeccion = $("input#nombre_coleccion").val();
    if (!nombre_coleccion_repetido(nombreColeccion)) {
        var coleccion = {nombre:nombreColeccion, lista_alojamientos:[]};
        colecciones.push(coleccion);
        // Refresco la informacion del HTML
        mostrar_colecciones();
    } else {
        alert("Nombre de colección repetido");
    }
    // Elimino el contenido del formulario
    $("input#nombre_coleccion").val("")
}

// Muestra todas las colecciones creadas
function mostrar_colecciones() {
    var lista = "<h3>Colecciones creadas</h3>";
    if (colecciones.length == 0) {
        lista = lista + "<p>Todavía no hay colecciones creadas.</p>" 
                + "<p>Puedes cargar colecciones pinchando Cargar en la esquina superior derecha.</p>"
    } else {
        lista = lista + '<p>Selecciona una colección haciendo click en ella</p> <ul class="lista">';
        for (var i=0; i<colecciones.length; i++) {
            lista = lista + '<li no=' + i + '>' + colecciones[i].nombre + '</li>';
        }
        lista = lista + "</ul>";
    }
    $('.colecciones').html(lista);
    if (alojamientos != null) {
        // Handler para seleccionar una coleccion
        $('.colecciones li').click(seleccionar_coleccion);
        $('.colecciones li').hover(function() {
            $(this).css({'cursor': 'pointer', 'background': '#E8E8E8'});
        }, function() {
            $(this).css('background', 'white');
        });
    }
}

// Muestra el formulario para crear colecciones
function mostrar_formulario_añadir_colecc() {
    txt = "<h3>Crea una nueva colección</h3>"
          + "<input type='text' name='nombre_coleccion' placeholder='Nombre' "
          + "value='' id='nombre_coleccion' size='30' />"
          + "<button type='button' id='añadir_coleccion'><span class='glyphicon glyphicon-plus'></span></button>";
    $('#nueva-coleccion').html(txt);
}

// Carga la interfaz de las colecciones
function mostrar_interfaz_colecciones() {
    colecciones = [];
    coleccion_seleccionada = null;
    mostrar_colecciones();
    mostrar_alojamientos_coleccion();
    mostrar_formulario_añadir_colecc();
    if (alojamientos != null) {
        // Handler para crear una nueva coleccion
        $('#nueva-coleccion button#añadir_coleccion').click(añadir_coleccion);
        // Handler para añadir alojamientos a la coleccion seleccionada
        $('div#colecciones .alojamientos li').click(añadir_alojamiento_a_coleccion);
    }
}


// --------------------------------------INFO ALOJAMIENTOS------------------------------------------

// Genera el HTML de los indicadores del carrusel
function indicadores_carrusel(media) {
    var txt = '<ol class="carousel-indicators">';
    for (var i=0; i<media.length; i++) {
        txt = txt + '<li data-target=".carousel" data-slide-to="' + i.toString() + '"';
        if (i == 0) {
            txt = txt + ' class="active"';
        }
        txt = txt + '></li>';
    }
    return txt + '</ol>';
}

// Genera el HTML que añade las fotos al carrusel
function fotos_carrusel(media) {
    var txt = '<div class="carousel-inner" role="listbox">'
    for (var i=0; i<media.length; i++) {
        txt = txt + '<div class="item';
        if (i == 0) {
            txt = txt + ' active';
        }
        txt = txt + '">'
              + '<img class="img-responsive center-block" src="' + media[i].url 
              + '" alt="' + i.toString() + '">' + '</div>';
    }
    return txt + '</div>'
}

// Genera los controles del carrusel
function controles_carrusel() {
    return '<a class="left carousel-control" href=".carousel" role="button" data-slide="prev"> \
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> \
        <span class="sr-only">Previous</span> \
    </a> \
    <a class="right carousel-control" href=".carousel" role="button" data-slide="next"> \
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> \
        <span class="sr-only">Next</span> \
    </a>'
}

// Devuelve las urls de las fotos como un carrusel de bootstrap
function insertar_fotos(multimedia) {
    var carrusel = '</p><p>';
    var media = multimedia.media;
    if (media.length > 0) {
        carrusel = carrusel + '<div class="carousel" class="carousel slide" data-ride="carousel"' 
                   + 'data-interval="5000">' + indicadores_carrusel(media) + fotos_carrusel(media) 
	               + controles_carrusel() + '</div>';
    } else {
        carrusel = "";
    }
    return carrusel;
}

/* Comprueba si un elemento del alojamiento es null. Devuelve un texto en formato HTML
   indicando el resultado. El try comprueba si el elemento existe, y el if si es null */
function comprobar_null(alojamiento, tipo) {
    var txt = "<p>";
    switch (tipo) {
        case "Direccion":
            txt = txt + '<span data-toggle="tooltip" data-original-title="Dirección"'
                  + ' class="glyphicon glyphicon-globe"></span> '
            try {
                if (alojamiento.geoData.address != null) {
                    txt = txt + alojamiento.geoData.address + '</p>';
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Descripcion":
            try {
                if (alojamiento.basicData.body != null) {
                    txt = '<div style="text-align:justify">'
                          + alojamiento.basicData.body + '</div>';
                } else {
                    txt = "<p>Descripción no disponible</p>";
                }
            } catch (e) {
                txt = "<p>Descripción no disponible</p>";
            }
            break;
        case "Latitud":
            try {
                if (alojamiento.geoData.latitude != null) {
                    txt = alojamiento.geoData.latitude;
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Longitud":
            try {
                if (alojamiento.geoData.longitude != null) {
                    txt = alojamiento.geoData.longitude;
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Tipo":
            try {
                if (alojamiento.extradata.categorias.categoria.item[1]['#text'] != null) {
                    txt = alojamiento.extradata.categorias.categoria.item[1]['#text'];
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Calidad":
            txt = txt + '<span data-toggle="tooltip" data-original-title="Estrellas"'
                  + ' class="glyphicon glyphicon-star"></span> '
            try {
                if (alojamiento.extradata.categorias.categoria
                    .subcategorias.subcategoria.item[1]['#text'] != null) {
                    txt = txt + alojamiento.extradata.categorias.categoria
                                .subcategorias.subcategoria.item[1]['#text'] + '</p>';
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Telefono":
            txt = txt + '<span data-toggle="tooltip" data-original-title="Teléfono"'
                  + ' class="glyphicon glyphicon-earphone"></span> '
            try {
                if (alojamiento.basicData.phone != null) {
                    txt = txt + alojamiento.basicData.phone + '</p>';
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Email":
            txt = txt + '<span data-toggle="tooltip" data-original-title="Email"'
                  + ' class="glyphicon glyphicon-envelope"></span> '
            try {
                if (alojamiento.basicData.email != null) {
                    txt = txt + alojamiento.basicData.email + '</p>';
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Pagina web":
            txt = txt + '<span data-toggle="tooltip" data-original-title="Página web"'
                  + ' class="glyphicon glyphicon-link"></span> '
            try {
                if (alojamiento.basicData.web != null) {
                    url = alojamiento.basicData.web
                    txt = txt + '<a href="' + url + '" style="color:#23527c;">' + url
                          + '</a></p>';
                } else {
                    txt = "";
                }
            } catch (e) {
                txt = "";
            }
            break;
        case "Fotos":
            try {
                txt = insertar_fotos(alojamiento.multimedia);
            } catch (e) {
                txt = "";
            }
            break;
        default:
            txt = "Campo erróneo";
    }
    return txt;
}

/* Muestra la siguiente información del alojamiento en formato HTML:
		- Nombre
		- Dirección
		- Descripción
		- Carrusel con fotos
*/
function info_reducida(alojamiento) {
	var nombre = alojamiento.basicData.name;
	var direccion = comprobar_null(alojamiento, "Direccion");
	var descripcion = comprobar_null(alojamiento, "Descripcion");
    var fotos = comprobar_null(alojamiento, "Fotos");
	var infoReducida = '<h2>' + nombre + '</h2>'
                      + '<div class="col-md-7">'
                      + descripcion + '<br>'
			          + direccion
                      + '</div><div class="col-md-5">'
                      + fotos 
                      + '</div>'
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
function info_completa(alojamiento) {
    if (alojamiento != null) {
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
        var fotos = comprobar_null(alojamiento, "Fotos");
	    var infoCompleta = '<h2>' + nombre + '</h2>'
                           + '<h3>Descripcion</h3>'
                           + descripcion + '<br>'
                           + '<p>' + '<span data-toggle="tooltip" data-original-title="Coordenadas GPS"'
                           + ' class="glyphicon glyphicon-map-marker"></span> '
                           + lat + 'W, ' + lon + 'N</p>'
			               + direccion
                           + clasif
                           + tlf
                           + email
                           + url
                           + '<h3>Fotos</h3>'
                           + fotos 
    } else {
        var infoCompleta = '<h2>Alojamiento</h2>'
                           + '<p>Aquí se mostrará la información del alojamiento \
                            elegido</p>'
    }
	return infoCompleta;
}

// Se añade un marcador en el alojamiento y se centra el mapa sobre él
function añadir_marcador(alojamiento) {
 	var lat = alojamiento.geoData.latitude;
	var lon = alojamiento.geoData.longitude;
	var url = alojamiento.basicData.web;
	var nombre = alojamiento.basicData.name;
	L.marker([lat, lon]).addTo(map)
	 .bindPopup('<a href="' + url + '">' + nombre + '</a><br/>')
	 .openPopup()
     .on('click', function() {
        // Cuando se hace click se muestra la informacion
        $('.info-aloj-reducida').html(info_reducida(alojamiento));
	    $('#info-aloj-completa').html(info_completa(alojamiento));
     });
	map.setView([lat, lon], 15);
}

/* Muestra la información del alojamiento en las pestañas correspondientes y 
   el marcador sobre el mapa */
function mostrar_alojamiento() {
	// Me quedo con el objeto correspondiente a este alojamiento a partir del
	// atributo del elemento seleccionado
 	var alojamiento = alojamientos[$(this).attr('no')];
	$('.info-aloj-reducida').html(info_reducida(alojamiento));
	$('#info-aloj-completa').html(info_completa(alojamiento));
    // Activo los tooltip
    $('[data-toggle="tooltip"]').tooltip();
	añadir_marcador(alojamiento);
};

// Crea una lista de todos los alojamientos y habilita el handler para cuando se haga click
// en cada elemento
function mostrar_alojamientos() {
    var lista = '<h3>Alojamientos</h3>';
    if (alojamientos != null) {
        lista = lista + '<p>Se han encontrado ' + alojamientos.length + ' alojamientos:</p>';
        lista = lista + '<ul class="lista">';
	    for (var i = 0; i < alojamientos.length; i++) {
	        lista = lista + '<li no=' + i + '>' + alojamientos[i].basicData.title + '</li>';
	    }
        lista = lista + '</ul>';
        $('.alojamientos').html(lista);
        $('.alojamientos li').click(mostrar_alojamiento);
        $('.alojamientos li').hover(function() {
            $(this).css({'cursor': 'pointer', 'background': '#E8E8E8'});
        }, function() {
            $(this).css('background', 'white');
        });
    } else {
        lista = lista + '<p>La funcionalidad está restringida si no cargas los alojamientos.</p>'
                + '<button type="button" class="cargarJSON">Cargar Alojamientos</button>'
        $('.alojamientos').html(lista);
    }
}

// ----------------------------------------BUSCAR--------------------------------------------

// Busca un alojamiento que contenga la cadena introducida por el usuario en el form_buscar
function buscar_alojamientos() {
    var txt = $("#form_buscar").val();
    var lista = '<ul class="lista">';
    var contador = 0;
    for (i = 0; i < alojamientos.length; i++) {
        if (alojamientos[i].basicData.title.toLowerCase().includes(txt.toLowerCase())) {
            lista = lista + '<li no=' + i + '>' + alojamientos[i].basicData.title + '</li>';
            contador = contador+1;
        }
    }
    lista = "<p>Se han encontrado " + contador.toString() + " alojamientos</p>" + lista;
    lista = lista + '</ul>';
    $("#lista-filtrada").html(lista);
    $('#lista-filtrada li').click(mostrar_alojamiento);
    $('#lista-filtrada li').hover(function() {
        $(this).css({'cursor': 'pointer', 'background': '#E8E8E8'});
    }, function() {
        $(this).css('background', 'white');
    });
}

// Muestra la interfaz del buscador y habilita el handler para buscar cuando se hayan cargado los alojamientos
function mostrar_buscador() {
    var txt = "<h3>Buscar alojamiento</h3>"
              + "<p>Introduce el alojamiento que quieres buscar.</p><br>";
    if (alojamientos == null) {
        txt = txt + "<p>Debes cargar los alojamientos.</p>"
        $("#buscador").html(txt);
    } else {
        txt = txt + "<input type='text' name='form_buscar' placeholder='Ej: Atocha, Moncloa...' "
              + "value='' id='form_buscar' size='30' />"
              + "<button type='button' id='buscar'><span class='glyphicon glyphicon-search'></span></button>";
        $("#buscador").html(txt);
        $('button#buscar').click(buscar_alojamientos);
    }
    $("#alojamientos-encontrados").html("<h3>Alojamientos encontrados</h3>"
                                        + "<p id='lista-filtrada'>Aquí se mostrarán los resultados</p>");
}


// ----------------------------------------GENERAL--------------------------------------------

/* Carga los alojamientos del fichero alojamientos.json. Se genera una lista con todos ellos,
   se activan los botones para cargar y guardar la información y se carga la interfaz de las
   colecciones y del buscador */
function cargar_alojamientos() {
	$.getJSON("JSON/alojamientos.json", function(data) {
		alojamientos = data.serviceList.service; /* Guardo en la variable global alojamientos todos
                                                    los objetos que son alojamientos */
		mostrar_alojamientos();
        activar_botones_github();
        mostrar_interfaz_colecciones();
        mostrar_buscador();
	});
};

// La ejecución del programa comienza aquí
$(document).ready(function() {
	// Método para declarar que el elemento pestañas sea gestionado como tabs
	$("#pestañas").tabs();

	// Inicializo el mapa en la variable map, selecciono sus coordenadas centrales y el nivel de zoom
	map = L.map('mapa').setView([40.4175, -3.708], 11);
	// Añado a map la capa de teselas extraida de OpenStreetMap
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

    // Inicializo la variable global alojamientos a null
    alojamientos = null;
    // Cargo la información de las pestañas
    mostrar_alojamientos();
    mostrar_interfaz_colecciones();
    mostrar_buscador();
    $('#info-aloj-completa').html(info_completa(null));
    
	/* Habilito el handler para que cuando se haga click en el elemento cargarJSON se carguen los
	   alojamientos */
	$(".cargarJSON").click(cargar_alojamientos);
});
