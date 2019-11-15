#!/bin/bash
OPTS="--trim=true --ignoreEmpty=true"
csvtojson ~/Desktop/ktest/idcommons/element.csv $OPTS | python -m json.tool > elements.json
csvtojson ~/Desktop/ktest/idcommons/connections.csv $OPTS | python -m json.tool > connections.json
