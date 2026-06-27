# Monitoring & Metrics Setup (Prometheus + Grafana)

While **Bull-Board** is excellent for managing and debugging Queues visually (Single Responsibility: Queue Management), **Prometheus and Grafana** are used for System Health and Metrics Aggregation (Single Responsibility: Analytics & Health).

To track metrics like "Processing Time", "Queue Length", and "Failure Rates", we use `prom-client` in Node.js to expose a `/metrics` endpoint, which Prometheus scrapes.

## 1. Required Packages
In your user-service, you would install:
```bash
pnpm add prom-client @willsoto/nestjs-prometheus # Or equivalent for Express
```
*Note: Since you are using Express, `prom-client` alone is enough. You create an endpoint `app.get('/metrics', async (req, res) => { res.send(await register.metrics()); })`*

## 2. Docker Compose Setup for Monitoring Stack

Create a `docker-compose.monitoring.yml` in your project root:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - '9090:9090'

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3000:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus

volumes:
  prometheus_data:
  grafana_data:
```

## 3. Prometheus Configuration (`prometheus.yml`)

Create this file in the same directory:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'user-service'
    static_configs:
      - targets: ['host.docker.internal:4000'] # Assuming your Express app runs on 4000
```

## 4. How to Run
```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

## 5. What Metrics to Record in your Worker?
In `email.worker.ts`, you would do something like this (conceptually):

```typescript
import client from 'prom-client';

// 1. Define Metrics
const jobDuration = new client.Histogram({
  name: 'queue_job_duration_seconds',
  help: 'Duration of jobs in seconds',
  labelNames: ['queue_name', 'status'],
});

const jobCounter = new client.Counter({
  name: 'queue_job_total',
  help: 'Total jobs processed',
  labelNames: ['queue_name', 'status'],
});

// 2. Record on Worker Events
worker.on('completed', (job) => {
  const duration = (job.finishedOn! - job.processedOn!) / 1000;
  jobDuration.labels(job.queueName, 'success').observe(duration);
  jobCounter.labels(job.queueName, 'success').inc();
});

worker.on('failed', (job, err) => {
  jobCounter.labels(job.queueName, 'failed').inc();
});
```
*Note: In an enterprise app, this logic is abstracted into a generic `MetricsService`.*
