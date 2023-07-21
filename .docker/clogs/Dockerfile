FROM node:20-bookworm-slim

RUN apt-get -qy update && apt-get -qy install --no-install-recommends build-essential ca-certificates checkinstall zlib1g-dev wget
RUN update-ca-certificates

WORKDIR /usr/local/src
RUN wget https://www.openssl.org/source/openssl-3.1.1.tar.gz && tar -xvzf openssl-3.1.1.tar.gz
RUN apt-get -qy purge wget

WORKDIR /usr/local/src/openssl-3.1.1
RUN ./config --prefix=/usr/local/ssl --openssldir=/usr/local/ssl shared zlib && make && make install && make clean
RUN echo /usr/local/ssl/lib64 > /etc/ld.so.conf.d/openssl-3.1.1.conf
RUN ldconfig -v
RUN apt-get -qy purge build-essential checkinstall openssl
ENV PATH "$PATH:/usr/local/ssl/bin"

WORKDIR /usr/local/src
RUN rm -rf openssl-3.1.1 openssl-3.1.1.tar.gz
RUN apt-get -qy clean --dry-run
