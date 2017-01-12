# X-Nav-Practica-Hoteles
Repositorio para la práctica final de DAT/AT. Curso 2015-2016

## Funcionamiento

Puedes comprobar su funcionamiento pinchando en [este enlace](https://cgonzalezsanc.github.io/X-Nav-Practica-Hoteles/ "Página de ejemplo").

## Criterios de diseño

Por lo general se han utilizado separadores para que cada funcionalidad se diferencie con claridad del resto. Una de las mayores prioridades ha sido que no haya ningún error al extraer la información del JSON, de forma que en el HTML tan sólo se cargue aquella información que aparece en él. Para ello se ha utilizado el manejamiento de excepciones de Javascript y la comprobación del valor de los campos.

La funcionalidad se ha restringido mientras no se haya cargado el JSON. Se muestran todos los campos de la web, pero no se permite cargar ni guardar datos de github, buscar alojamientos ni cargar ni seleccionar colecciones. 

En la pestaña *Principal* se muestra el mapa de Madrid usando *Leaflet*, la lista de todos los alojamientos (o el botón para cargarlos), la lista de alojamientos de la colección seleccionada y la información reducida del alojamiento seleccionado. Cada vez que se pinche en un alojamiento de cualquiera de las dos listas se cargará la información reducida y la información completa en la pestaña *Alojamiento*. En ambas informaciones se muestra un carrusel con las fotos disponibles del lugar. Este carrusel se ha implementado con el plugin *carousel* de Bootstrap. 

En la pestaña *Colecciones* se muestra la lista de colecciones disponibles, la lista de los alojamientos de la colección seleccionada, la lista de todos los alojamientos y un formulario para crear una nueva colección. Las colecciones se seleccionan pinchando en ellas en la lista de colecciones. Una vez seleccionada una colección, los alojamientos se añaden a ella pinchando en la lista de todos los alojamientos. Se pueden cargar colecciones almacenadas en un fichero JSON pinchando en el botón de la esquina superior derecha *Cargar*, y guardar las colecciones creadas con el botón *Guardar*.

## Funcionalidad extra

* Se ha implementado un **buscador** de hoteles por el nombre que diferencia entre mayúsculas y minúsculas.
* Se han utilizado **glyphicons** y el widget **Tooltip** de jQuery UI para mostrar la información de los alojamientos de forma más atractiva.
