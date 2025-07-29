import Modal from "./Modal";

export default function ModalMenu({ modalCancelHandler, menuOptions }) {
  return (
    <Modal closeHandler={modalCancelHandler}>
      {menuOptions.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className="bg-white text-black px-4 py-2 rounded-full leading-10"
        >
          {item.label}
        </button>
      ))}
    </Modal>
  );
}
