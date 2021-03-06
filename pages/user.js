import Head from "next/head";
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
// khi muốn 1 component không render ở phía server, chỉ về client hay chỉ muốn render ở phía trình duyệt (browser) mà thôi thì dùng cách này
const Test = dynamic(() => import("./test"), { ssr: false });
// getStaticProps (SSG), getStaticPaths (SSG), getServerSideProps (ISR) khi dùng 1 trong 3 thằng này thì component hiện tại nằm trong pages sẽ là server side rendering
// Trường hợp: static html generation (không dùng getStaticProps (SSG), getStaticPaths (SSG), getServerSideProps (ISR) trong component)
// -> thì khi npm run build or yarn build sau đó start thì next sẽ tự động tạo ra 1 file index.html, khi user request thì nó đã tạo sẵn file index.html, chỉ hiển thị ra mà thôi
// Trường hợp: static html + json data (dùng getStaticProps)
// Trường hợp: static html + json data + dynamic routes (dùng getStaticProps + getStaticPaths)
// Chỉ sử dụng getStaticProps + getStaticPath (2 thằng này là SSG, SSG sẽ giúp build ra 1 file .html sau khi chạy lên npm run build) hoặc getServerSideProps () -> không dùng chung, 3 thằng này chạy ở phía server
// có staticProps và staticPath thì không có serverSideProp (SSA) và ngược lại.
// chỉ sử dụng được 3 hàm này trong page (những component nằm trong folder pages), còn những component
// chia nhỏ nằm ngoài folder pages thì k dùng dc, chính vì vậy người ta thường sử dụng trong page rồi
// truyền data vào các component con,
// 3 hàm trên ở server-side (chỉ chạy ở phía server, client có console.log cũng không thấy) và chỉ chạy lúc build-time (khi npm run build or yarn build)
// trong môi trường dev thì chỉ cần gủi request thì nó luôn luôn chạy 3 hàm này
const User = ({ username }) => {
  //const { username } = props;
  // hàm getServerSideProps sẽ tự động được gọi lại mỗi khi refresh,
  //   const router = useRouter()
  //   useEffect(() => {
  //       const interVal = setInterval(() => {
  //           router.replace(router.asPath)
  //       }, 3000)
  //       return () => clearInterval(interVal)
  //   }, [])
  // Nếu chưa rõ thì mình giải thích chỗ router.replace() thôi, hàm này có nhiệm vụ refresh
  // lại thay vì F5 nhé, lưu ý không dùng router.reload() thì nó sẽ F5 lại page.
  const router = useRouter();
  const handleProductDetail = () => {
    router.push(
      {
        pathname: "/products/1",
        query: {
          page: "data ne",
        },
      },
      undefined,
      // khi muốn component này chỉ chạy ở phía client thôi, không muốn phải lên server chạy lại các thằng: getStaticProps, getStaticPaths, getServetSideProps nữa thì thêm thằng này vào
      { shallow: true }
    );
  };
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
      <div>{username}</div>
      <Test />
      <button onClick={handleProductDetail}>Click Product Details</button>
    </div>
  );
};
// getServerSideProps nên được sử dụng để xây dựng ứng dụng đảm bảo dữ liệu được cập nhật liên tục
// Nếu trang sử dụng Server-side rendering HTML sẽ được tạo khi có request. Sau mỗi request NextJS sẽ
//  tự động gọi hàm getServerSideProps trong page.
// hàm này có thể lấy được params trên url luôn
// mỗi lần client gửi request lên server thì hàm này sẽ được gọi, nó sẽ fetch lại api
// những component nào có getServerSideProps khi build thì component đó sẽ ở dạng .js, còn component không có
// hàm getServerSideProps thì khi build sẽ ở dạng .html,
// khi sử dụng getServerSideProps nó sẽ xử lý ở server và truyền kết quả cho client render ra UI thôi (client chỉ render 1 lần)
// getServerSideProps chỉ chạy ở server-side
// chạy mỗi khi page gửi request
// Vòng lặp của server side rendering là: user gửi request lên server, server sẽ đi fetch data,
// sau đó server sẽ tạo ra file .html và respon về cho client -> client gửi bao nhiêu request lên server thì server
// sẽ đi fetch data và tạo ra bấy nhiêu file .html -> nó sẽ luôn đảm bảo là dữ liệu của client luôn là dữ liệu mới
// -> điều này cũng sẽ không tốt cho performance (cứ mỗi lần user gửi request server phải query lại database)
export async function getServerSideProps(context) {
  // getServerSideProps cũng lấy params trên url được thông qua thuộc tính context
  // const {params} = context;
  // const id = params;
  // VD: khi call api mất 3s, cứ mỗi khi user gửi request hay reload (f5) dều phải mất 3s như vậy là không tốt
  // Chính vì vậy cache mới ra đời
  // ------------VD1: context.res.setHeader("Cache-Control", "s-maxage=5")------------
  // giải thích VD1: khi dùng VD1 thì ở lần truy cập đầu tiên (lần đầu tiên) cũng sẽ mất 3s thì hàm getServerSideProps này được gọi và fetch data
  // nhưng trong vòng 5s tới nêu data server có sự thay đổi (do những action or những thay đổi do user khác làm )
  // thì data bên mình cũng không cập nhật nó vẫn là data hiện tại (nghĩa là nó không chạy lại hàm getServerSideProps để cập nhật data mới nhất) -> Từ giây thứ 5 trở đi nếu user gửi request nữa or reload trình duyệt
  // thì lúc này data mới cập nhật (hàm getServerSideProps lúc này sẽ được gọi và cập nhật data mới nhất) -> nghĩa là khi gọi hàm getServerSideProps và fetch data xong trong vòng 5 giây nếu có bất kỳ request nào
  // thì nó vẫn lấy dữ liệu cũ, sau 5s khi user gửi request thì reload lại thì hàm getServerSideProps sẽ được gọi và chạy và fetch data mới thì dữ liệu mới, mới được cập nhật
  // ------------VD2: context.res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate")------------
  // tương tự vs VD1 nhưng ở VD2 khi quá thời gian 5s thậm chí là hơn 5s là được (miễn hơn 5s là được) khi reload or user gửi request mới
  // thì hàm getServerSideProps cũng sẽ được gọi nhưng khi gọi lần đầu tiên khi quá 5s thì nó vẫn là dữ liệu cũ (lần này nó sẽ call dữ liệu mới ngầm)
  // thay vì ở VD1 khi quá 5s thì nó sẽ gọi lại hàm getServerSideProps và mất 3s ms show ra data thì trong 3s này ở VD2 nó sẽ là data cũ, và lần reload or user gửi request lần thứ 2
  // sau 5s nó mới cập nhật data mới nhất -> Tóm lại sau 5s khi reload or request lần đầu tiên thì nó sẽ là data cũ
  // và lần reload or request thứ 2 sau 5s thì nó ms cập nhật data (thời gian mất 3s gọi hàm getServerSideProps sau 5s nó sẽ là data cũ)
  // ------------VD3: context.res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=5") ------------
  // ở VD3 cũng giống hoàn toàn với VD2 nhưng ở trường hợp VD2 miễn quá 5s thì dù qua ngày sau stale-while-revalidate vẫn chạy
  // nghĩa là vẫn reload or user gửi request lần thứ 2 ms cập nhật data mới nhất
  // còn ở VD3 thì thời gian stale-while-revalidate chỉ còn tính từ giây thứ 6 đến giây thứ 10
  // trong khoảng thời gian 6-10s này reload or request 2 lần vẫn oke nhưng qua 10s thì hàm getServerSideProps sẽ được gọi
  // và lúc này quay lại trường hợp 1 mất 3s để update dữ liệu mới
  // Tóm lại ở VD2: miễn qua 5s thì bao lâu nữa thì hàm stale-while-revalidate cũng sẽ thực thi, nhưng ở VD3 thì hàm stale-while-revalidate
  // chỉ thực thi trong vòng giây thứ 6-10s mà thôi
  //   const res = await fetch(`https://...`);
  //   const data = await res.json();
  //   if (!data) {
  //     return {
  //       notFound: true,
  //     };
  //   }
  //   return {
  //     props: {}, // will be passed to the page component as props
  //   };
  // hoặc
  // Fetch data from external API
  // const res = await fetch(`https://.../data`);
  // const data = await res.json();

  // Pass data to the page via props
  // return { props: { data } };

  const { params, req, res } = context;
  return {
    props: {
      username: "Max",
    },
  };
}
export default User;
