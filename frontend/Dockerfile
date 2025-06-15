FROM oven/bun:latest

WORKDIR /app

COPY package.json ./
COPY bun.lock* ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "3000"]