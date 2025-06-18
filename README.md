# jvicom - Jan van Iperen's Personal Website

Personal website built with Hugo and the MNML theme.

## Development

```bash
# Install Hugo modules
hugo mod get

# Run development server
npm run dev
# or
hugo server -D

# Build for production
npm run build
# or
hugo --gc --minify
```

## Deployment

The site is automatically deployed to Vercel when changes are pushed to the main branch.

## Theme

This site uses the [MNML Hugo theme](https://github.com/janvaniperen/mnml-hugo-theme) as a Hugo module.

## Content Structure

- `content/posts/` - Blog posts
- `content/projects/` - Project showcases
- `content/pages/` - Static pages
- `content/about.md` - About page
- `static/` - Static assets (images, etc.) 