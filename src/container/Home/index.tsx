import React, { useEffect, useState } from "react";
import img1 from "@src/assets/images/img1.png";
import img2 from "@src/assets/images/img2.png";
import "./index.less";

const Home = () => {
  useEffect(() => {
    const a = "";
    console.log(b);
  }, []);
  const [count, setCounts] = useState("");
  const onChange = (e: any) => {
    setCounts(e.target.value);
  };
  return (
    <div>
      Home Page New ssss
      <img src={img1} alt="小于10kb的图片" />
      <img src={img2} alt="大于10kb的图片" />
      <h2>webpack5+react+ts</h2>
      <p>下方为受控组件</p>
      <input type="text" value={count} onChange={onChange} />
      <br />
      <p>非受控组件</p>
      <input type="text" />
    </div>
  );
};

export default Home;
