# syntax=docker/dockerfile:1.7

FROM golang:1.26.2-alpine AS build

WORKDIR /src

COPY go.mod ./
COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build \
    -trimpath \
    -ldflags="-s -w" \
    -o /out/atlas \
    .

FROM scratch AS runtime

COPY --from=build /out/atlas /atlas

USER 65532:65532

ENTRYPOINT ["/atlas"]
