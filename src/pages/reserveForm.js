import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import {
FormGroup
, FormField
, Form  } from 'semantic-ui-react';
import { useContext, useRef } from 'react';
import { UserIdContext } from './UserContext.js';
import { UserNameContext } from './UserContext.js';

const initialTimes = [];
export default function ReserveForm({ selectDate, reserveDetailId, detailTimes, formMode }) {
const [getDate, setgetDate] = useState(selectDate);
const [reserveTimes, setReserveTimes] = useState([]);
const [reserveDetail, setReserveDetail] = useState([]);
const [reserveDetailTimes, setReserveDetailTimes] = useState([]);
const reserveDetailTimeList = [];
const [isChecked, setIsChecked] = useState(false);
const [times, dispatch] = React.useReducer(reserveTimeReducer, initialTimes);  
const inputRef1 = useRef();

function reserveTimeReducer(times, action) {
  console.log("action : " + JSON.stringify(action))
  
  switch (action.type) {
    case 'INITIAL':
      console.log("times INITIAL : " + JSON.stringify(times))
      return action.times;
    case 'CHECK':
      console.log("times CHECK : " + JSON.stringify(times))
      return [...times, action.timeId];
    case 'UNCHECK':
      console.log("times UNCHECK : " + JSON.stringify(times))
      return times.filter(t => t !== action.timeId);
    default:
      throw new Error()
  }
}

useEffect(() => {
  getData();
  formMode === "update" ? getDetailData() : 
  dispatch({
    type: 'INITIAL',
    times: initialTimes
  });
  setReserveDetail("");
  clearTextInput();

}, [selectDate, reserveDetailId]);
const userId = useContext(UserIdContext);
const userName = useContext(UserNameContext);

async function getData() {
  await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/timeList`, {
      headers: {
        "Content-Type": "application/json", 
        access: localStorage.getItem("access") 
      },
      params: {
        reserveDate: selectDate
      },
    }
  ).then((response) => {
    setgetDate(selectDate)
    setReserveTimes(response.data);
  }).catch(function (error) {
    console.log("error", error);
  });
}

async function getDetailData() {
  await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/reserveDetail/${reserveDetailId}`, {
      headers: {
        "Content-Type": "application/json", 
        access: localStorage.getItem("access") 
      },
      params: {
      },
    }
  ).then((response) => {
    setReserveDetail(
      {
        id : response.data["id"],
        reserveReason : response.data["reserveReason"],
        reserveDate : response.data["reserveDate"],
        userId : response.data["userId"],
        hallId : response.data["hallId"],
        reservePeriod : response.data["reservePeriod"]
      }
    )
    for (var responseKey in response.data) {
      if(responseKey === "reserveTime"){
        for (var timeKey in response.data["reserveTime"]) {
          console.log("reserveTime timeKey time : " +  timeKey + " : " + JSON.stringify(response.data[responseKey][timeKey]["time"]));
          reserveDetailTimeList.push(response.data[responseKey][timeKey]["time"]["id"]
          )   
        }
      }
    }
    setReserveDetailTimes(reserveDetailTimeList); 
    dispatch({
      type: 'INITIAL',
      times: reserveDetailTimeList
    })

  }).catch(function (error) {
    console.log("error", error);
  });
}
  reserveTimes.map((reserveTime) => (
  reserveTime.reserved == true ? console.log(true) : console.log(false)
));

  function clearTextInput() {
    inputRef1.current.value= "";
  }

const handleTimeChange = (e) => {
  console.log("checked : " + e.target.checked);
  console.log("tabIndex : " + e.target.tabIndex);
  var actionType = "";
  actionType="testset";
  e.target.checked ? actionType = "CHECK" : actionType = "UNCHECK";
  
  e.target.checked ? setIsChecked(true) : setIsChecked(false);
  dispatch({ type: actionType, timeId: e.target.tabIndex})
}
console.log("handleTimeChange times : " + JSON.stringify(times));

const router = useRouter();

console.log("formMode : " + formMode);
console.log("handleTimeChange reserveDetail : " + JSON.stringify(reserveDetail));

const handleReserveDetail = (e) =>{
  console.log("e.target.value : "+ e.target.value);
  setReserveDetail({...reserveDetail, reserveReason: e.target.value})
}
   return(
<div>
<div style={{display: 'flex', "padding-left": "40px", "text-align": "center" }}>
{reserveTimes.map((reserveTime, index) => (
  <div key={reserveTime.id} className="ui compact segment" style={{margin: '0'}}>
      {!reserveTime.reserved ?
        <div>
        <input type="checkbox" className="" readOnly="" tabIndex={reserveTime.id} onChange={handleTimeChange} value="1"/>
        {reserveTime.time} ~ {parseInt(reserveTime.time)+1}
        </div>
        : reserveTime.reserveUserId == userId && formMode === "update" ? 
        <label>
        <input type="checkbox" className="" defaultChecked readOnly="" tabIndex={reserveTime.id} onChange={handleTimeChange}/> {reserveTime.time} ~ {parseInt(reserveTime.time)+1}
        </label>
        : 
        <label>
        <input type="checkbox" className="" disabled  readOnly="" tabIndex={reserveTime.id}/>
        {reserveTime.time} ~ {parseInt(reserveTime.time)+1}
        </label>
      }
    </div>
/* )) */
  ))}
</div>
    <Form onSubmit={async evt=>{
      evt.preventDefault();
      const reserveReason = evt.target.reserveReason.value;
      const reserveDate = formMode === "update" ? reserveDetail.reserveDate : selectDate;
      const hallId = 1;
      const reserveTimeSave = times;
      const reservePeriod = times.length;
      if(formMode === "reserve"){
        await Axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/save`, {
          reserveReason: reserveReason,
          reserveDate: reserveDate,
          reserveUserId: userId,
          userName: userName,
          hallId: hallId,
          reserveTimeSave: reserveTimeSave,
          reservePeriod: reservePeriod
        },
        {
          headers: {
            access: localStorage.getItem("access") 
          }
        }
      )
        .then(function (response) {
        alert("Reserve Success")
        router.refresh();
        })
        .catch(function (error) {
          console.log(error);
        });
    }else if(formMode === "update"){
      await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/update`, 
        {
          id: reserveDetail.id,
          reserveReason: reserveReason,
          reserveDate: reserveDetail.reserveDate,
          reserveUserId: userId,
          userName: userName,
          hallId: hallId,
          reserveTimeSave: reserveTimeSave,
          reservePeriod: reservePeriod
        },
        {
          headers: {
            access: localStorage.getItem("access") 
          }
        }
      )
        .then(function (response) {
          alert("Update Success")
          router.refresh();
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }}>
      <FormGroup widths='equal'>
        <FormField>
        ID : {userId}
        </FormField>
        <FormField>
        Name : {userName}
        </FormField>
        <FormField>
        Date : {formMode === "update" ? reserveDetail.reserveDate : selectDate}
        </FormField>
        <FormField>
        Period : {times.length}
        </FormField>
        </FormGroup>
        <FormGroup widths='equal'>
        <FormField>
        <label>Reason</label>
        <input name='reserveReason' value={reserveDetail.reserveReason}
        onChange={handleReserveDetail} ref={inputRef1}/>
        </FormField>
      </FormGroup>
      {formMode === "reserve" ? <button type="submit" className="ui button">reserve</button> 
      : <button type="submit" className="ui button">update</button>}
    </Form>
</div>
)
}
