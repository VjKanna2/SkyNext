import bcrypt from 'bcryptjs';
import { getToken, REFRESH_TOKEN, refreshToken, TOKEN } from "@/lib/auth/TokenAuth";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from '@/lib/database/ConnectDB';
import UserData from '@/lib/database/Models/UserSchema';

export const POST = async (request) => {

    const { mailId, password } = await request.json();

    await ConnectDB();

    const isThereUser = await UserData.findOne({ mailId: mailId });

    if (!isThereUser || !(await bcrypt.compare(password, isThereUser.password))) {
        return NextResponse.json({ 'Status': 'Fail', 'Message': 'Invalid credentials' }, { status: 401 });
    }

    const token = await getToken(isThereUser);
    const refresh = await refreshToken(isThereUser);

    const response = NextResponse.json({ 'Status': 'Success', 'Message': 'Logged In Successfully' }, { status: 200 });

    response.cookies.set(TOKEN, token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000   // 1 day
    });

    response.cookies.set(REFRESH_TOKEN, refresh, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000   // 2 day
    });

    return response;

};
