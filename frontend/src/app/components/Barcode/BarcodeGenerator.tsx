'use client';
import { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
//import BarcodeGeneratorComponent from './../components/Barcode';

interface Registrations {
    registration_id: number;
    quantity: number;
    price: number;
    peer: number;
    barcode: number;
    range_name: string;
    initial_counts: number;
    now_counts: number;
    product_name: string;
    user_name: string;
    message: string;
    registration_date: string;
    last_update: string;
    // 他のプロパティがあればここに追加
}

export default function BarcodeGeneratorComponent() {
    const formRef = useRef<HTMLFormElement>(null);
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    const user_token: string | null = useSearchParams().get("token");
    const [vegetablesData, setVegetablesData] = useState<string[]>([]);
    const [rangesData, setRangesData] = useState<string[]>([]);
    const currentTime = getJSTDate();
    const router = useRouter();


    async function fetchUser(token: string) {
        const res = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/shopping?token=${user_token}`, { cache: "no-cache" });
        if (!res.ok) {
            throw new Error('Failed to fetch user');
        }
        return res.json();
    }

    async function fetchVegetables() {
        const res2 = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/vegetables`, { cache: "no-cache" });
        if (!res2.ok) {
            throw new Error('Failed to fetch vegetable');
        }
        return res2.json();
    }

    async function fetchRanges() {
        const res3 = await fetch(`https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/ranges`, { cache: "no-cache" });
        if (!res3.ok) {
            throw new Error('Failed to fetch range');
        }
        return res3.json();
    }

    useEffect(() => {
        const fetchAndSetUser = async () => {
            const userData = await fetchUser(token);
            setUserName(userData.user_name);
            // user_tokenがnullでないことを確認し、nullであれば空文字列""を使用
            setToken(user_token !== null ? user_token : "");
            console.log(userData);
        };
        fetchAndSetUser();

        const fetchAndSetVegetables = async () => {
            const response = await fetchVegetables();
            const data = await response;
            setVegetablesData(data.vegetables || []); // 応答の`vegetables`プロパティを直接使用
            console.log(data.vegetables);
        };
        fetchAndSetVegetables();

        const fetchAndSetRanges = async () => {
            const response2 = await fetchRanges();
            const data2 = await response2;
            setRangesData(data2.range || []); // 応答の`ranges`プロパティを直接使用
            console.log(data2.range);
        };
        fetchAndSetRanges();

    }, []);

    // 日本時間に変換するための関数
    function getJSTDate() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const jstOffset = 9
         * 60 * 60000; // JSTはUTC+9時間
        return new Date(utc + jstOffset);
    }

    const handleSend = async (event: any) => {
        event.preventDefault();

        // formRef.currentがnullでないことを確認
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const body_msg = JSON.stringify({
                token: token,
                product_name: formData.get('product_name'),
                price: formData.get('price'),
                peer: formData.get('peer'),
                initial_counts: formData.get('initial_counts'),
                message: formData.get('message'),
                range_name: formData.get('range_name'),
                registration_date:currentTime,
            });
            console.log(body_msg);

            const response = await fetch('https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/registrations', {
                method: 'POST',
                body: body_msg,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {

                // ポップアップで合計金額を表示
                const jsonData = await response.json();
                console.log(jsonData);
                window.alert(`${jsonData.product_name}を ${jsonData.price}円 (${jsonData.peer}peer)で ${jsonData.initial_counts}個登録しました！`);
                window.open(`/print?registration_id=${jsonData.registration_id}`, '_blank');
                router.push(`/mypage?token=${token}`);
            } else {
                console.error('Registration request failed:', response.statusText);
                window.alert(`Registration request failed`);
            }
        }
    };

    return (
        <div className="container">
            <div className='font-bold mb-4'>ようこそ {userName}さん！</div>
            <div>
                <form ref={formRef} onSubmit={handleSend}>
                    <h1 className="text-6xl font-bold mb-10 text-center">ゆーあーる  やさい  とうろく！</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_name">
                            野菜:
                        </label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="product_name"
                                name="product_name"
                                required
                            >
                                {vegetablesData.map((vegetable, index) => (
                                    <option key={index} value={vegetable}>{vegetable}</option>
                                ))}
                            </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                            価格：
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="price" name="price" type="text" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="peer">
                            peer：
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="peer" name="peer" type="text" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="initial_counts">
                            個数：
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="initial_counts" name="initial_counts" type="text" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="range_name">
                            メッセージ対象：
                        </label>
                        <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="range_name"
                                name="range_name"
                                required
                            >
                                {rangesData.map((range_name, index) => (
                                    <option key={index} value={range_name}>{range_name}</option>
                                ))}
                            </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                            メッセージ内容：
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="message" name="message" type="text" required />
                    </div>
                    <button className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        登録
                    </button>
                </form>
            </div>
    </div>
    );
}








