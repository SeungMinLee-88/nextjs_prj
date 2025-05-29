import React from "react";
import Axios from "axios";
import { useRouter } from "next/navigation";
import { 
FormField
, Form } from 'semantic-ui-react'
import { useEffect, useState, useRef } from "react";
import { useContext } from 'react';

export default function BoardWrite({ changeGoUrl, reissueAccessToken }) {
  const [userName, setUserName] = useState(useContext("")) 
  const [fileList, setFileList] = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    setUserName(window.sessionStorage.getItem("loginId"))
  }, [fileList]);
  
  const fileChange = e => {
    const newFiles = Array.from(e.target.files);
    setFileList(newFiles)
  };
  const renderFileList = () => (
<div>
  <li>
    Attached File : {fileList.length}
  </li>
  <ol>
    {[...fileList].map((f, i) => (
        <li key={i}>{f.name} - {f.type}</li>
    ))}
  </ol>
</div>  )

      const onFormSubmit = async evt => {
        evt.preventDefault(); 
          const boardWriter = userName;
          const boardTitle = evt.target.boardTitle.value;
          const boardContents = evt.target.boardContents.value;
          const formData = new FormData();
          formData.append("boardTitle", boardTitle);
          formData.append("boardWriter", boardWriter);
          formData.append("boardContents", boardContents);
          console.log("fileList.len : " + fileList.length);
          if(fileList.length === 0) {
          }else{
          fileList.forEach((fileList) => {
            formData.append('boardFile', fileList);
           });
          }
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
                    router.push(`/Board`); 
                  }
                  
                }
                else
                {
                  console.log("Reissue false")
                }
            }
          });
      };

  const fileInputRef1 = useRef();
    return (
      <div>
        <Form onSubmit={onFormSubmit}>
            <FormField>
            <label><span>Title</span> <span style={{"marginLeft": "680px"}}>Writer :  {userName}</span></label>
            <input name='boardTitle' />
            </FormField>
            <FormField name='boardContents' label='Contents' as="" control='textarea' rows='3' />
            <Form.Field>
              <input type="file" name='files' multiple onChange={fileChange} ref={fileInputRef1} hidden/>
              {renderFileList()}
              <button type="button"
                  name = "fileBtn"
                  className="ui icon left labeled button"
                  labelposition="left"
                  icon="file"
                  onClick={() => fileInputRef1.current.click()}
                ><i aria-hidden="true" className="file icon"></i>Choose File</button>
              </Form.Field>
            <div style={{display: 'flex', justifyContent:'right'}}>
            <button type="button"  className="ui button" onClick={() => changeGoUrl("/")}>List</button>
            <button type="submit" className="ui button">Write</button>
            </div>
        </Form>
      </div>
    );
}
