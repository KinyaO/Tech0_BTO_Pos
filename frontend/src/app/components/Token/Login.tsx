'use client';
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function Login() {
    const formRef = useRef<HTMLFormElement>(null);
    const [userName, setUserName] = useState(''); // ユーザー名の状態を管理
    const [token, setToken] = useState(''); // ユーザー名の状態を管理
    const router = useRouter();

    const handleSend = async (event: any) => {
        event.preventDefault();

        // formRef.currentがnullでないことを確認
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const body_msg = JSON.stringify({
                user_name: formData.get('user_name'),
                password: formData.get('password'),
            });

            const response = await fetch('https://tech0-gen-5-step4-studentwebapp-7.azurewebsites.net/login', {
                method: 'POST',
                body: body_msg,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const jsonData = await response.json();
                setToken(jsonData.access_token);
                setUserName(jsonData.user_name);
                console.log(jsonData);
            } else {
                console.error('Login request failed:', response.statusText);
                window.alert(`Login request failed`);
            }
        }
    };

    useEffect(() => {
        console.log(userName);

        // userNameが空でない場合のみ実行
        if (userName) {
            window.alert(`ようこそ ${userName}さま！`);
            router.push(`/mypage?token=${token}`);
        }
    }, [userName, token]); // userNameとtokenが変更されたときにのみ実行

    return (
        <>
            <style jsx>{`
                .background-flex {
                    background-image: repeating-linear-gradient(
                        90deg,
                        #ff4500,
                        #ff4500 50px,
                        #ff6347 50px,
                        #ff6347 100px
                    );
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .form-container {
                    background: #fff;
                    padding: 20px;
                }
                `}</style>

            <div className="background-flex">
                <div className="form-container">
                    <div className="form-content">
                        <form ref={formRef} onSubmit={handleSend}>
                            <h1 className="text-6xl font-bold mb-10 text-center">BTO商店</h1>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user_name">
                                    ユーザー名:
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="user_name" name="user_name" type="text" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    パスワード：
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" required />
                            </div>
                            <button className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                SIGN IN
                            </button>
                        </form>
                    </div>
                </div>
                </div>
            </>
        );
    }
