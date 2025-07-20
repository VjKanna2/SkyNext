import { getToken, REFRESH_TOKEN, TOKEN, verifyRefreshToken } from "@/lib/auth/TokenAuth"
import { NextResponse } from "next/server";
import UserData from "@/lib/database/Models/UserSchema";

export const POST = async (request) => {

    const refreshToken = await request.cookies.get(REFRESH_TOKEN)?.value;

    if (!refreshToken) {
        return NextResponse.json({ 'Status': 'Fail', 'Message': 'Refresh Token Not Found' }, { status: 499 });
    }

    const refreshResponse = await verifyRefreshToken(refreshToken);

    if (!refreshResponse) {
        return NextResponse.json({ 'Status': 'Fail', 'Message': 'Invalid or Expired Refresh Token' }, { status: 499 });
    }

    const user = await UserData.findById(refreshResponse.id)

    if (!user) {
        return NextResponse.json({ 'Status': 'Fail', 'Message': 'User Not Found' }, { status: 498 });
    }

    const newTokenFromRefresh = await getToken(user);

    const response = NextResponse.json({ 'Status': 'Success', 'Message': 'Token Refreshed' }, { status: 200 });

    response.cookies.set(TOKEN, newTokenFromRefresh, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000   // 2 day
    });

    return response;

}