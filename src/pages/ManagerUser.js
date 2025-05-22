import Axios from "axios";
import { useRouter } from "next/router";
import { Header } from "semantic-ui-react";
import { Button, Form } from "semantic-ui-react";
import { useEffect, useContext } from 'react';
import { UserIdContext } from '../pages/UserContext.js';

export default function ManagerUser({setAccessToken, setLoginUserId, setLoginUserName, accessToken}) {
    const router = useRouter();
      //console.log("accessToken : " + localStorage.getItem("access"))
    //const accessToken = useContext(AccessTokenContext);
      const userId = useContext(UserIdContext);
      console.log("ManagerUser userId : " + userId);
      
    async function chkAuthor(){
      console.log("call chkAuthor");
      console.log("ManagerUser accessToken : " + accessToken);
      await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/manageUser` ,
      {
        headers: {
            'access' : accessToken
          }
      },
        {
        withCredentials: true
        }
      )
      .then(function (response) {


        //router.refresh();
        //router.push(`/`);
      })
      .catch(function (error) {
        if(error.response.status === 403){
                alert("you are not authorized");
                router.push(`/`); 
        }
      });
    }
    
    useEffect(() => {
        chkAuthor()
    }, []);
    
    
    return (
      <div>
      ManagerUser
      </div>
    );
}