# DevOps Portfolio

A modern, interactive portfolio website for DevOps engineers. Built with HTML, CSS, and vanilla JavaScript for optimal performance and static hosting on AWS S3.

## Features

- 🎨 Colorful, professional design with smooth animations
- 📱 Fully responsive across all devices
- ⚡ Lightweight and fast-loading
- 🔍 Project filtering by category
- 📊 Animated statistics counter
- 🎯 Scroll-based reveal animations
- 🌐 S3-ready static site

## Project Structure

```
personal/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Interactive features and animations
├── assets/
│   └── hero-avatar.svg # Profile illustration (replace with your image)
└── README.md
```

## Local Development

### Option 1: Direct File Access
Simply open `index.html` in your browser.

### Option 2: Local Server (Recommended)
```bash
cd personal
python3 -m http.server 8000
```
Then visit: http://localhost:8000

## Customization

Replace these placeholder sections with your real information:

1. **Profile Image**: Replace `assets/hero-avatar.svg` with your photo (600×600px recommended)
2. **Contact Details**: Update email and LinkedIn in the Contact section
3. **Experience**: Modify job titles, companies, and dates in the Experience section
4. **Projects**: Add your actual projects with relevant tags
5. **Skills**: Adjust tools and technologies based on your expertise

## Deployment to AWS S3

### 1. Create S3 Bucket
```bash
aws s3 mb s3://your-portfolio-bucket-name
```

### 2. Enable Static Website Hosting
```bash
aws s3 website s3://your-portfolio-bucket-name \
  --index-document index.html \
  --error-document index.html
```

### 3. Upload Files
```bash
aws s3 sync . s3://your-portfolio-bucket-name \
  --exclude ".git/*" \
  --exclude "README.md"
```

### 4. Set Bucket Policy (Public Access)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-portfolio-bucket-name/*"
    }
  ]
}
```

### 5. (Optional) Add CloudFront for HTTPS
- Create a CloudFront distribution pointing to your S3 bucket
- Add custom domain with Route 53
- Enable ACM certificate for SSL/TLS

## Tech Stack

- **HTML5**: Semantic structure
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript ES6+**: Intersection Observer API, smooth interactions
- **Fonts**: Google Fonts (Space Grotesk, IBM Plex Mono)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

MIT License - Feel free to use this template for your own portfolio.

## Contact

Built by Vishnuprasad M  
For questions or collaboration: vishnu.devops@email.com
