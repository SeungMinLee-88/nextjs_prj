import Axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from 'react';

export default function ManagerUser({ accessToken }) {
    const router = useRouter();
    async function chkAuthor(){
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