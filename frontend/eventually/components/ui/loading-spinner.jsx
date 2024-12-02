export default function Loading() {
  return (
    <div className="w-full min-h-44 flex flex-col place-items-center gap-8">
        <p className="text-primary text-sm">Loading...</p>
      <svg className="mask-anim"
        width="114"
        height="15"
        viewBox="0 0 114 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 11L7.92893 6.07107C11.8342 2.16583 18.1658 2.16583 22.0711 6.07107L24.9289 8.92893C28.8342 12.8342 35.1658 12.8342 39.0711 8.92893L41.9289 6.07107C45.8342 2.16583 52.1658 2.16583 56.0711 6.07107L58.9289 8.92893C62.8342 12.8342 69.1658 12.8342 73.0711 8.92893L75.9289 6.07107C79.8342 2.16583 86.1658 2.16583 90.0711 6.07107L92.9289 8.92893C96.8342 12.8342 103.166 12.8342 107.071 8.92893L111.5 4.5"
          stroke="url(#paint0_linear_224_1410)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_224_1410"
            x1="3.00001"
            y1="7.49999"
            x2="111.5"
            y2="7.50007"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#484395" />
            <stop offset="1" stopColor="#D44757" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
