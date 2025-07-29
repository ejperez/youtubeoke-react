export default function ListItem({ item, clickHandler, isActive }) {
  return (
    <li      
      style={{ backgroundImage: `url(${item.image})` }}
      className={`bg-cover relative rounded-2xl ${isActive && "active"}`}
    >
      <div className="backdrop-blur-sm backdrop-brightness-20 absolute top-0 left-0 w-full h-full rounded-2xl"></div>
      <button
        className="relative flex gap-2 p-2 bg-white/20 w-full rounded-2xl"
        type="button"
        onClick={() => {
          clickHandler(item);
        }}
      >
        <div className="relative w-1/2">
          <img
            src={item.image}
            className="w-full"
            loading="lazy"
            width="360"
            height="202"
            alt={item.title}
          />
          <div className="absolute right-0 bottom-0 font-bold text-white bg-black/70 pl-0.5 pr-0.5 text-xs">
            {item.length}
          </div>
        </div>
        <div className="w-1/2 text-left">
          <p className="line-clamp-2 font-text font-bold">{item.title}</p>
          <em className="text-xs">{item.channel}</em>
        </div>
      </button>
    </li>
  );
}
