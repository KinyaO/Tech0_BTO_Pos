'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function MychoiceComponent() {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const user_token: string | null = useSearchParams().get("token");

    async function fetchUser(token: string) {
        const res = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/shopping?token=${token}`, { cache: "no-cache" });
        if (!res.ok) {
        throw new Error('Failed to fetch user');
        }
        return res.json();
    }

    useEffect(() => {
        if (user_token) { // user_tokenが存在する場合のみfetchを実行
        const fetchAndSetUser = async () => {
            const userData = await fetchUser(user_token);
            setUserName(userData.user_name);
            setToken(user_token);
            console.log(userData);
        };
        fetchAndSetUser();
        }
    }, [user_token]); // 依存配列にuser_tokenを追加

    // 登録画面に遷移する関数
    const handleSetRegistration = () => {
        console.log('handleSetRegistration is called');
        router.push(`/registration?token=${token}`);
    };

    // 購入画面に遷移する関数
    const handleSetShopping = () => {
        console.log('handleSetShopping is called');
        router.push(`/shopping?token=${token}`);
    };

    return (
        <div className="container">
        <div className='font-bold mb-4'>ようこそ {userName}さん！</div>
        <div>
        <button onClick={handleSetRegistration}>
            登録
            </button>
        </div>
        <div>
        <button onClick={handleSetShopping}>
            購入
            </button>
        </div>

        </div>
    );
}









