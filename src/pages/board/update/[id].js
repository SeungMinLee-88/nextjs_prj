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
  console.log("boardDetail : " +  JSON.stringify(boardDetail))
  if (board !== null) return board && setBoardDetail(boardDetail); setFileList(boardDetail["boardFileDTO"]);
  console.log("useEffect fileList : " + JSON.stringify(fileList));
}, [fileList]);


  const router = useRouter();
  
  
  if (router.isFallback) {
    return (
      <div style={{ padding: "100px 0" }}>
        <Loader active inline="centered">
          Loading
        </Loader>
      </div>
    );
  }

  console.log("update userId : " + userId);

  const fileChange = e => {
    console.log("e.target.value : " +  e.target.value)
    console.log("e.target.name : " +  e.target.name)
    console.log("e.target.files : " +  JSON.stringify(e.target.files))
    console.log("e.target.files[0] : " +  JSON.stringify(e.target.files[0]))
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
    ).then((response, error) => {
      console.log("response : " + JSON.stringify(response.data));
      setFileList(response.data);
      alert("Delete Success");
      router.refresh();
      console.log("fileDelete fileList : " + JSON.stringify(fileList));
    }).catch(function (error) {
      console.log("error cause : " + JSON.stringify(error));
    });
    };
    console.log("fileId : " +  fileId);
    console.log("boardId : " +  boardId)
  };
  
  const getFileList = async function (boardId) {

      await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/fileList/${fileId}`, {
        headers: {
          "Content-Type": "application/json", 
          access: localStorage.getItem("access") 
        },
        params: {
        },
      }
    ).then((response, error) => {
      console.log("response : " + JSON.stringify(response.data));
      setFileList(response.data);
      console.log("fileDelete fileList : " + JSON.stringify(fileList));
    }).catch(function (error) {
      console.log("error cause : " + JSON.stringify(error));
    });

  };
  

//console.log("boardDetail : " +  JSON.stringify(boardDetail))
      const onFormSubmit = async evt => {
        evt.preventDefault(); 
        console.log("prevent test");
        //console.log("onFormSubmit boardDetail : " +  JSON.stringify(boardDetail))
          const boardId = boardDetail.id;
          const boardWriter = boardDetail.boardWriter;
          const boardPass = boardDetail.boardPass;
          const boardTitle = boardDetail.boardTitle;
          const boardContents = boardDetail.boardContents;
          const formData = new FormData();
          /* formData.append("boardFile", fileList); */
          formData.append("boardId", boardId);
          formData.append("boardTitle", boardTitle);
          formData.append("boardPass", boardPass);
          formData.append("boardWriter", boardWriter);
          formData.append("boardContents", boardContents);
          console.log("fileUpdateList.len : " + fileUpdateList.length);
          if(fileUpdateList.length === 0) {
            console.log("fileUpdateList.length === 0");
          }else{
            console.log("fileUpdateList.length !== 0");
            fileUpdateList.forEach((fileUpdate) => {
            console.log("forEach : " + JSON.stringify(fileUpdate))
            formData.append('boardFile', fileUpdate);
           });
          }
          //formData.append("boardFile[]", fileList);
          
          console.log("formData : " + JSON.stringify(formData))
    
          const resp = await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/updateBoard`,
            formData,
            {headers: {'Content-Type': 'multipart/form-data' }}
/*             headers: {
              'Content-Type': 'multipart/form-data'
            }, */
          )
          .then(function (response) {
            console.log("response.data : " + JSON.stringify(response.data));
          /* const board = await resp.json(); */
          //router.push(`/board/detail/${response.data.id}`);
          alert("Update Success");
          router.push(`/board/detail/${id}`);
          })
          .catch(function (error) {
            console.log(error);
          });
          //router.refresh();
    
      };

    const fileInputRef1 = useRef();
    const fileFormRef1 = React.createRef();
    
    
  return (
    <>
      {board && (
       <div>
       {/* <Form onSubmit={async evt=>{
         evt.preventDefault();}}> */}
       <Form onSubmit={onFormSubmit}>


         <FormGroup widths='equal'>
         <FormField style={{width: "100px", "text-align":"left", "font-size":"20px"}}>
            Writer : {boardDetail.boardWriter}
          </FormField>
          </FormGroup>
         {/* <FormField>
         <label>boardWriter</label>
         <input name='boardWriter' value={boardDetail.boardWriter} onChange={e => setBoardDetail({...boardDetail, boardWriter: e.target.value})} />
         </FormField> */}
        {/*  <FormField>
         <label>boardPass</label>
         <input name='boardPass' value={boardDetail.boardPass} onChange={e => setBoardDetail({...boardDetail, boardPass: e.target.value})} />
         </FormField> */}
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
                 onClick={() => fileInputRef1.current.click()}
               ><i aria-hidden="true" className="file icon"></i>Choose File</button>
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
/*   async function getData() {
    await Axios.get(`http://localhost:8090/api/v1/board/31`, {
        headers: {
          "Content-Type": "application/json", 
          access: localStorage.getItem("access") 
        },
        params: {
        },
      }
    ).then((response, error) => {
      console.log("BoardDetail response.data : " + JSON.stringify(response.data));
      console.log("BoardDetail board : " + response.data);
      console.log("BoardDetail fileAttached : " + response.data['fileAttached']);
    }).catch(function (error) {
    });
}
      useEffect(() => {
        getData();
      }, []); */
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
/*   return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking' //indicates the type of fallback
} */
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
