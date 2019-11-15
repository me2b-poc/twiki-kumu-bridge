#!/bin/bash
if tsc; then
	rm -rf output/nodes/*
	rm -rf output/maps/*
	#./bin/convert
	./init.sh
	./bin/pub-anal
	#./bin/lookup IEEE
fi
