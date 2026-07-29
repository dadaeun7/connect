import React from "react";

interface ImageModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

/**
 * 화면 중앙에 이미지를 띄우고 배경을 검은색 반투명 처리하는 재사용 가능한 모달 컴포넌트
 */
export const ImageModal: React.FC<ImageModalProps> = ({
  src,
  alt = "확대 이미지",
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* max-h, max-w 제한을 풀거나 overflow-auto를 적용해 큰 이미지를 스크롤로 확인 */}
      <div
        className="relative max-h-[85vh] max-w-[85vw] overflow-auto rounded-lg p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black focus:outline-none"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* scale이나 w-full 등을 활용해 정중앙에서 더 크게 렌더링 */}
        <img
          src={src}
          alt={alt}
          className="h-auto max-w-none min-w-[100px] object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>
    </div>
  );
};
