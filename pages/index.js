import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import fs from "fs/promises";
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from "next";
import Link from "next/link";
import path from "path";
// Trong thực tế VD: list product thì sẽ lấy data render từ hàm getServerSideProps (SSR) chứ không dùng ISR
// Trong thực tế VD: trang detail vì hàm getServerSideProps cũng lấy dc params trên url nên nó có thể lấy ra id và truyền vào api để lấy ra object nên không cần dùng 2 hàm getStaticProps và getStaticPaths luôn
// -> Hàm getServerSideProps là nhất
// SSG + SSR sẽ được gọi lại mỗi khi user gửi request lên server (call API)
// ISR = SSG + revalidate (trong hàm getStaticProps)
// cả 3 thằng này: getStaticProps (SSG), getStaticPaths (SSG), getServerSideProps (ISR) khi npm run build đều sẽ tạo ra file .html
// khi muốn 1 component không render ở phía server, chỉ về client hay chỉ muốn render ở phía trình duyệt (browser) mà thôi thì dùng cách này
const Test = dynamic(() => import("./test"), { ssr: false });
// những page data cứng dùng: SSG, private page (VD: admin) dùng CSR, những page data dynamic bị thay đổi bởi user thì dùng ISR
// pre-rendering (VD: SSR (getServerSideProps), SSG (getStaticProps, getStaticPaths)): render sẵn file .html ở phía server -> khi user load lên là mình đã có sẵn file .html để show lên rồi
// sau đó tải về file javascript và load thêm javascript -> sau đó nó sẽ thực hiện quá trình gọi là: hydration
// Trường hợp No pre-rendering (VD: react (CSR)): ở lần render đầu tiên mình tải về thì file .html nó là 1 file rỗng (nó chỉ có 1 cái div là div root thôi)
// sau đó tải về file javascript load lên và render cái cây dom của mình lên
// Khác nhau giữa SSR và SSG là: SSR mỗi lần user gửi request or reload (browser) lên server thì server phải đi xử lý dữ liệu (query database)
// sau đó server sẽ tạo ra 1 file .html và trả về cho user -> cứ mỗi lần user gửi request lên server phải đi xử lý và trả về 1 file .html mới cho user -> server sẽ làm việc rất nhiều -> theo mỗi request của client mà server sẽ trả về tương ứng bao nhiêu file .html -> VD: client gửi lên server 3 request thì server xử lý và trả về cho client 3 file .html -> tốt ở chỗ: luôn đảm bảo data của mình luôn là data mới chỉ có nhược điểm ở chỗ là: làm ảnh hưởng performance (user gửi request nó server cũng phải đi xử lý (query) và gửi lại dữ liệu mới (file .html mới) về cho client)
// Còn thằng SSG: khi npm run build server sẽ tạo và trả về sẵn cho client tất cả các file .html trước, user cần file nào thì chỉ cần gửi query lên server, server sẽ trả về ngay lập tức cho user vì server đã tạo sẵn file .html rồi (respon file .html về cho client theo điều kiện VD như: id) hay nói cách khác VD: build ra 10 file .html thì dữ liệu trong file nó sẽ cố định và không bao giờ thay đổi -> dùng cho những data cứng, cố định không bị thay đổi khi user gửi request lên server
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
export default function Home({ products }) {
  console.log(props);
  // const { products } = props;
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
    <div className={styles.container}>
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

      <main className={styles.main}>
        {products &&
          products.length > 0 &&
          products.map((values, index) => {
            return (
              <div key={index}>
                <div>{values.id}</div>
                {/* khi redirect (chuyển trang) trong nextjs nó là: client site routing, nó không có làm full page reload (reload lại toàn bộ trang giống thẻ a), nó chỉ get file js về rồi nó chỉ chuyển đổi qua page nó mong muốn */}
                <Link href={`/products/${values.id}`}>
                  {/* bên trong link của nextjs phải có thêm thẻ a (tốt cho SEO)  */}
                  <a>{values.title}</a>
                </Link>
              </div>
            );
          })}
      </main>
      <Test />
      <button onClick={handleProductDetail}>Click Product Details</button>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  // trường hợp detail mới có getStaticProps và getStaticPaths, còn trường hợp getAll thì chỉ có getStaticProps mà thôi
  // getStaticProps khi npm run build chỉ tạo ra 1 file .html duy nhất, bên trong file này sẽ chứa array data (trường hợp không có getStaticPaths)
  // nếu chỗ này mình truyền vào 3 obj tương ứng với 3 id là: "1", "2", "3" thì thằng
  // getStaticProps sẽ chạy hay nói cách khác là được gọi 3 lần nhưng thằng getStaticPaths
  // này chỉ chạy hay được gọi 1 lần mà thôi. Tuỳ vào bao nhiêu obj thì getStaticProps sẽ được gọi và chạy bấy nhiêu lần
  // và sau khi npm run build or yarn build thì next sẽ tạo ra 3 file .html và .json tương ứng với 3 id (3 obj), file .html or .json thuộc id nào thì nó sẽ render là file .html or .json đó
  // có bao nhiêu obj id thì khi npm run build sẽ tạo ra bấy nhiêu file .html và .json
  const filePath = path.join(process.cwd(), "dummy", "data.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  // nếu data không tồn tại thì đẩy qua page /no-data
  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }
  // nếu data tồn tại mà rỗng thì đẩy sang 404
  if (data && data.products && data.products.length === 0) {
    return { notFound: true }; // data rỗng thì đẩy nó sang page 404.
  }

  // cách 1: filesystem
  return {
    props: {
      products: data.products,
    },
    // thêm dòng này vào sẽ trở thành ISR, công dụng của dòng này là:
    // Thay vì lúc trước chỉ sử dụng hàm này đối vs data cứng vì khi run build nó sẽ tạo sẵn 1 đóng file .html trước khi user
    // cần file .html nào thì gửi request lên server, server sẽ ngay lập tức trả về file .html tương ứng cho user (VD: tương ứng với id)
    // Chỉ dùng cho data cứng vì các file .html khi run build ra dữ liệu trong file .html luôn cố định không thay đổi, chỉ thay đổi
    // khi run build lần tiếp theo, còn nếu thêm thằng: revalidate này vào thì dưới 5s data nó vẫn là cứng như ban đầu, không thay đổi gì cả
    // nhưng sau 5s khi reload browser lần đầu tiên nó sẽ tiến hành cập nhật lại file .html theo id đó (vs data mới nhất trên server)
    // sau đó ta tiếp tục reload browser lần thứ 2 thì lúc này page tại id này sẽ được cập nhật dữ liệu mới nhất chứ không còn
    // mặc định là data cứng lúc run build nữa -> đây là cơ chế của ISR
    revalidate: 5,
  };
  // trường hợp array nhiều thuộc tính quá mà client chỉ cần vài thuộc tính để render thôi,
  // thì mình sẽ dùng hàm map để tạo ra 1 mảng mới
  // return {
  //   props: {
  //     object: data.products.map((x) => ({id: x.id, title: x.title})),
  //   },
  // }
  // cách 1.2: filesystem
  // const booksDir = path.join(process.cwd(), "books");
  // const bookFileNames = fs.readdirSync(booksDir);
  // const booksData = bookFileNames.map((bookFileName) => {
  //   const fullBookPath = path.join(booksDir, bookFileName);
  //   const bookContent = fs.readFileSync(fullBookPath, "utf8");
  //   return {
  //     bookName: bookFileName.replace(/\.txt$/, ""),
  //     bookContent,
  //   };
  // });
  // call api
  // cách 2
  // return {
  //   props: {
  //     products: [{ id: "1", title: "title 1" }]
  //   },
  // };

  // cách 3: call api
  // const res = await fetch("https://...");
  // const data = await res.json();
  // return {
  //   props: {
  //     products: data
  //   },
  // };
}
