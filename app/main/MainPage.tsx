import Link from "next/link";

export default function MainPage(){

    return(<div>
        <Link href="/login" className="text-blue-500 underline">
            <span>로그인</span>
        </Link>
    </div>)
}