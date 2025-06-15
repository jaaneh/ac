FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["bun", "run", "dev"]