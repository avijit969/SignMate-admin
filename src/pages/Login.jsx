import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../store/authSlice';
import { supabase } from '../../supabaseClient';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            toast.error(error.message);
        } else {
            dispatch(login({ userData: data.user }));
            console.log(data)
            toast.success("User logged in successfully.");
            navigate('/');
        }
    };

    return (
        <div>
            <div className="text-center mt-24">
                <div className="flex items-center justify-center">
                    <svg fill="none" viewBox="0 0 24 24" className="w-12 h-12 text-blue-500" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-4xl tracking-tight">
                    Login to Your Account
                </h2>
                <span className="text-sm">or <Link to="/signup" className="text-blue-500">
                    Register
                </Link></span>
            </div>
            <div className="flex justify-center my-2 mx-4 md:mx-0">
                <form className="w-full max-w-xl bg-white rounded-lg shadow-md p-6" onSubmit={handleLogin}>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-full px-3 mb-6">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='email'>Email address</label>
                            <input
                                className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                                type='email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full md:w-full px-3 mb-6">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor='password'>Password</label>
                            <input
                                className="appearance-none block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                                type='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="w-full md:w-full px-3 mb-6 text-red-500">{error}</div>}
                        <div className="w-full flex items-center justify-between px-3 mb-3 ">
                            <label htmlFor="remember" className="flex items-center w-1/2">
                                <input type="checkbox" name="" id="remember" className="mr-1 bg-white shadow" />
                                <span className="text-sm text-gray-700 pt-1">Remember Me</span>
                            </label>
                            <div className="w-1/2 text-right">
                                <Link to="/forgot-password" className="text-blue-500 text-sm tracking-tight">Forget your password?</Link>
                            </div>
                        </div>
                        <div className="w-full md:w-full px-3 mb-6">
                            <button
                                className="appearance-none block w-full bg-blue-600 text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-blue-500 focus:outline-none focus:bg-white focus:border-gray-500"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
