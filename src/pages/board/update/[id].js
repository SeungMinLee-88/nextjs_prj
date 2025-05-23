import React from "react";
import Axios from "axios";
import { useRouter } from "next/navigation";
import { FormGroup
, FormField
, Form
, Divider
, ListItem
, Loader } from 'semantic-ui-react'
import { useEffect, useState, useRef } from "react";
import { useContext } from 'react';
import { UserIdContext } from '../../UserContext.js';

export default function BoardUpdate({ board, id }) {
const [fileList, setFileList] = useState([]);
const [fileUpdateList, setFileUpdateList] = useState([]);
const [boardDetail, setBoardDetail] = useState(board);
const userId = useContext(UserIdContext);

useEffect(() => {
  board && setBoardDetail(boardDetail); setFileList(boardDetail["boardFileDTO"]);
}, [fileList]);

const router = useRouter();
const fileInputRef1 = useRef();
const fileFormRef1 = React.createRef();

if (router.isFallback) {
  return (
    <div style={{ padding: "100px 0" }}>
      <Loader active inline="centered">
        Loading
      </Loader>
    </div>
  );
  }


const fileChange = e => {

  const newFiles = Array.from(e.target.files);
  setFileUpdateList(newFiles)
  console.log("fileUpdateList : " +  JSON.stringify(fileUpdateList))
};
  
const renderFileList = () => (
  <div>
  {console.log("fileUpdateList : " + fileUpdateList.length)}
      <li>
        Attached File : {fileUpdateList.length}
      </li>
    <ol>
      {[...fileUpdateList].map((f, i) => (
          <li key={i}>{f.name} - {f.type}</li>
      ))}
  </ol>
  </div>
)

  const fileDelete = async function (fileId, boardId) {
    if(window.confirm('Delete attached file?')){
      await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/fileDelete/${fileId}&${boardId}`, {
        headers: {
          "Content-Type": "application/json", 
          access: localStorage.getItem("access") 
        },
        params: {
          fileId: fileId,
          boardId: boardId
        },
      }
    ).then((response) => {

      setFileList(response.data);
      alert("Delete Success");
      router.refresh();

    }).catch(function (error) {
      console.log("error", error);
    });
    };
  };
  

const onFormSubmit = async evt => {
  evt.preventDefault(); 

  const boardId = boardDetail.id;
  const boardWriter = boardDetail.boardWriter;
  const boardPass = boardDetail.boardPass;
  const boardTitle = boardDetail.boardTitle;
  const boardContents = boardDetail.boardContents;
  const formData = new FormData();

  formData.append("boardId", boardId);
  formData.append("boardTitle", boardTitle);
  formData.append("boardPass", boardPass);
  formData.append("boardWriter", boardWriter);
  formData.append("boardContents", boardContents);

  if(fileUpdateList.length === 0) {

  }else{

    fileUpdateList.forEach((fileUpdate) => {

    formData.append('boardFile', fileUpdate);
    });
  }


  await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/updateBoard`,
    formData,
    {
      headers: 
      {
        'Content-Type': 'multipart/form-data' 
      }
    })
  .then(function (response) {

  alert("Update Success");
  router.push(`/board/detail/${id}`);
  })
  .catch(function (error) {
    console.log(error);
  });
};


    
    
return (
<>
  {board && (
  <div>
    <Form onSubmit={onFormSubmit}>
      <FormGroup widths='equal'>
      <FormField style={{width: "100px", "text-align":"left", "font-size":"20px"}}>
        Writer : {boardDetail.boardWriter}
      </FormField>
      </FormGroup>
      <FormGroup widths='equal'>
      <FormField>
      <label>Title</label>
      <input name='boardTitle' value={boardDetail.boardTitle} onChange={e => setBoardDetail({...boardDetail, boardTitle: e.target.value})} />
      </FormField>
      </FormGroup>
      <FormField label='Contents' as="" control='textarea' rows='3' value={boardDetail.boardContents} 
      onChange={e => setBoardDetail({...boardDetail, boardContents: e.target.value})} />
      {board['fileAttached'] === 1 &&(
  <div>
    <div role="list" className="ui bulleted horizontal link list">
    <ListItem active>Attached | </ListItem>
  {fileList.map((files) => (
    <div key={files.id} id={files.id} role="listitem" className="item"  href={"http://localhost:8090/api/v1/board/download/"+files.storedFileName} target="_blank">{files.originalFileName}
      <i id={files.id} aria-hidden="true" className="delete icon" style={{hover: "background-color: #ff0000"}} onClick={() => fileDelete(files.id, files.boardId)}></i>
    </div>
    ))}
    </div>
  </div>
)}
<Form.Field>
  <div ref={fileFormRef1}>
<input type="file" name='files' multiple onChange={fileChange} ref={fileInputRef1} hidden/>
{renderFileList()}
<button type="button"
  name = "fileBtn"
  className="ui icon left labeled button"
  labelposition="left"
  icon="file"
  onClick={() => fileInputRef1.current.click()}>
  <i aria-hidden="true" className="file icon">
  </i>Choose File
  </button>
  </div>
</Form.Field>
  <Divider />
  <button type="submit" className="ui button">Update</button>
  {userId === board.boardWriter ? <button className="ui button"  onClick={() => router.push(`http://localhost:3000/board/detail/${id}`)}>Cancel</button> : ""}
</Form>
</div>
  )}
</>
);
};

export async function getStaticPaths() {
  const apiUrl =  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/list`;
  const res = await Axios.get(apiUrl);
  const data = res.data;
  return {
    paths: data.slice(0, 100).map((item) => ({
      params: {
        id: item.id.toString(),
      },
    })),
    fallback: true,
  };

}

export async function getStaticProps(context) {
  
  console.log("call getStaticProps");
  const id = context.params.id;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/detail/${id}`;
  const res = await Axios.get(apiUrl);
  const data = res.data;

  return {
    props: {
      board: data,
      name: process.env.name,
      id: id
    },
  };
}
