FROM node:22-alpine3.19
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g
RUN npm install serve -g
COPY . ./
RUN npm run build
ENTRYPOINT ["npm", "start"]