import { NextRequest, NextResponse } from "next/server";
import {
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const DEFAULT_SOL_ADDRESS: PublicKey = new PublicKey(
  "94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL" // devnet wallet
);
export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey, title, description, imageUrl } =
      validatedQueryParams(requestUrl);

    const baseHref = new URL(
      `/api/actions/blinkify?to=${toPubkey.toBase58()}`,
      requestUrl.origin
    ).toString();

    const payload: ActionGetResponse = {
      title: title,
      icon: imageUrl || new URL("/icon.png", requestUrl.origin).toString(),
      description: description,
      label: "Apply",
      links: {
        actions: [
          {
            label: `Apply`,
            href: `${baseHref}`,
            parameters: [
              {
                name: "Name",
                label: "Name",
                required: true,
              },
              {
                name: "Anything Else?",
                label: "Add any additional links or information here.",
              },
              {
                name: "compensation",
                label: "What is your compensation requirement?",
                required: true,
              },
              {
                name: "Wallet Address",
                label: "Your Solana Wallet Address",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return new NextResponse(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const { toPubkey, imageUrl } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // Your Helius RPC URL

    // Your Helius WebSocket URL

    // Create a new connection using the Helius RPC URL
    const connection = new Connection("");
    // const connection = new Connection(
    //   clusterApiUrl("mainnet-beta"),
    // );

    // ensure the receiving account will be rent exempt

    const transaction = new Transaction();
    transaction.feePayer = account;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: toPubkey,
        lamports: 0.1 * LAMPORTS_PER_SOL,
      })
    );

    // set the end user as the fee payer
    transaction.feePayer = account;

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    console.log("Transaction Parameters:", body);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "superteamearn.in",
      },
      // note: no additional signers are needed
      // signers: [],
    });

    return new NextResponse(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
  let amount: number = 0.1;
  let title: string = "";
  let description: string = "";
  let imageUrl: string = new URL("/icon.png", requestUrl.origin).toString();

  try {
    if (requestUrl.searchParams.get("to")) {
      toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
    }

    if (requestUrl.searchParams.get("title")) {
      title = requestUrl.searchParams.get("title")!;
    }
    if (requestUrl.searchParams.get("description")) {
      description = requestUrl.searchParams.get("description")!;
    }
    if (requestUrl.searchParams.get("imageUrl")) {
      imageUrl = requestUrl.searchParams.get("imageUrl")!;
    }
  } catch (err) {
    throw `Invalid input query parameter: ${err}`;
  }

  return {
    toPubkey,
    title,
    description,
    imageUrl,
  };
}
