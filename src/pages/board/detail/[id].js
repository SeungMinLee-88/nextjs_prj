
import Axios from "axios";
import { useRouter } from "next/navigation";
import { Link } from "next/link";
import { Loader
, Container
, Divider
, ListItem
, List
 } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { UserIdContext } from '../../UserContext.js';
import CommentList from "../../CommentList.js";


export default function BoardDetail({ board, name, id }) {
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const userId = useContext(UserIdContext);
  

useEffect(() => {
  if(board["fileAttached"] === 1){
      console.log("BoardDetail boardFileDTO : " + JSON.stringify(board["boardFileDTO"]));
      if (board["boardFileDTO"] !== null) return setFileList(board["boardFileDTO"]);
      if (fileList !== null) return setImageFileList(fileList.filter(a => a.mimeType === "image"));
      
      console.log("useEffect fileList : " + JSON.stringify(fileList));
    }
}, [fileList]);

  
  console.log("detail userId : " + userId);
  if (router.isFallback) {
    return (
      <div style={{ padding: "100px 0" }}>
        <Loader active inline="centered">
          Loading
        </Loader>
      </div>
    );
  }

  //console.log("BoardDetail fileAttached : " + board['fileAttached']);
  console.log("BoardDetail response.data : " + JSON.stringify(board));
  console.log("BoardDetail board : " + board);
  

console.log("fileList  : " + JSON.stringify(fileList));
  console.log("fileList filter : " + JSON.stringify(fileList.filter(a => a.mimeType === "image")));
  console.log("imageFileList : " + JSON.stringify(imageFileList));
  console.log(`${process.env.NEXT_PUBLIC_API_URL}/board/update/${id}`)
  
  
  const boardDelete = async () => {
    if(!confirm("Do you want to delete?")){
      return false;
    }
    await Axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/delete/${id}`, {
      headers: {
        "Content-Type": "application/json", 
        access: localStorage.getItem("access") 
      },
      params: {
      },
    }
  ).then((response, error) => {
    alert("Delete Success");
    router.push("/Board");
  
  }).catch(function (error) {
    console.log("error cause : " + JSON.stringify(error));
  });
  };
  
  return (
    <>
      {board && (
        <>
            <div>
            <Container textAlign='left' style={{"font-size": "50px", "padding-top":"20px", "display" : "block"}}>{board.boardTitle}</Container>
            <Container textAlign='right'>Writer : {board.boardWriter}</Container>
            <Container textAlign='justified'>
            <Divider />
              <p>
              {board.boardContents}
              </p>
              {imageFileList.map((imageFiles) => (
                    <div key={imageFiles.id}>
                     <img src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/download/`+imageFiles.storedFileName} class="ui medium bordered image"/>                     
                     </div>
                   
                   ))}
            </Container>
            </div>
            <div>
            <Divider />
            {/* <div role="list" className="ui bulleted horizontal link list"></div> */}
            {board['fileAttached'] === 1 &&(

                  
                  
                  <List bulleted horizontal link>
                    <ListItem active>Attached | </ListItem>
                {fileList.map((files) => (
                   
                    <Link key={files.id} role="listitem" id={files.id} className="item"  href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/download/`+files.storedFileName} target="_blank">{files.originalFileName}{files.type}</Link>                   
                  
                  ))}
                  </List>
              )}
            </div>
            <Divider />
            {userId === board.boardWriter && 
            <div>
            <button className="ui button"  onClick={() => router.push(`/board/update/${id}`)}>Edit</button>
            
            <button className="ui button"  onClick={boardDelete}>Delete</button>
            </div>
            }
            <button type="button"  className="ui button" onClick={() => changeGoUrl("/")}>List</button>
            <CommentList boardId={id} userId={userId}/>
        </>
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
