#!/bin/bash

# Script de instalación para TPS Perfumes Catálogo Web
# Uso: ./install.sh

echo "🚀 Instalando TPS Perfumes Catálogo Web..."

# Verificar si estamos en un sistema Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ Este script está diseñado para sistemas Linux"
    exit 1
fi

# Verificar si tenemos permisos de sudo
if ! sudo -n true 2>/dev/null; then
    echo "🔐 Se requieren permisos de administrador"
    exit 1
fi

# Función para instalar dependencias
install_dependencies() {
    echo "📦 Instalando dependencias..."
    
    # Detectar el gestor de paquetes
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y nginx curl wget unzip
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum update -y
        sudo yum install -y nginx curl wget unzip
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf update -y
        sudo dnf install -y nginx curl wget unzip
    else
        echo "❌ No se pudo detectar el gestor de paquetes"
        exit 1
    fi
}

# Función para configurar nginx
setup_nginx() {
    echo "🌐 Configurando nginx..."
    
    # Crear directorio del sitio
    sudo mkdir -p /var/www/tpsperfumes
    
    # Copiar archivos del proyecto
    sudo cp -r . /var/www/tpsperfumes/
    
    # Configurar permisos
    sudo chown -R www-data:www-data /var/www/tpsperfumes
    sudo chmod -R 755 /var/www/tpsperfumes
    
    # Configurar nginx
    sudo cp nginx.conf /etc/nginx/sites-available/tpsperfumes
    sudo ln -sf /etc/nginx/sites-available/tpsperfumes /etc/nginx/sites-enabled/
    
    # Verificar configuración
    if sudo nginx -t; then
        sudo systemctl restart nginx
        sudo systemctl enable nginx
        echo "✅ nginx configurado correctamente"
    else
        echo "❌ Error en la configuración de nginx"
        exit 1
    fi
}

# Función para configurar firewall
setup_firewall() {
    echo "🔥 Configurando firewall..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian
        sudo ufw allow 'Nginx Full'
        sudo ufw allow ssh
        sudo ufw --force enable
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/RHEL/Fedora
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --permanent --add-service=https
        sudo firewall-cmd --permanent --add-service=ssh
        sudo firewall-cmd --reload
    fi
    
    echo "✅ Firewall configurado"
}

# Función para configurar SSL (opcional)
setup_ssl() {
    echo "🔒 Configurando SSL con Let's Encrypt..."
    
    if command -v certbot &> /dev/null; then
        echo "📝 Certbot ya está instalado"
    else
        # Instalar certbot
        if command -v apt-get &> /dev/null; then
            sudo apt-get install -y certbot python3-certbot-nginx
        elif command -v yum &> /dev/null; then
            sudo yum install -y certbot python3-certbot-nginx
        elif command -v dnf &> /dev/null; then
            sudo dnf install -y certbot python3-certbot-nginx
        fi
    fi
    
    echo "ℹ️  Para configurar SSL, ejecuta: sudo certbot --nginx -d tu-dominio.com"
}

# Función para verificar la instalación
verify_installation() {
    echo "🔍 Verificando instalación..."
    
    # Verificar que nginx esté corriendo
    if sudo systemctl is-active --quiet nginx; then
        echo "✅ nginx está corriendo"
    else
        echo "❌ nginx no está corriendo"
        exit 1
    fi
    
    # Verificar que los archivos estén en su lugar
    if [ -f "/var/www/tpsperfumes/index.html" ]; then
        echo "✅ Archivos del sitio web instalados"
    else
        echo "❌ Archivos del sitio web no encontrados"
        exit 1
    fi
    
    echo "🎉 ¡Instalación completada exitosamente!"
    echo ""
    echo "📋 Información de la instalación:"
    echo "   - Directorio del sitio: /var/www/tpsperfumes"
    echo "   - Configuración nginx: /etc/nginx/sites-available/tpsperfumes"
    echo "   - Logs nginx: /var/log/nginx/"
    echo ""
    echo "🌐 Para acceder al sitio:"
    echo "   - Local: http://localhost"
    echo "   - Red: http://$(hostname -I | awk '{print $1}')"
    echo ""
    echo "🔧 Comandos útiles:"
    echo "   - Reiniciar nginx: sudo systemctl restart nginx"
    echo "   - Ver logs: sudo tail -f /var/log/nginx/error.log"
    echo "   - Verificar estado: sudo systemctl status nginx"
}

# Función principal
main() {
    echo "🎯 Iniciando instalación de TPS Perfumes Catálogo Web..."
    echo ""
    
    install_dependencies
    setup_nginx
    setup_firewall
    setup_ssl
    verify_installation
}

# Ejecutar función principal
main "$@"
