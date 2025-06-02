
import Axios from "axios";
import { useRouter } from "next/navigation";
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

export default function BoardDetail({ board, id }) {
  const router = useRouter();
  const [fileList, setFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const userId = useContext(UserIdContext);


  if (router.isFallback) {
    return (
      <div style={{ padding: "100px 0" }}>
        <Loader active inline="centered">
          Loading
        </Loader>
      </div>
    );
  }
  
useEffect(() => {
  if(board["fileAttached"] === 1){
      setFileList(board["boardFileDTO"]);
      setImageFileList(fileList.filter(a => a.mimeType === "image"));
    }
}, [fileList]);

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
  ).then((response) => {
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
        <Container textAlign='left' style={{"fontSize": "50px", "paddingTop":"20px", "display" : "block"}}>{board.boardTitle}</Container>
        <Container textAlign='right'>Writer : {board.boardWriter}</Container>
        <Container textAlign='justified'>
        <Divider />
          <p>
          {board.boardContents}
          </p>{}
          {imageFileList.map((imageFiles) => (
            <div key={imageFiles.id}>
              <img src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/download/`+imageFiles.storedFileName} className="ui medium bordered image"/>                     
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
                  
                  <a key={files.id} role="listitem" id={files.id} className="item"  href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/download/`+files.storedFileName} target="_blank">{files.originalFileName}{files.type}</a>                   
                
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
        <div style={{display: 'flex', justifyContent:'right'}}>
        <button type="button"  className="ui button" onClick={() => router.push("/Board")}>List</button>
        </div>
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
/*   const paths = data.slice(0, 100).map((item) => {
    return { params: {
      id: item.id.toString(),
    }};
  });
  return {
    paths,
    fallback: false
  }; */
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
  const id = context.params.id;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/detail/${id}`;
  const res = await Axios.get(apiUrl);
  const data = res.data;
  
/*   const [{ data }] = await Promise.all([
    Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/detail/${id}`),
    timeout(5000)
  ]); */

  return {
    props: {
      board: data,
      id: id
    },
  };
}


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}