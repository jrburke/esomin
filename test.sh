set -e

OUT=test/output

runTest() {
    $ESUMINXPC esumin.js test/$1.js $OUT/$1.js
    $ESUMINXPC $OUT/$1.js
}

runTest simple
runTest arrow-func
runTest template
runTest template-tag

