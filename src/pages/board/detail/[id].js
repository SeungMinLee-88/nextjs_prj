
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

export default function BoardDetail({ board, id }) {
  const router = useRouter();


console.log("router.isFallback : " + router.isFallback)
  if (router.isFallback) {
    return (
      <div style={{ padding: "100px 0" }}>
        <Loader active inline="centered">
          Loading
        </Loader>
      </div>
    );
  }
 
return (
  <>
    
  </>
);
};
export async function getStaticPaths() {
  const apiUrl =  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/list`;
  const res = await Axios.get(apiUrl);
  const data = res.data;
  const paths = data.slice(0, 50).map((item) => {
    return { params: {
      id: item.id.toString(),
    }};
  });
  return {
    paths,
    fallback: true
  };
/*   return {
    paths: data.slice(0, 50).map((item) => ({
      params: {
        id: item.id.toString(),
      },
    })),
    fallback: true,
  }; */
}

export async function getStaticProps(context) {
  
  console.log("call getStaticProps");
  const id = context.params.id;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/board/detail/${id}`;
/*   const res = (setTimeout(() => {
    Axios.get(apiUrl);
  }, 10000)); */
/*   const res = await Axios.get(apiUrl);
   */
  const [{ data: res }] = await Promise.all([
    Axios.get(apiUrl),
    setTimeout(() => {
      console.log("await")
    }, 10000)
  ]);

  const data = res.data;

  return {
    props: {
      board: data,
      name: process.env.name,
      id: id
    },
  };
}
