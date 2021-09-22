import React, { useState, useEffect } from "react";
import { Move } from "./components/Move";
import  Human from "./components/Human";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import EditIcon from '@material-ui/icons/Edit';
export const App = () => {
  // target value
  const [targetValue, setTargetValue] = useState(0);
  //current amont
  const [current, setCurrent] = useState(0);

  // amount of changing
  const [diffAmont, setDiffAmont] = useState(250);

  //edit modal setting variable
  const [targetEdit, setTargetEdit] = useState(false);

  // API URl
  const API_URL = `https://r6ah8ijxul.execute-api.us-east-1.amazonaws.com/pro/vv/2`;
  // connect to API_URL
  const userDataUpdate = async ({ targetValue, current }) => {
    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ targetValue, current }),
      });
      const userData = await res.json();
      return userData;
    } 
    catch (error) {
      console.log(error);
    }
  };
 // connect to API_URL
  const userDataList = async () => {
    try {
      const res = await fetch(API_URL);
      const userData = await res.json();
      if (userData !== null || userData !== undefined) {
        const { targetValue, current } = userData;
        setTargetValue(targetValue);
        setCurrent(current);
        return userData;
      }
      return;
    } 
    catch (error) {
      console.log(error)
    }
  };

  // when component is rendered, calling
   useEffect(() => {
     userDataList();
   }, []);

 // When user edit a mount of targetValue, update the value of targetValue and dynamodb
  const targetValueValueUpdateHandle = (event) => {
      event.preventDefault();
      let targetValueUpdateValue = parseInt(event.target.updateValue.value);
      if (targetValueUpdateValue < current) {
        userDataUpdate({ targetValue: targetValueUpdateValue, current: targetValueUpdateValue });
        setCurrent(targetValueUpdateValue);
      } else {
        userDataUpdate({ targetValue: targetValueUpdateValue, current });
      }
      setTargetValue(targetValueUpdateValue);
      handleClose_modal()
    };
  // handle add
  const handlePlusButton = () => {
    if (current < targetValue) {
      const update = (value) => {
        return value + diffAmont < targetValue ? value + diffAmont : targetValue;
      };
      userDataUpdate({ targetValue, current: update(current) });
      setCurrent((prevTotal) => update(prevTotal));
    }
  };

  // handle minus
  const handleMinusButton = () => {
    if (current > 0) {
      const update = (value) => {
        return value - diffAmont > 0 ? value - diffAmont : 0;
      };
      userDataUpdate({ targetValue, current: update(current) });
      setCurrent((prevTotal) => update(prevTotal));
    }
  };

  //set the value of changing
  const diffAmountSelected = (value) => {
    const selectedValue = parseInt(value);
    // set a mount of changing
    setDiffAmont(selectedValue);
  };

  // closed modal
  const handleClose_modal = () => {
    setTargetEdit(!targetEdit);
  };

  // When clicked noModal_click,  close the modal
  const handleClose = (event) => {
    if (event.target.id === "noModal_click") {
      setTargetEdit(!targetEdit);
    }
  };

   // Start the edit 
  const editModal = () => {
    setTargetEdit(true);
  };
  
/// display the text
  const getText = (val) => {
    if( val >= 100){
        return "Good job today! Lets do it again tomorrow!";}

     else return "Nice work! Keep it Up";
    
  };


  return (
    <div className="container">
      <div className="topBanner">
         <div className="left">
          <span className="topBanner_title">{`${(current / 1000).toString().slice(0, 4)} L`}</span>
          <p className="topBanner_text">TOTAL WATER DRUNK</p>
        </div>
        <div className="right">
          <span className="topBanner_title">2</span>
          <p className="topBanner_text">ACHIEVED GOAL DAYS</p>
        </div>
     </div>

     <div className="main">
        <Human sat_ratia={current / targetValue} />
        <div className="edit" onClick={editModal}>
          <span>
            {`${(targetValue / 1000).toString().slice(0, 4)} L`} <EditIcon style={{fontSize:'18px'}}/>
          </span>
        </div>
    </div>

     <div className="notificationText">
      <span>{getText((current/targetValue)*100)}</span>
    </div>
      <Move
        listItem={[100, 250, 350]}
        selected={diffAmont.toString()}
        diffAmountSelected={diffAmountSelected}
      />


      <div className="topBanner">
        {/* Minus button */}
        <button className="btn plusButton" type="button" onClick={handleMinusButton}>
          <IndeterminateCheckBoxIcon style= {{fontSize:'45px'}}/>
        </button>

        {/* Plus button */}
        <button className="btn minusButton" type="button" onClick={handlePlusButton}>
            <AddCircleIcon style= {{fontSize:'45px'}}/>
        </button>
      </div>



 {/* Edit Modal */}
      {targetEdit && (
            <div id="noModal_click" className="editModal" onClick={handleClose}>
                <div className="modalbody">
                  <span className="close_button" onClick={handleClose_modal}> × </span>
                  <span className="edit_modal_title">UPDATE TARGET WATER</span><br/><br></br>
                  <span className="edit_modal_text">Please enter your new water target below:</span>
                  <form onSubmit={targetValueValueUpdateHandle}>
                      <input type="number" name="updateValue"  id="update" className="inputElementmodal" defaultValue={targetValue}  min="0" max="20000" step="100" required
                      />
                      <button type="submit" className="submitButton">
                        Update
                      </button>
                  </form>
                </div>
        </div>
      )}
    </div>
  );
};

