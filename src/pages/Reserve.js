import React from "react";
import { useEffect, useState, useRef  } from "react";
import { useRouter } from "next/navigation";
import Axios from "axios";
import ReserveForm from "./reserveForm";
import { useContext } from 'react';
import { UserIdContext } from './UserContext.js';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

const initialTasks = {
  events: [
    { id: 1, title: "event 1", date: "2025-04-03" },
    {
      id: 2,
      title: "event 2",
      start: "2025-04-01T10:00:00",
      end: "2025-04-01T11:00:00",
      allDay: false,
      HostName: "William"
    },
    {
      id: 3,
      title: "event 3",
      start: "2025-04-01T13:00:00",
      end: "2025-04-01T15:00:00",
      allDay: false
    },
    {
      id: 4,
      title: "event 4",
      start: "2025-04-01T16:00:00",
      end: "2025-04-01T17:00:00",
      allDay: false
    }
  ]}
;
const times = [];
const reserveList = [];

export default function Reserve({ reissueAccessToken }) {
  //console.log("sessionStorage userId : " + window.sessionStorage.getItem("userId"));
    const [reserveData, setreserveData] = useState([]);
    var moment = require('moment');
      const userId = useContext(UserIdContext);
       console.log("Reserve userId : " + userId);
       /* const [userId, setuserId] = useState(sessionUserId); */

    async function getData() {
      

      //setuserId(sessionUserId);
      console.log("getData userId : " + userId);
      console.log("getData toolBarState : " + toolBarState);
      
      console.log("getData moment : " + moment(new Date()).format('YYYYMM'));
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
      ).then((response, error) => {
        /* console.log("response.data[0] : " + JSON.stringify(response.data[0])); */
         /*  console.log("response.data[0] : " + JSON.stringify(response.data[0]));
          console.log("response.data[0] : " + response.data[0]);
          console.log("=====================================================");
          console.log("response.data : " + JSON.stringify(response.data[0]["id"]));
          
          console.log("response reserveDate : " + moment(response.data[0]["reserveDate"]).format("YYYY-MM-DD"));
          console.log("=====================================================");
          
          //start: moment(response.data[0]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[0]["reserveTime"][0]["time"]["time"]+":00:00",
          console.log("response.data length : " + response.data.length) */
          console.log("moment : " + moment(response.data[0]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[0]["reserveTime"][0]["time"]["time"]+":00:00");
          const reserveTotalList = [];
          for (var responseKey in response.data) {
            //console.log("responseKey[responseKey] :" + JSON.stringify(response.data[responseKey]["reserveTime"]));
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
          for (var timeKey in response.data[0]["reserveTime"]) {
            //console.log("timeKey loop");
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
              /* setreserveData(
                ...reserveData,
                [{
                  id: response.data[0]["id"],
                  title: response.data[0]["reserveReason"],
                  start: moment(response.data[0]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[0]["reserveTime"][0]["time"]["time"]+":00:00",
                  end: moment(response.data[0]["reserveDate"]).format("YYYY-MM-DD")+"T"+response.data[0]["reserveTime"][0]["time"]["time"]+":00:00",
                  time: response.data[0]["reserveTime"][timeKey]["time"]["time"],
                  allDay: false
                }]
              ); */
              if (!response.data[0].hasOwnProperty(key)) continue;
  /*             if(key === "reserveTime"){
                for (var timeKey in response.data[0][key]) {
                  console.log("timeKey : " + timeKey + " || response.data[0][timeKey] :" + response.data[0][key][timeKey]["time"]);
                  for (var timeKeytimes in response.data[0][key][timeKey]["time"]) {
                    if(timeKeytimes === "time"){
                      console.log("timeKeytimes : " + timeKeytimes + " || response.data[0][timeKeytimes] :" + response.data[0][key][timeKey][timeKeytimes]["time"]);
                      times.push(response.data[0][key][timeKey][timeKeytimes]["time"]);
                    }
                  }
                }
              } */
          }
        }
        setreserveData(reserveTotalList);
        })
        .catch(async function (error) {
          
/*           console.log("error : " + error);
          console.log("data : " + error.response.data);
          console.log("status : " + error.response.status);
          console.log("headers : " + error.response.headers);
          console.log("error : " + error.response.data); */
          /* if(error.response.status === 401){
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
          } */
        });
        
        
    }
    
    console.log("reserveData chk : " + JSON.stringify(reserveData)); 
    const [formMode, setFormMode] = useState(""); 
    const [isVisible, setisVisible] = useState(false);
    const [selectDate, setSelectDate] = useState("");
    const [toolBarState, setToolBarState] = useState(moment(new Date()).format('YYYYMM'));
    useEffect(() => {
      getData();
      console.log("reserve useEffect userId : " + JSON.stringify(userId));
      console.log("times 222 : " + JSON.stringify(times));
    }, [selectDate, userId, formMode, isVisible, toolBarState]);
/*     console.log("reserveData : " + JSON.stringify(reserveData)); */
   // console.log("reserveData[0].events : " + JSON.stringify(reserveData.events));



      const handleSelectedDates = info => {
/*         console.log("info : " + JSON.stringify(info));
        console.log("moment start : " + moment(info.start).format('YYYY-MM-DD')); */
  
        var  startDate = moment(info.start);
        console.log("startDate : " + startDate);
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
/*         console.log("reserve SelectDate : " + selectDate); */
        setisVisible(true);
        console.log("handleSelectedDates isVisible : " + isVisible);
      }
      
      const [reserveDetailId, setReserveDetailId] = useState("");
      const [reserveDetail, setReserveDetail] = useState([]);
      const [reserveDetailTimes, setReserveDetailTimes] = useState([]);
      async function getDetailData(detailId) {
        console.log("getDetailData detailId : " + detailId);
        const reserveDetailList = [];
        const reserveDetailTimeList = [];
        console.log("ReserveForm call getDetailData");
        console.log("selectDate " + selectDate);
        const reserveTimeList = [];
        await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/reserve/reserveDetail/${detailId}`, {
            headers: {
              "Content-Type": "application/json", 
              access: localStorage.getItem("access") 
            },
            params: {
            },
          }
        ).then((response, error) => {
          //console.log("getDetailData : " + JSON.stringify(response.data));

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
            //console.log(responseKey + " : responseKey[responseKey] :" + JSON.stringify(response.data[responseKey]));
            //console.log("reserveTime :" + JSON.stringify(response.data["reserveTime"]));
            //console.log("responseKey[responseKey] :" + JSON.stringify(response.data[responseKey]["reserveTime"]));
            
            if(responseKey === "reserveTime"){
              for (var timeKey in response.data["reserveTime"]) {
                console.log("reserveTime timeKey time : " +  timeKey + " : " + JSON.stringify(response.data[responseKey][timeKey]["time"]));
                reserveDetailTimeList.push(response.data[responseKey][timeKey]["time"]["id"]
                )   
              }
            }
          }
          //reserveDetailTimes.push(reserveDetailTimeList)
          console.log("afterPushDetailTimes : " + JSON.stringify(reserveDetailTimes));
          setReserveDetail(reserveDetailList);
          setReserveDetailTimes(reserveDetailTimeList);
      
        }).catch(function (error) {
          console.log("error : " + JSON.stringify(error));
        });
      }
      const handleEventClick  = (arg) => {
        //return alert(arg.dateStr);
/*         console.log("arg id : " + JSON.stringify(arg.event.id));
        console.log("arg title : " + JSON.stringify(arg.event.title));
        console.log("arg reserveReason : " + JSON.stringify(arg.event.extendedProps.reserveReason));
        console.log("arg reserveDate : " + JSON.stringify(arg.event.extendedProps.reserveDate));
        console.log("arg userId : " + JSON.stringify(arg.event.extendedProps.userId));
        console.log("arg hallId : " + JSON.stringify(arg.event.extendedProps.hallId));
        console.log("arg reservePeriod : " + JSON.stringify(arg.event.extendedProps.reservePeriod)); */
        
        console.log("arg.event.extendedProps.reserveDate : " + arg.event.extendedProps.reserveDate);
        console.log("arg.event.id : " + arg.event.id);
        setSelectDate(arg.event.extendedProps.reserveDate);
        setReserveDetailId(arg.event.id);
        console.log("handleEventClick reserveDetailId : " + reserveDetailId);
        getDetailData(arg.event.id);
        setisVisible(true);
        setFormMode("update");
        
      };
      
  const calendarRef = useRef(null);

  const handleNextButtonClick = () => {
    if (calendarRef.current) {
      console.log(calendarRef.current.calendar.currentData.currentDate)
      const currentMonth = moment(calendarRef.current.calendar.currentData.currentDate).format('YYYYMM');
      console.log("currentMonth : " + parseInt(currentMonth)+1);
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setToolBarState(parseInt(currentMonth)+1);
    }
  };
  const handlePrevButtonClick = () => {
    if (calendarRef.current) {
      console.log(calendarRef.current.calendar.currentData.currentDate)
      const currentMonth = moment(calendarRef.current.calendar.currentData.currentDate).format('YYYYMM');
      console.log("currentMonth : " + parseInt(currentMonth)-1)
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
