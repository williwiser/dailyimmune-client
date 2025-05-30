import React from "react";

interface DownloadButtonProps {
  href: string;
  icon: React.ReactNode;
  subtitle: string;
  title: string;
  onClick?: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  href,
  icon,
  subtitle,
  title,
  onClick,
}) => (
  <a
    href={href}
    className="bg-stone-200/50 px-4 py-2 border border-stone-100 rounded-md"
    onClick={onClick}
  >
    <div className="w-8 h-8 transition-transform duration-300 group-hover:rotate-[5deg] group-hover:scale-110">
      {icon}
    </div>
    <div className="flex flex-col items-start">
      <span className="text-xs opacity-80 font-normal">{subtitle}</span>
      <span className="text-lg font-bold">{title}</span>
    </div>
  </a>
);

const FloatingElement: React.FC<{ delay: string; left: string }> = ({
  delay,
  left,
}) => (
  <div
    className="absolute w-1.5 h-1.5 bg-white/60 rounded-full animate-float-up"
    style={{
      left,
      animationDelay: delay,
      animation: "floatUp 3s infinite ease-in-out",
    }}
  />
);

const GetOurAppSection: React.FC = () => {
  const handleAppStoreClick = () => {
    // Add your App Store analytics or tracking here
    console.log("App Store button clicked");
  };

  const handlePlayStoreClick = () => {
    // Add your Google Play analytics or tracking here
    console.log("Google Play button clicked");
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }

        @keyframes glow {
          0% { filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.3)); }
          100% { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.6)); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        @keyframes floatUp {
          0% { 
            transform: translateY(100px) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }

        .app-section {
          background: #ffffff;
        }

        .gradient-text {
          background: linear-gradient(45deg, #667eea, #764ba2);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glow 3s ease-in-out infinite alternate;
        }

        .download-btn {
          background: rgba(102, 126, 234, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(102, 126, 234, 0.2);
          color: #667eea;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .download-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.5s;
        }

        .download-btn:hover::before {
          left: 100%;
        }

        .download-btn:hover {
          transform: translateY(-3px) scale(1.05);
          background: rgba(102, 126, 234, 0.15);
          border-color: rgba(102, 126, 234, 0.4);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
        }

        .phone-mockup {
          background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
          transform: perspective(1000px) rotateY(-15deg);
          transition: transform 0.6s ease;
        }

        .phone-mockup:hover {
          transform: perspective(1000px) rotateY(0deg) scale(1.05);
        }

        .phone-screen {
          background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
        }

        .app-icon {
          animation: bounce 2s infinite;
        }
      `}</style>

      <section className="app-section relative py-20 px-5 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-15 items-center">
            {/* Text Content */}
            <div className="text-gray-800 lg:text-left text-center">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-5 text-[#747474]">
                Get Our App
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed mb-10 text-gray-600">
                Experience the power of our platform wherever you go. Download
                our mobile app for seamless access to all features, enhanced
                performance, and exclusive mobile-only benefits.
              </p>

              <div className="flex flex-wrap gap-5 lg:justify-start justify-center">
                <DownloadButton
                  href="#app-store"
                  onClick={handleAppStoreClick}
                  subtitle="Download on the"
                  title="App Store"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  }
                />

                <DownloadButton
                  href="#play-store"
                  onClick={handlePlayStoreClick}
                  subtitle="Get it on"
                  title="Google Play"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex justify-center items-center relative">
              <div className="phone-mockup w-72 h-[600px] md:w-80 md:h-[640px] rounded-[40px] p-5 shadow-2xl relative">
                <div className="phone-screen w-full h-full rounded-[30px] flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="app-icon w-20 h-20 bg-white rounded-2xl mb-5 flex items-center justify-center shadow-lg">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="#667eea"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
                    </svg>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute inset-0">
                    <FloatingElement delay="0s" left="20%" />
                    <FloatingElement delay="0.5s" left="40%" />
                    <FloatingElement delay="1s" left="60%" />
                    <FloatingElement delay="1.5s" left="80%" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetOurAppSection;
