import React from 'react';

// --- CONFIGURATION ---
// IMPORTANT: Update the 'src' path to where your PNG files are located!
const socialLinks = [
  // Example path: Assuming your files are in public/logo/social/
  { name: 'Facebook', url: 'https://www.facebook.com/nitdgplug/', src: '/logo/fb.png' },
  { name: 'LinkedIn', url: 'linkedin.com/company/lugnitdgp/', src: '/logo/linked.png' },
  { name: 'youtube', url: 'https://www.youtube.com/@GNULinuxUsersGroupNITDurgapur', src: '/logo/yt.png' },
  { name: 'Instagram', url: 'https://www.instagram.com/nitdgplug/', src: '/logo/insta.png' },
];
// ---------------------

function BottomBar() {
  return (
    // Fixed positioning locks it to the bottom of the viewport
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-transparent backdrop-blur-none shadow-2xl">
      <div className="flex justify-center items-center py-3 px-6">
        
        {socialLinks.map((handle, index) => (
          // Link element with hover effect
          <a
            key={index}
            href={handle.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${handle.name} page`}
            // Added margin (mx-3) and the hover/transition classes
            className="text-white mx-3 transition-transform duration-300 hover:scale-125"
          >
            <img 
              src={handle.src} 
              alt={`${handle.name} Icon`}
              // Set the size of the image (w-8 h-8 is about 32px)
              className="w-8 h-8 object-contain"
            />
          </a>
        ))}
        
      </div>
    </footer>
  );
}

export default BottomBar;