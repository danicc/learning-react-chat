import React, { Component } from 'react';

class SendMessageForm extends Component {
  state = {
    message: ''
  }

  handleChange = (e) => {
    this.setState({
      message: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.sendMessage(this.state.message);
    this.setState({
      message: ''
    });
  }

  render(){
    return (
      <form 
        className='send-message-form'
        onSubmit={this.handleSubmit}>
        <input
          disabled={this.props.disabled}
          type='text'
          placeholder='Type your message and hit ENTER'
          onChange={this.handleChange}
          value={this.state.message}
        />
      </form>
    )
  }  
}

export default SendMessageForm;