import { getToken, REFRESH_TOKEN, refreshToken, TOKEN } from "@/lib/auth/TokenAuth";
import { ConnectDB } from "@/lib/database/ConnectDB";
import UserData from "@/lib/database/Models/UserSchema";
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request) => {

    const { username, mailId, password, confirmPassword } = await request.json();

    if (password !== confirmPassword) {
        return NextResponse.json({ 'Status': 'Success', 'Message': 'Password Not Matched' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formatted = `${day}/${month}/${year} - ${hours}:${minutes}`;

    await ConnectDB();

    await UserData.create({
        uniqId: `${username}_${formatted}`,
        name: username,
        mailId: mailId,
        password: hashed
    });

    const data = await UserData.find({ mailId: mailId });

    const token = await getToken(data[0]);
    const refresh = await refreshToken(data[0]);

    const response = NextResponse.json({ 'Status': 'Success', 'Message': 'Welcome New User' });

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
}
