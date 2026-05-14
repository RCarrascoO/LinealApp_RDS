FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias necesarias para algunos paquetes de Node
RUN apk add --no-cache libc6-compat

# Exponer el puerto que usará Next.js
EXPOSE 3000

# Por ahora, usamos un comando por defecto que mantenga el contenedor vivo o ejecute el modo dev
# Una vez inicialices Next.js, esto correrá la aplicación.
# Truco para que el contenedor no se muera si aún no hay package.json:
CMD ["sh", "-c", "if [ -f package.json ]; then npm install && npm run dev; else tail -f /dev/null; fi"]