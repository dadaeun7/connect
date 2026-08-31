import InfoPage from "@/components/my_info/InfoPage";
import * as myinfo from "@/actions/myinfo";

export default function Page() {
  return (
    <InfoPage
      appConnectHanlder={myinfo.appConnectHanlder}
      userWithDraw={myinfo.userWithDraw}
    />
  );
}
