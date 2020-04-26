import * as React from 'react'
import * as d3 from 'd3'
import { SimulationNodeDatum } from 'd3-force'
import * as _ from 'lodash'
import { Change } from '../../../cli/backend/models'
import { Typography, Paper, Grid } from '@material-ui/core'
import * as randomColor from 'randomcolor'
import * as styles from './commits-graph.css'
import { Filter } from '../../model/models'

interface Node extends SimulationNodeDatum {
  id: string
  type: string
  size: number
  color: string
}

interface Link {
  source: string
  target: string
}

export class CommitsGraph extends React.Component<
  { changes: Change[]; filter: Filter },
  { overElement: EventTarget; overNode: any; height: number }
> {
  ele: SVGElement

  constructor(props: any) {
    super(props)

    this.state = {
      overElement: null,
      overNode: null,
      height: 1000,
    }
  }

  getNodes(): Node[] {
    const changes = this.props.changes.filter(change => change.status === 'MERGED')
    const projectsSet = new Set()
    const usersSet = new Set()

    changes.forEach(change => {
      projectsSet.add(change.project)
      usersSet.add(change.owner.username)
      change.comments.forEach(comment => usersSet.add(comment.author.username))
      change.reviews.forEach(comment => usersSet.add(comment.author.username))
    })

    const colors = randomColor({
      luminosity: 'dark',
      count: usersSet.size,
      seed: 15158730,
    })
    const colors2 = randomColor({
      luminosity: 'dark',
      count: projectsSet.size,
      seed: 15158730,
    })
    const projects = [...projectsSet].map((project, index) => ({
      id: `project:${project}`,
      name: project,
      size: 20,
      type: 'project',
      color: colors2[index],
    }))
    const users = [...usersSet].map((user, index) => ({
      id: `user:${user}`,
      size: 3,
      type: 'user',
      name: user,
      color: colors[index],
    }))

    return [...users, ...projects]
  }

  getLinks(): Link[] {
    const changes = this.props.changes.filter(change => change.status === 'MERGED')
    const links = {}
    const addLink = (source: string, target: string) => {
      const key = [source, target].sort().join('#')
      links[key] = { source, target }
    }

    changes.forEach(change => {
      addLink(`project:${change.project}`, `user:${change.owner.username}`)
      change.comments.forEach(comment => {
        addLink(`user:${change.owner.username}`, `user:${comment.author.username}`)
      })
      change.reviews.forEach(review => {
        addLink(`user:${change.owner.username}`, `user:${review.author.username}`)
      })
    })

    return _.values(links)
  }

  onMouseOver(node: any, index: number, circles: HTMLElement[]) {
    this.setState({ overElement: circles[index], overNode: node })
  }

  onMouseOut() {
    this.setState({ overElement: null })
  }

  onDragStart(d: any, simulation: any) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart()
    }
    d.fx = d.x
    d.fy = d.y
  }

  onDrag(d: any, simulation: any) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  onDragEnd(d: any, simulation: any) {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }
    d.fx = null
    d.fy = null
  }

  renderSvg() {
    // Remove everything in the svg node
    this.ele.innerHTML = ''

    const svg = d3.select(this.ele)
    const links = this.getLinks()
    const nodes = this.getNodes()
    const rect = this.ele.getBoundingClientRect()

    const simulation = d3
      .forceSimulation<Node>()
      .force(
        'link',
        d3.forceLink().id((d: any) => d.id)
      )
      .force(
        'charge',
        d3.forceManyBody().strength((d: any) => (d.type === 'project' ? -200 : -200))
      )
      .force('collide', d3.forceCollide(50))
      .force('center', d3.forceRadial(100, rect.width / 2, rect.height / 2))

    const link = svg
      .append('g')
      .attr('stroke', '#AAA')
      .selectAll('line')
      .data<Link>(links)
      .enter()
      .append('line')
      .attr('stroke-width', 1)

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data<Node>(nodes)
      .enter()
      .append('circle')
      .attr('r', (d: any) => d.size)
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', (d: any) => (d.type === 'project' ? 0 : 1))
      .attr('fill', (d: any) => (d.type === 'project' ? d.color : '#FFFFFF'))
      .on('mouseover', this.onMouseOver.bind(this))
      .on('mouseout', this.onMouseOut.bind(this))
      .call(
        d3
          .drag<any, Node>()
          .on('start', (d: any) => this.onDragStart(d, simulation))
          .on('drag', (d: any) => this.onDrag(d, simulation))
          .on('end', (d: any) => this.onDragEnd(d, simulation))
      )

    const text = svg
      .append('g')
      .attr('class', 'texts')
      .selectAll('text')
      .data<Node>(nodes)
      .enter()
      .append('text')
      .attr('fill', '#444')
      .text((d: any) => d.name)

    const ticked = () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)

      text
        .attr('text-anchor', (d: any) => (d.type === 'user' ? 'start' : 'start'))
        .attr('x', (d: any) => (d.type === 'user' ? d.x + 10 : d.x + 27))
        .attr('y', (d: any) => d.y + 5)
    }

    simulation.nodes(nodes).on('tick', ticked)

    simulation.force<any>('link').links(links)
  }

  componentDidMount() {
    this.renderSvg()
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.changes !== this.props.changes) {
      this.renderSvg()
    }
  }

  render() {
    return (
      <Grid item xs={12} sm={12}>
        <Paper>
          <Typography variant="h5" color="inherit" style={{ padding: '20px' }}>
            Users and projects graph
          </Typography>
          <svg
            width="1000"
            height={this.state.height}
            ref={ele => (this.ele = ele)}
            className={styles.svg}
          />
        </Paper>
      </Grid>
    )
  }
}
