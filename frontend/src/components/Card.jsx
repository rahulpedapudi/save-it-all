import { useNavigate } from "react-router-dom";

function Card(props) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/detail/${props._id}`);
  };

  const handleDeleteClick = () => {
    props.handleDelete(props._id);
  };

  return (
    <div className=" relative w-72 h-64 border-2 p-4 mb-6 box-border border-black overflow-hidden">
      <div className="mb-9">
        <h1 className="font-bold text-2xl whitespace-normal break-words">
          {props.title}
        </h1>
      </div>
      <button
        onClick={handleOpen}
        className="absolute right-2 bottom-2 inline-block  text-black cursor-pointer items-center justify-center rounded-md border-[1.58px] border-zinc-600  px-5 py-3 font-medium shadow-md transition-all duration-300 hover:[transform:translateY(-.335rem)] hover:shadow-xl">
        Open
      </button>
      <button
        onClick={handleDeleteClick}
        className="absolute right-24 bottom-2 inline-block  text-black cursor-pointer items-center justify-center rounded-md border-[1.58px] border-zinc-600  px-5 py-3 font-medium shadow-md transition-all duration-300 hover:[transform:translateY(-.335rem)] hover:shadow-xl">
        Delete
      </button>
    </div>
  );
}

export default Card;
