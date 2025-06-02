import axios from 'axios'
import { Loader } from "semantic-ui-react";
import { useRouter } from 'next/router';
import _ from 'lodash';

export default function UserDetailPage({ user }) {
  const router = useRouter();
	// fallback version
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
    <div>
      {user.id} / {user.name} / {user.email}
    </div>
  )
}

export async function getStaticPaths() {
  const { data: users } = await axios.get('https://jsonplaceholder.typicode.com/users');
  const paths = _.map(_.slice(users, 0, 5), (user) => {
    return { params: {id: _.toString(user.id)}};
  });

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps(context) {
  const { id } = context.params;

  const [{ data: user }] = await Promise.all([
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`),
    timeout(5000)
  ]);

  return {
    props: {
      user
    }
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}