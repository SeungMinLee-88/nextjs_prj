import React from "react";
import Axios from "axios";
import { useRouter } from "next/navigation";
import { FormGroup, FormField, Form, SegmentGroup, Segment } from 'semantic-ui-react'
import { useEffect, useState, useRef } from "react";
import { useContext } from 'react';

export default function BoardWrite({ changeGoUrl, reissueAccessToken }) {
  const [userName, setUserName] = useState(useContext("")) 
  const [fileList, setFileList] = useState([]);
  const [fileNameList, setfileNameList] = useState("");
  console.log("BoardWrite userName : " + userName);

  const router = useRouter();
  const data = new FormData();
  const fileChange = e => {
    console.log("e.target.value : " +  e.target.value)
    console.log("e.target.name : " +  e.target.name)
    console.log("e.target.files : " +  JSON.stringify(e.target.files))
    console.log("e.target.files[0] : " +  JSON.stringify(e.target.files[0]))
/*State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().     
setFileList({...fileList,fileList : Array.from(e.target.files)}, () => { console.log("callback fileList : " + JSON.stringify(fileList)) }) */
    const newFiles = Array.from(e.target.files);
    setFileList(newFiles)
    console.log("fileList : " +  JSON.stringify(fileList))
  };
  const renderFileList = () => (
<div>
{console.log("fileList : " + fileList.length)}
    <li>
      Attached File : {fileList.length}
    </li>
  <ol>

    {[...fileList].map((f, i) => (
        <li key={i}>{f.name} - {f.type}</li>
    ))}
</ol>
</div>  )
useEffect(() => {
  setUserName(window.sessionStorage.getItem("loginId"))
}, [fileList]);

      const onFormSubmit = async evt => {
        evt.preventDefault(); 
        console.log("prevent test");
        console.log("evt.target.boardTitle.value : " + evt.target.boardTitle.value);
          const boardWriter = userName;
          const boardTitle = evt.target.boardTitle.value;
          const boardContents = evt.target.boardContents.value;
          const formData = new FormData();
          /* formData.append("boardFile", fileList); */
          formData.append("boardTitle", boardTitle);
          /* formData.append("boardPass", "boardPass"); */
          formData.append("boardWriter", boardWriter);
          formData.append("boardContents", boardContents);
          console.log("fileList.len : " + fileList.length);
          if(fileList.length === 0) {
            console.log("fileList.length === 0");
            //formData.append('boardFile', []);
          }else{
            console.log("fileList.length !== 0");
          fileList.forEach((fileList) => {
            console.log("forEach : " + JSON.stringify(fileList))
            formData.append('boardFile', fileList);
           });
          }
          //formData.append("boardFile[]", fileList);
          
          console.log("formData : " + JSON.stringify(formData))
          const accessToken = localStorage.getItem("access")
    
          await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/boardSave`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'access' : accessToken
              }
            }
          )
          .then(function (response) {
            alert("Save Success");
            router.push(`/Board`);
          })
          .catch(async function (error) {
            console.log("error : " + error);
            console.log("data : " + error.response.data);
            console.log("status : " + error.response.status);
            console.log("headers : " + error.response.headers);
            console.log("error : " + error.response.data);
            
            if(error.response.status === 401){
              if(confirm("Session is expired. Do you want Reissue?"))
                {
                  console.log("Reissue true")
                  const reissueResult = await reissueAccessToken();
                  console.log("BoardWrite reissueResult : " +reissueResult);
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
          //router.refresh();
    
      };

  const fileInputRef1 = useRef();
  const fileFormRef1 = React.createRef();
    return (
      <div>
        {/* <Form onSubmit={async evt=>{
          evt.preventDefault();}}> */}
        <Form onSubmit={onFormSubmit}>

            <FormField>
            <label><span>Title</span> <span style={{"marginLeft": "700px"}}>Writer :  {userName}</span></label>

            <input name='boardTitle' />
            </FormField>

            <FormField name='boardContents' label='Contents' as="" control='textarea' rows='3' />

            <Form.Field>
              <div ref={fileFormRef1}>
              <input type="file" name='files' multiple onChange={fileChange} ref={fileInputRef1} hidden/>
              {renderFileList()}
              <button type="button"
                  name = "fileBtn"
                  className="ui icon left labeled button"
                  labelposition="left"
                  icon="file"
                  onClick={() => fileInputRef1.current.click()}
                ><i aria-hidden="true" className="file icon"></i>Choose File</button>
                </div>
              </Form.Field>
            <div style={{display: 'flex', justifyContent:'right'}}>
            <button type="button"  className="ui button" onClick={() => changeGoUrl("/")}>List</button>
            <button type="submit" className="ui button">Write</button>
            </div>
        </Form>
      </div>
    );
}
