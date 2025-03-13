# Etapa 1: Build
FROM node:18 as build

# Definindo diretório de trabalho
WORKDIR /usr/src/app

# Copiando arquivos de dependências
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando arquivos TypeScript (e tsconfig)
COPY tsconfig.json ./
COPY src ./src

# Compilando para JavaScript (saída em /dist)
RUN npm run build


# Etapa 2: Produção
FROM node:18 as production

WORKDIR /usr/src/app

# Copiando somente arquivos de dependências novamente
COPY package*.json ./

# Instalando somente as dependências de produção
RUN npm ci --only=production

# Copiando o resultado do build (saída /dist) da imagem anterior
COPY --from=build /usr/src/app/dist ./dist

# Expondo a porta do container (caso rode localmente)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
