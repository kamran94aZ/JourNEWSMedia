FROM pierrezemb/gostatic
COPY . /srv/http/
CMD ["-port","3000","-https-promote", "-enable-logging"]
