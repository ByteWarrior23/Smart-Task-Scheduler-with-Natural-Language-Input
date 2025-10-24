import fetch from 'node-fetch';
import { User } from '../../models/user.model.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import asyncHandler from '../../utils/asyncHandler.js';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_API = 'https://api.github.com/user';
const GITHUB_USER_EMAILS_API = 'https://api.github.com/user/emails';

function getEnv(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

export const githubLoginStart = asyncHandler(async (req, res) => {
  const clientId = getEnv('GITHUB_CLIENT_ID');
  const redirectUri = getEnv('GITHUB_REDIRECT_URI');
  const state = Buffer.from(JSON.stringify({ r: req.query.r || '/' })).toString('base64url');
  const scope = 'read:user user:email';
  const url = `${GITHUB_AUTHORIZE_URL}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
  return res.redirect(url);
});

async function exchangeCodeForToken(code) {
  const clientId = getEnv('GITHUB_CLIENT_ID');
  const clientSecret = getEnv('GITHUB_CLIENT_SECRET');
  const resp = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new ApiError(400, `GitHub token exchange failed: ${text}`);
  }
  const data = await resp.json();
  if (!data.access_token) {
    throw new ApiError(400, 'GitHub token exchange did not return access_token');
  }
  return data.access_token;
}

async function fetchGitHubUser(ghToken) {
  const headers = { Authorization: `Bearer ${ghToken}`, 'User-Agent': 'TaskMaster-App' };
  const userResp = await fetch(GITHUB_USER_API, { headers });
  if (!userResp.ok) throw new ApiError(400, 'Failed to fetch GitHub user');
  const ghUser = await userResp.json();

  const emailsResp = await fetch(GITHUB_USER_EMAILS_API, { headers });
  if (!emailsResp.ok) throw new ApiError(400, 'Failed to fetch GitHub emails');
  const emails = await emailsResp.json();
  const primaryEmail = emails.find(e => e.primary)?.email || emails[0]?.email;

  return { ghUser, primaryEmail };
}

export const githubOAuthCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  if (!code) throw new ApiError(400, 'Missing code');

  // Verify state if present
  let redirectPath = '/dashboard';
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
      if (typeof parsed.r === 'string') redirectPath = parsed.r;
    } catch {}
  }

  const ghToken = await exchangeCodeForToken(code);
  const { ghUser, primaryEmail } = await fetchGitHubUser(ghToken);

  if (!primaryEmail) throw new ApiError(400, 'GitHub account has no email');

  // Upsert user
  const usernameBase = ghUser.login || primaryEmail.split('@')[0];

  let user = await User.findOne({ $or: [
    { providerId: ghUser.id?.toString() },
    { email: primaryEmail.toLowerCase() }
  ]});

  if (!user) {
    user = await User.create({
      username: usernameBase,
      email: primaryEmail.toLowerCase(),
      fullname: ghUser.name || usernameBase,
      password: 'oauth',
      authProvider: 'github',
      providerId: ghUser.id?.toString() || null,
      emailVerified: !!primaryEmail,
    });
  } else {
    // Update provider info if needed
    if (!user.providerId) user.providerId = ghUser.id?.toString() || null;
    user.authProvider = 'github';
    user.emailVerified = user.emailVerified || !!primaryEmail;
    user.fullname = user.fullname || ghUser.name || usernameBase;
    await user.save({ validateBeforeSave: false });
  }

  // Generate tokens and redirect back to frontend with them in fragment
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshTokens = Array.isArray(user.refreshTokens) ? user.refreshTokens : [];
  user.refreshTokens.push(refreshToken);
  user.refreshTokens = user.refreshTokens.slice(-5);
  user.lastLoginAt = new Date();
  user.loginCount = (user.loginCount || 0) + 1;
  await user.save({ validateBeforeSave: false });

  const frontendBase = getEnv('FRONTEND_URL', 'http://localhost:5173');
  const redirectUrl = `${frontendBase}/oauth/callback#provider=github&accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}&redirect=${encodeURIComponent(redirectPath)}`;

  return res.redirect(redirectUrl);
});
