import axios from "axios";
import jwt from "jsonwebtoken";
import { findByProvider, create } from "../models/user.model.js";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

const facebookAppId = process.env.FACEBOOK_APP_ID;
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
const facebookRedirectUri = process.env.FACEBOOK_REDIRECT_URI;

const appUrl = process.env.APP_URL || "http://localhost:3000";

async function findOrCreateSocialUser(provider, providerId, name, email) {
  let user = findByProvider(provider, providerId);
  if (!user) {
    user = await create({ name, email, provider, providerId });
  }
  return user;
}

export const googleAuth = (req, res) => {
  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: googleRedirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

export const googleCallback = async (req, res, next) => {
  try {
    const { code, error } = req.query;
    if (error) {
      return res.redirect(`${appUrl}/?error=google_auth_denied`);
    }
    if (!code) {
      return res.redirect(`${appUrl}/?error=google_auth_failed`);
    }

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { sub, email, name } = userRes.data;
    const user = await findOrCreateSocialUser("google", sub, name, email);
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${appUrl}/?token=${token}`);
  } catch (err) {
    console.error("Google callback error:", err.message);
    res.redirect(`${appUrl}/?error=google_auth_failed`);
  }
};

export const facebookAuth = (req, res) => {
  const params = new URLSearchParams({
    client_id: facebookAppId,
    redirect_uri: facebookRedirectUri,
    response_type: "code",
    scope: "email,public_profile",
  });
  res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`);
};

export const facebookCallback = async (req, res, next) => {
  try {
    const { code, error } = req.query;
    if (error) {
      return res.redirect(`${appUrl}/?error=facebook_auth_denied`);
    }
    if (!code) {
      return res.redirect(`${appUrl}/?error=facebook_auth_failed`);
    }

    const tokenRes = await axios.get("https://graph.facebook.com/v18.0/oauth/access_token", {
      params: {
        client_id: facebookAppId,
        client_secret: facebookAppSecret,
        redirect_uri: facebookRedirectUri,
        code,
      },
    });

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get("https://graph.facebook.com/v18.0/me", {
      params: {
        fields: "id,name,email",
        access_token: accessToken,
      },
    });

    const { id, name, email } = userRes.data;
    const user = await findOrCreateSocialUser("facebook", id, name, email);
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${appUrl}/?token=${token}`);
  } catch (err) {
    console.error("Facebook callback error:", err.message);
    res.redirect(`${appUrl}/?error=facebook_auth_failed`);
  }
};
