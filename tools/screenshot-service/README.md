# Screenshot Service

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Deployment

Build the Docker image:

```bash
docker build -t screenshot-service -f ./docker/screenshot-service/Dockerfile .
```

Run the Docker container:

```bash
docker run -d -p 3003:3003 screenshot-service
```
