FROM nginx:1.20.0

WORKDIR /frontend
COPY ./src/frontend/dist .
WORKDIR /cert
COPY ./cert/device.key .
COPY ./cert/device.crt .