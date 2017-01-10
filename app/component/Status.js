import React from 'react';
import chessStore from '../store/chessStore';

export default class Status extends React.Component{
   constructor(props){
       super(props);
       this.state = {};

       chessStore.on('ALREADY_TAKEN', this.showAlreadyTaken.bind(this));
       chessStore.on('REFRESH', this.refresh.bind(this));
   }

   render(){
       return (
           <p>{this.state.message}</p>
       );
   }

   showAlreadyTaken({row, col}){
       let message = `Oh, the cell at [${row+1},${col+1}] has been taken.`;
       this.setState({message});
   }

   refresh(){
       let message = '';
       this.setState({message});
   }
}
