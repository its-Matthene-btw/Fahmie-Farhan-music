export default function FFMLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="drop-shadow-lg"
      >
        {/* Outer circle with gradient */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#d4af37", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#f7d86f", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#d4af37", stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="url(#goldGradient)"
          opacity="0.2"
        />
        
        {/* Main letters */}
        <text
          x="60"
          y="75"
          textAnchor="middle"
          fill="url(#goldGradient)"
          fontSize="36"
          fontWeight="900"
          fontFamily="Cinzel, serif"
          filter="url(#glow)"
          className="select-none"
        >
          FFM
        </text>
        
        {/* Decorative elements */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          opacity="0.5"
        />
        
        {/* Small musical notes */}
        <text
          x="25"
          y="30"
          fill="#d4af37"
          fontSize="12"
          opacity="0.7"
        >
          ♫
        </text>
        
        <text
          x="95"
          y="35"
          fill="#d4af37"
          fontSize="12"
          opacity="0.7"
        >
          ♪
        </text>
        
        <text
          x="20"
          y="95"
          fill="#d4af37"
          fontSize="12"
          opacity="0.7"
        >
          ♬
        </text>
        
        <text
          x="90"
          y="100"
          fill="#d4af37"
          fontSize="12"
          opacity="0.7"
        >
          ♩
        </text>
      </svg>
    </div>
  );
}