FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn config set registry https://npmjs.org

RUN --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile --no-progress

COPY dist ./dist

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8082/health || exit 1

CMD ["node", "dist/server.js"]
