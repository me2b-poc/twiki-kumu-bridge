#!/bin/bash
if tsc; then
	rm -rf output/*
	./init.sh
	./bin/convert
	#./bin/pub-anal
	#./bin/lookup IEEE
fi
