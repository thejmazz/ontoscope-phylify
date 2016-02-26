# ontoscope-phylify

Phylify module for [Ontoscope]

[Ontoscope]: https://github.com/hyginn/Ontoscope

## Running

```bash
$ npm install
# in one tab
$ npm start
# in another tab
$ npm run serve
```

The bundle will recompile as you save, and the webpage will then automatically refresh.

R code is in `igraph`.

## Notebook

**2016/02/23** 

Webpage for streaming vertices into cytoscape.js. See [igraph](https://github.com/thejmazz/ontoscope-phylify/tree/106a2a8c0f17e82e8bfe86e5121f881d4719c87c/igraph) (at that commit). Has the first plot of FANTOM data!

**2016/02/26**

Integrated edges into cytoscape.js. Applied "cose" layout after all edges added. See [some pictures from the vacation](https://github.com/thejmazz/ontoscope-phylify/commit/c1541267798f946e7e66c20686a442962dd59373) (went to lag city). Next todo is to go back and get a nice plot from igraph.


## Design Milestone

The PHYLIFY module sits near the top of the Ontoscope pipeline:

![screen shot 2016-02-16 at 10 49 28 pm](https://cloud.githubusercontent.com/assets/1270998/13099403/ba767692-d4ff-11e5-8815-82152481636e.png)

It is responsible for taking CO, which is the ontology of anatomical structures
and cells, from FANTOM, and building a useful graph out of it.

This graph will then be combined with FANTOM expression data, and through a
thresholding function, provide the cell types to use as background when
calculating differential expression with [DESeq2].

This module will take input data from the FANTOM cell ontology, which has been
downloaded and resides in this repository
[here](https://raw.githubusercontent.com/thejmazz/ontoscope-phylify/master/ff-phase2-140729.obo).

It will parse the `.obo` file using [bionode-obo] \(v0.1.0 at time of writing),
which is a streaming obo parser I have written that can take a URL or a file and
emit a stream of term objects, or newline delimited JSON (ndjson).

JSON can be easily interpreted into R data frames with [jsonlite], which also
supports streaming data.

The graph will be constructed using the relations present in the obo file. The
graph will be constructed using [graph.js] for the browser visualization tool,
and [igraph] for the actual data pipeline within R. It is valuable to have a
browser based interactive visualization, which you can toggle different
relations on/off, to get a feel for what the data represents, and the meanings
of the specific terms within the obo file.


[DESeq2]: https://bioconductor.org/packages/release/bioc/html/DESeq2.html
[bionode-obo]: https://github.com/bionode/bionode-obo
[jsonlite]: https://cran.r-project.org/web/packages/jsonlite/index.html
[graph.js]: https://www.npmjs.com/package/graph.js
[igraph]: http://igraph.org/

