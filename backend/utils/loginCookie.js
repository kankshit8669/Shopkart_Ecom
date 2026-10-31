function issueLoginCookie(account, status, response) {
    const token = account.getJwtToken();
    const days = Number(process.env.COOKIE_EXPIRES_TIME) || 7;
    const expires = new Date(Date.now() + days * 86400000);

    response.cookie('token', token, {
        expires,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'PRODUCTION'
    });

    response.status(status).json({ success: true, token, user: account });
}

module.exports = issueLoginCookie;
