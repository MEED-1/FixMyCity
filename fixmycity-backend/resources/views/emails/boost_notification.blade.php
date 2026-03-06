<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .header { background-color: #f8f9fa; padding: 10px 20px; border-bottom: 1px solid #eee; text-align: center; }
        .content { padding: 20px; }
        .footer { font-size: 12px; color: #999; text-align: center; margin-top: 20px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; background-color: #e0f2f1; color: #00695c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>FixMyCity Boost Activated! 🚀</h2>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Great news! Your boost for <strong>{{ $item->title }}</strong> has been successfully activated.</p>
            
            <p><strong>Boost Level:</strong> <span class="badge">{{ ucfirst($boostLevel) }}</span></p>
            
            <p>Your contribution helps prioritize this item and brings it to the attention of the community and local authorities faster.</p>
            
            <p>Thank you for making your city better!</p>
            
            <p>The FixMyCity Team</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} FixMyCity. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
