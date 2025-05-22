import React from "react";
import Axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormGroup, FormField, Form } from 'semantic-ui-react'

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]

export default function BoardWrite({ changeGoUrl }) {
  const router = useRouter();
  const [userName, setUserName] = useState(window.sessionStorage.getItem("userName")) 

    return (
      <div>
        <Form onSubmit={async evt=>{
          evt.preventDefault();
          const boardWriter = evt.target.boardWriter.value;
          const boardPass = evt.target.boardPass.value;
          const boardTitle = evt.target.boardTitle.value;
          const boardContents = evt.target.boardContents.value;
          const resp = await Axios.post(`${process.env.NEXT_PUBLIC_API_URL}/save`, {
            boardWriter: boardWriter,
            boardPass: boardPass,
            boardTitle: boardTitle,
            boardContents: boardContents
          })
          .then(function (response) {
            console.log("response.data : " + JSON.stringify(response.data));
          /* const board = await resp.json(); */
          router.push(`/board/detail/${response.data.id}`);
          //router.refresh();
          })
          .catch(function (error) {
            console.log(error);
          });

        }}>
          <FormGroup widths='equal'>
          <FormField>
          <label>boardWriter : {userName}</label>
          <input name='boardWriter'/>
          </FormField>
          <FormField>
          <label>boardPass</label>
          <input name='boardPass' />
          </FormField>
          </FormGroup>
          <FormField>
          <label>boardTitle</label>
          <input name='boardTitle' />
          </FormField>

          <FormField name='boardContents' label='boardContents' as="" control='textarea' rows='3' />
          {/* <FormField label='Write' control='button'>
            HTML Button
          </FormField> */}
          <div style={{display: 'flex', justifyContent:'right'}}>
          <button type="button"  class="ui button" onClick={() => changeGoUrl("/")}>List</button>
          <button type="submit" class="ui button">Write</button>
          </div>
        </Form>
      
      </div>
    );
}
