export default function ProjectLoading() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white animate-pulse">
      {/*  우측 메인 콘텐츠 스켈레톤 (보내주신 작업라인 화면 일치) */}
      <main className="flex-1 h-full p-8 space-y-6 overflow-y-auto bg-white">
        {/* 상단 타이틀 영역 (작업라인 248) */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-24 bg-gray-200 rounded-md"></div>{" "}
            {/* 작업라인 */}
            <div className="h-5 w-10 bg-gray-200 rounded-full"></div>{" "}
            {/* 248 배지 */}
          </div>
        </div>

        {/* 탭 메뉴 (전체 / 긴급 / 새작업 / 완료) */}
        <div className="flex space-x-6 border-b border-gray-100 pb-2">
          <div className="h-4 w-10 bg-gray-300 rounded"></div>
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
        </div>

        {/* 상단 검색바 & 버튼 필터 라인 */}
        <div className="flex justify-end space-x-3">
          <div className="h-9 w-48 bg-gray-100 rounded-lg"></div>{" "}
          {/* Search tasks */}
          <div className="h-9 w-16 bg-gray-100 rounded-lg"></div> {/* Filter */}
          <div className="h-9 w-14 bg-gray-100 rounded-lg"></div> {/* Sort */}
          <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>{" "}
          {/* + Add Milestone */}
        </div>

        {/* 대형 이슈 카드 내부 박스 레이아웃 */}
        <div className="border border-gray-100 rounded-2xl p-6 space-y-6 bg-gray-50/30">
          {/* 이슈 메인 타이틀 & 마감일 헤더 영역 */}
          <div className="space-y-3">
            <div className="h-5 w-3/4 bg-gray-200 rounded-md"></div>{" "}
            {/* 코어 데이터 동기화... */}
            <div className="flex space-x-2">
              <div className="h-5 w-28 bg-gray-100 rounded"></div>{" "}
              {/* 마감일 2026.06.24 */}
              <div className="h-5 w-16 bg-gray-100 rounded"></div>{" "}
              {/* CLOSED 50 */}
              <div className="h-5 w-14 bg-gray-100 rounded"></div>{" "}
              {/* OPEN 2 */}
              <div className="h-5 w-12 bg-gray-100 rounded"></div> {/* D-13 */}
            </div>
          </div>

          {/* 담당자 아이콘들 & 64% 완료 프로그레스 바 자리 */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1.5">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>{" "}
              {/* U1 */}
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>{" "}
              {/* U2 */}
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>{" "}
              {/* U3 */}
            </div>
            {/* 우측 진행률 막대 바 */}
            <div className="h-2 w-48 bg-gray-200 rounded-full"></div>
          </div>

          {/* 하위 서브 태스크 리스트 (Webhook 실시간 알림..., 웹훅 엔드포인트...) */}
          <div className="space-y-3 pt-4">
            {/* 첫 번째 서브 태스크 바 */}
            <div className="flex justify-between items-center p-3 border border-gray-100 bg-white rounded-xl h-12">
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
              <div className="flex space-x-2">
                <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
                <div className="h-5 w-14 bg-gray-100 rounded-full"></div>
              </div>
            </div>

            {/* 두 번째 서브 태스크 바 (연동 링크 포함된 박스) */}
            <div className="border border-gray-100 bg-white rounded-xl divide-y divide-gray-50">
              <div className="flex justify-between items-center p-3 h-12">
                <div className="h-4 w-72 bg-gray-200 rounded"></div>
                <div className="flex space-x-2">
                  <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
                  <div className="h-5 w-14 bg-gray-100 rounded-full"></div>
                </div>
              </div>
              {/* 내부 연동된 GitHub / Figma 링크 라인 */}
              <div className="p-3 space-y-2.5 bg-gray-50/20">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-sm"></div>{" "}
                  {/* 깃허브 아이콘 */}
                  <div className="h-3.5 w-96 bg-gray-100 rounded"></div>{" "}
                  {/* Feat: Implement custom... */}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded-sm"></div>{" "}
                  {/* 피그마 아이콘 */}
                  <div className="h-3.5 w-80 bg-gray-100 rounded"></div>{" "}
                  {/* Design: Update component... */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
