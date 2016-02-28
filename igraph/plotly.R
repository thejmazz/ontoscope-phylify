# R bindings to C based network analysis package igraph
if (!require(igraph, quietly=TRUE)) install.packages("igraph")

# web-based graphs via plotly's JavaScript graphing library
if (!require(plotly, quietly=TRUE)) install.packages("plotly")

G <- read.graph("fantom.gml", format = c("gml"))
# L <- layout.circle(G)
L <- layout_as_tree(G)

# vertices and edges
vs <- V(G)
es <- as.data.frame(get.edgelist(G))

Nv <- length(vs)
Ne <- length(es[1]$V1)

Xn <- L[,1]
Yn <- L[,2]

network <- plot_ly(type = "scatter", x = Xn, y = Yn, mode = "markers", text = vs$label, hoverinfo = "text")

edge_shapes <- list()
for(i in 1:Ne) {
  v0 <- es[i,]$V1
  v1 <- es[i,]$V2

  edge_shape = list(
    type = "line",
    line = list(color = "#030303", width = 0.3),
    x0 = Xn[v0],
    y0 = Yn[v0],
    x1 = Xn[v1],
    y1 = Yn[v1]
  )

  edge_shapes[[i]] <- edge_shape
}

network <- layout(
  network,
  title = 'FANTOM Network',
  shapes = edge_shapes,
  xaxis = list(title = "", showgrid = FALSE, showticklabels = FALSE, zeroline = FALSE),
  yaxis = list(title = "", showgrid = FALSE, showticklabels = FALSE, zeroline = FALSE)
)

network
