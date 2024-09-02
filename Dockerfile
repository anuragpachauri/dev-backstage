FROM node:18-bookworm-slim

COPY . .

RUN apt-get update && apt-get install git -y

RUN ulimit -n 65535

 RUN yarn install

# RUN yarn tsc


# RUN yarn build:all

EXPOSE 7007

EXPOSE 3000

CMD ["yarn", "dev"]
