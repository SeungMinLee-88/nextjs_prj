import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ko">
        <Head>
        {/* 사용자 정의 메타 태그 */}
        <meta name="description" content="커스텀 설명입니다."/>

        {/* 외부 스크립트 추가 */}
{/*<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
  integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ=="
  crossOrigin="anonymous" referrerPolicy="no-referrer"></script> */}
<title>Next.JS</title>
<meta charSet="utf-8"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default MyDocument;