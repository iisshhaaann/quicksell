// src/components/Board.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Board = () => {
  const [groupingOption, setGroupingOption] = useState('status');
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [groupingOption]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.quicksell.co/v1/internal/frontend-assignment`);
      const groupedData = groupDataByOption(response.data.tickets, groupingOption);
      setBoardData(groupedData);
    } catch (error) {
      console.error('Error fetching board data:', error);
    }
  };

  const groupDataByOption = (data, option) => {
    const groupedData = {};
    data.forEach((ticket) => {
      const groupValue = option === 'status' ? ticket.status : option === 'user' ? ticket.userId : ticket.priority;
      if (!groupedData[groupValue]) {
        groupedData[groupValue] = [];
      }
      groupedData[groupValue].push(ticket);
    });
    return groupedData;
  };

  const handleGroupingChange = (option) => {
    setGroupingOption(option);
  };

  return (
    <div className="board">
      <div className="grouping-options">
        <button onClick={() => handleGroupingChange('status')}>By Status</button>
        <button onClick={() => handleGroupingChange('user')}>By User</button>
        <button onClick={() => handleGroupingChange('priority')}>By Priority</button>
      </div>
      {Object.keys(boardData).map((groupValue) => (
        <div key={groupValue} className="group">
          <h3>{groupValue}</h3>
          <div className="tickets">
            {boardData[groupValue].map((ticket) => (
              <div key={ticket.id} className="ticket">
                <h4>{ticket.title}</h4>
                <p>Tag: {ticket.tag.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Board;
