const express = require('express');
const passport = require('passport');
const router = express.Router();
const { Octokit } = require('@octokit/rest');
const { sendDiscountEmail } = require('../mailer'); // E-posta gönderme modülü

// GitHub Auth Route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub Callback Route
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: 'http://localhost:3000/',
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/profile'); // Başarılı auth sonrası yönlendirme
  }
);

// Fetch User Info
router.get('/user', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const octokit = new Octokit({
        auth: req.user.accessToken,
      });

      // Kullanıcı bilgilerini çek
      const { data: userDetails } = await octokit.users.getAuthenticated();
      const { data: repos } = await octokit.repos.listForAuthenticatedUser();

      // Gizli e-posta adreslerini çekmek için GitHub API'nin /user/emails endpoint'ini kullan
      const emailsResponse = await octokit.request('GET /user/emails', {
        headers: {
          authorization: `token ${req.user.accessToken}`,
        },
      });

      // Birincil e-posta adresini bul
      const primaryEmail =
        emailsResponse.data.find((email) => email.primary)?.email || 'No email available';

      // E-posta adresi varsa indirim e-postası gönder
      if (primaryEmail !== 'No email available') {
        try {
          await sendDiscountEmail(primaryEmail);
          console.log(`Discount email sent to ${primaryEmail}`);
        } catch (error) {
          console.error('Error sending email:', error.message);
        }
      } else {
        console.log('User email is not available, skipping email sending.');
      }

      // Kullanıcı bilgilerini ve repoları döndür
      res.json({
        name: userDetails.name || userDetails.login,
        username: userDetails.login,
        avatar: userDetails.avatar_url,
        email: primaryEmail, // Birincil e-posta adresini döndür
        followers: userDetails.followers,
        following: userDetails.following,
        repos: repos.map((repo) => ({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          description: repo.description,
          updated_at: repo.updated_at,
        })),
      });
    } catch (error) {
      console.error('GitHub API error:', error.message);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

module.exports = router;
