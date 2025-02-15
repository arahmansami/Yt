"use client";
import React from "react";

function MainComponent() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState([]);
  const fetchDownloads = useCallback(async () => {
    try {
      const response = await fetch("/api/list-downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch downloads");
      }
      const data = await response.json();
      setDownloads(data.downloads || []);
    } catch (err) {
      setError("Failed to load download history");
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchDownloads();
  }, [fetchDownloads]);

  const handleDownload = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      new URL(url);

      const response = await fetch("/api/download-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (!data || data.error) {
        throw new Error(data?.error || "Failed to download video");
      }

      if (data.success && data.download?.download_url) {
        window.open(data.download.download_url, "_blank");
      } else {
        throw new Error("No download URL available");
      }

      setUrl("");
      await fetchDownloads();
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("URL")) {
        setError("Please enter a valid URL");
      } else {
        setError(err.message || "Failed to download video");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1120] to-[#2D1F4D] animate-gradient-xy py-12 px-4 relative overflow-hidden">
      <div className="geometric-shapes"></div>
      <div className="particles"></div>
      <div className="max-w-4xl mx-auto perspective-1000">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 mb-8 border border-white/20 transition-all duration-500 hover:shadow-blue-500/20 transform-style preserve-3d hover:translate-z-12 relative">
          <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse-glow">
            Video Downloader
          </h1>
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-white/90">
              Supported Platforms:
            </h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 text-white/80">
              <div className="flex items-center transform hover:scale-110 transition-transform duration-500 hover:shadow-[#FF0000]/20">
                <i className="fab fa-youtube text-[#FF0000] text-4xl mr-3 animate-float"></i>
                <span className="hover:text-[#FF0000] transition-colors duration-300">
                  YouTube
                </span>
              </div>
              <div className="flex items-center transform hover:scale-110 transition-transform duration-500 hover:shadow-[#1877F2]/20">
                <i className="fab fa-facebook text-[#1877F2] text-4xl mr-3 animate-float"></i>
                <span className="hover:text-[#1877F2] transition-colors duration-300">
                  Facebook
                </span>
              </div>
              <div className="flex items-center transform hover:scale-110 transition-transform duration-500 hover:shadow-[#E4405F]/20">
                <i className="fab fa-instagram text-[#E4405F] text-4xl mr-3 animate-float"></i>
                <span className="hover:text-[#E4405F] transition-colors duration-300">
                  Instagram
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleDownload} className="mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="url"
                name="videoUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste video URL here"
                className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-500 hover:bg-white/10 transform hover:translate-z-4"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-500 ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed loading-shimmer"
                    : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-xl hover:shadow-purple-500/25 text-white relative overflow-hidden hover:translate-z-4"
                }`}
              >
                {loading ? (
                  <i className="fas fa-circle-notch fa-spin"></i>
                ) : (
                  <span className="flex items-center">
                    <i className="fas fa-download mr-2 animate-bounce"></i>
                    Download
                  </span>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 text-red-400 bg-red-900/20 p-4 rounded-lg backdrop-blur-sm animate-shake">
                <i className="fas fa-exclamation-circle mr-2 animate-pulse"></i>
                {error}
              </div>
            )}
          </form>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur"></div>
            <h2 className="text-2xl font-semibold mb-6 text-white/90 flex items-center">
              <i className="fas fa-history mr-3 text-blue-400"></i>
              Recent Downloads
            </h2>
            <div className="space-y-4 relative">
              {downloads.map((download) => (
                <div
                  key={download.id}
                  className="border border-white/10 rounded-xl p-6 backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg transform-style preserve-3d hover:translate-z-8 animate-float"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-white/90 text-lg mb-2">
                        {download.title || "Untitled"}
                      </h3>
                      <div className="flex items-center text-sm text-white/60 gap-4">
                        <span className="flex items-center">
                          <i
                            className={`fab fa-${download.platform.toLowerCase()} text-lg mr-2`}
                          ></i>
                          {download.platform}
                        </span>
                        <span
                          className={`flex items-center ${
                            download.status === "completed"
                              ? "text-green-400"
                              : download.status === "failed"
                              ? "text-red-400"
                              : "text-yellow-400"
                          }`}
                        >
                          <i
                            className={`fas fa-${
                              download.status === "completed"
                                ? "check-circle"
                                : download.status === "failed"
                                ? "times-circle"
                                : "clock"
                            } mr-2`}
                          ></i>
                          {download.status.charAt(0).toUpperCase() +
                            download.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {download.status === "completed" &&
                      download.download_url && (
                        <a
                          href={download.download_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:from-green-500 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                        >
                          <i className="fas fa-download mr-2"></i>
                          Download
                        </a>
                      )}
                  </div>
                </div>
              ))}
              {downloads.length === 0 && (
                <div className="text-center text-white/40 py-12">
                  <i className="fas fa-inbox text-4xl mb-4"></i>
                  <p>No downloads yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            filter: brightness(1) blur(0px);
          }
          50% {
            opacity: 0.7;
            filter: brightness(1.2) blur(2px);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateZ(0);
          }
          50% {
            transform: translateY(-10px) translateZ(20px);
          }
        }
        @keyframes particle-move {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, 10px);
          }
          50% {
            transform: translate(0, 20px);
          }
          75% {
            transform: translate(-10px, 10px);
          }
        }
        .geometric-shapes::before,
        .geometric-shapes::after {
          content: '';
          position: fixed;
          width: 60vmax;
          height: 60vmax;
          background: radial-gradient(circle, rgba(125, 39, 255, 0.1) 0%, transparent 70%);
          animation: particle-move 20s infinite;
        }
        .geometric-shapes::before {
          top: -20vmax;
          left: -20vmax;
        }
        .geometric-shapes::after {
          bottom: -20vmax;
          right: -20vmax;
          animation-delay: -10s;
        }
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: 
            radial-gradient(circle at 20% 20%, rgba(62, 87, 255, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(255, 62, 242, 0.05) 0%, transparent 40%);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .translate-z-12 {
          transform: translateZ(12px);
        }
        .translate-z-8 {
          transform: translateZ(8px);
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .loading-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;