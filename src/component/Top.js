import Axios from "axios";
import { useRouter } from "next/router";
import { Header } from "semantic-ui-react";
import Gnb from "./Gnb";

export default function Top({setAccessToken, setLoginUserId, setLoginUserName, accessToken}) {
  const router = useRouter();;
  async function logout(){
    console.log("call logout");
    await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/logout` ,
    {},
    {withCredentials: true}
    )
    .then(function (response) {
      if(response.status === 200){
        localStorage.removeItem("access");
        window.sessionStorage.removeItem("loginId"); 
        window.sessionStorage.removeItem("userName"); 
      }
      setAccessToken();
      setLoginUserId();
      setLoginUserName();
      alert("Logout Success");
      router.push(`/`);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
return (
  <div>
    <div style={{ display: "flex", paddingTop: 20 }}>
      <div style={{ flex: "100px 0 0" }}>
        <img
          src="/images/spring.png"
          alt="logo"
          style={{ display: "block", width: 80 }}
        />
      </div>
      <Header as="h1">SpringBoot</Header>
    </div>
    <div style={{display: 'flex',  justifyContent:'right'}}>
      {!accessToken ? 
      <button className="ui primary button" color="blue" onClick={() => {router.push("/login");}}>LogIn</button> 
      : <button className="ui primary button" color="blue" onClick={() => logout()}>LogOut</button>}
    </div>
    <Gnb />
  </div>
);
}