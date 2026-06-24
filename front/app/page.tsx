import { cookies } from "next/headers";
import MainPage from "../components/main/MainPage";

export default async function Page() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("accessToken")?.value;

  return <MainPage isLoggedIn={isLoggedIn} />;
}
