// Polyfills
require('es6-promise').polyfill()
require('isomorphic-fetch')

// Requires
const _ = require('highland')
const cytoscape = require('cytoscape')


fetch('/ff-phase2-140729.obo')
  .then( (response) => {
    if (response.status >= 400) {
        throw new Error('Bad response from server');
    }
       
    _(response.text())
      .splitBy('\n')
      .each(s => console.log(s))
  })


// TODO css..
document.documentElement.style.height = '100%'
document.body.style.margin = '0'
document.body.style.height = '100%'

// Create and append container dom element
const containerDiv = document.createElement('div')
// containerDiv.id = 'cy'
containerDiv.style.height = '100%'
document.body.appendChild(containerDiv)


const cy = cytoscape({
  container: containerDiv, 

  elements: [ 
    { // node a
      data: { id: 'a' }
    },
    { // node b
      data: { id: 'b' }
    },
    { // edge ab
      data: { id: 'ab', source: 'a', target: 'b' }
    }
  ],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }
}) 
