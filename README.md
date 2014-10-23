# esumin

Experiments in minifying with files that use some es5+ features, mainly for mozilla-based code, specifically, minifying Gaia apps.

Ideally, can use the AST parse tree from Reflect, then convert to code that at a minimum just strips comments.

Nice to have features:

* Keep line returns.
* Allow for light mangling, does not need to take extraordinary measures.

Something that allows the following features:

* arrow functions
* template strings

## How to run tests

    ESUMINXPC=/path/to/xpcshell ./test.sh

Some basic tests, just confirms the files can be parsed and generated, and runs the generated file. The test just output strings, and current expectations for the output should look like this:

    simple OK: hello something
    arrow-func OK: hello something
    template OK: hello apple
    TEMPLATE-TAG OK: hello 15 WORLD 50

## Dependencies

1) [escodegen](https://github.com/Constellation/escodegen):

    git clone --recursive git@github.com:Constellation/escodegen.git
    cd escodegen/
    git checkout 1.4.1
    npm install
    npm run-script build
    cp escodegen.browser.js ..

[escodegen options](https://github.com/Constellation/escodegen/wiki/API)

2) [esprima/harmony branch](https://github.com/ariya/esprima/tree/harmony):

    Oct 18:
    https://github.com/ariya/esprima/blob/54f49ada8739b90f07a9197394dcbd3574596c81/esprima.js


### Discarded

[esmangle](https://github.com/Constellation/esmangle) 1.0.1:

    git clone --recursive git@github.com:Constellation/esmangle.git
    cd esmangle
    git checkout 1.0.1
    npm install
    make bundle
    cp esmangle.js ..


## Implementation notes

I wanted to use native SpiderMonkey Reflect.parse, as it stays current with the JS engine implementation, and it is likely the fastest parse option when in xpcshell. However, there is a mismatch between its output and what the escodegen/esmangle projects expect.

There is the Mozilla [bug 913617](https://bugzilla.mozilla.org/show_bug.cgi?id=913617) to bring them closer into alignment.

I tried just doing a rename fix (discarded/fixes.js) for ArrowFunctionExpression to ArrowExpression in escodegen, and while that got the arrow functions to work, the template strings still had problems. The Reflect code mentions `quasis`, and that breaks when given to escodegen.

So, I switched to using the esprima/harmony branch for parsing, and no more discarded/fixes.js use. That esprima branch does not have releases, so I just grabbed the latest as of the day I did this investigation.

I tried using esmangle, but it has problems, does not seem to be up to date with what esprima generates. I was using an actual release, 1.0.1. When trying to use its master, I could not generate a build locally from the cloned git repo. So skipping it for now, and just relying on escodegen.

escodegen ends up stripping comments and there is a "compact" format that seems to do a basic minification, which is enough for gaia needs.



