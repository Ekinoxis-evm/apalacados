How to Embed your Kick Livestream
Embedding your kick livestream on your website, how-to embed your live stream, kick.com livestream iframe embedding

Updated over 2 years ago
Welcome to the Kick Streaming Player embedding documentation. With our simple embedding system, you can easily add your live stream to your website using an iframe, giving your audience the convenience of watching your stream directly from your site. This guide will walk you through the steps you need to follow to embed the Kick player on your website.

 

Basic Embedding
To embed the Kick player, insert the following iframe code into the HTML of your website:
​

<iframe 
     src="https://player.kick.com/YOUR_USERNAME" 
     height="720" 
     width="1280"
     frameborder="0" 
     scrolling="no" 
     allowfullscreen="true"> 
</iframe>
💡 Replace YOUR_USERNAME with your actual Kick username.

Customizing the Player
Kick's streaming player offers several options you can use to customize the player to your preference. These options are added to the URL of the player in the iframe as query parameters. Here's how you can customize your player:

 

Autoplay
To make the player start automatically, set the autoplay parameter to true. If you want to disable autoplay, set autoplay to false. The default value is false.

 

<iframe 
     src="https://player.kick.com/YOUR_USERNAME?autoplay=true" 
     height="720" 
     width="1280"
     frameborder="0" 
     scrolling="no" 
     allowfullscreen="true"> 
</iframe>
 

Mute
To mute the player, set the muted parameter to true. If you want to allow sound, set muted to false. The default value is false.

 

<iframe 
     src="https://player.kick.com/YOUR_USERNAME?muted=true" 
     height="720" 
     width="1280"
     frameborder="0" 
     scrolling="no" 
     allowfullscreen="true"> 
</iframe>
 

Allow fullscreen
The fullscreen option is enabled by default on all streams. This means viewers can switch the stream to fullscreen mode. If you wish to disable this option, set the allowfullscreen parameter to false in the URL and remove allowfullscreen="true" from the iframe.

 

<iframe 
     src="https://player.kick.com/YOUR_USERNAME?allowfullscreen=false" 
     height="720" 
     width="1280"
     frameborder="0" 
     scrolling="no"> 
</iframe>
 

Using Multiple Parameters
You can also combine multiple parameters. When using multiple parameters, separate them with the & symbol.

 

For instance, to embed a player that is muted and does not allow fullscreen, you can use the following code:

 

<iframe 
     src="https://player.kick.com/YOUR_USERNAME?muted=true&allowfullscreen=false" 
     height="720" 
     width="1280"
     frameborder="0" 
     scrolling="no"> 
</iframe>
 

Conclusion
With these simple steps, you can easily embed the Kick Streaming Player into your website and customize it according to your preference. This will make it easier for your audience to access and watch your live streams directly from your website.

 

If you have any questions or need further assistance, please feel free to contact our support team. 

 

Happy streaming!