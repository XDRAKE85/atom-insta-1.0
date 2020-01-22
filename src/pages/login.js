import React, { Component } from 'react'
import firebase from 'firebase'
import store from '../tree'

class Login extends Component{
    constructor(props){
      super(props)
      this.state={
          loading: true
      }
    }
    componentDidMount = async () => {
      try {
        console.log(this.props)
        let data = await firebase.auth().getRedirectResult()
        if( data.credential){
            let user = firebase.database().ref(`users/${data.user.uid}`)
            let userFormat = {
              displayName: data.user.displayName,
              photoURL: data.user.photoURL,
              userId: data.user.uid
            }
            user.set(userFormat)
            window.localStorage.setItem('user', JSON.stringify(userFormat))
            store.set("user",userFormat)
            store.commit()
            console.log(this.props)
            let{
                history
            } = this.props
            history.goBack() //redirecciona a la pagina(componente)
          //console.log('Sesión iniciada')
          //console.log(this.props.history)
        } else {
            this.setState({
                loading:false
            })
        } 
      } catch (error) {
        console.log(error)
      }
      
      /*firebase.auth().getRedirectResult().then( function (result){
        if (result.credential){
          console.log('hola',result)
  
          var token = result.credential.accessToken
        }
        var user = result.user
      }) */
    }
  
    handleLoginWithSocialNetwork = async (service) => {
      /*let provider = new firebase.auth.FacebookAuthProvider()
      try {
        provider.addScope('user_birthday')
        let data = await firebase.auth().signInWithPopup(provider)  
        console.log('data', data)
      } catch (error) {
        console.error(error)
      }*/
        let provider
        let stringService
        if( service === 'facebook'){
          //provider = new firebase.auth.FacebookAuthProvider()
          stringService = 'FacebookAuthProvider'
        }else if ( service === 'google'){
          //provider = new firebase.auth.FacebookAuthProvider()
          stringService = 'GoogleAuthProvider'
        }else if ( service === 'email'){
          stringService = 'EmailAuthProvider'
        }
        provider = new firebase.auth[stringService]()
        let data = await firebase.auth().signInWithRedirect(provider)  
    }
    
    render(){
        let{
            loading
        }=this.state
        let content = <p className="cursive-font has-text-centered">Loading...</p> 
        if(!loading){
            content = (
            <div className="buttons">
                <button onClick={() => this.handleLoginWithSocialNetwork('facebook')} className = "button is-fullwidth is-info">
                    Iniciar sesión con Facebook
                </button>
                <br/>
                <br/>
                <button onClick={() => this.handleLoginWithSocialNetwork('google')} className = "button is-fullwidth is-success">
                    Iniciar sesión con Google
                </button>
                <br/>
            </div>
            )
        }


      return (
          <div className="columns">
            <div className="column is-9">
                <img src="/assets/preview.jpg" />
            </div>
            <div className="column has-centered">
                <h1 className="title is-1 has-text-centered cursive-font main-title">
                    Insta Atom
                </h1>
                {
                    content 
                }
                
            </div>
          </div>
      )
    }
  }
  
  export default Login;
  