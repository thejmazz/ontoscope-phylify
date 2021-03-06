# === Packages ===

# json <-> data frames (w/ streams too)
if (!require(jsonlite, quietly=TRUE)) install.packages("jsonlite")

# R bindings to C based network analysis package igraph
if (!require(igraph, quietly=TRUE)) install.packages("igraph")

# web-based graphs via plotly's JavaScript graphing library
if (!require(plotly, quietly=TRUE)) install.packages("plotly")

# === Utility Functions ===

# trim whitespace on edges of string
trim <- function (x) gsub("^\\s+|\\s+$", "", x)


# === Parsing ===

# obo -> ndjson performed externally by bionode-obo
# see: https://github.com/bionode/bionode-obo
# why JS? works in the browser as well.

# ndjson -> data frame
# TODO reference file in some less sketch way -> CLI params
# TODO option for url streams, pipe, etc.
inputFile <- "fantom.ndjson"
conn <- file(inputFile)

# jsonlite#stream_in will handle closing file connection
terms <- stream_in(conn)

# === Building an igraph object ===

# Edges live as two vectors s,t, where |s| = |t|
# s[i] -> t[i]
sources <- c()
targets <- c()

# Loop over each term
# source is term$id, target is term$is_a
# (after removing comments and trimming)
for (i in 1:length(terms$is_a)) {
    src <- trim(strsplit(terms$is_a[i], "!")[[1]][1])
   
    # TODO check if validity of target based off target id present
    # in vector of ids.

    # sketchily assume source is a valid id if it contains : or _ 
    validSrc <- grepl(":|_", src)
    
    # print invalids to test feasiblity of sketchy code
    # if (!validSrc) {
    #     print(src)
    # }

    if (validSrc) {
        sources <- c(sources, src)
        targets <- c(targets, terms$id[i])
    }
}

# One way to construct an igraph is with
# igraph#graph_from_data_frame
# which can take a d.f. with vectors named from, to, for the edges as described
# above
relations <- data.frame(from=sources, to=targets)
g <- graph_from_data_frame(relations, directed=TRUE, vertices=terms$id)


# === Plotting ===

# SVG
# svg("plot.svg", width=20, height=20)

# Quartz
plot(g, vertex.size=0.01, vertex.label=NA, edge.arrow.width=0)

# Close to SVG file
# dev.off

# Layouts
# as_star
# as_tree
# as_circle
# nicely

# === With Just FFs ===

# 4144 Nodes with FF IDs
ffNodes <- c()

for (id in terms$id) {
    if (strsplit(id, ":")[[1]][1] == "FF") {
        ffNodes <- c(ffNodes, id)
    }
}
