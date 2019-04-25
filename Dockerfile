FROM node:10.15.3-alpine

RUN apk add nginx --no-cache --update && \
    rm -rf /var/cache/apk/* && \
    chown -R nginx:www-data /var/lib/nginx

RUN mkdir /app
WORKDIR /app
COPY package.json /app/
RUN npm install

COPY ./ /app/
RUN npm run build

# Copy a configuration file from the current directory
COPY nginx.conf /etc/nginx/

RUN mkdir -p /var/www/html/cosmos /run/nginx

RUN cp -r build/* /var/www/html/cosmos
RUN cp -r build/* /var/www/html

# Append "daemon off;" to the beginning of the configuration

# Expose ports
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
