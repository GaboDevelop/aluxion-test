##Instalación del proyecto Aluxion NestJS
###Opción 1: Instalación normal

#### Instalar Node.js y NPM

Descarga e instala Node.js desde la página oficial: https://nodejs.org/en
Verifica que tengas NPM instalado ejecutando el comando npm -v en tu terminal.
#####Clonar el proyecto

Clona el proyecto desde GitHub usando el comando git clone

#####Instalar dependencias

Navega a la carpeta del proyecto y ejecuta el comando npm install.

##### Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto.
Copia las variables de entorno del archivo env al nuevo archivo .env.
Modifica los valores de las variables según tu configuración. Necesitas tener rellenar variables referente a:

- credenciales de servidor SMTP
- credenciales de unsplsh
- credenciales de base de datos
- credenciales de S3 bucket

##### Iniciar la aplicación

Ejecuta el comando npm start para iniciar la aplicación en el puerto 3000.

### Instalación con Docker (con Node y PostgreSQL)
#### 1. Instalar Docker

Descarga e instala Docker desde la página oficial: https://www.docker.com/

#### 2. Construir la imagen Docker

Ejecuta el comando docker build -t nestjs-app . en la terminal.

#### 3. Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto.
Copia las variables de entorno del archivo env al nuevo archivo .env.
Modifica los valores de las variables según tu configuración.

#### 4. Iniciar la aplicación con Docker Compose

Ejecuta el comando docker-compose up.
 