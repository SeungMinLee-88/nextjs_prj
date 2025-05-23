import Axios from "axios";
import { useRouter } from "next/router";
import {
  Form
} from 'semantic-ui-react'

export default function Login({setAccessToken, setLoginUserId, setLoginUserName}) {

const router = useRouter();

return (
  <div style={{ padding: "100px 0", textAlign: "center" }}>
    <Form onSubmit={async evt=>{
        evt.preventDefault();
        const loginId = evt.target.loginId.value;
        const userPassword = evt.target.userPassword.value;
        await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login`, 
          {
            loginId: loginId,
            userPassword: userPassword
          },
          {
            withCredentials: true
          },
          {
/*             headers :{
              'Access-Control-Allow-Headers':'Content-Type, Authorization, userName, Response-Header, access',
              'Access-Control-Allow-Methods':'POST, GET, OPTIONS, DELETE',
              'Access-Control-Allow-Origin':'*',
              'Access-Control-Expose-Headers':'userName, access'
            } */
          }
        )
        .then(function (response) {

          if (response.headers.access) {
            localStorage.setItem("access", response.headers.access);
          }
          setAccessToken(localStorage.getItem("access"));
          setLoginUserId(loginId);
          setLoginUserName(response.headers["username"]);
          
          window.sessionStorage.setItem("loginId", loginId);
          window.sessionStorage.setItem("userName", response.headers["username"]); 

          alert("Login Success");
          router.push(`/`);
        })
        .catch(function (error) {
          if(error.response.status === 401){
            alert("Login Fail");
          }
        });
        }}>
      <Form.Field inline>
        <input name="loginId" placeholder="ID" />
      </Form.Field>
      <Form.Field inline>
        <input name="userPassword" type="password" placeholder="Password" />
      </Form.Field>
      <button className="ui primary button" color="blue">
        Login
      </button>
    </Form>
  </div>
);
}