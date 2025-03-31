import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChooseGame.css';
import imgtest from '../image/imgtest.png';
import imgtest2 from '../image/imgtest2.png';

const images = [imgtest, imgtest2, imgtest, imgtest2, imgtest, imgtest2, imgtest, imgtest2];
const descriptions = [
  "Game 1 description", "Game 2 description", "Game 3 description", "Game 4 description", 
  "Game 5 description", "Game 6 description", "Game 7 description", "Game 8 description"
];
const buttons = [
  "เล่นเกม 1", "เล่นเกม 2", "เล่นเกม 3", "เล่นเกม 4", 
  "เล่นเกม 5", "เล่นเกม 6", "เล่นเกม 7", "เล่นเกม 8"
];

function ChooseGame() {
  const navigate = useNavigate();

  const handleButtonClick = (index) => {
    switch (index) {
      case 0:
        navigate('/game1');
        break;
      case 1:
        navigate('/game2');
        break;
      case 2:
        navigate('/game3');
        break;
      case 3:
        navigate('/game4');
        break;
      case 4:
        navigate('/game5');
        break;
      case 5:
        navigate('/game6');
        break;
      case 6:
        navigate('/game7');
        break;
      case 7:
        navigate('/game8');
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid-container">
      {Array.from({ length: 8 }, (_, index) => (
        <div className="card" key={index}>
          <div className="card-image-container">
            <img src={images[index]} alt={`game${index + 1}`}/>
          </div>
          <p className="card-des">
            {descriptions[index]}
          </p>
          <button className="card-button" onClick={() => handleButtonClick(index)}>
            {buttons[index]}
          </button>
        </div>
      ))}
    </div>
  );
}

export default ChooseGame;
