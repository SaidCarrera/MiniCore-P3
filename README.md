# Este proyecto es un sistema de gestión de gastos desarrollado utilizando MongoDB, Angular y Node.js. El sistema está diseñado para ayudar a las organizaciones a gestionar y visualizar los gastos de diferentes departamentos de manera eficiente. Proporciona una interfaz intuitiva para agregar, visualizar y analizar los gastos, así como un backend robusto para manejar la lógica y la base de datos.

# Estructura del Proyecto

El proyecto está dividido en tres componentes principales:

Backend (Node.js): Maneja la lógica del servidor, las conexiones a la base de datos y las API RESTful.
Frontend (Angular): Proporciona la interfaz de usuario para interactuar con el sistema.
Base de Datos (MongoDB): Almacena la información de los gastos, empleados y departamentos.
# Características

Dashboard de Gastos por Departamento: Muestra los gastos totales por departamento en una tabla, permitiendo una rápida visualización de los gastos acumulados.
Lista de Gastos: Permite ver un listado detallado de todos los gastos registrados, incluyendo fecha, descripción, monto, ID del empleado y ID del departamento.
Agregar Nuevo Gasto: Proporciona un formulario para agregar nuevos gastos al sistema, facilitando la actualización de la base de datos.
Filtrado y Búsqueda: Permite filtrar y buscar gastos por fecha, descripción, empleado o departamento.
Instalación

# Requisitos Previos

Node.js: Asegúrate de tener Node.js instalado en tu sistema.
MongoDB: Debes tener MongoDB instalado y en ejecución.
Angular CLI: Necesitarás Angular CLI para ejecutar el frontend.
Pasos para la Instalación

Clonar el Repositorio:
bash
Copy
git clone 
cd expense-management-system
Instalar Dependencias:
Backend:
bash
Copy
cd backend
npm install
Frontend:
bash
Copy
cd ../frontend
npm install
Configurar MongoDB:
Asegúrate de tener MongoDB instalado y en ejecución.
Configura la conexión a la base de datos en el archivo backend/config/db.js.
Ejecutar el Proyecto:
Backend:
bash
Copy
cd backend
npm start
Frontend:
bash
Copy
cd ../frontend
ng serve
Acceder al Sistema:
Abre tu navegador y visita http://localhost:4200.
Uso

# Dashboard

El dashboard proporciona una visión general de los gastos por departamento. Puedes ver rápidamente cuánto ha gastado cada departamento en un período determinado.
<img width="1270" alt="Captura de pantalla 2025-01-31 a la(s) 12 16 09 a  m" src="https://github.com/user-attachments/assets/1fa7ba05-809c-4b81-af94-dc24a5cc8372" />

# Lista de Gastos
<img width="1280" alt="Captura de pantalla 2025-01-31 a la(s) 12 17 43 a  m" src="https://github.com/user-attachments/assets/fb124d65-8280-4959-852f-95647de3d9c3" />

La lista de gastos muestra todos los gastos registrados en el sistema. Puedes filtrar los gastos por fecha, descripción, empleado o departamento para encontrar la información que necesitas.

# Agregar Nuevo Gasto
<img width="758" alt="Captura de pantalla 2025-01-31 a la(s) 12 17 17 a  m" src="https://github.com/user-attachments/assets/ca316bf2-a23d-4439-afd8-c87eb531cc74" />

Para agregar un nuevo gasto, completa el formulario proporcionado. Asegúrate de incluir la fecha, descripción, monto, ID del empleado y ID del departamento.

# Tecnologías Utilizadas

MongoDB: Base de datos NoSQL para almacenar la información de manera flexible y escalable.
Angular: Framework frontend para construir una interfaz de usuario dinámica y responsive.
Node.js: Entorno de ejecución para el backend, permitiendo un manejo eficiente de las solicitudes y respuestas.
Express: Framework para construir las API RESTful que conectan el frontend con la base de datos.
Contribución


# Contacto

Si tienes alguna pregunta o necesitas más información, no dudes en contactarme

Email: jose.carrera.montesdeoca@udla.edu.ec
