"use client";

import { useState, useEffect } from "react";

interface TimerProps {
  expiredAt: number; // 초기 설정 시간 (예: 180초 = 3분)
  onTimeout: () => void; // 시간 만료 시 실행할 콜백 함수
}

export default function AuthTimer({
  expiredAt,
  onTimeout,
}: Readonly<TimerProps>) {
  const calculateTimeLeft = () => {
    const now = Date.now(); // 브라우저의 현재 밀리초 시각
    const difference = Math.floor((expiredAt - now) / 1000); // 초 단위 변환
    return Math.max(difference, 0);
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    // 2. 1초마다 남은 시간을 계산하는 인터벌 구동
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const intervalId = setInterval(() => {
      const secondsRemaining = calculateTimeLeft();

      if (secondsRemaining <= 0) {
        clearInterval(intervalId);
        setTimeLeft(0);
        onTimeout();
      } else {
        setTimeLeft(secondsRemaining);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiredAt, onTimeout]);

  // 4. 분:초 형식으로 포맷팅 (예: 03:00)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="text-sm font-medium text-red-500">
      {timeLeft > 0
        ? `남은 시간: ${formatTime(timeLeft)}`
        : "인증 시간이 만료되었습니다."}
    </div>
  );
}
