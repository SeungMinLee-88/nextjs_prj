import React from "react";
import { useEffect, useState, useRef  } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import ReserveForm from "./ReserveForm";
import { useContext } from 'react';
import { UserIdContext } from './UserContext.js';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

const times = [];
const reserveList = [];

export default function Reserve({ reissueAccessToken }) {
  var moment = require('moment');
const [reserveData, setreserveData] = useState([]);
const [formMode, setFormMode] = useState(""); 
const [isVisible, setisVisible] = useState(false);
const [selectDate, setSelectDate] = useState("");
const [toolBarState, setToolBarState] = useState(moment(new Date()).format('YYYYMM'));
const [reserveDetailId, setReserveDetailId] = useState("");
const [reserveDetail, setReserveDetail] = useState([]);
const [reserveDetailTimes, setReserveDetailTimes] = useState([]);
const calendarRef = useRef(null);


const userId = useContext(UserIdContext);

useEffect(() => {
  getData();

}, [selectDate, userId, formMode, isVisible, toolBarState]);


async function getData() {
  await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/reserveList`, {
      headers: {
        "Content-Type": "application/json", 
        access: localStorage.getItem("access") 
      },
      params: {
        reserveDate: toolBarState,
        reserveUserId: userId
      },
    }
  ).then((response) => {
      const reserveTotalList = [];
      for (var responseKey in response.data) {
        for (var timeKey in response.data[responseKey]["reserveTime"]) {
          reserveTotalList.push(
            {
                id: response.data[responseKey]["id"],
                title: response.data[responseKey]["reserveReason"],
                reserveReason: response.data[responseKey]["reserveReason"],
                reserveDate: response.data[responseKey]["reserveDate"],
                hallId: response.data[responseKey]["hallId"],
                reservePeriod: response.data[responseKey]["reservePeriod"],
                start: moment(response.data[responseKey]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[responseKey]["reserveTime"][timeKey]["time"]["time"]+":00:00",
                end: moment(response.data[responseKey]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[responseKey]["reserveTime"][timeKey]["time"]["time"]+":00:00",
                time: response.data[responseKey]["reserveTime"][timeKey]["time"]["time"],
                userId: response.data[responseKey]["userId"],
                allDay: false
              }
            );
        }
      }
      if(response.data[0]){
        for (var timeKey in response.data[0]["reserveTime"]) {
          reserveList.push(
            {
              id: response.data[0]["id"],
              reserveReason: response.data[0]["id"],
              title: response.data[0]["reserveReason"],
              start: moment(response.data[0]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[0]["reserveTime"][0]["time"]["time"]+":00:00",
              end: moment(response.data[0]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[0]["reserveTime"][0]["time"]["time"]+":00:00",
              time: response.data[0]["reserveTime"][timeKey]["time"]["time"],
              allDay: false
              }
            );
          for (var key in response.data[0]) {
            if (!response.data[0].hasOwnProperty(key)) continue;
          }
      }
    }
    setreserveData(reserveTotalList);
    })
    .catch(async function (error) {
      console.log("error : " + error);
      
      if(error.response.status === 401){
        if(confirm("Session is expired. Do you want Reissue?"))
          {
            console.log("Reissue true")
            setTimeout(() => console.log("after"), 3000);
            const reissueResult = await reissueAccessToken();
            console.log("reserve reissueResult : " +reissueResult);
            if(reissueResult){
              alert("Reissue success")
            }else{
              alert("Reissue false");
              //router.push(`/Board`); 
            }
            
          }
          else
          {
            console.log("Reissue false")
          }
      }
    });
    
    
}
const handleSelectedDates = info => {
  var  startDate = moment(info.start);
  var endDate = moment(info.end);
  const date = startDate.clone();
  var isWeekend = false;
  
  while (date.isBefore(endDate)) {
    if (date.isoWeekday() == 6 || date.isoWeekday() == 7) {
      isWeekend = true;
    }
    date.add(1, 'day');
  }
  if (isWeekend) {
  alert('can\'t add event - weekend');
  return false;
  }
  setSelectDate(startDate.format('YYYYMMDD'));
  setReserveDetailId("");
  setFormMode("reserve");
  setisVisible(true);
}

async function getDetailData(detailId) {
const reserveDetailList = [];
const reserveDetailTimeList = [];

  await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/reserveDetail/${detailId}`, {
      headers: {
        "Content-Type": "application/json", 
        access: localStorage.getItem("access") 
      },
      params: {
      },
    }
  ).then((response) => {
    reserveDetailList.push(
      {
        id : response.data["id"],
        reserveReason : response.data["reserveReason"],
        reserveDate : response.data["reserveDate"],
        userId : response.data["userId"],
        hallId : response.data["hallId"],
        reservePeriod : response.data["reservePeriod"]
      }
  )
  setReserveDetailTimes([])
  for (var responseKey in response.data) {
    if(responseKey === "reserveTime"){
      for (var timeKey in response.data["reserveTime"]) {
        reserveDetailTimeList.push(response.data[responseKey][timeKey]["time"]["id"]
        )   
      }
    }
  }
  setReserveDetail(reserveDetailList);
  setReserveDetailTimes(reserveDetailTimeList);

  }).catch(function (error) {
    console.log("error : " + JSON.stringify(error));
  });
}
const handleEventClick  = (arg) => {   

  setSelectDate(arg.event.extendedProps.reserveDate);
  setReserveDetailId(arg.event.id);
  getDetailData(arg.event.id);
  setisVisible(true);
  setFormMode("update");
  
};
      

const handleNextButtonClick = () => {
if (calendarRef.current) {
  const currentMonth = moment(calendarRef.current.calendar.currentData.currentDate).format('YYYYMM');
  const calendarApi = calendarRef.current.getApi();
  calendarApi.next();
  setToolBarState(parseInt(currentMonth)+1);
}
};
const handlePrevButtonClick = () => {
if (calendarRef.current) {
  const currentMonth = moment(calendarRef.current.calendar.currentData.currentDate).format('YYYYMM');
  const calendarApi = calendarRef.current.getApi();
  calendarApi.prev();
  setToolBarState(parseInt(currentMonth)-1);
}
};
return(
  <div>

    <FullCalendar
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

    headerToolbar={{
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    }}
    customButtons= {{
      prev: {
        text: 'prev',
        click: handlePrevButtonClick
      },
      next: {
        text: 'next',
        click: handleNextButtonClick
      }
    }}
    ref={calendarRef}
    initialView='dayGridMonth'
    select={handleSelectedDates}
    eventClick={handleEventClick}
    editable={false}
    selectable={true}
    selectMirror={true}
    dayMaxEvents={true}
    weekends={true}
    events={{events: reserveData}}
    eventTimeFormat={{
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }}
    displayEventEnd={true}
    /* you can update a remote database when these fire:
    eventAdd={function(){}}
    eventChange={function(){}}
    eventRemove={function(){}}
    */
    />
      {isVisible && (
        <ReserveForm selectDate={selectDate} reserveDetailId={reserveDetailId} reserveDetailTimes={reserveDetailTimes} formMode={formMode} />
      )}
  </div>
)
}
