import Axios from "axios";
import { useEffect, useState } from "react";
import {
CommentText
, CommentGroup
, CommentContent
, CommentActions
, CommentAction
, CommentAuthor
, Comment
, Form
, FormField
, Pagination
, Divider
} from 'semantic-ui-react'
import { useContext } from 'react';
import { UserIdContext } from './UserContext.js';
import { useRouter } from "next/router";

let retRootId = "";

export default function CommentList({ boardId }) {
const [commentListRender, setCommentListRender] = useState([]);
const [commentListReturn, setCommentListReturn] = useState([]);
const [rootIdSt, setRootIdSt] = useState();
const userId = useContext(UserIdContext);
const router = useRouter();
const [currentPage, setCurrentPage] = useState(1);
const [totalPage, setTotalPage] = useState(1);

useEffect(() => {
  getData();
}, [currentPage, userId]);

const addReply = e => {
  var replyId = "reply_div"+e.target.getAttribute('parentid');
  const element = document.getElementById(replyId);
  element.getAttribute("hidden") === null ? element.hidden = true : element.hidden = false;
}
const addEdit = e => {
  var editId = "edit_div"+e.target.getAttribute('commentId');
  const element = document.getElementById(editId);
  element.getAttribute("hidden") === null ? element.hidden = true : element.hidden = false;
}

async function commentGetRoot(commentId) {
  await Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comment/commentGetRoot`, {
    headers: {
      "Content-Type": "application/json", 
      access: localStorage.getItem("access") 
    },
    params: {
      commentId: commentId
    },
  }
).then((response) => {
  if(response.data.rootCommentId !== null){
    retRootId = response.data.rootCommentId
    setRootIdSt(response.data.rootCommentId);
  }else{
    retRootId = commentId
    setRootIdSt(commentId);
  }
}).catch(function (error) {
console.log("error",error);
});
return retRootId;
}
  
  const saveFormSubmit = async evt => {
    evt.preventDefault(); 
    const parentCommentId = evt.target.parentId.getAttribute('parentid');
    const rootId = await commentGetRoot(parentCommentId);
    const formId = "form" + parentCommentId;

    await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comment/commentSave`,
      {
        commentWriter: userId,
        commentContents: document.getElementById(formId).value,
        boardId: boardId,
        parentCommentId: parentCommentId,
        rootCommentId: rootId,
        isRootComment: "false"
      },
      {
        headers: {
          'access' : localStorage.getItem("access") 
        }
      }
    )
    .then(function (response) {
      alert("Save Success");
      router.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
  }
    const updateFormSubmit = async evt => {
      evt.preventDefault(); 
      const commentId = evt.target.commentId.getAttribute('commentId'); 
      const editFormId = "edit" + commentId;
 
      await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comment/commentUpdate`,
        {
          id: commentId,
          commentContents: document.getElementById(editFormId).value,
        },
        {
          headers: {
            'access' : localStorage.getItem("access") 
          }
        }
      )
      .then(function (response) {
        alert("Update Success");
        router.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  var renderVal = [];
  function recursiveMap(commentLists, level, depthVal) {
    commentLists.map((commentList) => {
      var depthStyle = depthVal * 20;

      if(commentList["childrenComments"] !== "" && commentList["childrenComments"] !== null 
        && commentList["childrenComments"].length > 0
      ){
        renderVal.push(<Comment key={commentList["id"]} style={{ paddingLeft: depthStyle }}>
          <CommentContent>
            <CommentAuthor as='a'>{commentList["commentWriter"]}</CommentAuthor>
            <CommentText>{commentList["commentContents"]}</CommentText>
            <CommentActions>
          <CommentAction parentid={commentList["id"]} onClick={addReply}>Reply</CommentAction>
          
            <div id={"reply_div"+commentList["id"]} hidden>
            <Form onSubmit={saveFormSubmit}>
            <input type="text" id="parentId" name="parentId" parentid={commentList["id"]} hidden />
            <FormField id={"form"+commentList["id"]} as="" control='textarea' rows='2' />
            <button type="submit" className="ui primary button" color="blue">Write</button>
            </Form>
            </div>
            {userId === commentList["commentWriter"] && <CommentAction commentid={commentList["id"]} onClick={addEdit}>Edit</CommentAction>}
            <div id={"edit_div"+commentList["id"]} hidden>
            <Form onSubmit={updateFormSubmit}>
            <input type="text" id="commentId" name="commentId" commentid={commentList["id"]} hidden />
            <FormField id={"edit"+commentList["id"]} as="" control='textarea' rows='2' defaultValue={commentList["commentContents"]} />
            <button type="submit" className="ui primary button" color="blue">Edit</button>
            </Form>
            </div>
            </CommentActions>
          </CommentContent>
         </Comment>
         );
          setCommentListRender([...commentListRender, 
           renderVal]);
        recursiveMap(commentList["childrenComments"], "child", depthVal+1)

      }else{

        renderVal.push(<Comment key={commentList["id"]} style={{ paddingLeft: depthStyle }}>
          <CommentContent>
            <CommentAuthor as='a'>{commentList["commentWriter"]}</CommentAuthor>
            <CommentText>{commentList["commentContents"]}</CommentText>
            <CommentActions>
            <CommentAction parentid={commentList["id"]} onClick={addReply}>Reply</CommentAction>
              <div id={"reply_div"+commentList["id"]} hidden>
              <Form onSubmit={saveFormSubmit}>
              <input type="text" id="parentId" name="parentId" parentid={commentList["id"]} hidden />
              <FormField id={"form"+commentList["id"]} as="" control='textarea' rows='2' />
              <button type="submit" className="ui primary button" color="blue">Write</button>
              </Form>
              </div>
              {userId === commentList["commentWriter"] && <CommentAction commentid={commentList["id"]} onClick={addEdit}>Edit</CommentAction>}

              <div id={"edit_div"+commentList["id"]} hidden>
              <Form onSubmit={updateFormSubmit}>
              <input type="text" id="commentId" name="commentId" commentid={commentList["id"]} hidden />
              <FormField id={"edit"+commentList["id"]} as="" control='textarea' rows='2' defaultValue={commentList["commentContents"]} />
              <button type="submit" className="ui primary button" color="blue">Edit</button>
              </Form>
              </div>
            </CommentActions>
         </CommentContent>
         </Comment>);
          setCommentListRender([...commentListRender, 
           renderVal]);
      }
    });
  }
  
    function getData() {
        Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comment/commentList`, {
          headers: {
            "Content-Type": "application/json", 
            access: localStorage.getItem("access") 
          },
          params: {
            page: currentPage,
            size: "2",
            boardId: `${boardId}`
          },
        }
      ).then((response, error) => {
        
        setTotalPage(response.data.totalPages);
        setCommentListReturn(response.data.content);
        recursiveMap(response.data.content, "root", 0);
      
    }).catch(function (error) {
    });
  }

  const goToPage = pageNumber => {
    renderVal = [];
    setCommentListRender([]);
    setCurrentPage(pageNumber);
  };
  



      const addFormSubmit = async evt => {
        evt.preventDefault(); 
        const commentContents = evt.target.commentContents.value; 
        
        await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comment/commentSave`,
          {
            commentWriter:userId,
            commentContents:commentContents,
            boardId:boardId,
            isRootComment:"true"
          },
          {
            headers: {
              'access' : localStorage.getItem("access") 
            }
          }
        )
        .then(function (response) {
          alert("Save Success");
          router.reload();
        })
        .catch(function (error) {
          console.log(error);
        });
    }

      return (
        <div>
          <span>Comments</span>
          <Divider />
          {userId !== null &&
        <Form onSubmit={addFormSubmit} reply>
          <FormField name='commentContents' label='Comments' as="" control='textarea' rows='3' />
          <button type="submit" className="ui icon primary left labeled button" color="blue">
          <i aria-hidden="true" className="edit icon"></i>
          Add Comment
          </button>
        </Form>
        }
        <CommentGroup>
          {commentListRender}
        </CommentGroup>
        {commentListReturn.length > 0 &&
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <Pagination
          activePage={currentPage}
          boundaryRange={0}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={totalPage}
          onPageChange={(_, { activePage }) => goToPage(activePage)}
          
        />
        </div>
          }
        </div>
     );
}