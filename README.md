# Overview

This repository provides an example of a socket timeout bug that is triggered by some combination of OTEL Collector HTTP Receiver, opentelmetry-js, and possibly AWS X-Ray exporter.

# Requirements
* docker
* docker-compose

# Getting Started
The default configuration will launch a stock AWS OTEL Collector. You may need to modify `docker-compose.yml` to modify how AWS credentials are passed to the collector, based off your environment.

```sh
# build trace generator
docker-compose build

# launch collector + generator
docker-compose up

# monitor number of open file handles in otel collector (linux environment)
sudo watch "lsof -n -p $(ps -elf | grep [a]wscollector | awk '{print $4}') | wc -l"
```

# Observations
In my development environment with restricted ulimits (specified in `docker-compose.yml`), the otel-collector services seems to run out of file descriptors between 6k-7k traces. 

By switching the `otel-collector` service config to use a logging exporter instead of the default AWS exporters, you can see the file descriptors grow to the defined limits as well. In this configuration, the collector does not report an error, but appears to stop collecting new traces. This seems like a clue that maybe the bug lies somewhere within `opentelemetry-js` or `otel-collector` (or in some way both?).

