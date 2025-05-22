import Head from "next/head";
import { Divider, Header } from "semantic-ui-react";

export default function Home() {

  
  return (
    <div>
      <Head>
        <title>Board</title>
      </Head>
      <Header as="h3" style={{ paddingTop: 40 }}>
      Index Page
      </Header>
      <Divider />

    </div>
  );
}

// axios