# Define project root argument
ARG PROJECT_DIR=tools/screenshot-service

# Build the app
FROM node:20-alpine AS builder
ARG PROJECT_DIR

RUN npm i -g pnpm@9
USER node
WORKDIR /home/node/build

COPY --chown=node:node *.* .
COPY --chown=node:node ${PROJECT_DIR} ${PROJECT_DIR}

RUN pnpm install --frozen-lockfile --ignore-scripts -F=./${PROJECT_DIR}

RUN pnpm -F=./${PROJECT_DIR} build

# Install production dependencies
FROM node:20-alpine AS deps
ARG PROJECT_DIR

RUN npm i -g pnpm@9
USER node
WORKDIR /home/node/build

COPY --chown=node:node pnpm*.yaml .
COPY --chown=node:node ${PROJECT_DIR} ${PROJECT_DIR}

RUN pnpm install --prod --ignore-scripts --frozen-lockfile -F=./${PROJECT_DIR}

# App runner instance
FROM node:20-alpine AS runner
ARG PROJECT_DIR

USER node
WORKDIR /home/node/fcc

# Copy the built app
COPY --from=builder --chown=node:node /home/node/build/${PROJECT_DIR}/dist ./

# Copy the production dependencies
COPY --from=deps --chown=node:node /home/node/build/node_modules/ node_modules/
COPY --from=deps --chown=node:node /home/node/build/${PROJECT_DIR}/node_modules ${PROJECT_DIR}/node_modules/

ENV PORT 3003

# Run the app
CMD [ "node", "./tools/screenshot-service/index.js" ]
