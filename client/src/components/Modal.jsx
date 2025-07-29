export default function Modal({ children, closeHandler }) {
  return (
    <div
      onClick={closeHandler}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-4"
    >
      <div className="w-90 rounded-lg shadow-lg p-1 space-y-4">
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}
