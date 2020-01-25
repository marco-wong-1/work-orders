import React, { Component } from 'react';
import { Form, Container } from 'react-bootstrap';
import WorkOrder from './WorkOrders';

class ListCards extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filtered: []
    }
    this.sort = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      filtered: this.props.orders
    })
  }

  async handleChange(e) {
    let currentOrders = [];
    let filteredOrders = [];
    let filteredWorkers = [];
    let currentWorkers = [];
    if (e.target.value !== "") {
      currentWorkers = this.props.workers;
      currentOrders = this.props.orders;
      filteredWorkers = currentWorkers.filter((worker) => {
        const lworkers = worker.name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lworkers.includes(filter);
      })
      const workersIdList = filteredWorkers.map((w) => w.id);
      filteredOrders = currentOrders.filter((orders => {
        return workersIdList.includes(orders.workerId);
      }))
    } else {
      filteredOrders = this.props.orders;
    }
    const boo = !this.sort.current.checked; // make sure we are still sorting
    this.setState({
      filtered: filteredOrders.sort((a, b) => {
        if(boo) {
          return a.deadline - b.deadline
        } else {
          return b.deadline - a.deadline
        }})
    })
  }

  handleSort(e) {
    const { filtered } = this.state;
    const boo = !this.sort.current.checked;
    this.setState({
      filtered: filtered.sort((a, b) => {
        if(boo) {
          return a.deadline - b.deadline
        } else {
          return b.deadline - a.deadline
        }})
    })
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const workOrders = this.state.filtered;
    const workers = this.props.workers;
    const filterString = this.props.searchString;
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Control 
              id="name-input" 
              type="input" 
              value={filterString} 
              onChange={this.handleChange} 
              placeholder="Filter by worker name ..." 
            />
            <Form.Check
              id="deadline-input"
              type="switch"
              onClick={this.handleSort}
              ref={this.sort}
              label="Filter by Latest"
              className="mt-3"
            />
          </Form.Group>
        </Form>
        <div className="CardsList ml-auto mr-auto">
          {workOrders.length > 0 ? workOrders.map((work) => { // display list if workOrders not empty
            const worker = workers.find(w => w.id === work.workerId); // find the worker 
            return <WorkOrder  key={work.id} work={work} worker={worker} />
          }) // if found no workOrders 
          : <h2>No Orders Found</h2>} 
        </div>
      </Container>
    );
  }
}

export default ListCards;
