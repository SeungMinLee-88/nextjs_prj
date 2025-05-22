import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import { Checkbox, Segment, FormGroup, FormField, Form  } from 'semantic-ui-react';
import { useContext, useRef, createRef } from 'react';
import { UserIdContext } from './UserContext.js';
import { UserNameContext } from './UserContext.js';

const initialTimes = [];
export default function ReserveForm({ selectDate, reserveDetailId, detailTimes, formMode }) {
  console.log("call ReserveForm");
  console.log("ReserveForm selectDate : " + JSON.stringify(selectDate));
  console.log("ReserveForm reserveDetailId : " + JSON.stringify(reserveDetailId));
  console.log("ReserveForm formMode : " + JSON.stringify(formMode));
  const [getDate, setgetDate] = useState(selectDate);
  const [reserveTimes, setReserveTimes] = useState([]);
  const [reserveDetail, setReserveDetail] = useState([]);
  const [reserveDetailTimes, setReserveDetailTimes] = useState([]);


  
  console.log("detailTimes : " + JSON.stringify(detailTimes));
async function getData() {
  console.log("ReserveForm call getData");
  const reserveTimeList = [];
  await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/timeList`, {
      headers: {
        "Content-Type": "application/json", 
        access: localStorage.getItem("access") 
      },
      params: {
        reserveDate: selectDate
      },
    }
  ).then((response, error) => {
    setgetDate(selectDate)
/*     for (var responseKey in response.data) {
      reserveTimeList.push(response.data[responseKey]["timeId"]);
    } */
      console.log("response reserveTimes : " + JSON.stringify(response.data))
    setReserveTimes(response.data);
    console.log("getData reserveTimes : " + JSON.stringify(reserveTimes))
  }).catch(function (error) {
    console.log("error : " + JSON.stringify(error));

  });
}
const reserveDetailList = [];
const reserveDetailTimeList = [];
const userId = useContext(UserIdContext);
const userName = useContext(UserNameContext);
console.log("ReserveForm userId : " + userId);
console.log("ReserveForm userName : " + userName);

async function getDetailData() {
  console.log("ReserveForm call getDetailData");
  console.log("selectDate " + selectDate);
  const reserveTimeList = [];
  await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/reserveDetail/${reserveDetailId}`, {
      headers: {
        "Content-Type": "application/json", 
        access: localStorage.getItem("access") 
      },
      params: {
      },
    }
  ).then((response, error) => {
    console.log("getDetailData : " + JSON.stringify(response.data));
    
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
    console.log("reserveDetailTimeList : " + JSON.stringify(reserveDetailTimeList));

    setReserveDetailTimes(reserveDetailTimeList); 
    dispatch({
      type: 'INITIAL',
      times: reserveDetailTimeList
    })
    
    console.log("getDetailData reserveDetail : " + JSON.stringify(reserveDetail));
    console.log("getDetailData reserveDetailTimes : " + JSON.stringify(reserveDetailTimes));

  }).catch(function (error) {
    console.log("error cause : " + JSON.stringify(error));
  });
}
console.log("reserveTimes 222222 : " + JSON.stringify(reserveTimes));
console.log("reserveDetailTimes : " + JSON.stringify(reserveDetailTimes));
console.log("initialTimes : " + JSON.stringify(initialTimes));

       reserveTimes.map((reserveTime) => (
        reserveTime.reserved == true ? console.log(true) : console.log(false)
      ));
    
    console.log("set reserveTimeReducer");
    const [times, dispatch] = React.useReducer(reserveTimeReducer, initialTimes);  
    const inputRef1 = useRef();
    function clearTextInput() {
      /* inputRef1.current.focus(); */
      console.log("inputRef1 : " + inputRef1.current.value);
      inputRef1.current.value= "";

    }
    
    const elementsRef = useRef([]);
    const checkBoxRef = useRef([]);
    function clearCheckBox() {
      //elementsRef.current[0].value="1111";
      //checkBoxRef.current[0].value="1";
    }
    
    const [isChecked, setIsChecked] = useState(false);
    useEffect(() => {
      getData();
      formMode === "update" ? getDetailData() : 
      dispatch({
        type: 'INITIAL',
        times: initialTimes
      });
      setReserveDetail("");
      clearTextInput();
      clearCheckBox();
      /* console.log("elementsRef : " + elementsRef.current[0].type); */

    }, [selectDate, reserveDetailId]);

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
            {/* {index} */}
            {/* <input type="text" value="aaa" ref={ref => {elementsRef.current[index] = ref}}/> */}
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
          {reserveTime.reserveUserId === userId && console.log("User match")}
          {console.log("reserveTime.reserveUserId chk!! : " + reserveTime.reserveUserId)}
        </div>
    /* )) */
      ))}
</div>
          <Form onSubmit={async evt=>{
            console.log("call onSubmit");
          //if(formMode === "update") return;
          evt.preventDefault();
          const reserveReason = evt.target.reserveReason.value;
          const reserveDate = formMode === "update" ? reserveDetail.reserveDate : selectDate;
/*           const userId = userId;
          const userName = userName; */
          const hallId = 1;
          const reserveTimeSave = times;
          const reservePeriod = times.length;
          console.log("submit userId : " + userId);
          //return;
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
              console.log("response.data : " + JSON.stringify(response.data));
            /* const board = await resp.json(); */
            // router.push(`/reserve`);
            alert("Reserve Success")
            router.refresh();
            })
            .catch(function (error) {
              console.log(error);
            });
        }else if(formMode === "update"){
          const resp = await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/update`, 
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
              console.log("response.data : " + JSON.stringify(response.data));
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
{/*           <FormField>
          <label>hallId</label>
          <input name='hallId' value={reserveDetail.hallId} onChange={e => setReserveDetail(e.target.value)} />
          </FormField> */}
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
  
  /* timeItems = (
    <div>
    <div style={{display: 'flex'}}>
    {reserveTimes.map((reserveTime) => (
          <div key={reserveTime.id} className="ui compact segment" style={{margin: '0'}}>
              {reserveTime.reserved == true ?
              <div className="ui fitted checkbox">
                <input type="checkbox" className="" readOnly="" tabIndex={reserveTime.id} onChange={handleTimeChange}/>
                <label>
                </label>
                </div>
                : <input type="checkbox" className="" disabled  readOnly="" tabIndex={reserveTime.id}/>
              }
            </div>
          ))}
    </div>
      </div>
    ); */