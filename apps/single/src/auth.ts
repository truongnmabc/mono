import NextAuth from "next-auth";
import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifiedCodeApi } from "./services/home.service";

type IAccountInfo = {
    email: string;
    picture: string;
    name: string;
    id: string;
    email_verified: boolean;
    given_name: string;
    family_name: string;
};

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            id: "token",
            name: "Credentials",
            credentials: {
                token: { label: "Token", type: "text" },
            },
            async authorize(credentials) {
                const { token } = credentials;
                if (token && typeof token === "string") {
                    const accountInfo = jwt.decode(token) as IAccountInfo;
                    return {
                        ...accountInfo,
                        id: accountInfo.id,
                        image: accountInfo.picture,
                    };
                }
                return null;
            },
        }),

        CredentialsProvider({
            id: "email",
            name: "Email ",
            credentials: {
                email: { label: "Email", type: "text " },
                code: { label: "Code", type: "text " },
            },
            async authorize(credentials) {
                const { email, code } = credentials as {
                    email: string;
                    code: string;
                };
                if (email && code) {
                    try {
                        const res = await verifiedCodeApi({ email, code });
                        if (res) {
                            return {
                                email: email,
                                image: "/images/totoro.jpg",
                                id: email,
                                name: email,
                            };
                        } else {
                            return null;
                        }
                    } catch (error) {
                        console.error("🚀 ~ authorize ~ API error:", error);
                        return null;
                    }
                }
                return {};
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
                token["id"] = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: (token["id"] as string) || "",
            };
            return session;
        },
    },
    jwt: {
        maxAge: 60 * 60 * 48,
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 48,
    },
    secret: process.env["AUTH_SECRET"],
    trustHost: true,
});
