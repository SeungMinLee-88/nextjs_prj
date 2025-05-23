import React, { useState, useEffect, useCallback } from "react";

import {ListItem,
  ListHeader,
  ListDescription,
  ListContent,
  List,
  Pagination,
  Search  } from "semantic-ui-react";
  import { useRouter } from "next/navigation";
import styles from "./ItemList.module.css";
import Link from "next/link";



function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false}
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}
const initialState = {
  loading: false,
  results: [],
  value: '',
}
export default function BoardList({ boardList, currentPage, setCurrentPage, TotalPage, changePage, changeSearchKey, changeSearchValue, searchKey }) {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState);
  const { loading, results, value } = state;
  const router = useRouter();
  
  const goToPage = pageNumber => {
    changePage(pageNumber);
  };
  const timeoutRef = React.useRef()
  const handleSearchChange = (e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })
    changeSearchValue(data.value);
    setCurrentPage(1);
    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }
      dispatch({
        type: 'FINISH_SEARCH',
      })
    }, 300)
  }

  return (
    <div>
      <div style={{display: 'flex',  justifyContent:'right', alignItems:'right'}}>
    <select
      value={searchKey}
      onChange={e => changeSearchKey(e.target.value)} style={{width: 100}}>
      <option value="boardTitle">Title</option>
      <option value="boardWriter">Writer</option>
    </select>
      
      <Search
          loading={loading}
          placeholder='Search...'
          onSearchChange={handleSearchChange}
          showNoResults={false}
        />
   </div>
   {boardList.length !== 0 ?
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
          /* activePage={paginationOptions.activePage} */
          activePage={currentPage}
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