# Pocketbase server
FROM golang:1.22.4

WORKDIR /pb

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /pb/kmt

COPY ./pb_migrations /pb/pb_migrations

COPY ./pb_hooks /pb/pb_hooks

# Optional:
# To bind to a TCP port, runtime parameters must be supplied to the docker command.
# But we can document in the Dockerfile what ports
# the application is going to listen on by default.
# https://docs.docker.com/engine/reference/builder/#expose
EXPOSE 8080

ENTRYPOINT [ "/pb/kmt", "serve", "--http=0.0.0.0:8080" ]