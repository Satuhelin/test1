import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 50, left: 170, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([0, 45000000])
  .range([0, width])
const yPositionScale = d3
  .scaleBand()
  .domain([
    'Uganda',
    'Afghanistan',
    'Nigeria',
    'Malawi',
    'Zambia',
    'Senegal',
    'Angola',
    'Tanzania',
    'Nepal',
    'Sudan'
  ])
  .range([0, height])

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([0, 0])
  .html(function(d) {
    return `${d.country} <span style='color:red'>${d.per_person}</span>`
  })
svg.call(tip)

d3.csv(require('../data/least.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('fill', '#fdbb84')
    .attr('stroke', 'none')
    .attr('height', 25)
    .attr('width', d => {
      return xPositionScale(d.per_person)
    })
    .attr('y', d => {
      return yPositionScale(d.country)
    })

    .attr('font-size', 25)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
}

svg
  .append('text')
  .text('Countries with most people per one rollercoaster')
  .attr('x', width / 2)
  .attr('y', -30)
  .attr('text-anchor', 'middle')
  .attr('font-size', 22)

const yAxis = d3.axisLeft(yPositionScale)
svg
  .append('g')
  .attr('class', 'axis y-axis')
  .call(yAxis)

const xAxis = d3.axisBottom(xPositionScale).ticks(5)
svg
  .append('g')
  .attr('class', 'axis x-axis')
  .attr('font-size', 20)
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis)
