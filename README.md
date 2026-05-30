# Guía de Instalación y Uso - Aplicación de Cónicas (MathRUT)

Bienvenida a la aplicación interactiva para el análisis de Cónicas a partir del RUT. Esta guía está diseñada paso a paso para que cualquier persona pueda ejecutar el programa en su computadora sin necesidad de conocimientos previos en programación.

---

## 🛠️ Requisitos Previos

Para hacer esto lo más sencillo posible, solo necesitas instalar un programa llamado **Node.js**. Esto provee el "motor" necesario para que la aplicación corra en tu equipo.

1. Ingresa a la página oficial: [https://nodejs.org/es](https://nodejs.org/es)
2. Descarga el botón verde que dice **"LTS"** (Recomendado para la mayoría de los usuarios).
3. Abre el archivo descargado e instálalo como cualquier otro programa (solo presiona *Siguiente > Siguiente > Finalizar*).

---

## 🚀 Paso a Paso: Cómo encender la aplicación

### Paso 1: Abrir la consola en la carpeta del proyecto
1. Descarga o descomprime la carpeta de la aplicación en tu computadora.
2. Abre esa carpeta.
3. Ahora debemos abrir una pequeña consola (terminal) justo en esa ubicación:
   - **En Windows:** Haz clic en la barra de direcciones superior de la carpeta (donde ves la ruta, por ejemplo: `C:\Users\...\LinealApp_RDS`), borra todo el texto, escribe **`cmd`** y presiona la tecla **Enter**. Se abrirá una ventana negra.
   - **En Mac:** Abre la aplicación "Terminal". Escribe la palabra `cd ` (con espacio al final) y **arrastra la carpeta** desde el buscador hacia la ventana de la terminal, luego presiona **Enter**.

### Paso 2: Instalación (Solo se hace la primera vez)
En la ventanita que acabas de abrir, escribe el siguiente comando y presiona **Enter**. Esto descargará automáticamente los elementos matemáticos y visuales necesarios para que funcione:

```bash
npm install
```
*(Espera un minuto; verás que se llenan barras de carga o texto en la pantalla, es completamente normal).*

### Paso 3: Encender el sistema
Una vez que termine el paso anterior (cuando vuelva a dejarte escribir), escribe el comando a continuación y vuelve a presionar **Enter**:

```bash
npm run dev
```

### Paso 4: ¡Abrir la aplicación!
¡Listo! La aplicación ya está encendida y corriendo en tu equipo. Para conectarte a ella:
1. Abre tu navegador de internet habitual (Google Chrome, Edge, Safari, etc.).
2. En la barra de búsqueda de arriba, escribe exactamente esta dirección y dale a Enter:

   **http://localhost:3000**

---

## 💻 Guía de Uso Rápido
Una vez dentro de la app en la página de **Validación de RUT y Cónicas**:
1. Escribe un RUT en la casilla (sin puntos ni guiones o de forma tradicional).
2. Haz clic en **"Analizar"**.
3. El programa extraerá los coeficientes matemáticos basados en tus números, generará la **Ecuación General**, la transformará a su **Forma Canónica**, te dirá de qué tipo de cónica se trata y construirá la **Gráfica** automáticamente con sus componentes.
4. Más abajo, encontrarás una sección llamada **Defensa oral**. Ahí los alumnos pueden comprobar sus cálculos introduciendo los vértices, focos, radio y otros elementos geométricos; la aplicación validará si los valores calculados son los correctos.

---

## 🛑 ¿Cómo apagar la aplicación?
Al terminar de usar la herramienta, vuelve a la ventana negra de texto (consola) que dejaste abierta.
- Presiona en tu teclado las teclas **Ctrl + C** juntas. 
- Te preguntará si deseas terminar el proceso, escribe la letra **`S`** o **`Y`** (dependiendo del idioma) y presiona Enter. (También puedes simplemente cerrar la ventana en la "X" si lo prefieres).

---

> **⚙️ Opcional para usuarios avanzados (Informáticos):**  
> Si tienes Docker instalado en tu máquina, simplemente abre una terminal en esta carpeta y ejecuta `docker compose up -d --build`. La plataforma estará lista en el puerto 3000 automáticamente de forma aislada.
