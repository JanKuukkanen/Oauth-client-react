FROM dockerfile/python

MAINTAINER n4sjamk

RUN add-apt-repository ppa:nginx/stable
RUN apt-get update && apt-get install -y nodejs npm nginx
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

RUN echo "\
server {\n\
        listen 80 default_server;\n\
\n\
        root /home/teamboard/teamboard-client;\n\
        index index.html;\n\
\n\
        server_name localhost;\n\
\n\
        location / {\n\
                try_files \$uri /index.html;\n\
        }\n\
}" > /etc/nginx/sites-enabled/default


RUN npm install -g gulp

RUN ["useradd", "-m", "teamboard"]
RUN ["mkdir", "-p", "/home/teamboard/teamboard-client"]

ADD . /home/teamboard/teamboard-client/
RUN ["chown", "-R", "teamboard:teamboard", "/home/teamboard/teamboard-client"]

USER teamboard
WORKDIR /home/teamboard/teamboard-client
ENV HOME /home/teamboard/

RUN npm install

EXPOSE 80

USER root
CMD cd /home/teamboard/teamboard-client && \
        sudo -u teamboard -E ./node_modules/.bin/gulp build --production && \
        nginx -c /etc/nginx/nginx.conf