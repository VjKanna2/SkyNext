'use client'
import React, { useState } from 'react'
import loginStyles from '@/styles/LoginForm.module.css'
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';
import { LOGIN, SIGNUP, VERIFYMAIL } from '@/utils/Urls';
import { PostApi } from '@/lib/ApiCall';
import Backgrounds from '@/components/Backgrounds'
import { currentTime, setDynamicBackground } from '@/utils/Functions'

const LoginForm = () => {

    const route = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const [loginCredentials, setLoginCredentials] = useState({
        username: '',
        mailId: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        usernameError: '',
        mailIdError: '',
        passwordError: '',
        confirmPasswordError: ''
    });

    const [signUpCount, setSignUpCount] = useState(0);

    const switchLogin = (value) => {
        setIsLogin(value);
        setLoginCredentials({
            username: '',
            mailId: '',
            password: '',
            confirmPassword: ''
        });
        clearError();
    }

    const clearError = () => {
        setErrorMessages({
            usernameError: '',
            mailIdError: '',
            passwordError: '',
            confirmPasswordError: ''
        });
    }

    const validation = () => {
        const { username, mailId, password, confirmPassword } = loginCredentials;
        const errors = { usernameError: '', passwordError: '', confirmPasswordError: '' };

        if (!isLogin && username.trim().length < 5) {
            errors.usernameError = 'Please Enter a Valid Username';
        } else if (mailId === '') {
            errors.passwordError = 'Please Enter a Valid Mail ID';
        } else if ((isLogin || (!isLogin && signUpCount === 1)) && password.length < 8) {
            errors.passwordError = 'Please Enter a Valid Password';
        } else if ((!isLogin && signUpCount === 1) && confirmPassword.length < 8) {
            errors.confirmPasswordError = 'Please Enter a Valid Password';
        } else if ((!isLogin && signUpCount === 1) && confirmPassword !== password) {
            errors.confirmPasswordError = "Password Doesn't Match";
        }

        const isThereError = Object.values(errors).some(msg => msg !== '');
        setErrorMessages(errors);

        return !isThereError;
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (!validation()) return;

        const url = isLogin ? LOGIN : !isLogin && signUpCount === 0 ? VERIFYMAIL : SIGNUP;
        const payload = (!isLogin && signUpCount === 1) ? loginCredentials :
            (!isLogin && signUpCount === 0) ? {
                username: loginCredentials.username,
                mailId: loginCredentials.mailId
            } : {
                mailId: loginCredentials.mailId,
                password: loginCredentials.password,
            };

        try {
            setIsLoading(true);
            const response = await PostApi(url, payload);
            if (response.data !== null && response.data.Status === 'Success') {
                clearError();
                if (response.data['Message'] === 'Logged In Successfully' ||
                    response.data['Message'] === 'Welcome New User') route.push('/');
                else if (response.data['Message'] === 'Mail ID Verified') setSignUpCount(1);
                else if (response.data['Message'] === 'User Mail Already Exists') {
                    setErrorMessages(p => ({ ...p, mailIdError: 'User Already Exists' }));
                }
                else if (response.data['Message'] === 'Password Not Matched') {
                    setErrorMessages(p => ({ ...p, confirmPasswordError: "Password Doesn't Match" }));
                } else setSignUpCount(0);
            } else if (response.data == null && response.status == 401 && isLogin) {
                setErrorMessages(p => ({ ...p, passwordError: 'Invalid Credentials' }));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Backgrounds centerY videoUrl={setDynamicBackground(currentTime())}>
            <div className='LoginContainer flex items-center justify-center h-full'>

                <img src="images/Icon2.jpg"
                    className={`LoginContainer_headerLogo ${loginStyles.logoImg} absolute top-[10px] right-[20px]`}
                />

                <form className='LoginContainer_Form glass-effect w-[310px] max-w-[350px] m-auto py-3 px-4 flex flex-col items-center text-center'
                    onSubmit={handleSubmitForm}
                >
                    <div className="LoginContainer_Form-Switch w-full flex items-center justify-between">
                        <p className={`${loginStyles.switchLogin} w-[48%] ${isLogin ? 'text-white bg-[#0957DE]' : 'text-white'} cursor-pointer p-1 m-0 rounded-lg`}
                            onClick={() => switchLogin(true)}
                        >
                            Login
                        </p>
                        <p className={`${loginStyles.switchLogin} w-[48%] ${!isLogin ? 'text-white bg-[#0957DE]' : 'text-white'} cursor-pointer p-1 m-0 rounded-lg`}
                            onClick={() => switchLogin(false)}
                        >
                            SignUp
                        </p>
                    </div>

                    <img src='/images/User.jpg' className={loginStyles.logoImg} />

                    {(!isLogin && signUpCount === 0) && <div className={`LoginContainer_Form-UserName ${loginStyles.fieldContainer}`}>
                        <label htmlFor="UserName" className={loginStyles.label}>
                            User Name
                        </label>
                        <input
                            name='UserName'
                            type="text"
                            placeholder='Enter Username'
                            autoComplete="new-username"
                            className={`${loginStyles.textBox} focus:outline-none p-2`}
                            value={loginCredentials.username}
                            onChange={(e) => {
                                clearError();
                                const input = e.target.value;
                                const cleaned = input.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
                                setLoginCredentials((p) => ({ ...p, username: cleaned }));
                            }}
                        />
                        {errorMessages.usernameError !== '' &&
                            <p className={loginStyles.error}>{errorMessages.usernameError}</p>
                        }
                    </div>}

                    {((!isLogin && signUpCount === 0) || isLogin) &&
                        <div className={`LoginContainer_Form-Mail ${loginStyles.fieldContainer}`}>
                            <label htmlFor="MailID" className={loginStyles.label}>
                                Mail ID
                            </label>
                            <input
                                name='MailID'
                                type="email"
                                placeholder='Enter Mail ID'
                                autoComplete="new-mail"
                                className={`${loginStyles.textBox} focus:outline-none p-2`}
                                value={loginCredentials.mailId}
                                onChange={(e) => {
                                    clearError();
                                    const input = e.target.value;
                                    const cleaned = input.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
                                    setLoginCredentials((p) => ({ ...p, mailId: input }));
                                }}
                            />
                            {errorMessages.mailIdError !== '' &&
                                <p className={loginStyles.error}>{errorMessages.mailIdError}</p>
                            }
                        </div>
                    }

                    {((!isLogin && signUpCount === 1) || isLogin) && <div className={`LoginContainer_Form-Password ${loginStyles.fieldContainer}`}>
                        <label htmlFor="Password" className={loginStyles.label}>
                            Password
                        </label>
                        <input
                            name='UserPassword'
                            type="password"
                            placeholder='Password'
                            className={`${loginStyles.textBox} focus:outline-none p-2`}
                            value={loginCredentials.password}
                            onChange={(e) => {
                                clearError();
                                setLoginCredentials(p => ({ ...p, password: e.target.value }));
                            }}
                        />
                        {errorMessages.passwordError !== '' &&
                            <p className={loginStyles.error}>{errorMessages.passwordError}</p>
                        }
                    </div>}

                    {(!isLogin && signUpCount === 1) &&
                        <div className={`LoginContainer_Form-ConfirmPassword mb-4 ${loginStyles.fieldContainer}`}>
                            <label htmlFor="ConfirmPassword" className={loginStyles.label}>
                                Confirm Password
                            </label>
                            <input
                                name='ConfirmPassword'
                                type="password"
                                placeholder='Confirm Password'
                                className={`${loginStyles.textBox} focus:outline-none p-2`}
                                value={loginCredentials.confirmPassword}
                                onChange={(e) => {
                                    clearError();
                                    setLoginCredentials(p => ({ ...p, confirmPassword: e.target.value }))
                                }}
                            />
                            {errorMessages.confirmPasswordError !== '' &&
                                <p className={loginStyles.error}>{errorMessages.confirmPasswordError}</p>
                            }
                        </div>
                    }

                    {isLogin &&
                        <div className={`LoginContainer_Form-forgotPassword w-full mt-2 text-right`}>
                            <p className={loginStyles.forgotPassword}>Forgot Password?</p>
                        </div>
                    }

                    <div className={`LoginContainer_Form-Action ${loginStyles.fieldContainer}`}>
                        <button type='submit'
                            className={`${loginStyles.loginBtn} cursor-pointer rounded-lg p-2`}
                        >
                            {isLoading ?
                                <Spinner color="white" /> :
                                (isLogin ? 'Enter' : (!isLogin && signUpCount === 0) ?
                                    'Next' : 'SignUp')
                            }
                        </button>
                        {(isLogin || (!isLogin && signUpCount === 0)) && <div className="w-[95%] mt-1 mb-1 flex justify-around items-center">
                            <div className={loginStyles.line} ></div>
                            <p className='text-white'>or</p>
                            <div className={loginStyles.line} ></div>
                        </div>}
                        {(isLogin || (!isLogin && signUpCount === 0)) && <button type='button'
                            className={`${loginStyles.noLoginBtn} cursor-pointer rounded-lg p-2`}
                            onClick={() => route.push('/')}
                        >
                            Continue without Login
                        </button>}
                    </div>
                </form >
            </div >
        </Backgrounds>
    )
}

export default LoginForm
