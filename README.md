# TPS Perfumes - Catálogo Web

Sistema de catálogo web para gestión y visualización de productos de perfumes con panel de administración integrado.

## Descripción

Catálogo web responsive que permite la visualización de productos con funcionalidades de búsqueda, filtrado y gestión administrativa completa mediante panel de control.

## Características

- Catálogo público con búsqueda y filtrado por categorías
- Panel de administración con autenticación
- Gestión completa de productos (CRUD)
- Gestión de categorías
- Sistema de precios minoristas y mayoristas
- Almacenamiento de datos en localStorage
- Diseño responsive para dispositivos móviles, tablets y desktop
- Integración con WhatsApp para contacto directo

## Estructura del Proyecto

```
GESTION BRANKO/
├── index.html              # Catálogo público
├── styles.css              # Estilos del catálogo
├── script.js               # Lógica del catálogo
├── data-manager.js         # Gestión de datos (JSON/localStorage)
├── logo.png                # Logo de la empresa
├── Lista de Productos.csv  # Base de datos inicial
├── admin/
│   ├── admin.html          # Panel de administración
│   ├── admin.css           # Estilos del panel
│   ├── admin.js            # Lógica del panel
│   └── auth.js             # Sistema de autenticación
├── package.json            # Configuración del proyecto
├── .htaccess              # Configuración Apache
├── nginx.conf              # Configuración Nginx
└── install.sh             # Script de instalación
```

## Instalación

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación Local

1. Descargar o clonar el proyecto
2. Colocar el archivo `logo.png` en la raíz del proyecto
3. Abrir `index.html` en el navegador

### Servidor de Desarrollo (Opcional)

```bash
# Node.js
npx http-server

# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000
```

## Uso

### Catálogo Público

Acceder a `index.html` para visualizar el catálogo de productos. Los usuarios pueden:

- Buscar productos por nombre
- Filtrar por categorías (Masculinos, Femeninos, Unisex, Victoria Secret)
- Ver detalles de productos en modal
- Contactar vía WhatsApp

### Panel de Administración

Acceder a `admin/admin.html` para gestionar productos y categorías.

**Credenciales de acceso:**
- Usuario: `admin`
- Contraseña: `Todoperfumes123`

**Funcionalidades del panel:**
- Crear, editar y eliminar productos
- Gestionar imágenes de productos
- Crear, editar y eliminar categorías
- Visualizar estadísticas del catálogo
- Dashboard con información resumida

## Sistema de Datos

Los datos se almacenan en localStorage del navegador en formato JSON. Al cargar por primera vez, el sistema migra automáticamente los datos del archivo CSV a JSON.

### Estructura de Productos

```json
{
  "id": "prod_1234567890",
  "name": "Nombre del Producto",
  "category": "masculinos",
  "image": "data:image/jpeg;base64,...",
  "retailPrice": 68000,
  "price5": 47,
  "price10": 39,
  "price20": 36,
  "price30": 32,
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### Sistema de Precios

- **Precio Minorista**: Expresado en Pesos Argentinos (ARS)
- **Precios Mayoristas**: Expresados en Dólares Americanos (USD)
  - x5 unidades
  - x10 unidades
  - x20 unidades
  - x30 unidades

## Configuración

### Información de Contacto

Modificar en `script.js`:

```javascript
function contactar() {
    const phone = '+54 9 2914 74-8255';
    const message = 'Hola! Me interesa consultar sobre los perfumes del catálogo.';
    // ...
}
```

### Personalización de Colores

Modificar variables CSS en `styles.css`:

```css
:root {
    --primary-color: #FFD700;
    --secondary-color: #B8860B;
    --background-dark: #000000;
    --background-card: #111111;
    --text-light: #FFFFFF;
    --text-gold: #FFD700;
}
```

## Tecnologías

- HTML5
- CSS3 (Grid, Flexbox, Media Queries)
- JavaScript (ES6+)
- Font Awesome (iconos)
- localStorage API

## Despliegue

El proyecto puede desplegarse en cualquier servidor web estático. Se incluyen archivos de configuración para:

- Apache (`.htaccess`)
- Nginx (`nginx.conf`)
- Script de instalación automatizada (`install.sh`)

## Seguridad

- Panel de administración protegido con autenticación
- Sesiones con timeout de 24 horas
- Validación de datos en formularios
- Compresión de imágenes antes de almacenar

## Soporte

Para consultas técnicas o soporte, contactar a través de:

- Email: Todoperfumesshop@gmail.com
- Teléfono: +54 9 2914 74-8255

## Licencia

Copyright © 2024 TPS Perfumes. Todos los derechos reservados.
