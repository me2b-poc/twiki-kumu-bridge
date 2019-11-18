#!/bin/bash
OPTS="--trim=true --ignoreEmpty=true"
csvtojson ~/Desktop/ktest/me2b/event.csv $OPTS | python -m json.tool > input/event.json
csvtojson ~/Desktop/ktest/me2b/groups.csv $OPTS | python -m json.tool > input/groups.json
csvtojson ~/Desktop/ktest/me2b/organizations.csv $OPTS | python -m json.tool > input/organizations.json
csvtojson ~/Desktop/ktest/me2b/product.csv $OPTS | python -m json.tool > input/product.json
csvtojson ~/Desktop/ktest/me2b/pubs.csv $OPTS | python -m json.tool > input/pubs.json
