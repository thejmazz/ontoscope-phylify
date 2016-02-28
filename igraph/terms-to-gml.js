'use strict'

const _ = require('highland')
const fs = require('fs')

const INPUT_FILE = 'fantom.ndjson'
const OUTPUT_FILE = 'fantom.gml'


let terms = []

const obo = fs.readFileSync(INPUT_FILE, 'utf8')

const printGml = (terms, edges) => {
  terms = terms.map((term,i) => '\tnode [\n\t\tid ' + i + '\n\t\tlabel "' + term.id + '"\n\t]\n')
  edges = edges.map(edge => '\tedge [\n\t\tsource ' + edge.source + '\n\t\ttarget ' + edge.target + '\n\t\tlabel "' + edge.label + '"\n\t]\n')


  console.log('graph [\n')

  terms.forEach(t => console.log(t))
  edges.forEach(e => console.log(e))

  console.log(']')
}

const makeEdges = (terms) => {
  let edges = []

  const getI = (id) => {
    let i
    terms.forEach((term, j) => {
      if (term.id === id) {
        i = j
      }
    })

    return i
  }

  terms.forEach((term, i) => {
    if (term.is_a) {
      const source = i
      const target = term.is_a.split('!')[0].trim()
      const label = term.id + '-' + target
      
      edges.push({source, target: getI(target), label})
    }  
  })

  return edges
}

obo.split('\n').forEach(l => {
  let term
  try {
    term = JSON.parse(l)
  } catch(e) {
    console.error(e)
  }

  if (term === undefined) {
    // Sketchily use inability to parse last line to know we are done 
    const edges = makeEdges(terms)
    printGml(terms, edges)
  } else {
    terms.push(term) 
  }
})
