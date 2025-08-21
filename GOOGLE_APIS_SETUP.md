# 🚀 Google APIs Setup Guide

This guide will help you set up all the free Google APIs for your coffee shop website.

## 📋 Required Google APIs (All FREE)

### 1. Google Maps JavaScript API
**Purpose**: Interactive maps, directions, store location
**Free Tier**: 28,000 map loads per month

**Setup Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict API key to your domain
6. Copy API key to `config/google-apis-config.js`

### 2. Google Places API
**Purpose**: Business reviews, nearby places, autocomplete
**Free Tier**: 17,000 requests per month

**Setup Steps**:
1. In Google Cloud Console
2. Enable "Places API"
3. Use same API key as Maps API
4. Get your Place ID from [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)

### 3. Google Analytics 4
**Purpose**: Website analytics and user tracking
**Free Tier**: Unlimited (with data limits)

**Setup Steps**:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create account and property
3. Get Measurement ID (G-XXXXXXXXXX)
4. Update `analytics-manager.js` with your ID

### 4. Google reCAPTCHA v3
**Purpose**: Form security and spam protection
**Free Tier**: 1 million requests per month

**Setup Steps**:
1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register your site
3. Choose reCAPTCHA v3
4. Add your domain
5. Get Site Key and Secret Key

### 5. Google Fonts API
**Purpose**: Enhanced typography
**Free Tier**: Unlimited

**Setup Steps**:
- Already integrated! No API key needed
- Fonts load automatically from Google Fonts

### 6. Google Translate Widget
**Purpose**: Multi-language support
**Free Tier**: Unlimited for widget

**Setup Steps**:
- Already integrated! No API key needed
- Widget loads automatically

### 7. YouTube Data API v3
**Purpose**: Embed coffee-making videos
**Free Tier**: 10,000 units per day

**Setup Steps**:
1. In Google Cloud Console
2. Enable "YouTube Data API v3"
3. Create API key
4. Get your channel/playlist IDs

## 🔧 Configuration Steps

### Step 1: Update API Keys
Edit `config/google-apis-config.js`:

```javascript
const GoogleAPIsConfig = {
    apiKeys: {
        maps: 'YOUR_GOOGLE_MAPS_API_KEY',
        places: 'YOUR_GOOGLE_PLACES_API_KEY', 
        recaptcha: 'YOUR_RECAPTCHA_SITE_KEY',
        youtube: 'YOUR_YOUTUBE_API_KEY',
        analytics: 'G-XXXXXXXXXX'
    },
    // ... rest of config
};
```

### Step 2: Get Your Place ID
1. Visit [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your coffee shop
3. Copy the Place ID
4. Update `google-business-api.js`:

```javascript
this.placeId = 'YOUR_GOOGLE_PLACE_ID';
```

### Step 3: Update Business Information
Edit `config/google-apis-config.js` with your actual business details:

```javascript
maps: {
    center: {
        lat: YOUR_LATITUDE,
        lng: YOUR_LONGITUDE
    }
}
```

## 🎯 Features You'll Get

### 📍 Enhanced Maps
- Interactive store location
- User location detection
- Turn-by-turn directions
- Delivery zone visualization
- Street View integration

### ⭐ Google Reviews Integration
- Display Google Reviews
- QR code for easy reviewing
- Review prompts for customers
- Business hours display
- Structured data for SEO

### 🔒 Security Features
- reCAPTCHA v3 on all forms
- Spam protection
- Bot detection
- Secure form submissions

### 📊 Analytics & Tracking
- User behavior tracking
- Menu interaction analytics
- Event booking tracking
- Performance monitoring
- Custom events tracking

### 🌍 Multi-language Support
- Google Translate widget
- Automatic language detection
- 100+ languages supported
- Persistent language selection

### 🎥 Video Integration
- YouTube coffee tutorials
- Embedded playlists
- Automatic video loading
- Responsive video players

## 🚀 Quick Start

1. **Get API Keys** (15 minutes)
   - Google Cloud Console setup
   - Enable required APIs
   - Generate API keys

2. **Configure Files** (5 minutes)
   - Update `google-apis-config.js`
   - Add your Place ID
   - Set business coordinates

3. **Test Features** (10 minutes)
   - Check maps loading
   - Test directions
   - Verify reviews display
   - Test forms with reCAPTCHA

## 💡 Pro Tips

### Security Best Practices
- Restrict API keys to your domain
- Use HTTP referrer restrictions
- Monitor API usage regularly
- Enable billing alerts

### Performance Optimization
- Load APIs only when needed
- Use lazy loading for maps
- Implement error handling
- Cache API responses when possible

### SEO Benefits
- Structured data for business info
- Google My Business integration
- Local SEO optimization
- Rich snippets support

## 🔍 Testing Your Setup

### Maps API Test
```javascript
// Check if maps loaded
if (window.google && window.google.maps) {
    console.log('✅ Google Maps loaded successfully');
} else {
    console.log('❌ Google Maps failed to load');
}
```

### Analytics Test
```javascript
// Check if analytics loaded
if (window.gtag) {
    console.log('✅ Google Analytics loaded successfully');
    gtag('event', 'test_event', { test: true });
} else {
    console.log('❌ Google Analytics failed to load');
}
```

## 📈 Monitoring & Maintenance

### Monthly Tasks
- [ ] Check API usage in Google Cloud Console
- [ ] Review analytics reports
- [ ] Monitor website performance
- [ ] Update business information if needed

### Quarterly Tasks
- [ ] Review and respond to Google Reviews
- [ ] Update structured data
- [ ] Check for API updates
- [ ] Optimize based on analytics data

## 🆘 Troubleshooting

### Common Issues

**Maps not loading?**
- Check API key validity
- Verify domain restrictions
- Check browser console for errors
- Ensure billing is enabled

**Reviews not showing?**
- Verify Place ID is correct
- Check if business is claimed on Google
- Ensure Places API is enabled

**Analytics not tracking?**
- Verify Measurement ID format
- Check for ad blockers
- Ensure gtag is loading properly

**reCAPTCHA not working?**
- Check site key configuration
- Verify domain settings
- Test in incognito mode

## 📞 Support Resources

- [Google Maps Documentation](https://developers.google.com/maps/documentation)
- [Google Analytics Help](https://support.google.com/analytics)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [Google My Business Help](https://support.google.com/business)

## 🎉 You're All Set!

Once configured, your coffee shop website will have:
- Professional interactive maps
- Customer review integration
- Advanced security features
- Comprehensive analytics
- Multi-language support
- Video content integration

**Total Setup Time**: ~30 minutes
**Monthly Cost**: $0 (within free tiers)
**Value Added**: Immense! 🚀

---

**Need help?** Check the browser console for any error messages and refer to the troubleshooting section above.