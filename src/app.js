import React from 'react'
import ReactDOM from 'react-dom'
import { Link, HashRouter, Switch, Route } from 'react-router-dom'
import { userService, loginService } from './services'

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
        <button ref="newPasswordButton">Glemt Passord</button>
        <button ref="newUserButton">Ny bruker</button>
      </div>

    )
  }

  // Called after render() is called for the first time
  componentDidMount () {
    this.refs.innlogginButton.onclick = () => {
      loginService.checkLogin(this.refs.unInput.value, this.refs.pwInput.value, (login, medlemsnr) => {
        if (login) {
          console.log('Innlogget')
          brukerid = medlemsnr
          console.log(brukerid)
          this.props.history.push('/start')
        } else {
          console.log('Feil brukernavn eller passord')
        }
      })
    }
    this.refs.newPasswordButton.onclick = () => {
      this.props.history.push('/nyttpassord')
    }
    this.refs.newUserButton.onclick = () => {
      this.props.history.push('/nybruker')
    }
  };
}

class NyBruker extends React.Component {
  render () {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>Navn: </td>
              <td><input type="text" ref="navnInput" /></td>
            </tr>
            <tr>
              <td>Epost: </td>
              <td><input type="text" ref="epostInput" /></td>
            </tr>
            <tr>
              <td>Medlemsnr: </td>
              <td><input type="number" ref="medlemsnrInput" /></td>
            </tr>
            <tr>
              <td>Telefonnummer: </td>
              <td><input type="number" ref="tlfInput" /></td>
            </tr>
            <tr>
              <td>Adresse: </td>
              <td><input type="text" ref="adresseInput" /></td>
            </tr>
            <tr>
              <td>Passord: </td>
              <td><input type="password" ref="passwordInput1" /></td>
            </tr>
            <tr>
              <td>Gjenta passord: </td>
              <td><input type="password" ref="passwordInput2" /> </td>
            </tr>
          </tbody>
        </table>
        <button ref="createuserButton">Ferdig</button>
      </div>
    )
  }
  componentDidMount () {
    if (this.refs.passwordInput1.value === this.refs.passwordInput2) {
      userService.addUser(this.refs.navnInput.value, this.refs.epostInput.value, this.refs.medlemsnr.value, this.refs.tlfInput.value, this.refs.passwordInput1.value, () => {
        console.log('User added')
      })
    }
  }
}

class NyttPassord extends React.Component {
  render () {
    return (
      <div>

      </div>
    )
  }
}

class StartSide extends React.Component {
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
/*
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
*/
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
        <Route exact path='/start' component={StartSide} />
        <Route exact path='/nybruker' component={NyBruker} />
        <Route exact path='/nyttpassord' component={NyttPassord} />

      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'))
