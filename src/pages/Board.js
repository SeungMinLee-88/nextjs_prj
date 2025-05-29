import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Divider, Header } from "semantic-ui-react";
import BoardList from "../component/BoardList";
import { useContext } from 'react';
import { UserIdContext } from './UserContext.js';

export default function Board() {
const [boardList, setboardList] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPage, setTotalPage] = useState(1);
const [searchKey, setSearchKey] = useState("boardTitle");
const [searchValue, setSearchValue] = useState("");
const [startPage, setStartPage] = useState("/");
const [endPage, setEndPage] = useState("/");
const userId = useContext(UserIdContext);
  

useEffect(() => {
getData();
}, [currentPage,searchKey, searchValue]);

const router = useRouter();

function getData() {
  Axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/boardList`, {
    headers: {
      "Content-Type": "application/json"
    },
    params: {
      page: currentPage,
      size: "3",
      sort: "createdTime,desc",
      searchKey: searchKey,
      searchValue: searchValue
    },
  }
).then((response) => {
    setTotalPage(response.data.totalPages);
    setStartPage((((Number)(Math.ceil(Number(currentPage) / response.data.totalPages))) - 1) * response.data.pageable.pageSize + 1);
    setEndPage(((startPage + response.data.pageable.pageSize - 1) < response.data.totalPages) ? startPage + response.data.pageable.pageSize - 1 : response.data.totalPages);
    setboardList(response.data.content);
  }).catch(function (error) {
    console.log("error", error);
  });
}
function changePage(page) {
  setCurrentPage(page);
}

  return (
    <div>
      <Head>
        <title>Board</title>
      </Head>
      <Header as="h3" style={{ paddingTop: 40 }}>
      Board
      </Header>
      <Divider />
      <BoardList boardList={boardList} 
      currentPage={currentPage} 
      setCurrentPage = {setCurrentPage} 
      TotalPage={totalPage} 
      changePage={changePage} 
      changeSearchKey={setSearchKey} 
      changeSearchValue={setSearchValue} 
/*       searchKey={searchKey} */
      startPage={startPage} 
      endPage={endPage} /> 
      {userId !== null ? <button className="ui button" onClick={() => router.push("/BoardWrite")}>Write</button> : ""}
    </div>
  );
}