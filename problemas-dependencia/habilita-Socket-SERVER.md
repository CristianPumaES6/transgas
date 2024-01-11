sudo mkdir -p /var/www/socket-transgas.codev.site/


sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/socket-transgas.occard.site


sudo ln -s /etc/nginx/sites-available/socket-transgas.occard.site /etc/nginx/sites-enabled/socket-transgas.occard.site





server {
       server_name socket-transgas.occard.site www.socket-transgas.occard.site;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }


}



sudo certbot --nginx -d socket-transgas.occard.site -d www.socket-transgas.occard.site




  listen 80;
        listen [::]:80;

        root /var/www/socket-transgas.codev.site;
        index index.html index.htm index.nginx-debian.html;

        server_name test.com www.test.com;

        location / {
                try_files $uri $uri/ =404;
        }








          GNU nano 4.8                                              socket-transgas.codev.site                                                        
server {
         server_name socket-transgas.codev.site www.socket-transgas.codev.site;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }



    listen 80; # managed by Certbot

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/socket-transgas.codev.site/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/socket-transgas.codev.site/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}










----------------------------------
--------------------------------
---------------------------------
------------------------------


al final queda asi nuestra conifguracion
server {
         server_name socket-transgas.codev.site;

           location /socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
  
}










y en el config del frontend 



export const EnvConfig: EnvConfig = {
    API: 'https://transgas.codev.site',
    ENV: '',
    VERSION: 'v1.9e',
    SOCKET: 'https://socket-transgas.codev.site'
};


/* 
export const EnvConfig: EnvConfig = {
    API: 'http://localhost:3000',
    ENV: '',
    VERSION: 'v1.9e',
    SOCKET:'ws://localhost:4000'
};
 */