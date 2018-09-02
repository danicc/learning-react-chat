import React, { Component } from 'react';
import './App.css';
import Chatkit from '@pusher/chatkit';

import MessageList from './components/MessageList';
import NewRoomForm from './components/NewRoomForm';
import RoomList from './components/RoomList';
import SendMessageForm from './components/SendMessageForm';
import { tokenUrl, instanceLocator } from './config';

class App extends Component {
  state = {
    roomId: null,
    messages: [],
    joinedRooms: [],
    joinableRooms: []
  }

  async componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: '77',
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    });

    try {
      this.currentUser = await chatManager.connect();
      this.getJoinableRooms();
    } catch (e) {
      console.log('error connecting to chat manager', e);
    }
  }

  subscribeToRoom = (roomId) => {
    this.setState({
      messages: []
    });
    this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
        onNewMessage: (message) => {
          this.setState((prevState) => {
            return {
              messages: [...prevState.messages, message]
            }
          })
        }
      }
    });
    this.setState({
      roomId
    });
    this.getJoinableRooms();
  }

  getJoinableRooms = async () => {
    try {
      const joinableRooms = await this.currentUser.getJoinableRooms();
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms
      })
    } catch(err) {
      console.log('error getting joinable rooms', err) 
    }
  }

  sendMessage = (text) => {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  }

  createRoom = async (name) => {
    try {
      const createdRoom = await this.currentUser.createRoom({
        name
      });
      this.subscribeToRoom(createdRoom.id);
    } catch (err) {
      console.log('error creating a new room', err)
    }
  }

  render() {
    return (
      <div className="app">
        <MessageList 
          messages={this.state.messages}
          roomId={this.state.roomId}
        />
        <NewRoomForm createRoom={this.createRoom}/>
        <RoomList 
          roomId={this.state.roomId}
          subscribeToRoom={this.subscribeToRoom} 
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
        <SendMessageForm 
          disabled={!this.state.roomId}
          sendMessage={this.sendMessage}
          />
      </div>
    );
  }
}

export default App;
