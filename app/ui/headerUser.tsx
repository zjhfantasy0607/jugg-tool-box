import LoginButton from "./headerUser/loginButton";
import UserInfo from './headerUser/userInfo';
import { cookies } from "next/headers";

export default function HeaderUser() {
    
    const token = cookies().get('token')?.value || '';

    return (
        <div>
            <LoginButton hiddenButton={Boolean(token)} />
            {token && <UserInfo /> }   
        </div>
    );
}