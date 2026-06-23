package main

import (
	"bytes"
	"context"
	"testing"
)

func TestRunStopsWhenContextIsCancelled(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	var output bytes.Buffer
	if err := run(ctx, &output); err != nil {
		t.Fatalf("run returned an error: %v", err)
	}

	const expected = "Atlas is running\nAtlas is stopping\n"
	if output.String() != expected {
		t.Fatalf("unexpected output: got %q, want %q", output.String(), expected)
	}
}
