import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListCards from './components/ListCards';
import { Container, Spinner } from 'react-bootstrap';

const workerURL = 'https://work-orders-fake-api.herokuapp.com/workers/';
const ordersURL = 'https://work-orders-fake-api.herokuapp.com/work_orders';


class App extends Component {
  constructor() {
    super();
    this.state = {
      orders: [], // array of work orders 
      ordersToRender: [], // work orders but sorted || filtered
      workers: [], // array of workers
      searchStrings: '', 
      sortLatest: false,
      isLoading: false
    }
  }

  async componentDidMount() { // fetch data on mount
    await this.fetchData();
  }

  async fetchData() {
    await this.fetchWorkOrders(); // fetch work orders 
    const { orders, workers } = this.state;
    for ( const o of orders ) { // for each order fetch worker if not in workers array already
      const wid = o.workerId;
      const worker = workers.find( ({id}) => id === wid); // check if worker already exsist in array
      if (worker) {
        continue; // worker exsist in array
      } else {
        await this.fetchWorker(wid);
      }
    }
  }

  async fetchWorkOrders() {
    try{
      this.setState({ isLoading: true });
      const res = await fetch(ordersURL)
      if (!res.ok) {
        throw Error(res.statusText);
      }
      const json = await res.json();
      const orders = json.orders;
      this.setState({
        orders: orders,
        ordersToRender: orders.sort((a, b) => { // Earliest First
            return a.deadline - b.deadline
          }),
        isLoading: false
      })
    } catch (error) {
      console.log(error);
    }
  }

  async fetchWorker(id) {
    try{
      this.setState({ isLoading: true });
      let { workers } = this.state;
      const res = await fetch(`${workerURL}${id}`)
      if (!res.ok) {
        throw Error(res.statusText);
      }
      const json = await res.json();
      const worker = json.worker;
      workers.push(worker);
      this.setState({
        workers: workers,
        isLoading: false
      })
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { searchStrings, ordersToRender, workers, isLoading } = this.state;
    if (isLoading) {
      return (
        <Container className="App mt-5">
          <h2> Fetching Data </h2>
          <Spinner animation="border" variant="secondary" />
        </Container>
      );
    }
    return (
      <Container className="App mt-5">
        <ListCards
          orders={ordersToRender}
          workers={workers}
          searchStrings={searchStrings}
          onStringChange={this.handleStringChange}
          onToggleSwitch={this.handleSwitch} />
      </Container>
    );
  }
}

export default App;
