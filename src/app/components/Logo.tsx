export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#16a34a" />
      
      {/* Rice grain/leaf design */}
      <path
        d="M 50 20 Q 40 25 40 35 Q 40 42 45 47 Q 48 50 50 50 Q 52 50 55 47 Q 60 42 60 35 Q 60 25 50 20 Z"
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <path
        d="M 50 25 Q 45 28 45 35 Q 45 40 48 44 Q 49 45 50 45 Q 51 45 52 44 Q 55 40 55 35 Q 55 28 50 25 Z"
        fill="#fbbf24"
      />
      
      {/* Second grain */}
      <path
        d="M 35 40 Q 28 43 28 50 Q 28 56 32 60 Q 34 62 36 62 Q 38 62 40 60 Q 44 56 44 50 Q 44 43 35 40 Z"
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <path
        d="M 35 44 Q 31 46 31 50 Q 31 54 33 57 Q 34 58 36 58 Q 37 58 38 57 Q 40 54 40 50 Q 40 46 35 44 Z"
        fill="#fbbf24"
      />
      
      {/* Third grain */}
      <path
        d="M 65 40 Q 56 43 56 50 Q 56 56 60 60 Q 62 62 64 62 Q 66 62 68 60 Q 72 56 72 50 Q 72 43 65 40 Z"
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth="1.5"
      />
      <path
        d="M 65 44 Q 60 46 60 50 Q 60 54 62 57 Q 63 58 64 58 Q 65 58 67 57 Q 69 54 69 50 Q 69 46 65 44 Z"
        fill="#fbbf24"
      />
      
      {/* Leaf element */}
      <path
        d="M 50 55 Q 45 60 42 70 L 45 71 Q 48 62 50 60 Q 52 62 55 71 L 58 70 Q 55 60 50 55 Z"
        fill="#22c55e"
      />
      
      {/* Bottom bowl/container */}
      <path
        d="M 30 65 Q 30 75 50 80 Q 70 75 70 65 L 65 65 Q 65 72 50 75 Q 35 72 35 65 Z"
        fill="#ffffff"
        opacity="0.9"
      />
      
      {/* Outer ring accent */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        fill="none" 
        stroke="#ffffff" 
        strokeWidth="2"
        opacity="0.3"
      />
    </svg>
  );
}
