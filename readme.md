##  Proyecto de Clase: Sistema de Bienes Raíces
---
<p align="justify">
En este proyecto se pondran en ejemplo practico la cración de APIs propias asi como 
el consumo de API's de Terceros (Gestión de Mapas, envio de correos, Autentificación por Redes Sociales, Gestión de 
Bases de Datos, Gestión de Archivos, Seguridad, Control de sesiones y validaciones). En el contexto real de la compra, venta o renta de propiedades.</p>

---

#### Consideraciones:
<p align="justify">
El proyecto estará basado en una arquitectura SOA (Service Oriented Architecture), el patron de diseño MVC (Model, View, Controler) y servicios API REST, deberá gestionarse debidamente en el uso del control de versiones y ramas progresivas. </p>

---

## Tabla de Secciones:
| No. | Descripción | Potenciador | Estatus |
|---|---|---|---|
| 1. | Configuración inicial del Proyecto (NodeJS) | 2 | ✅ Finalizado |
| 2. | Routing y Requests (Peticiones) | 5 | ✅ Finalizado |
| 3. | Layouts, Template Engines y Tailwind CSS (FrontEnd) | 5 | ✅ Finalizado |
| 4. | Creación de páginas de Login y Creación de usuarios | 6 | ✅ Finalizado |
| 5. | ORM'a y Bases de Datos | 7 | ✅ Finalizado |
| 6. | Insertando Registros en la Tabla Usuarios | 20 | ✅ Finalizado |
| 7. | Implementación de la Funcionalidad (Feature) Recuperación de Contraseña (Password Recovery)| xx | ✅ Finalizado |
| 8. | Autenticación de Usuarios (auth) | xx | ✅ Finalizado |
| 9. | Definición de Clase Propiedades (property) | ❌ | ❌ |
| 10. | Operaciones CRUD (Create, Read, Update, Delete) de las Propiedades | ❌ | ❌ |
| 11. | Protección de Rutas y Validación de de Tokens de Sesión (JWT) | ❌ | ❌ |
| 12. | Añadir imágenes a la propiedad (Gestión de Archivos) | ❌ | ❌ |
| 13. | Elaboración Panel de Administración (Dashboard) | ❌ | ❌ |
| 14. | Formulario de Edición de propiedades | ❌ | ❌ |
| 15. | Formulario de Eliminación de propiedades | ❌ | ❌ |
| 16. | Página de Consulta de la Propiedad | ❌ | ❌ |
| 17. | Implementación del Paginador | ❌ | ❌ |
| 18. | Creando la Página Inicial (index) | ❌ | ❌ |
| 19. | Creando las Páginas de Categorías y Páginas de Eror (404) | ❌ | ❌ |
| 20. | Envío de Email por un formulario de Contacto | ❌ | ❌ |
| 21. | Cambiar el Estatus de una Propiedad | ❌ | ❌ |
| 22. | Barras de Navegación y cierre de Sesión | ❌ | ❌ |
| 23. | Publicación del API y el Frontend | ❌ | ❌ |


## Resultados Obtenidos:
```
Posteriormente se ubicaran imagenes en el proyecto
```

### Creado por:
Carlos Rene Morales Santos - 240221

---

### Examen Unidad 2:

### - TEST 1: Interacción rotativa (Registro,Login y Recuperación):

#### Registro:
![general_view](./images/IntRegistation.png)

#### Login:
![general_view](./images/IntLogin.png)

#### Recuperación:
![general_view](./images/IntRecuperation.png)


### - TEST 2: Registro exitoso de un nuevo usuario:

#### Mensaje de exito:
![general_view](./images/NewUserPage.png)

#### Nuevo Usuario en Base de datos:
![general_view](./images/NewUserDataBase.png)


### - TEST 3: Registro Fallido de un Nuevo Usuario por Formulario mal llenado

#### Usuario Fallido:
![general_view](./images/UserError.png)


### - TEST 4: Registro Fallido por correo duplicado

#### Correo Duplicado:
![general_view](./images/DuplicatedEmail.png)


### - TEST 5: Validación de Usuario por Email

#### Validación enviada al email:
![general_view](./images/MailtrapEmailValidation.png)

#### Validacion:
![general_view](./images/Valitation.png)


### - TEST 6: Actualización exitosa de contraseña de un usuario validado

#### Actualización de contraseña:
![general_view](./images/UpdatePassword.png)
![general_view](./images/UpdatePasswordRedirection.png)


### - TEST 7: Actualización fallida de contraseña de un usuario no validado

#### Usuario no valido:
![general_view](./images/InvalidEmail.png)


### - TEST 8: Actualización fallida de contraseña de un usuario por errores de formulario y token inválido.

#### Token Invalido:
![general_view](./images/InvalidToken.png)


### - TEST 9: Logeo Exitoso del Usuario monstrar página de Mis Propiedades

#### Logueo Exitoso:
![general_view](./images/SuccessfulLogin.png)


### - TEST 10: Bloqueo de cuenta por exceso de intentos fallidos (5 intentos)

#### Bloqueo de cuenta:
![general_view](./images/BlockedAccount.png)

#### Correo de aviso de bloqueo de la cuenta
![general_view](./images/BlockedAccountEmail.png)








