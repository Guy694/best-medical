import { withIronSessionApiRoute } from "iron-session/next";

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters",
  cookieName: "myapp_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSession(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}