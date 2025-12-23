FROM python:3.9-alpine

COPY --from=ghcr.io/openfaas/classic-watchdog:0.2.3 /fwatchdog /usr/bin/fwatchdog

RUN chmod +x /usr/bin/fwatchdog

WORKDIR /home/app

COPY index.py .
COPY handler.py .

ENV fprocess="python3 index.py"

ENV write_debug="true"
ENV exec_timeout="10s"

EXPOSE 8083

CMD ["fwatchdog"]