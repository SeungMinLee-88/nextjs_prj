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
export default function ReserveForm({ selectDate, reserveDetailId, formMode }) {
const [getDate, setgetDate] = useState(selectDate);
const [reserveTimes, setReserveTimes] = useState([]);
const [reserveDetail, setReserveDetail] = useState([]);
const [reserveDetailTimes, setReserveDetailTimes] = useState([]);
const reserveDetailTimeList = [];
const [isChecked, setIsChecked] = useState(false);
const [times, dispatch] = React.useReducer(reserveTimeReducer, initialTimes);  
const inputRef1 = useRef();


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

function reserveTimeReducer(times, action) {
  switch (action.type) {
    case 'INITIAL':
      return action.times;
    case 'CHECK':
      return [...times, action.timeId];
    case 'UNCHECK':
      return times.filter(t => t !== action.timeId);
    default:
      throw new Error()
  }
}


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
/*   reserveTimes.map((reserveTime) => (
  reserveTime.reserved == true ? console.log(true) : console.log(false)
)); */

function clearTextInput() {
  inputRef1.current.value= "";
}

const handleTimeChange = (e) => {
  let actionType = "";
  e.target.checked ? actionType = "CHECK" : actionType = "UNCHECK";
  
  e.target.checked ? setIsChecked(true) : setIsChecked(false);
  dispatch({ type: actionType, timeId: e.target.tabIndex})
}

const router = useRouter();

const handleReserveDetail = (e) =>{
  setReserveDetail({...reserveDetail, reserveReason: e.target.value})
}
   return(
<div>
<div style={{display: 'flex', "paddingLeft": "40px", "textAlign": "center" }}>
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
