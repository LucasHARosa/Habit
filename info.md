## Node
Inciando o node normal

    npm init -y  

## Fastify

Framework parecido com express para ser o servidor

    npm install fastify   

## Typescript
typescript como dependencia

    npm install typescript -D

Configuração typeScript do projeto

    npx tsc --init 

Permite rodar typescript como se fosse javascript

    npm i tsx -D  

## Prysma
intermeio do Banco de dados orm com typeScript

    npm i -D prisma

Cliente do prisma 

    npm i @prisma/client

Iniciar com um banco de dados SQLite

    npx prisma init --datasource-provider SQLite

Abrir no navegador o banco de dados SQLite

    npx prisma studio   

Para salvar as mudanças feitas no schema.prisma

    npx prisma migrate dev

# Front end com REACT

## Vite

Front-end com react

    npm create vite@latest
    npm install

## tailwindcss

Biblioteca para estilização css no classname=""
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

## Radix

Biblioteca Radix UI tem vários componentes e comportamentos com acessibilidade e facilidade. Ex: menus, scross, tabs, accordion e varios outros...

    npm install @radix-ui/react-dialog

## Phosphor-react

Biblioteca de icones para react

    npm i phosphor-react

## Clsx

Realiza condicionais nos atriutos dos elementos

    npm i clsx

## Axios


# Mobile

## React native

Instalando o expo para as aplicações mobile

    npx create-expo-app mobile --template

Executando

    npx expo start     

## Para usar svg com componente

    npx expo install react-native-svg
    npm i react-native-svg-transformer --save-dev

## tailwindcss
Estilização css com classes

    npm i nativewind
    npm i tailwindcss --save-dev
    npx tailwindcss init 

## Navigation
Biblioteca que faz a navegação entre telas

    npm install @react-navigation/native
    npx expo install react-native-screens react-native-safe-area-context
    npm install @react-navigation/native-stack