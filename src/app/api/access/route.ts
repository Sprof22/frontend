import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

// Define the GET handler
import { NextApiRequest, NextApiResponse } from "next";

const GET = withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { accessToken } = await getAccessToken(req, res);

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json({ error: "Failed to fetch access token" }, { status: 500 });
  }
});

export { GET };