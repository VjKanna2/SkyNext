import { isAuthUser } from "@/lib/auth/TokenAuth";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/database/ConnectDB";
import UserData from "@/lib/database/Models/UserSchema";

export const POST = async (request) => {

    const { place, latitude, longitude } = await request.json();

    const response = await isAuthUser(request);
    if (response instanceof NextResponse) return response

    await ConnectDB();

    await UserData.findByIdAndUpdate(response.id,
        {
            $set:
            {
                home: {
                    place: place,
                    latitude: latitude !== null ? Number(latitude) : '',
                    longitude: longitude !== null ? Number(longitude) : ''
                }
            }
        }
    )

    return NextResponse.json({ 'Status': 'Success', 'Message': 'Updated Successfully' })

}