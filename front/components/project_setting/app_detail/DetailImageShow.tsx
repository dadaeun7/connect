import { Dispatch, SetStateAction } from "react";

interface DetailImageShow {
  imgUrl: string;
  setShow: Dispatch<SetStateAction<boolean>>;
}

export default function DetailImageShow({
  imgUrl,
  setShow,
}: Readonly<DetailImageShow>) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity"
      onClick={() => {
        setShow(false);
      }}
      aria-modal="true"
      role="dialog"
    >
      {/* max-h, max-w 제한을 풀거나 overflow-auto를 적용해 큰 이미지를 스크롤로 확인 */}
      <div
        className="relative max-h-[85vh] max-w-[85vw] overflow-auto rounded-lg p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setShow(false);
          }}
          className="fixed right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black focus:outline-none"
          aria-label="닫기"
        >
          ✕
        </button>
        <img src={imgUrl} alt="detail img" />
      </div>
    </div>
  );
}
