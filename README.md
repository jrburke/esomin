# esumin

Experiments in minifying with files that use some es5+ features, mainly for mozilla-based code, specifically, minifying Gaia apps.

Ideally, can use the AST parse tree from Reflect, then convert to code that at a minimum just strips comments.

Nice to have features:

* Keep line returns.
* Allow for light mangling, does not need to take extraordinary measures.

Something that allows the following features:

* arrow functions
* template strings

## How to run

    /path/to/xpcshell esumin.js filename

## Implementation

1) Uses esmangle.js 1.0.1:

    git clone --recursive git@github.com:Constellation/esmangle.git
    cd esmangle
    git checkout 1.0.1
    npm install
    make bundle
    cp esmangle.js ..

2) escodegen:

    git clone --recursive git@github.com:Constellation/escodegen.git
    cd escodegen/
    git checkout 1.4.1
    npm install
    npm run-script build
    cp escodegen.browser.js ..
