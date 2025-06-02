import React, { } from "react";

import {ListItem,
  ListHeader,
  ListDescription,
  ListContent,
  List,
  Pagination,
  Search  } from "semantic-ui-react";
  import { useRouter } from "next/navigation";

function searchReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false}
    case 'UPDATE_SELECTION':
      return { ...state, searchKey: action.query }
    default:
      throw new Error()
  }
}
const initialState = {
  loading: false,
  value: '',
  searchKey: ''
}
export default function BoardList({ boardList, setCurrentPage, TotalPage, changePage, changeSearchKey, changeSearchValue }) {
  const [state, dispatch] = React.useReducer(searchReducer, initialState);
  const { loading, value, searchKey } = state;
  const router = useRouter();
  
  const goToPage = pageNumber => {
    changePage(pageNumber);
  };
  const timeoutRef = React.useRef()
  const handleSearchChange = (e, data) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: 'START_SEARCH', query: data.value });
    changeSearchValue(data.value);
    setCurrentPage(1);
    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' });
        return
      }
      dispatch({
        type: 'FINISH_SEARCH',
      })
    }, 300)
  }
  const handleSearchKey = (e) => {
    dispatch({ type: 'UPDATE_SELECTION', query: e.target.value });
    changeSearchKey(e.target.value);
    setCurrentPage(1);
  }

  return (
    <div>
      <div style={{display: 'flex',  justifyContent:'right', alignItems:'right'}}>
    <select
      value={searchKey}
      onChange={handleSearchKey} style={{width: 100}}>
      <option value="boardTitle">Title</option>
      <option value="boardWriter">Writer</option>
    </select>
      
      <Search
          loading={loading}
          placeholder='Search...'
          value={value}
          onSearchChange={handleSearchChange}
          showNoResults={false}
        />
   </div>
   {boardList && boardList.length !== 0 ?
      <div>
       <List divided relaxed>
          {boardList.map((board) => (
           <ListItem onClick={() => router.push(`/board/detail/${board.id}`)}  key={board.id} >
              <ListContent>
                <ListHeader>{board.boardTitle}</ListHeader>
                <ListDescription>Writer : {board.boardWriter}</ListDescription>
                <ListDescription>{board.boardCreatedTime.substring(0, 10)}</ListDescription>
              </ListContent>
            </ListItem>
          ))}
        </List>
        </div>
          : 
          <div style={{display: 'flex',  justifyContent:'center'}}>
          <h1 className="ui header">There is no Contents</h1>
          </div>
          }
 
        {/* https://ko.react.dev/learn/javascript-in-jsx-with-curly-braces */}
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <Pagination
          /* activePage={currentPage} */
          boundaryRange={0}
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={TotalPage}
          onPageChange={(_, { activePage }) => goToPage(activePage)}
        />
        </div>
    </div>
  );
}