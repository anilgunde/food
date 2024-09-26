# Use the official Nginx image from the Docker Hub
FROM nginx:latest
# Copy custom configuration files
COPY default.conf /etc/nginx/conf.d/default.conf
#COPY ssl /etc/nginx/ssl
# Copy website content
COPY html /usr/share/nginx/html
# Expose ports 80 and 443
EXPOSE 80 443
# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
