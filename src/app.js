import React from 'react'
import ReactDOM from 'react-dom'
import { Link, HashRouter, Switch, Route } from 'react-router-dom'
import { customerService, loginService } from './services'

let brukerid = null

class Menu extends React.Component {
  render () {
    return (
      <div>
        Menu: <Link to='/'>Innlogging</Link> <Link to='/start'>Start</Link>
      </div>
    )
  }
}

// Component that shows a list of all the customers
class Innlogging extends React.Component {
  render () {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>Brukernavn: </td>
              <td><input type="text" ref="unInput" defaultValue="testson@hotmail.com" /></td>
            </tr>
            <tr>
              <td>Passord: </td>
              <td><input type="password" ref="pwInput" defaultValue="passord" /> </td>
              <td><button ref="innlogginButton">Logg inn</button></td>
            </tr>
          </tbody>
        </table>
      </div>

    )
  }

  // Called after render() is called for the first time
  componentDidMount () {
    this.refs.innlogginButton.onclick = () => {
      loginService.checkLogin(this.refs.unInput.value, this.refs.pwInput.value, (login, medlem_nr) => {
        if (login) {
          console.log('Innlogget')
          brukerid = medlem_nr
          console.log(brukerid)
          this.props.history.push('/start')
        } else {
          console.log('Feil brukernavn eller passord')
        }
      })
    }
  };
}

class StartSide extends React.Component {
  constructor () {
    super()
  }
  render () {
    return (
      <div>
        <h1>Dette er en startside</h1>
      </div>
    )
  }
  componentDidMount () {

  }
}

// Detailed view of one customer
class CustomerDetails extends React.Component {
  constructor (props) {
    super(props) // Call React.Component constructor

    this.customer = {}

    // The customer id from path is stored in props.match.params.customerId
    this.id = props.match.params.customerId
  }

  render () {
    return (
      <div>
        Customer:
        <ul>
          <li>Name: {this.customer.firstName}</li>
          <li>City: {this.customer.city}</li>
        </ul>
        New name: <input type="text" ref='editName' /> <br />
        New city: <input type="text" ref='editCity' />
        <button ref='editCustomerButton'>Edit</button>
      </div>
    )
  }

  // Called after render() is called for the first time
  componentDidMount () {
    // The customer id from path is stored in props.match.params.customerId
    customerService.getCustomer(this.id, (result) => {
      this.customer = result
      this.forceUpdate() // Rerender component with updated data
    })

    this.refs.editCustomerButton.onclick = () => {
      customerService.editCustomer(this.refs.editName.value, this.refs.editCity.value, this.id, () => {
        customerService.getCustomer(this.id, (result) => {
          this.customer = result
          this.forceUpdate()
        })
      })
    }
  }
}

// The Route-elements define the different pages of the application
// through a path and which component should be used for the path.
// The path can include a variable, for instance
// path='/customer/:customerId' component={CustomerDetails}
// means that the path /customer/5 will show the CustomerDetails
// with props.match.params.customerId set to 5.
ReactDOM.render((
  <HashRouter>
    <div>
      <Menu />
      <Switch>
        <Route exact path='/' component={Innlogging} />
        <Route exact path='/customer/:customerId' component={CustomerDetails} />
        <Route exact path='/start' component={StartSide} />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
