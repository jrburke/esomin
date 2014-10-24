set -e

OUT=test/output

runTest() {
    $ESOMINXPC esomin.js test/$1.js $OUT/$1.js
    $ESOMINXPC $OUT/$1.js
}

runTest simple
runTest arrow-func
runTest template
runTest template-tag

