set -e

OUT=test/output

$ESUMINXPC esumin.js test/simple.js $OUT/simple.js
$ESUMINXPC $OUT/simple.js
