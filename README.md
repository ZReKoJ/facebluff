# FACEBLUFF

### APLICACIONES WEB

### 2018

```
Grado en Ingeniería del Software
Facultad de Informática
```
# Práctica 1: Red social ​​ Facebluff

## Fecha de entrega: pendiente de concretar

## Objetivo

La aplicación web a desarrollar consiste en una red social en la que los distintos usuarios/as intentan
acertar preguntas sobre los gustos e intereses de sus amigos/as con el fin de ganar puntos que les
permitan, posteriormente, subir fotos. Las preguntas que deberán responder los usuarios son de elección
múltiple. Cada pregunta tiene asociada una lista de respuestas, pero esta lista es extensible, de modo que si
un usuario, al contestar una determinada pregunta, considera que ninguna de las respuestas propuestas
coincide con su opinión, puede añadir una respuesta más a la lista de opciones posibles para esa pregunta.
Cada usuario/a de la aplicación posee un perfil con sus datos y, opcionalmente, una imagen a modo de
avatar. Un usuario podrá modificar los datos de su perfil en cualquier momento. Suponemos que el perfil
es público y accesible para cualquier persona que haya ingresado (logueado) en la red. Además, un usuario
puede solicitar la amistad de otro en la red. Si este último acepta, ambos se convierten en amigos, lo que
les permitirá a cada uno de ellos responder preguntas sobre el otro.

## 1. Funcionalidad básica: usuarios y amigos

La parte obligatoria de la práctica implica únicamente la implementación de la funcionalidad básica,
consistente en la gestión de los perfiles de usuario, identificación (login) y salida (logout) del sistema, y las
solicitudes de amistad entre usuarios.
Cada página del sitio web deberá disponer de una lista de enlaces para navegar por el sitio web. Esta lista
variará en función de si el usuario está identificado o no. En el primer caso, deberán aparecer cuatro
enlaces: ​ **[Perfil]** ​​, ​ **[Amigos]** ​​, ​ **[Preguntas]** y ​ **[Desconectar]** junto con la cantidad de puntos del usuario
actualmente identificado (ver figura 3). En caso de no estar identificado, tan solo aparecerán dos enlaces:
**[Entrar]** ​​ y​ **[Nuevo usuario]** ​​(ver figura 1 ​).


```
Figura 1: Página de identificación de usuario
```
### Identificación en la red social

La página principal del sitio web debe contener un formulario que permita a un usuario acceder a ​ _Facebluff_
mediante la introducción de su dirección de correo y su contraseña (ver figura 1 ​). Si los datos son
incorrectos, el sistema volverá a la página de identificación mostrando un mensaje de error. Si los datos son
correctos, el sistema redirigirá a la página de perfil del usuario (ver figura 3).

### Creación de usuarios

La información guardada para cada usuario consiste en: su dirección de correo (que lo identifica
unívocamente), una contraseña, su nombre completo y su género. Opcionalmente, puede incluirse una
imagen de perfil (avatar) y su fecha de nacimiento. Para crear una cuenta, el usuario deberá rellenar un
formulario como el de la figura 2.
La funcionalidad que se describe a continuación solo estará disponible para usuarios identificados.

### Página de perfil de usuario

A esta página se accede tras la identificación, o cada vez que se pulsa el enlace ​ **[Perfil]** de la barra de
navegación. Aquí se debe mostrar el nombre del usuario, su edad, su género, su puntuación y su imagen de
perfil (si la tiene). También existe un botón ​ **[Modificar perfil]** para actualizar los datos del perfil (ver figura
3).

### Modificación de perfil

Al acceder a esta página, aparecerá un formulario similar a la de creación de usuarios, permitiendo
modificar la información del usuario actualmente identificado.


```
Figura 2: Creación de un nuevo perfil de usuario
```
### Vista de amigos

Pulsando en el enlace ​ **[Amigos]** del menú de navegación se accede a una página como la mostrada en la
figura 4. Esta página contiene:
● Una lista con las solicitudes de amistad pendientes. En esta lista se encuentran aquellas personas
que han solicitado ser amigos del usuario actualmente identificado. Este último podrá aceptar o
rechazar cada solicitud haciendo clic en los botones correspondientes. Por otra parte, al hacer clic
en el nombre de cada usuario se accederá a la página con su información de perfil, similar a la de la
figura 3, pero sin el botón de ​ **[Modificar perfil]** ​​.
● Un cuadro de texto para realizar búsquedas de usuarios en la red social a partir de su nombre.
● Un listado con aquellos usuarios que están registrados como amigos del usuario actual. Al igual que
en la lista de solicitudes de amistad, al hacer clic sobre el nombre del usuario debe mostrarse su
información de perfil.

### Búsqueda de usuarios por nombre

En la vista de ​ **[Amigos]** (figura 4), al rellenar el cuadro de texto de búsqueda por nombre y hacer clic en el
botón ​ **[Buscar]** ​​, deberá aparecer un listado de aquellos usuarios cuyo nombre contenga la cadena
introducida en el formulario (figura 5). Al lado de cada uno de estos usuarios debe existir un botón
**[Solicitar amistad]** que permita al usuario actualmente identificado enviar una solicitud de amistad al
usuario seleccionado.


```
Figura 3: Página de perfil de usuario.
```
### Envío, aceptación y rechazo de solicitudes de amistad

El envío de solicitudes de amistad se realiza en la página de búsqueda, como se ha explicado
anteriormente. La aceptación y rechazo de solicitudes de amistad se realizan en la vista de ​ **[Amigos]** ​​.

### Desconexión (logout)

Al pulsar sobre el enlace ​ **[Desconectar]** del menú de navegación, se volverá a la página inicial de
identi1cación del usuario (ver figura 1​).

## 2. Crear y responder preguntas

La primera extensión opcional de la práctica comprende la incorporación de preguntas a la base de datos, y
la implementación de la funcionalidad relativa a responder preguntas. Antes de entrar en detalles,
aclaremos un poco la terminología. Decimos que un usuario responde a un pregunta para sí mismo cuando
selecciona una de las opciones asociadas a dicha pregunta atendiendo a su propio criterio y opinión. Por
otro lado, decimos que un usuario X responde a una pregunta en nombre de otro usuario Y cuando X
selecciona una de las opciones de dicha pregunta basándose la opinión de Y. Es decir, X intenta adivinar la
opción que Y había seleccionado previamente al responder este último la pregunta.
En esta parte de la práctica nos centraremos exclusivamente en permitir que un usuario responda una
pregunta para sí mismo.


Figura 4: Página de amigos y solicitudes de amistad
Figura 5: Búsqueda de usuarios


Al hacer clic en la opción ​ **[Preguntas]** ​​ del menú de navegación debe aparecer una página como la mostrada
en la figura 6. Esta página está formada por dos secciones. Una de ellas contiene una selección aleatoria de
cinco preguntas existentes en la base de datos. Al hacer clic en una de ellas se mostrará la vista de
pregunta, que se describe más adelante. La otra sección de la página contiene un botón ​ **[Crear nueva
pregunta]** ​​.
La funcionalidad a implementar es la siguiente:

### Añadir una pregunta a la base de datos

Al pulsar el botón ​ **[Crear nueva pregunta]** aparecerá una página con un formulario que permita introducir
el enunciado de la pregunta junto un conjunto inicial de opciones. La introducción de estas opciones queda
a tu elección. Por ejemplo, puedes hacer que el usuario rellene un ​ **\<textarea\>** con las distintas opciones
(una por línea).

### Seleccionar una de las preguntas de la selección aleatoria mencionada anteriormente

Al hacer esto se muestra una página como la de la figura 7. En este punto de la práctica tan solo has de
implementar la funcionalidad del botón ​ **[Contestar pregunta]** ​​, ignorando la lista de amigos que aparece en
la parte inferior.

### Responder una pregunta para sí mismo

El botón ​ **[Contestar pregunta]** lleva a una página que contiene la lista para que el usuario actual seleccione,
de entre todas las opciones asociadas a la pregunta, aquella que concuerde más con su opinión. Si ninguna
de las opciones es adecuada, el usuario puede introducir una nueva opción en un cuadro de texto (ver
figura 8).


```
Figura 6: Listado aleatorio de preguntas.
Figura 7: Vista de pregunta.
```
## 3. Responder una pregunta en nombre de otro usuario

En esta extensión se completa la funcionalidad relativa a las preguntas. Para ello se permitirá que un
usuario pueda responder a una determinada pregunta en nombre de un amigo para obtener puntos.
Volviendo a la vista de pregunta mostrada en la figura 7, se completará esta página añadiendo aquellos
amigos del usuario actual que han contestado la pregunta. Al lado de cada uno de ellos existe un botón
**[Adivinar]** que permitirá al usuario actual responder la pregunta en nombre del amigo seleccionado. Si el
usuario actual ya había respondido previamente en nombre de dicho amigo, en lugar del botón ​ **[Adivinar]**
se indicará si el usuario había acertado la pregunta para ese amigo (es decir, si al responder en su nombre,
había seleccionado la misma opción que éste) o, por el contrario, la había fallado.
Al seleccionar la opción ​ **[Adivinar]** ​​para un determinado usuario Z, se muestra una página para que el
usuario actual intente adivinar la opción que había marcado Z. Al contrario que en la figura 8, aquí no hay
ningún cuadro de texto para añadir opciones. Además, no deben mostrarse todas las opciones asociadas a
la pregunta, sino un subconjunto aleatorio de estas, entre las que que se ha de incluir necesariamente


la opción correcta (es decir, la seleccionada previamente por el usuario Z). Este subconjunto tendrá tantos
elementos como opciones tiene la pregunta en el momento en que se creó. Por ejemplo, en la pregunta de

### la figura cuyo enunciado es ​ ¿Nintendo Switch, PS ​ , o Xbox One? había inicialmente cuatro opciones:

### Nintendo Switch, PS ​ , Xbox One y No me interesan los videojuegos ​. Si posteriormente se añadieron más

opciones para esta pregunta, a la hora de responder en nombre de otro usuario sólo deben aparecer cuatro
posibilidades, la que seleccionó el usuario Z junto con otras tres seleccionadas aleatoriamente.
Si el usuario actual ha acertado la pregunta, su puntuación se incrementará en 50 ​ puntos. En caso
contrario, su puntuación no se modificará.
Figura 8: Responder una pregunta para sí mismo

## 4. Subida y visualización de fotos

## ​​

En esta parte de la práctica se implementa la funcionalidad relativa a la subida y visualización de fotos
por parte del usuario. Cada foto debe ir acompañada por una descripción.

### Visualización de fotos

La página de perfil de un usuario (figura 3 ​) debe extenderse para incluir las fotos que dicho usuario haya
subido previamente. Esto se aplica tanto si el usuario está visitando su propio perfil como si está visitando
el perfil de otra persona.

### Subida de fotos


Cuando el usuario visita su propio perfil, la página ha de contener un formulario al lado del botón
**[Modificar Perfil]** que sirva para añadir una imagen a la base de datos. Al hacerlo, su puntuación se
decrementará en ​​​100 puntos.
Figura 9: Responder una pregunta en nombre de un amigo.

## 5. Notificaciones de respuestas

El objetivo de esta parte consiste en ampliar la página que aparece cada vez que un usuario se identifica en
el sistema. En esta página han de aparecer aquellas preguntas que otros amigos del usuario han respondido
en su nombre. Por ejemplo, si X responde una pregunta en nombre de Y , cuando Y vuelva a loguearse en la
red social, le aparecerá una notificación diciendo que X ha acertado o fallado una determinada pregunta,
indicando el enunciado de la pregunta, la opción correcta (marcada por Y ), y la opción que X había
seleccionado.


## Desarrollo y evaluación de la práctica

El peso de esta práctica es del 65% sobre la puntuación de las prácticas que consta en el campus virtual.
El alumno debe demostrar en el desarrollo de esta práctica las siguientes competencias:

● Diseño de páginas web mediante HTML y CSS. (Tema 2).

● Implementación de un servidor web utilizando Node y Express.js (Temas 3, 4, 5, y 6).

### Esta práctica contiene cinco apartados, de los cuales el primero (​ Funcionalidad básica:usuarios y amigos ​) es

obligatorio​. Entregando solamente este apartado la calificación máxima obtenible es de APTO con 4 sobre
10 ​​. Si se desea obtener una calificación mayor se deberán realizar extensiones opcionales de la práctica. La
calificación máxima variará en función de las extensiones implementadas según se describe a continuación.

● Apartado 1: Calificación máxima de 4/

● Apartados 1 y 2: Calificación máxima de 6/​ 10

● Apartados 1, 2 y 3: Calificación máxima de 8/

● Apartados 1, 2, 3 y 4: Calificación máxima de 10/

● Apartados 1, 2, 3 y 5: Calificación máxima de 10/

Como puede observarse en la lista anterior, NO es necesario hacer los cinco apartados para obtener la
calificación máxima de 10/10. Se debe elegir entre el apartado 4 y el 5 (además de implementar los tres
primeros).
Se recuerda que la ausencia de entregas, o la entrega de una práctica total o parcialmente copiada
conllevará la calificación de NO APTO no recuperable. Los casos de copia serán tratados de acuerdo a la
normativa de la FdI.
En la corrección se valorará:

● El correcto funcionamiento de la aplicación web, incluyendo la validación de formularios.

● El correcto uso de Express.js para estructurar adecuadamente la cadena de peticiones al servidor.

● El diseño de la página web. Las capturas de pantalla proporcionadas en este enunciado se deben
considerar como un mero ejemplo de presentación. Cada grupo deberá realizar su propio diseño,
que será valorado en cuanto a su usabilidad y al correcto uso de las propiedades CSS.

● El correcto diseño de la base de datos, que ha de ser relacional.

### En esta práctica no está permitido utilizar ​ Bootstrap ni ​ jQuery ​, ni tecnologías similares del lado del cliente,

pues éstas son objeto de la práctica 2. Por el mismo motivo, no está permitido utilizar Javascript en el lado
del cliente, es decir, no se debe incluir ninguna etiqueta <script> en las páginas HTML.
Con antelación suficiente a la fecha límite de entrega se publicará en el Campus Virtual un documento
indicando los requisitos y procedimientos de entrega.


