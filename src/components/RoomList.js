import React, { Component } from 'react';

class RoomList extends Component {
  render() {
    if (this.props.rooms) {
      const orderedRooms = [...this.props.rooms].sort((a, b) => a.id - b.id);
      return (
        <div className='rooms-list'>
          <h3>Your rooms:</h3>
          <ul>
            {
              orderedRooms.map((room) => {
                const active = this.props.roomId === room.id ? 'active' : '';
                return (
                  <li className={'room ' + active} key={room.id}>
                    <a onClick={() => this.props.subscribeToRoom(room.id)} href="#">{room.name}</a>
                  </li>
                );
              })
            }
          </ul>
        </div>
      )
    }
    return (
      <div>
        Loading
      </div>
    )
  }
}

export default RoomList;