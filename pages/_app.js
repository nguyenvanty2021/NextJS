import "../styles/globals.css";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="initial-scale=1.0,width=device-width" />
    
        <meta name="title" content="" />
        <meta property="fb:app_id" content="" />
        <meta property="twitter:url" content="" />
        <meta property="og:type" content="" />
        <meta property="og:site_name" content="" />
        <meta property="og:locale" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
        <meta property="og:image:secure" content="" />
        <meta name="og:url" content="" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
