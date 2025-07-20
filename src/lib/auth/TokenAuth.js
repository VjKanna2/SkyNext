import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.SECRET_JWT_KEY
const REFRESH_KEY = process.env.SECRET_REFRESH

export const TOKEN = 'Sky_Next_Token';
export const REFRESH_TOKEN = 'Refresh_Sky_Next_Token';

export const getToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, mailId: user.mailId, joinedOn: user.createdAt },
        SECRET_KEY,
        { expiresIn: '15m' }
    )
}

export const refreshToken = (user) => {
    return jwt.sign(
        { id: user._id, mailId: user.mailId },
        REFRESH_KEY,
        { expiresIn: '1d' }
    )
}

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_KEY);
    } catch (err) {
        return null;
    }
}

export const isAuthUser = async (request) => {
    const token = request.cookies.get(TOKEN)?.value;
    if (!token) {
        return NextResponse.json(
            { Status: "Fail", Message: "Unauthorized User" },
            { status: 401 }
        );
    }
    try {
        const data = verifyToken(token);
        if (!data) {
            return NextResponse.json(
                { Status: "Fail", Message: "Invalid or Expired Token" },
                { status: 401 }
            );
        }
        return data;
    } catch (error) {
        return NextResponse.json(
            { Status: "Fail", Message: "Invalid or Expired Token" },
            { status: 401 }
        );
    }
};