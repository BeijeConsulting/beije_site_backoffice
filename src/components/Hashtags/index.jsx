import { useState } from "react";
import useService from "../../hooks/useService";
import Input from "../Input";
import styles from './styles.module.css';

const Hashtag = ({ item }) => {
  const [response, updateHashtag] = useService(`/blog_hashtag/${item.id}`, {
    method: "put"
  })
  const [hashtag, setHashtag] = useState(item.hashtag);
  return (
    <div className={styles["inputs-container"]}>
      <Input
        style={{ width: "60%" }}
        placeholder="Hashtag"
        name="hashtag"
        value={hashtag}
        onChange={
          (e) =>
            setHashtag(e.target.value)
        }
      />
      <button
        className="warning-button"
        onClick={(e)=>{
          e.preventDefault()
          updateHashtag()
        }}
        >
        Salva hashtag
      </button>
    </div>
  )
}

function Hashtags({ hashtagList }) {
  if (!hashtagList.response) return;

  const map = (el, key) => <Hashtag key={key} item={el} />
  return (
   <div className={styles["inputs-row"]}>
     {hashtagList.response.map(map)}
   </div>
  )
}

export default Hashtags;