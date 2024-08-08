FROM node:bookworm-slim
RUN apt-get update && apt-get -y install procps
WORKDIR /usr/app
COPY package*.json ./
RUN npm i --legacy-peer-deps
RUN rm -f .npmrc
COPY ./ ./
ENV NODE_OPTIONS=--max_old_space_size=4096
CMD ["npm", "run", "dev"]
