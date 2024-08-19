FROM oven/bun:1.1.24 AS base
WORKDIR /usr/src/app

ARG PROJECT_DIR=tools/screenshot-service

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY $PROJECT_DIR/package.json $PROJECT_DIR/bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY $PROJECT_DIR/package.json $PROJECT_DIR/bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY $PROJECT_DIR .

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 3003/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]