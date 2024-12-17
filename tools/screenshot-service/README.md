# Screenshot Service

## Development

To install dependencies:

```bash
pnpm install
```

To run:

```bash
npm run dev
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
