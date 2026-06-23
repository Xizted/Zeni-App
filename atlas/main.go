package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()

	if err := run(ctx, os.Stdout); err != nil {
		log.Fatalf("run Atlas: %v", err)
	}
}

func run(ctx context.Context, output io.Writer) error {
	if _, err := fmt.Fprintln(output, "Atlas is running"); err != nil {
		return fmt.Errorf("write startup message: %w", err)
	}

	<-ctx.Done()

	if _, err := fmt.Fprintln(output, "Atlas is stopping"); err != nil {
		return fmt.Errorf("write shutdown message: %w", err)
	}

	return nil
}
