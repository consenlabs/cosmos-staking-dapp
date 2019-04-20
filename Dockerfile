FROM openresty/openresty:xenial

# Copy a configuration file from the current directory
COPY nginx.conf /usr/local/openresty/nginx/conf/

COPY build/ /var/www/html/

# Append "daemon off;" to the beginning of the configuration

# Expose ports
EXPOSE 80

# Set the default command to execute
# when creating a new container
