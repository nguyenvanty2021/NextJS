import { useEffect } from "react";
// Trong thực tế VD: list product thì sẽ lấy data render từ hàm getServerSideProps (SSR) chứ không dùng ISR
// Trong thực tế VD: trang detail vì hàm getServerSideProps cũng lấy dc params trên url nên nó có thể lấy ra id và truyền vào api để lấy ra object nên không cần dùng 2 hàm getStaticProps và getStaticPaths luôn
// -> Hàm getServerSideProps là nhất
// SSG + SSR sẽ được gọi lại mỗi khi user gửi request lên server (call API)
// ISR = SSG + revalidate (trong hàm getStaticProps)
// những page data cứng dùng: SSG, private page (VD: admin) dùng CSR, những page data dynamic bị thay đổi bởi user thì dùng ISR
// pre-rendering (VD: SSR (getServerSideProps), SSG (getStaticProps, getStaticPaths)): render sẵn file .html ở phía server -> khi user load lên là mình đã có sẵn file .html để show lên rồi
// sau đó tải về file javascript và load thêm javascript -> sau đó nó sẽ thực hiện quá trình gọi là: hydration
// Trường hợp No pre-rendering (VD: react (CSR)): ở lần render đầu tiên mình tải về thì file .html nó là 1 file rỗng (nó chỉ có 1 cái div là div root thôi)
// sau đó tải về file javascript load lên và render cái cây dom của mình lên
// Khác nhau giữa SSR và SSG là: SSR mỗi lần user gửi request or reload (browser) lên server thì server phải đi xử lý dữ liệu (query database)
// sau đó server sẽ tạo ra 1 file .html và trả về cho user -> cứ mỗi lần user gửi request lên server phải đi xử lý và trả về 1 file .html mới cho user -> server sẽ làm việc rất nhiều -> theo mỗi request của client mà server sẽ trả về tương ứng bao nhiêu file .html -> VD: client gửi lên server 3 request thì server xử lý và trả về cho client 3 file .html -> tốt ở chỗ: luôn đảm bảo data của mình luôn là data mới chỉ có nhược điểm ở chỗ là: làm ảnh hưởng performance (user gửi request nó server cũng phải đi xử lý (query) và gửi lại dữ liệu mới (file .html mới) về cho client)
// Còn thằng SSG: khi npm run build server sẽ tạo và trả về sẵn cho client tất cả các file .html trước, user cần file nào thì chỉ cần gửi query lên server, server sẽ trả về ngay lập tức cho user vì server đã tạo sẵn file .html rồi (respon file .html về cho client theo điều kiện VD như: id) hay nói cách khác VD: build ra 10 file .html thì dữ liệu trong file nó sẽ cố định và không bao giờ thay đổi -> dùng cho những data cứng, cố định không bị thay đổi khi user gửi request lên server
// cả 3 thằng này: getStaticProps (SSG), getStaticPaths (SSG), getServerSideProps (ISR) khi npm run build đều sẽ tạo ra file .html
// getStaticProps (SSG), getStaticPaths (SSG), getServerSideProps (ISR) khi dùng 1 trong 3 thằng này thì component hiện tại nằm trong pages sẽ là server side rendering
// Trường hợp: static html generation (không dùng getStaticProps (SSG), getStaticPaths (SSG), getServerSideProps (ISR) trong component)
// -> thì khi npm run build or yarn build sau đó start thì next sẽ tự động tạo ra 1 file index.html, khi user request thì nó đã tạo sẵn file index.html, chỉ hiển thị ra mà thôi
// Trường hợp: static html + json data (dùng getStaticProps)
// Trường hợp: static html + json data + dynamic routes (dùng getStaticProps + getStaticPaths)
// Chỉ sử dụng getStaticProps + getStaticPath (2 thằng này là SSG, SSG sẽ giúp build ra 1 file .html sau khi chạy lên npm run build) hoặc getServerSideProps () -> không dùng chung, 3 thằng này chạy ở phía server
// có staticProps và staticPath thì không có serverSideProp (ISR) và ngược lại.
// chỉ sử dụng được 3 hàm này trong page (những component nằm trong folder pages), còn những component 
// chia nhỏ nằm ngoài folder pages thì k dùng dc, chính vì vậy người ta thường sử dụng trong page rồi 
// truyền data vào các component con, 
// 3 hàm trên ở server-side (chỉ chạy ở phía server, client có console.log cũng không thấy) và chỉ chạy lúc build-time (khi npm run build or yarn build)
// trong môi trường dev thì chỉ cần gủi request thì nó luôn luôn chạy 3 hàm này
import Head from "next/head";
// khi muốn 1 component không render ở phía server, chỉ về client hay chỉ muốn render ở phía trình duyệt (browser) mà thôi thì dùng cách này
const Test = dynamic(() => import("./test"), {ssr: false})
// instead
// function useUser() {
//     // return useSWR('/users', fetcher)
//     return useSWR('/url-api')
// }
// import useSWR from "swr"; // install library
const SWR = () => {
  // SWR là một thư viện React Hooks dùng trong việc fetch data.
  // const {data, error, isValidating} = useUser;
  // useEffect(() => {
  //     if(data) {
  //         setArrayAPI(data);
  //     }
  // }, [data]);
  // if(error) {
  //     return <p>Failed to load.</p>
  // }
  // if(!data && !arrayAPI) {
  //     return <p>Loading...</p>
  // }
  const router = useRouter();
  const handleProductDetail = () => {
    router.push(
      {
        pathname: "/products/1",
        query: {
          page: "data ne"
        },
      },
      undefined,
      // khi muốn component này chỉ chạy ở phía client thôi, không muốn phải lên server chạy lại các thằng: getStaticProps, getStaticPaths, getServetSideProps nữa thì thêm thằng này vào
      {shallow: true}
    )
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
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
      <Test/>
      <button onClick={handleProductDetail}>Click Product Details</button>
    </div>
  );
};
export default SWR;
